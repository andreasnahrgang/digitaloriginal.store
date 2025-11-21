#!/usr/bin/env node

import fetch from "node-fetch";

/**
 * Extract IPFS uploads from thirdweb dashboard
 * Queries the thirdweb API to list all stored files
 */

const SECRET_KEY = process.env.THIRDWEB_SECRET_KEY;
const CLIENT_ID = process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID;

if (!SECRET_KEY || !CLIENT_ID) {
    console.error("❌ Missing credentials:");
    console.error("   THIRDWEB_SECRET_KEY:", SECRET_KEY ? "✓" : "✗");
    console.error("   NEXT_PUBLIC_THIRDWEB_CLIENT_ID:", CLIENT_ID ? "✓" : "✗");
    process.exit(1);
}

async function fetchWithAuth(url, options = {}) {
    return fetch(url, {
        ...options,
        headers: {
            "Authorization": `Bearer ${SECRET_KEY}`,
            "X-Client-ID": CLIENT_ID,
            "Content-Type": "application/json",
            ...options.headers,
        },
    });
}

async function getStorageUsage() {
    console.log("═══════════════════════════════════════════════════════");
    console.log("  📦 thirdweb IPFS Uploads - Complete Inventory");
    console.log("═══════════════════════════════════════════════════════\n");

    try {
        // Try multiple endpoints to get storage/files data
        const endpoints = [
            {
                name: "Files API",
                url: "https://api.thirdweb.com/v1/storage/files",
            },
            {
                name: "Storage Stats",
                url: "https://api.thirdweb.com/v1/account/storage",
            },
            {
                name: "Upload History",
                url: "https://api.thirdweb.com/v1/account/uploads",
            },
        ];

        let found = false;

        for (const { name, url } of endpoints) {
            try {
                console.log(`🔍 Trying: ${name}`);
                console.log(`   URL: ${url}`);

                const response = await fetchWithAuth(url);
                
                if (response.ok) {
                    const data = await response.json();
                    console.log("   ✓ Success!\n");
                    console.log(JSON.stringify(data, null, 2));
                    found = true;
                    break;
                } else {
                    console.log(`   Status: ${response.status} ${response.statusText}`);
                }
            } catch (err) {
                console.log(`   Error: ${err.message}`);
            }
            console.log("");
        }

        if (!found) {
            console.log("⚠️  API endpoints not accessible via standard endpoints.\n");
            console.log("Alternative: Direct Dashboard Data Extraction\n");
            printDashboardInstructions();
        }

    } catch (error) {
        console.error("❌ Error:", error.message);
        process.exit(1);
    }
}

function printDashboardInstructions() {
    console.log("Since you already have access to the dashboard, here's how to extract the data:\n");
    
    console.log("📊 Manual Export from Dashboard:");
    console.log("━".repeat(60));
    console.log(`
1. Open your browser and go to:
   https://thirdweb.com/team/1677596d0fcd31580e84a892d404d3fce00a8269/~/usage/storage

2. You should see all uploaded files listed with:
   • File names
   • IPFS hashes (QmXXXX...)
   • File sizes
   • Upload dates

3. To export, look for:
   • "Export" button
   • "Download as CSV/JSON" option
   • Right-click to "Save as"

4. If no export option, use browser DevTools:
   • Press F12 to open DevTools
   • Go to Network tab
   • Reload the page
   • Look for API calls to "files", "storage", or "uploads"
   • Copy the JSON response
    `);
    
    console.log("━".repeat(60));
    console.log("\n💡 Browser DevTools Method (Most Reliable):\n");
    
    console.log("1. Open: https://thirdweb.com/team/1677596d0fcd31580e84a892d404d3fce00a8269/~/usage/storage");
    console.log("2. Press F12 (or Cmd+Option+I on Mac)");
    console.log("3. Go to: Console tab");
    console.log("4. Paste this code to extract all files:\n");
    
    console.log(`
// Extract all IPFS uploads from page
const uploads = [];
document.querySelectorAll('[data-file], [data-upload], tr').forEach(el => {
    const name = el.querySelector('[data-name]')?.textContent || 
                 el.querySelector('.name')?.textContent || '';
    const hash = el.querySelector('[data-hash]')?.textContent || 
                 el.querySelector('.hash')?.textContent || '';
    const size = el.querySelector('[data-size]')?.textContent || 
                 el.querySelector('.size')?.textContent || '';
    const date = el.querySelector('[data-date]')?.textContent || 
                 el.querySelector('.date')?.textContent || '';
    
    if (hash && name) {
        uploads.push({ name, hash, size, date });
    }
});

console.table(uploads);
console.log(JSON.stringify(uploads, null, 2));
    `);

    console.log("\n5. Copy the JSON output");
    console.log("6. Save to a file\n");
}

async function main() {
    await getStorageUsage();
    console.log("═══════════════════════════════════════════════════════\n");
}

main().catch((error) => {
    console.error("Fatal error:", error);
    process.exit(1);
});
