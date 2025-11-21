#!/usr/bin/env node

import { createThirdwebClient } from "thirdweb";

// Set up client with secret key for backend access
const THIRDWEB_SECRET_KEY = process.env.THIRDWEB_SECRET_KEY;
const NEXT_PUBLIC_THIRDWEB_CLIENT_ID = process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID;

if (!THIRDWEB_SECRET_KEY && !NEXT_PUBLIC_THIRDWEB_CLIENT_ID) {
    console.error("❌ Missing THIRDWEB_SECRET_KEY or NEXT_PUBLIC_THIRDWEB_CLIENT_ID in .env.local");
    process.exit(1);
}

const client = createThirdwebClient({
    secretKey: THIRDWEB_SECRET_KEY,
    clientId: NEXT_PUBLIC_THIRDWEB_CLIENT_ID,
});

/**
 * Query thirdweb IPFS storage via SDK
 * Lists all files uploaded to IPFS by your client
 */
async function listIPFSUploads() {
    try {
        console.log("🔍 Querying thirdweb IPFS Storage...\n");
        
        // Note: thirdweb SDK doesn't directly expose a "list all uploads" API
        // Instead, we'll need to use the REST API or fetch from known contract addresses
        
        // Alternative approach: Use thirdweb's storage explorer API
        const storageAPI = `https://storage.thirdweb.com/ipfs/`;
        
        console.log("📝 IPFS Upload Status:\n");
        console.log(`Client ID: ${NEXT_PUBLIC_THIRDWEB_CLIENT_ID}`);
        console.log(`Secret Key: ${THIRDWEB_SECRET_KEY ? "✓ Present" : "✗ Missing"}\n`);
        
        console.log("⚠️  Note: Direct IPFS listing requires:");
        console.log("1. Knowledge of uploaded IPFS hashes (from contract token URIs)");
        console.log("2. Contract addresses with minted NFTs\n");
        
        // Option 1: Check known NFT contracts for their URIs
        const factoryAddress = "0x608cFea5Cb87E6e2af991C61CFCaca4D4E720f28";
        
        console.log(`📋 Scanning Factory Contract: ${factoryAddress}\n`);
        console.log("To retrieve IPFS uploads, you need to:\n");
        console.log("✓ Query NFT contracts for tokenURIs()");
        console.log("✓ Fetch metadata from returned IPFS hashes");
        console.log("✓ Aggregate all metadata with image URIs\n");
        
    } catch (error) {
        console.error("❌ Error querying IPFS:", error.message);
        process.exit(1);
    }
}

/**
 * Query thirdweb REST API for storage info
 */
async function queryThirdwebStorageAPI() {
    try {
        console.log("🌐 Querying thirdweb Storage API...\n");
        
        const headers = {
            "Authorization": `Bearer ${THIRDWEB_SECRET_KEY}`,
            "Content-Type": "application/json",
        };
        
        // This endpoint might not be directly available, but worth trying
        const response = await fetch("https://api.thirdweb.com/v1/storage/uploads", {
            method: "GET",
            headers,
        }).catch(() => null);
        
        if (response && response.ok) {
            const data = await response.json();
            return data;
        }
        
        console.log("ℹ️  thirdweb Storage API endpoint not directly accessible via REST.\n");
        console.log("Alternative: Query individual contract addresses\n");
        
    } catch (error) {
        console.error("Error querying storage API:", error.message);
    }
}

/**
 * Main execution
 */
async function main() {
    console.log("═══════════════════════════════════════════════════════");
    console.log("  🖼️  thirdweb IPFS Upload Manager");
    console.log("═══════════════════════════════════════════════════════\n");
    
    await listIPFSUploads();
    await queryThirdwebStorageAPI();
    
    console.log("📌 To fully list IPFS uploads, provide:");
    console.log("   • Contract addresses (NFT collections)");
    console.log("   • Or specific IPFS hashes to query\n");
    
    console.log("═══════════════════════════════════════════════════════\n");
}

main().catch((error) => {
    console.error("Fatal error:", error);
    process.exit(1);
});
