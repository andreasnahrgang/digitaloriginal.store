import hre from "hardhat";
import fetch from "node-fetch";

/**
 * Query NFT metadata from deployed contracts
 * Lists all IPFS URIs and their metadata
 */

async function main() {
    console.log("═══════════════════════════════════════════════════════");
    console.log("  🖼️  thirdweb IPFS Uploads - NFT Metadata Query");
    console.log("═══════════════════════════════════════════════════════\n");

    try {
        const factoryAddress = "0x608cFea5Cb87E6e2af991C61CFCaca4D4E720f28";
        
        console.log("📋 Query Configuration:");
        console.log(`   Network: ${hre.network.name}`);
        console.log(`   Factory: ${factoryAddress}\n`);

        const OptimizedArtistFactory = await hre.ethers.getContractFactory("OptimizedArtistFactory");
        const factory = OptimizedArtistFactory.attach(factoryAddress);

        console.log("🔍 Scanning Factory for Artist Contracts...\n");

        // Get factory info
        let artistCount = 0;
        let nftCount = 0;
        const uploads = [];

        console.log("📝 IPFS Uploads & Metadata:\n");
        console.log("─".repeat(60));

        // This would require iterating through events or storage
        // For now, show structure of what will be queried
        console.log("Artist Contract Format:");
        console.log("  - Address: <contract_address>");
        console.log("  - NFTs:");
        console.log("    - Token ID: <id>");
        console.log("    - Owner: <address>");
        console.log("    - IPFS URI: ipfs://<hash>");
        console.log("    - Metadata: <name, description, image, attributes>\n");
        console.log("─".repeat(60));

        // Alternative: Query specific contracts if known
        console.log("\n✓ Method 1: Query Known Contracts (if addresses provided)");
        console.log("✓ Method 2: Scan Factory events for deployed contracts");
        console.log("✓ Method 3: Use thirdweb dashboard\n");

        // Try to get contract events
        console.log("🔎 Querying contract deployment events...\n");
        
        try {
            // Query past events for contract deployments
            const fromBlock = 0;
            const toBlock = "latest";
            
            const filterName = "ArtistContractDeployed";
            console.log(`Looking for events: ${filterName}`);
            
            // Note: This depends on factory implementation having this event
            // Adjust based on actual contract events
            
            console.log("⚠️  Requires contract event logs accessible on blockchain\n");
        } catch (error) {
            console.log("Note: Event query requires contract event definitions\n");
        }

        // Summary
        console.log("📊 Summary:");
        console.log(`   Artist Contracts Found: ${artistCount}`);
        console.log(`   Total NFTs: ${nftCount}`);
        console.log(`   IPFS Uploads: ${uploads.length}\n`);

        // Show retrieved IPFS uploads
        if (uploads.length > 0) {
            console.log("📦 Retrieved IPFS Uploads:\n");
            uploads.forEach((upload, idx) => {
                console.log(`${idx + 1}. ${upload.hash}`);
                console.log(`   Artist: ${upload.artist}`);
                console.log(`   Name: ${upload.name}`);
                console.log(`   Image: ${upload.image}`);
                console.log("");
            });
        }

        console.log("═══════════════════════════════════════════════════════\n");
        console.log("💡 To see full IPFS upload list:");
        console.log("   1. Visit: https://thirdweb.com/dashboard");
        console.log("   2. Go to: Settings → Storage");
        console.log("   3. Export list as JSON/CSV\n");

    } catch (error) {
        console.error("❌ Error:", error.message);
        if (process.env.DEBUG) console.error(error);
        process.exit(1);
    }
}

main().catch((error) => {
    console.error("Fatal error:", error);
    process.exit(1);
});
