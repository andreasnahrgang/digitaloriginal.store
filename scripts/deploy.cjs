const hre = require("hardhat");

async function main() {
    console.log("Starting deployment to Amoy...");

    const [deployer] = await hre.ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);

    // 1. Deploy Implementation
    console.log("Deploying NFTCollectionUpgradeable implementation...");
    const NFTCollectionUpgradeable = await hre.ethers.getContractFactory("NFTCollectionUpgradeable");
    const implementation = await NFTCollectionUpgradeable.deploy();
    await implementation.waitForDeployment();
    const implementationAddress = await implementation.getAddress();
    console.log("NFTCollectionUpgradeable implementation deployed to:", implementationAddress);

    // 2. Setup Treasury and Gallery Wallet (Use deployer if not specified in env)
    const treasury = process.env.TREASURY_ADDRESS || deployer.address;
    const galleryWallet = process.env.GALLERY_WALLET_ADDRESS || deployer.address;
    console.log("Using Treasury:", treasury);
    console.log("Using Gallery Wallet:", galleryWallet);

    // 3. Deploy Factory
    console.log("Deploying OptimizedArtistFactory...");
    const OptimizedArtistFactory = await hre.ethers.getContractFactory("OptimizedArtistFactory");
    const factory = await OptimizedArtistFactory.deploy(
        implementationAddress,
        treasury,
        galleryWallet
    );
    await factory.waitForDeployment();
    const factoryAddress = await factory.getAddress();
    console.log("OptimizedArtistFactory deployed to:", factoryAddress);

    console.log("\nDeployment Complete!");
    console.log("----------------------------------------------------");
    console.log("Implementation:", implementationAddress);
    console.log("Factory:       ", factoryAddress);
    console.log("----------------------------------------------------");

    // Verify hint
    console.log("\nTo verify on PolygonScan:");
    console.log(`npx hardhat verify --network amoy ${implementationAddress}`);
    console.log(`npx hardhat verify --network amoy ${factoryAddress} ${implementationAddress} ${treasury} ${galleryWallet}`);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
