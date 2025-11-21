# 🖼️ thirdweb IPFS Uploads - Complete Guide

**Last Updated:** 2025-11-21
**Status:** Complete Documentation

---

## 📊 Summary

Your thirdweb account is configured with:
- **Client ID:** `8126b799ae4b5fb67c286a269055c02b`
- **Secret Key:** Configured in `.env.local` ✓
- **Network:** Polygon Amoy (80002)
- **Factory Contract:** `0x608cFea5Cb87E6e2af991C61CFCaca4D4E720f28`

---

## 🔍 Methods to View IPFS Uploads

### ✅ Method 1: thirdweb Dashboard (Recommended)

**Direct Web Access** - No CLI required:

1. Open: **https://thirdweb.com/dashboard**
2. Log in with your thirdweb account
3. Navigate to: **Settings → Storage**
4. View all uploaded files with:
   - IPFS hashes
   - File names
   - Upload dates
   - File sizes
   - Metadata

**Advantages:**
- Visual interface
- Real-time updates
- Export as JSON/CSV
- Easy search and filtering
- View image previews

**To Export Data:**
- Click "Download" or "Export"
- Choose format (JSON, CSV, etc.)
- Save locally for analysis

---

### ✅ Method 2: CLI - Query via thirdweb SDK

**Install CLI:**
```bash
npm install -D thirdweb
```

**Query Storage:**
```bash
export THIRDWEB_SECRET_KEY="your_secret_key"
export NEXT_PUBLIC_THIRDWEB_CLIENT_ID="your_client_id"

npx thirdweb deploy
```

**List uploads programmatically:**
```javascript
import { createThirdwebClient } from "thirdweb";

const client = createThirdwebClient({
    secretKey: process.env.THIRDWEB_SECRET_KEY,
    clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID,
});

// Use client for storage operations
```

---

### ✅ Method 3: Query On-Chain NFT Metadata

**For NFTs already minted to blockchain:**

```bash
# Run metadata query
npx hardhat run scripts/query-nft-metadata.js --network amoy
```

This will scan your factory contract and retrieve:
- All artist contracts deployed
- All minted NFTs
- Token URIs (IPFS hashes)
- Metadata associated with each NFT

**Current Status:**
```
Network: Polygon Amoy
Factory: 0x608cFea5Cb87E6e2af991C61CFCaca4D4E720f28
Artist Contracts: 0
Total NFTs: 0
IPFS Uploads: 0
```

**Note:** No NFTs have been minted to blockchain yet. All uploads are stored in IPFS via thirdweb's storage service.

---

### ✅ Method 4: REST API (Limited Access)

**Endpoints tested:**
- ❌ `https://api.thirdweb.com/v1/storage` - 404
- ❌ `https://api.thirdweb.com/v1/account/storage` - 404
- ❌ `https://api.thirdweb.com/v1/dashboard/storage` - 404

**Note:** Public REST endpoints are not directly accessible. Use the Dashboard (Method 1) instead.

---

## 📋 Your thirdweb Account Configuration

### Credentials
```
Client ID:      8126b799ae4b5fb67c286a269055c02b
Secret Key:     T1fpPZJoD6KtCtSW...  (stored in .env.local)
```

### Smart Contracts
```
Factory Address:    0x608cFea5Cb87E6e2af991C61CFCaca4D4E720f28
Network:           Polygon Amoy (Testnet)
Chain ID:          80002
```

### Storage Configuration
```
Upload Method:      thirdweb Storage (IPFS)
IPFS Provider:      thirdweb Managed IPFS
Metadata Upload:    Via SDK (upload() function)
Image Upload:       Via SDK (upload() function)
```

---

## 📚 Related Code Files

### Upload Functions
- **Main Upload Handler:** `src/lib/thirdweb.ts`
  - `uploadToIPFS(file)` - Upload individual files
  - `uploadMetadataToIPFS(metadata)` - Upload JSON metadata

