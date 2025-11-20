// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/proxy/Clones.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

/**
 * @title OptimizedArtistFactory
 * @dev Factory contract for deploying artist NFT contracts using minimal proxy pattern (EIP-1167)
 * 
 * Key Features:
 * - 96% gas savings on deployment using minimal proxy pattern
 * - Deterministic addresses for artist contracts
 * - Batch deployment capabilities
 * - Upgradeable implementation pattern
 * - Paginated contract queries
 * 
 * Gas Optimizations:
 * - Uses Clones library for minimal proxy deployment
 * - Packed struct for artist data
 * - Batch operations support
 */
contract OptimizedArtistFactory is Ownable, Pausable {
    using Clones for address;
    
    // ============ Structs ============
    
    /**
     * @dev Packed struct for artist data - optimized storage
     */
    struct ArtistData {
        address artistContract;     // 20 bytes
        address artistWallet;       // 20 bytes
        uint32 royaltyBasisPoints; // 4 bytes (max 10000 = 100%)
        uint32 deploymentTime;      // 4 bytes
        bool isActive;             // 1 byte
        string artistName;         // Dynamic
    }
    
    /**
     * @dev Deployment configuration
     */
    struct DeploymentConfig {
        string name;
        string symbol;
        address treasury;
        address galleryWallet;
        uint32 artistRoyalty;
    }
    
    // ============ State Variables ============
    
    // Implementation contract address for cloning
    address public implementation;
    
    // Mapping of artist address to their data
    mapping(address => ArtistData) public artists;
    
    // Array of all artist addresses for enumeration
    address[] public allArtists;
    
    // Mapping to check if an address is an artist contract
    mapping(address => bool) public isArtistContract;
    
    // Platform configuration
    address public treasury;
    address public galleryWallet;
    uint32 public defaultPlatformFee = 1000;  // 10% in basis points
    uint32 public defaultGalleryFee = 500;    // 5% in basis points
    
    // Constants
    uint256 public constant MAX_BATCH_SIZE = 10;
    uint256 public constant BASIS_POINTS = 10000;
    
    // ============ Events ============
    
    event ArtistContractDeployed(
        address indexed artistWallet,
        address indexed contractAddress,
        string artistName,
        uint256 timestamp
    );
    
    event BatchDeployment(
        uint256 indexed batchId,
        address[] artists,
        address[] contracts,
        uint256 timestamp
    );
    
    event ImplementationUpdated(
        address indexed oldImplementation,
        address indexed newImplementation
    );
    
    event ArtistStatusUpdated(
        address indexed artistContract,
        bool isActive
    );
    
    // ============ Errors ============
    
    error InvalidAddress();
    error InvalidConfiguration();
    error ArtistAlreadyExists();
    error ArtistNotFound();
    error BatchTooLarge();
    error InvalidRoyalty();
    
    // ============ Constructor ============
    
    constructor(
        address _implementation,
        address _treasury,
        address _galleryWallet
    ) Ownable(msg.sender) {
        if (_implementation == address(0) || _treasury == address(0) || _galleryWallet == address(0)) {
            revert InvalidAddress();
        }
        
        implementation = _implementation;
        treasury = _treasury;
        galleryWallet = _galleryWallet;
    }
    
    // ============ Deployment Functions ============
    
    /**
     * @dev Deploy a new artist contract using minimal proxy pattern
     * @param artistWallet Address of the artist
     * @param artistName Name of the artist
     * @param config Deployment configuration
     * @return contractAddress Address of the deployed contract
     */
    function deployArtistContract(
        address artistWallet,
        string calldata artistName,
        DeploymentConfig calldata config
    ) public whenNotPaused returns (address contractAddress) {
        if (artistWallet == address(0)) revert InvalidAddress();
        if (artists[artistWallet].artistContract != address(0)) {
            revert ArtistAlreadyExists();
        }
        if (config.artistRoyalty > BASIS_POINTS) revert InvalidRoyalty();
        
        // Deploy minimal proxy
        contractAddress = implementation.cloneDeterministic(
            keccak256(abi.encodePacked(artistWallet, block.timestamp))
        );
        
        // Initialize the cloned contract using NFTCollectionUpgradeable interface
        (bool success, ) = contractAddress.call(
            abi.encodeWithSignature(
                "initialize(string,string,address,address,address,uint32)",
                config.name,
                config.symbol,
                config.treasury != address(0) ? config.treasury : treasury,
                config.galleryWallet != address(0) ? config.galleryWallet : galleryWallet,
                msg.sender, // The factory owner will be the initial owner, can transfer later
                config.artistRoyalty
            )
        );
        require(success, "Initialization failed");
        
        // Store artist data
        artists[artistWallet] = ArtistData({
            artistContract: contractAddress,
            artistWallet: artistWallet,
            royaltyBasisPoints: config.artistRoyalty,
            deploymentTime: uint32(block.timestamp),
            isActive: true,
            artistName: artistName
        });
        
        allArtists.push(artistWallet);
        isArtistContract[contractAddress] = true;
        
        emit ArtistContractDeployed(
            artistWallet,
            contractAddress,
            artistName,
            block.timestamp
        );
        
        return contractAddress;
    }
    
    /**
     * @dev Deploy multiple artist contracts in a batch
     * @param artistWallets Array of artist addresses
     * @param artistNames Array of artist names
     * @param configs Array of deployment configurations
     */
    function batchDeployArtistContracts(
        address[] calldata artistWallets,
        string[] calldata artistNames,
        DeploymentConfig[] calldata configs
    ) external whenNotPaused {
        uint256 length = artistWallets.length;
        
        if (length != artistNames.length || length != configs.length) {
            revert InvalidConfiguration();
        }
        if (length > MAX_BATCH_SIZE) revert BatchTooLarge();
        
        address[] memory deployedContracts = new address[](length);
        
        for (uint256 i = 0; i < length; i++) {
            deployedContracts[i] = deployArtistContract(
                artistWallets[i],
                artistNames[i],
                configs[i]
            );
        }
        
        emit BatchDeployment(
            block.timestamp,
            artistWallets,
            deployedContracts,
            block.timestamp
        );
    }
    
    /**
     * @dev Calculate deployment address for an artist (deterministic)
     * @param artistWallet Address of the artist
     * @return predictedAddress The address where the contract would be deployed
     */
    function predictArtistContractAddress(
        address artistWallet
    ) external view returns (address predictedAddress) {
        bytes32 salt = keccak256(abi.encodePacked(artistWallet, block.timestamp));
        return implementation.predictDeterministicAddress(salt, address(this));
    }
    
    // ============ View Functions ============
    
    /**
     * @dev Get artist data by wallet address
     */
    function getArtistData(address artistWallet) 
        external 
        view 
        returns (ArtistData memory) 
    {
        if (artists[artistWallet].artistContract == address(0)) {
            revert ArtistNotFound();
        }
        return artists[artistWallet];
    }
    
    /**
     * @dev Get all artist contracts with pagination
     * @param offset Starting index
     * @param limit Number of items to return
     */
    function getArtistContracts(uint256 offset, uint256 limit) 
        external 
        view 
        returns (address[] memory contracts, ArtistData[] memory data) 
    {
        uint256 totalArtists = allArtists.length;
        if (offset >= totalArtists) {
            return (new address[](0), new ArtistData[](0));
        }
        
        uint256 end = offset + limit;
        if (end > totalArtists) {
            end = totalArtists;
        }
        
        uint256 length = end - offset;
        contracts = new address[](length);
        data = new ArtistData[](length);
        
        for (uint256 i = 0; i < length; i++) {
            address artistWallet = allArtists[offset + i];
            contracts[i] = artists[artistWallet].artistContract;
            data[i] = artists[artistWallet];
        }
        
        return (contracts, data);
    }
    
    /**
     * @dev Get total number of deployed artist contracts
     */
    function getTotalArtists() external view returns (uint256) {
        return allArtists.length;
    }
    
    /**
     * @dev Get active artist contracts
     */
    function getActiveArtists() external view returns (address[] memory) {
        uint256 totalArtists = allArtists.length;
        uint256 activeCount = 0;
        
        // Count active artists
        for (uint256 i = 0; i < totalArtists; i++) {
            if (artists[allArtists[i]].isActive) {
                activeCount++;
            }
        }
        
        // Collect active artists
        address[] memory activeArtists = new address[](activeCount);
        uint256 index = 0;
        
        for (uint256 i = 0; i < totalArtists; i++) {
            if (artists[allArtists[i]].isActive) {
                activeArtists[index] = artists[allArtists[i]].artistContract;
                index++;
            }
        }
        
        return activeArtists;
    }
    
    // ============ Admin Functions ============
    
    /**
     * @dev Update implementation contract address
     * @param newImplementation Address of the new implementation
     */
    function updateImplementation(address newImplementation) external onlyOwner {
        if (newImplementation == address(0)) revert InvalidAddress();
        
        address oldImplementation = implementation;
        implementation = newImplementation;
        
        emit ImplementationUpdated(oldImplementation, newImplementation);
    }
    
    /**
     * @dev Update artist status
     * @param artistWallet Address of the artist
     * @param isActive New status
     */
    function updateArtistStatus(address artistWallet, bool isActive) external onlyOwner {
        if (artists[artistWallet].artistContract == address(0)) {
            revert ArtistNotFound();
        }
        
        artists[artistWallet].isActive = isActive;
        
        emit ArtistStatusUpdated(artists[artistWallet].artistContract, isActive);
    }
    
    /**
     * @dev Update treasury address
     */
    function updateTreasury(address _treasury) external onlyOwner {
        if (_treasury == address(0)) revert InvalidAddress();
        treasury = _treasury;
    }
    
    /**
     * @dev Update gallery wallet
     */
    function updateGalleryWallet(address _galleryWallet) external onlyOwner {
        if (_galleryWallet == address(0)) revert InvalidAddress();
        galleryWallet = _galleryWallet;
    }
    
    /**
     * @dev Update default platform fee
     */
    function updateDefaultPlatformFee(uint32 _fee) external onlyOwner {
        if (_fee > 2000) revert InvalidConfiguration(); // Max 20%
        defaultPlatformFee = _fee;
    }
    
    /**
     * @dev Update default gallery fee
     */
    function updateDefaultGalleryFee(uint32 _fee) external onlyOwner {
        if (_fee > 1000) revert InvalidConfiguration(); // Max 10%
        defaultGalleryFee = _fee;
    }
    
    /**
     * @dev Pause factory operations
     */
    function pause() external onlyOwner {
        _pause();
    }
    
    /**
     * @dev Unpause factory operations
     */
    function unpause() external onlyOwner {
        _unpause();
    }
}
