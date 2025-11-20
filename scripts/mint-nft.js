import { createThirdwebClient } from "thirdweb";
import { upload } from "thirdweb/storage";
import hre from "hardhat";
import fs from "fs";
import path from "path";

// Load environment variables
const THIRDWEB_SECRET_KEY = process.env.THIRDWEB_SECRET_KEY;
if (!THIRDWEB_SECRET_KEY) {
    console.error("Missing THIRDWEB_SECRET_KEY in .env.local");
    process.exit(1);
}

const client = createThirdwebClient({
    secretKey: THIRDWEB_SECRET_KEY,
});

async function main() {
    console.log("Starting Minting Workflow...");

    // 1. Mock Data (In production, fetch from TinaCMS/Supabase)
    const artistData = {
        name: "Test Artist",
        bio: "This is a short bio of the artist from TinaCMS.",
        wallet: "0x17116cC21Df3Fe56ecA56DA4B7C3f962A0f94471" // Using the address from previous steps
    };

    const nftData = {
        name: "Digital Masterpiece #1",
        description: "A unique digital artwork.",
        image: "https://placehold.co/600x400.png", // Placeholder image
        priceUSD: 100,
        attributes: [
            { trait_type: "Artist", value: artistData.name },
            { trait_type: "Year", value: "2024" }
        ]
    };

    console.log("Preparing metadata for:", nftData.name);

    // 2. Upload to IPFS via Thirdweb
    // Note: In a real scenario, you'd upload the image file first if it's local
    const metadata = {
        name: nftData.name,
        description: nftData.description,
        image: nftData.image,
        external_url: "https://digitaloriginal.store",
        attributes: nftData.attributes,
        properties: {
            bio: artistData.bio,
            priceUSD: nftData.priceUSD
        }
    };

    console.log("Uploading metadata to IPFS...");
    const uri = await upload({
        client,
        files: [metadata],
    });
    console.log("Metadata uploaded to:", uri);

    // 3. Convert USD to MATIC (Mock conversion)
    const maticPriceUSD = 0.50; // Example rate: 1 MATIC = $0.50
    const priceMATIC = nftData.priceUSD / maticPriceUSD;
    console.log(`Price: $${nftData.priceUSD} USD ~= ${priceMATIC} MATIC`);

    // 4. Mint NFT
    // We need the Artist Contract address. 
    // For this script, we'll deploy a new one via factory or use an existing one if provided.
    const [deployer] = await hre.ethers.getSigners();

    // Fetch Factory
    const factoryAddress = "0x608cFea5Cb87E6e2af991C61CFCaca4D4E720f28"; // Deployed Factory Address
    const OptimizedArtistFactory = await hre.ethers.getContractFactory("OptimizedArtistFactory");
    const factory = OptimizedArtistFactory.attach(factoryAddress);

    // Check if artist has a contract
    let artistContractAddress = (await factory.getArtistData(artistData.wallet)).artistContract;

    if (artistContractAddress === hre.ethers.ZeroAddress) {
        console.log("Deploying new Artist Contract...");
        const config = {
            name: `${artistData.name} Collection`,
            symbol: "ART",
            treasury: deployer.address,
            galleryWallet: deployer.address,
            artistRoyalty: 1000 // 10%
        };

        const tx = await factory.deployArtistContract(artistData.wallet, artistData.name, config);
        const receipt = await tx.wait();

        // Parse logs to find address (simplified)
        // In a real script, we'd parse the event properly
        // For now, we'll just fetch it again
        artistContractAddress = (await factory.getArtistData(artistData.wallet)).artistContract;
        console.log("New Artist Contract deployed to:", artistContractAddress);
    } else {
        console.log("Using existing Artist Contract:", artistContractAddress);
    }

    // Mint
    const NFTCollectionUpgradeable = await hre.ethers.getContractFactory("NFTCollectionUpgradeable");
    const artistContract = NFTCollectionUpgradeable.attach(artistContractAddress);

    console.log("Minting NFT...");
    const royalty = 1000; // 10%
    const tx = await artistContract.mintNFT(
        artistData.wallet,
        uri,
        artistData.wallet,
        royalty
    );
    await tx.wait();

    console.log("NFT Minted successfully!");
    console.log("----------------------------------------------------");
    console.log("Artist:", artistData.name);
    console.log("Contract:", artistContractAddress);
    console.log("Token URI:", uri);
    console.log("----------------------------------------------------");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
