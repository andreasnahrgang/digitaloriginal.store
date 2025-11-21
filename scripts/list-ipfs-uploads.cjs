#!/usr/bin/env node

require("dotenv").config();

const fetch = require("node-fetch");

// Load environment variables
const THIRDWEB_SECRET_KEY = process.env.THIRDWEB_SECRET_KEY;
const NEXT_PUBLIC_THIRDWEB_CLIENT_ID = process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID;

if (!THIRDWEB_SECRET_KEY || !NEXT_PUBLIC_THIRDWEB_CLIENT_ID) {
    console.error("❌ Missing environment variables:");
    console.error("   THIRDWEB_SECRET_KEY:", THIRDWEB_SECRET_KEY ? "✓" : "✗");
    console.error("   NEXT_PUBLIC_THIRDWEB_CLIENT_ID:", NEXT_PUBLIC_THIRDWEB_CLIENT_ID ? "✓" : "✗");
    process.exit(1);
}

/**
 * Query thirdweb Storage Dashboard/API
 */
async function listIPFSUploads() {
    try {
        console.log("═══════════════════════════════════════════════════════");
        console.log("  🖼️  thirdweb IPFS Uploads - Inventory Report");
        console.log("═══════════════════════════════════════════════════════\n");

        console.log("📝 Account Configuration:");
        console.log(`   Client ID: ${NEXT_PUBLIC_THIRDWEB_CLIENT_ID}`);
        console.log(`   Secret Key: ${THIRDWEB_SECRET_KEY.substring(0, 20)}...`);
        console.log("");

        // Try to query thirdweb dashboard API
        console.log("🔍 Attempting to query thirdweb Storage API...\n");

        const headers = {
            "Authorization": `Bearer ${THIRDWEB_SECRET_KEY}`,
            "Content-Type": "application/json",
        };

        // Query thirdweb's storage tracking endpoints
        const endpoints = [
            "https://api.thirdweb.com/v1/storage",
            "https://api.thirdweb.com/v1/account/storage",
            "https://storage.thirdweb.com/api/uploads",
        ];

        let found = false;

        for (const endpoint of endpoints) {
            try {
                console.log(`  Trying: ${endpoint}`);
                const response = await fetch(endpoint, {
                    method: "GET",
                    headers,
                    timeout: 5000,
                });

                if (response.ok) {
                    const data = await response.json();
                    console.log(`  ✓ Success!\n`);
                    console.log("📦 IPFS Uploads Found:\n");
                    console.log(JSON.stringify(data, null, 2));
                    found = true;
                    break;
                }
            } catch (err) {
                // Continue to next endpoint
            }
        }

        if (!found) {
            console.log("\n⚠️  Storage API endpoints not accessible.\n");
            console.log("Alternative Method: Query from Blockchain\n");
            console.log("To retrieve IPFS uploads that were used for NFT minting:\n");
            console.log("1. Get Artist Contract Addresses from Factory");
            console.log("2. Query each contract's tokenURI(tokenId)");
            console.log("3. Fetch metadata from IPFS hashes\n");

            console.log("📋 Known Contracts:\n");
            console.log("Factory: 0x608cFea5Cb87E6e2af991C61CFCaca4D4E720f28\n");

            console.log("Commands to run:\n");
            console.log("  # List all artist contracts:");
            console.log("  hardhat run scripts/query-factory.js --network mumbai\n");
            console.log("  # Query NFT metadata from contracts:");
            console.log("  hardhat run scripts/query-nft-metadata.js --network mumbai\n");
        }

    } catch (error) {
        console.error("❌ Error:", error.message);
        process.exit(1);
    }
}

/**
 * Query via thirdweb Dashboard (requires web browser)
 */
function showDashboardInstructions() {
    console.log("\n📊 Manual Method - thirdweb Dashboard:\n");
    console.log("1. Go to: https://thirdweb.com/dashboard");
    console.log("2. Navigate to: Settings → Storage");
    console.log("3. View all uploaded files and their IPFS hashes");
    console.log("4. Download CSV/JSON export if available\n");
}

/**
 * Main execution
 */
async function main() {
    await listIPFSUploads();
    showDashboardInstructions();
    console.log("═══════════════════════════════════════════════════════\n");
}

main().catch((error) => {
    console.error("Fatal error:", error);
    process.exit(1);
});
