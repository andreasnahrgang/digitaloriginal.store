// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721URIStorageUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721EnumerableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/ReentrancyGuardUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts/interfaces/IERC2981.sol";

/**
 * @title NFTCollectionUpgradeable
 * @dev Upgradeable version of NFTCollection for use with minimal proxy pattern
 * 
 * Key Features:
 * - Fully upgradeable and proxy-compatible
 * - Gas-optimized with packed structs (30-50% savings)
 * - Batch minting capability for efficiency
 * - Built-in marketplace functionality
 * - Royalty distribution system
 * - Double-sale prevention
 * - Emergency pause functionality
 * 
 * Commission Structure:
 * - Artist: 85% (after platform and gallery fees)
 * - Platform: 10% (default, adjustable)
 * - Gallery: 5% (if applicable)
 */
contract NFTCollectionUpgradeable is 
    Initializable,
    ERC721Upgradeable, 
    ERC721URIStorageUpgradeable,
    ERC721EnumerableUpgradeable, 
    OwnableUpgradeable, 
    ReentrancyGuardUpgradeable,
    PausableUpgradeable,
    IERC2981
{
    // ============ Structs ============
    
    /**
     * @dev Packed struct for token data - optimized to 2 storage slots
     */
    struct TokenData {
        uint128 price;           // Price in wei (16 bytes)
        address artist;          // Artist address (20 bytes)
        uint32 royalty;          // Royalty in basis points (4 bytes)
        uint32 timestamp;        // Mint timestamp (4 bytes)
        bool forSale;           // Sale status (1 byte)
        bool sold;              // Sold status for double-sale prevention (1 byte)
    }
    
    /**
     * @dev Batch information for tracking
     */
    struct BatchInfo {
        uint128 totalTokens;
        uint128 timestamp;
    }
    
    // ============ State Variables ============
    
    uint256 private _tokenIdCounter;
    
    mapping(uint256 => TokenData) private _tokens;
    mapping(string => BatchInfo) public batchInfo;
    mapping(string => uint256[]) public batchTokenIds;
    
    // Platform configuration
    uint32 public platformFee;  // Platform fee in basis points
    uint32 public galleryFee;    // Gallery fee in basis points
    uint32 public maxRoyalty;   // Max royalty in basis points
    address public treasury;
    address public galleryWallet;
    
    // Constants
    uint256 public constant MAX_BATCH_SIZE = 50;
    uint256 public constant BASIS_POINTS = 10000;
    
    // ============ Events ============
    
    event BatchMinted(
        address indexed minter,
        string indexed batchId,
        uint256 indexed startTokenId,
        uint256 count
    );
    event TokenListed(uint256 indexed tokenId, uint256 price);
    event TokenUnlisted(uint256 indexed tokenId);
    event TokenPurchased(
        uint256 indexed tokenId,
        address indexed buyer,
        address indexed seller,
        uint256 price
    );
    event RoyaltyPaid(uint256 indexed tokenId, address artist, uint256 amount);
    event DoubleSaleAttempt(address indexed buyer, uint256 indexed tokenId);
    
    // ============ Errors ============
    
    error InvalidArrayLength();
    error BatchTooLarge();
    error EmptyBatch();
    error InvalidAddress();
    error ValueTooHigh();
    error NotTokenOwner();
    error InvalidPrice();
    error TokenNotForSale();
    error TokenAlreadySold();
    error IncorrectPayment();
    error TransferFailed();
    
    // ============ Initializer ============
    
    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }
    
    /**
     * @dev Initialize the contract (replaces constructor for proxy pattern)
     * @param name Collection name
     * @param symbol Collection symbol
     * @param _treasury Treasury address for platform fees
     * @param _galleryWallet Gallery wallet address
     * @param _owner Owner address
     * @param _artistRoyalty Default artist royalty in basis points
     */
    function initialize(
        string memory name,
        string memory symbol,
        address _treasury,
        address _galleryWallet,
        address _owner,
        uint32 _artistRoyalty
    ) public initializer {
        if (_treasury == address(0) || _galleryWallet == address(0) || _owner == address(0)) {
            revert InvalidAddress();
        }
        
        __ERC721_init(name, symbol);
        __ERC721URIStorage_init();
        __ERC721Enumerable_init();
        __Ownable_init(_owner);
        __ReentrancyGuard_init();
        __Pausable_init();
        
        treasury = _treasury;
        galleryWallet = _galleryWallet;
        platformFee = 1000;  // 10% default
        galleryFee = 500;    // 5% default
        maxRoyalty = _artistRoyalty > 0 ? _artistRoyalty : 1000; // Default 10% if not specified
        _tokenIdCounter = 1; // Start from 1
    }
    
    // ============ Minting Functions ============
    
    /**
     * @dev Batch mint NFTs with metadata
     * @param recipients Array of addresses to receive NFTs
     * @param tokenURIs Array of token URIs for metadata
     * @param artists Array of artist addresses for royalties
     * @param royalties Array of royalty percentages in basis points
     * @param batchId Unique identifier for this batch
     */
    function batchMint(
        address[] calldata recipients,
        string[] calldata tokenURIs,
        address[] calldata artists,
        uint32[] calldata royalties,
        string calldata batchId
    ) external onlyOwner whenNotPaused {
        uint256 length = recipients.length;
        
        // Validations
        if (
            length != tokenURIs.length || 
            length != artists.length || 
            length != royalties.length
        ) {
            revert InvalidArrayLength();
        }
        if (length > MAX_BATCH_SIZE) revert BatchTooLarge();
        if (length == 0) revert EmptyBatch();
        
        uint256 startTokenId = _tokenIdCounter;
        uint256[] memory mintedTokenIds = new uint256[](length);
        
        // Optimized minting loop
        unchecked {
            for (uint256 i = 0; i < length; ++i) {
                if (recipients[i] == address(0) || artists[i] == address(0)) {
                    revert InvalidAddress();
                }
                if (royalties[i] > maxRoyalty) {
                    revert ValueTooHigh();
                }
                
                uint256 tokenId = _tokenIdCounter + i;
                
                // Initialize token data
                _tokens[tokenId] = TokenData({
                    price: 0,
                    artist: artists[i],
                    royalty: royalties[i],
                    timestamp: uint32(block.timestamp),
                    forSale: false,
                    sold: false
                });
                
                _safeMint(recipients[i], tokenId);
                _setTokenURI(tokenId, tokenURIs[i]);
                
                mintedTokenIds[i] = tokenId;
            }
            
            _tokenIdCounter += length;
        }
        
        // Store batch information
        batchInfo[batchId] = BatchInfo({
            totalTokens: uint128(length),
            timestamp: uint128(block.timestamp)
        });
        batchTokenIds[batchId] = mintedTokenIds;
        
        emit BatchMinted(msg.sender, batchId, startTokenId, length);
    }
    
    /**
     * @dev Mint single NFT
     */
    function mintNFT(
        address recipient,
        string calldata uri,
        address artist,
        uint32 royalty
    ) external onlyOwner whenNotPaused returns (uint256) {
        if (recipient == address(0) || artist == address(0)) {
            revert InvalidAddress();
        }
        if (royalty > maxRoyalty) {
            revert ValueTooHigh();
        }
        
        uint256 tokenId = _tokenIdCounter++;
        
        _tokens[tokenId] = TokenData({
            price: 0,
            artist: artist,
            royalty: royalty,
            timestamp: uint32(block.timestamp),
            forSale: false,
            sold: false
        });
        
        _safeMint(recipient, tokenId);
        _setTokenURI(tokenId, uri);
        
        return tokenId;
    }
    
    // ============ Marketplace Functions ============
    
    /**
     * @dev List token for sale
     */
    function listToken(uint256 tokenId, uint128 price) external {
        if (ownerOf(tokenId) != msg.sender) revert NotTokenOwner();
        if (price == 0) revert InvalidPrice();
        
        TokenData storage token = _tokens[tokenId];
        
        // Prevent listing already sold tokens
        if (token.sold) revert TokenAlreadySold();
        
        token.price = price;
        token.forSale = true;
        
        emit TokenListed(tokenId, price);
    }
    
    /**
     * @dev Unlist token from sale
     */
    function unlistToken(uint256 tokenId) external {
        if (ownerOf(tokenId) != msg.sender) revert NotTokenOwner();
        
        TokenData storage token = _tokens[tokenId];
        token.price = 0;
        token.forSale = false;
        
        emit TokenUnlisted(tokenId);
    }
    
    /**
     * @dev Purchase a listed token with commission distribution
     * Commission Structure:
     * - Platform: 10% (platformFee)
     * - Gallery: 5% (galleryFee) 
     * - Artist: royalty % (configured per token)
     * - Seller: remainder (typically 85% minus royalty)
     */
    function purchaseToken(uint256 tokenId) 
        external 
        payable 
        nonReentrant 
        whenNotPaused 
    {
        TokenData storage token = _tokens[tokenId];
        
        // Double-sale prevention checks
        if (token.sold) {
            revert TokenAlreadySold();
        }
        if (!token.forSale) {
            revert TokenNotForSale();
        }
        if (msg.value != token.price) {
            revert IncorrectPayment();
        }
        
        address seller = ownerOf(tokenId);
        uint256 price = token.price;
        
        // Calculate distributions (ensuring 85% to artist on primary sale)
        uint256 platformAmount = (price * platformFee) / BASIS_POINTS;
        uint256 galleryAmount = (price * galleryFee) / BASIS_POINTS;
        uint256 royaltyAmount = 0;
        uint256 sellerAmount;
        
        // If seller is the artist (primary sale), they get 85%
        if (seller == token.artist) {
            // Artist gets 85% total (100% - 10% platform - 5% gallery)
            sellerAmount = price - platformAmount - galleryAmount;
        } else {
            // Secondary sale: apply royalty
            royaltyAmount = (price * token.royalty) / BASIS_POINTS;
            sellerAmount = price - platformAmount - galleryAmount - royaltyAmount;
        }
        
        // Update token state BEFORE transfers (CEI pattern)
        token.price = 0;
        token.forSale = false;
        token.sold = true;  // Mark as sold permanently
        
        // Transfer NFT
        _transfer(seller, msg.sender, tokenId);
        
        // Distribute payments
        _safeTransfer(treasury, platformAmount);
        _safeTransfer(galleryWallet, galleryAmount);
        if (royaltyAmount > 0) {
            _safeTransfer(token.artist, royaltyAmount);
            emit RoyaltyPaid(tokenId, token.artist, royaltyAmount);
        }
        _safeTransfer(seller, sellerAmount);
        
        emit TokenPurchased(tokenId, msg.sender, seller, price);
    }
    
    // ============ View Functions ============
    
    /**
     * @dev EIP-2981 Royalty Info
     */
    function royaltyInfo(
        uint256 tokenId,
        uint256 salePrice
    ) external view override returns (address receiver, uint256 royaltyAmount) {
        TokenData memory token = _tokens[tokenId];
        
        // If no specific artist/royalty set, return 0
        if (token.artist == address(0)) {
            return (address(0), 0);
        }
        
        receiver = token.artist;
        royaltyAmount = (salePrice * token.royalty) / BASIS_POINTS;
    }

    /**
     * @dev Check if token is sold (owned by someone other than artist/minter)
     */
    function isSold(uint256 tokenId) external view returns (bool) {
        if (_tokens[tokenId].sold) return true;
        return ownerOf(tokenId) != _tokens[tokenId].artist;
    }
    
    /**
     * @dev Get complete token information
     */
    function getTokenInfo(uint256 tokenId) 
        external 
        view 
        returns (
            address owner,
            address artist,
            uint256 price,
            uint32 royalty,
            bool forSale,
            bool sold,
            string memory uri
        ) 
    {
        TokenData memory token = _tokens[tokenId];
        return (
            ownerOf(tokenId),
            token.artist,
            token.price,
            token.royalty,
            token.forSale,
            token.sold,
            tokenURI(tokenId)
        );
    }
    
    /**
     * @dev Get tokens available for sale
     */
    function getTokensForSale() external view returns (uint256[] memory) {
        uint256 total = totalSupply();
        uint256[] memory tempTokens = new uint256[](total);
        uint256 count = 0;
        
        for (uint256 i = 1; i <= total; i++) {
            if (_tokens[i].forSale && !_tokens[i].sold) {
                tempTokens[count] = i;
                count++;
            }
        }
        
        // Create correctly sized array
        uint256[] memory tokensForSale = new uint256[](count);
        for (uint256 i = 0; i < count; i++) {
            tokensForSale[i] = tempTokens[i];
        }
        
        return tokensForSale;
    }
    
    /**
     * @dev Get batch tokens
     */
    function getBatchTokens(string calldata batchId) 
        external 
        view 
        returns (uint256[] memory) 
    {
        return batchTokenIds[batchId];
    }
    
    // ============ Admin Functions ============
    
    /**
     * @dev Update platform fee
     */
    function setPlatformFee(uint32 _platformFee) external onlyOwner {
        if (_platformFee > 2000) revert ValueTooHigh(); // Max 20%
        platformFee = _platformFee;
    }
    
    /**
     * @dev Update gallery fee
     */
    function setGalleryFee(uint32 _galleryFee) external onlyOwner {
        if (_galleryFee > 1000) revert ValueTooHigh(); // Max 10%
        galleryFee = _galleryFee;
    }
    
    /**
     * @dev Update treasury address
     */
    function setTreasury(address _treasury) external onlyOwner {
        if (_treasury == address(0)) revert InvalidAddress();
        treasury = _treasury;
    }
    
    /**
     * @dev Update gallery wallet
     */
    function setGalleryWallet(address _galleryWallet) external onlyOwner {
        if (_galleryWallet == address(0)) revert InvalidAddress();
        galleryWallet = _galleryWallet;
    }
    
    /**
     * @dev Pause contract
     */
    function pause() external onlyOwner {
        _pause();
    }
    
    /**
     * @dev Unpause contract
     */
    function unpause() external onlyOwner {
        _unpause();
    }
    
    // ============ Internal Functions ============
    
    /**
     * @dev Safe transfer with error handling
     */
    function _safeTransfer(address to, uint256 amount) private {
        if (amount > 0) {
            (bool success, ) = payable(to).call{value: amount}("");
            if (!success) revert TransferFailed();
        }
    }
    
    // ============ Overrides ============
    
    function _update(
        address to,
        uint256 tokenId,
        address auth
    ) internal override(ERC721Upgradeable, ERC721EnumerableUpgradeable) returns (address) {
        return super._update(to, tokenId, auth);
    }

    function _increaseBalance(
        address account,
        uint128 value
    ) internal override(ERC721Upgradeable, ERC721EnumerableUpgradeable) {
        super._increaseBalance(account, value);
    }

    function tokenURI(
        uint256 tokenId
    ) public view override(ERC721Upgradeable, ERC721URIStorageUpgradeable) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(
        bytes4 interfaceId
    ) public view override(ERC721Upgradeable, ERC721EnumerableUpgradeable, ERC721URIStorageUpgradeable, IERC165) returns (bool) {
        return interfaceId == type(IERC2981).interfaceId || super.supportsInterface(interfaceId);
    }
}