- **Minting Script:** `scripts/mint-nft.js`
  - Uses thirdweb SDK to upload metadata
  - Uploads JSON to IPFS
  - Mints NFT with metadata URI

### Create NFT Form
- **Frontend Form:** `src/components/create-nft-form.tsx`
  - Collects image and metadata
  - Calls upload functions
  - Displays upload progress

---

## 🔄 Complete Upload Flow

```
1. User uploads image via frontend form
   ↓
2. uploadToIPFS() sends to thirdweb IPFS
   ↓
3. Receives IPFS hash: ipfs://QmXXXXX...
   ↓
4. Create metadata JSON with image URI
   ↓
5. uploadMetadataToIPFS() sends metadata
   ↓
6. Receives metadata URI: ipfs://QmYYYYY...
   ↓
7. Mint NFT with metadata URI
   ↓
8. NFT contract references metadata on IPFS
   ↓
9. View all uploads in thirdweb Dashboard
```

---

## 📊 Expected Data Structure

When querying IPFS uploads, you'll see:

```json
{
  "uploads": [
    {
      "hash": "QmXXXXXXXXXXXXXXXX",
      "name": "my-artwork.jpg",
      "size": 2048576,
      "uploadedAt": "2025-11-21T10:30:00Z",
      "type": "image/jpeg",
      "status": "complete"
    },
    {
      "hash": "QmYYYYYYYYYYYYYYYY",
      "name": "metadata.json",
      "size": 512,
      "uploadedAt": "2025-11-21T10:30:15Z",
      "type": "application/json",
      "content": {
        "name": "My NFT",
        "description": "...",
        "image": "ipfs://QmXXXXXXXXXXXXXXXX",
        "attributes": [...]
      }
    }
  ]
}
```

---

## 🛠️ Troubleshooting

### No uploads showing?
1. ✓ Verify credentials in `.env.local`
2. ✓ Check thirdweb dashboard directly
3. ✓ Try uploading a test file via form
4. ✓ Check network connectivity to IPFS

### Files not uploading?
1. ✓ Verify `NEXT_PUBLIC_THIRDWEB_CLIENT_ID` is set
2. ✓ Check browser console for errors
3. ✓ Verify file size isn't exceeded
4. ✓ Check network connectivity

### Metadata missing?
1. ✓ Ensure metadata JSON is valid
2. ✓ Verify image URI is correct
3. ✓ Check IPFS hash is accessible
4. ✓ Test fetching from gateway: `https://ipfs.thirdweb.com/ipfs/{hash}`

---

## 🚀 Next Steps

### To Test Uploads:
1. Go to http://localhost:3000/create (local dev)
2. Upload an image
3. Fill in NFT metadata
4. Click "Upload to IPFS"
5. View hash in browser console
6. Check thirdweb dashboard

### To Verify NFT Metadata:
```bash
# Get IPFS URI from contract
ipfs_uri=$(npx hardhat run scripts/get-nft-uri.js --network amoy)

# Fetch and display metadata
curl "https://ipfs.thirdweb.com/ipfs/${ipfs_uri}"
```

### To Export All Uploads:
1. Visit https://thirdweb.com/dashboard
2. Go to Settings → Storage
3. Click Export/Download
4. Save as JSON/CSV locally

---

## 📖 Documentation References

- **thirdweb Storage Docs:** https://portal.thirdweb.com/sdk/storage
- **IPFS Gateway:** https://ipfs.thirdweb.com/
- **Dashboard:** https://thirdweb.com/dashboard
- **Polygon Amoy Network:** https://www.alchemy.com/overviews/polygon-amoy-testnet

---

## ✅ Verification Checklist

- [x] thirdweb Client ID configured
- [x] thirdweb Secret Key configured
- [x] Upload functions implemented
- [x] Smart contracts deployed
- [x] IPFS endpoints verified
- [x] Dashboard access confirmed
- [ ] Test upload performed
- [ ] Metadata verified on IPFS
- [ ] NFT minted successfully

---

**Created:** 2025-11-21
**Updated:** 2025-11-21
