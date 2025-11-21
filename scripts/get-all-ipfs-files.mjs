#!/usr/bin/env node

import fetch from "node-fetch";

const SECRET_KEY = process.env.THIRDWEB_SECRET_KEY;
const CLIENT_ID = process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID;

if (!SECRET_KEY || !CLIENT_ID) {
    console.error("Missing environment variables");
    process.exit(1);
}

async function listIPFSFiles() {
    console.log("═══════════════════════════════════════════════════════");
    console.log("  📦 thirdweb IPFS Files - Complete Inventory");
    console.log("═══════════════════════════════════════════════════════\n");

    try {
        // Try GraphQL API endpoint
        const graphqlQuery = {
            query: `
                query GetStorageFiles {
                    account {
                        storage {
                            files(first: 100) {
                                edges {
                                    node {
                                        id
                                        name
                                        hash
                                        size
                                        mimeType
                                        uploadedAt
                                        metadata
                                    }
                                }
                            }
                        }
                    }
                }
            `
        };

        const response = await fetch("https://api.thirdweb.com/graphql", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${SECRET_KEY}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(graphqlQuery),
        });

        if (response.ok) {
            const data = await response.json();
            console.log("✓ Retrieved storage data:\n");
            console.log(JSON.stringify(data, null, 2));
        } else {
            console.log(`Status: ${response.status}`);
            const text = await response.text();
            console.log("Response:", text.substring(0, 500));
        }

    } catch (error) {
        console.error("Error:", error.message);
    }

    // Show manual instructions
    console.log("\n═══════════════════════════════════════════════════════");
    console.log("\n🔑 To Access Storage via Direct API Connection:\n");
    console.log("You have full API access credentials:");
    console.log(`   Client ID: ${CLIENT_ID}`);
    console.log(`   Secret Key: ${SECRET_KEY.substring(0, 20)}...\n`);
    
    console.log("📊 Since you're logged into the dashboard, navigate to:");
    console.log("   https://thirdweb.com/team/1677596d0fcd31580e84a892d404d3fce00a8269/~/usage/storage\n");
    
    console.log("The page shows ALL your IPFS uploads with:");
    console.log("   ✓ File names");
    console.log("   ✓ IPFS hashes (QmXXXX...)");
    console.log("   ✓ File sizes (bytes)");
    console.log("   ✓ Upload timestamps");
    console.log("   ✓ File types\n");
}

listIPFSFiles();
