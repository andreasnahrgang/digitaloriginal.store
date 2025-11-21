# Digital Original - Smart Contract & Workflow Update

We have successfully improved the smart contracts, deployed them to the Amoy testnet, and established a content-to-minting workflow.

## 1. Smart Contract Improvements

- **EIP-2981 Royalty Standard**: Implemented `royaltyInfo` in both `NFTCollection` and `NFTCollectionUpgradeable` to ensure compatibility with Thirdweb MarketplaceV3 and other external marketplaces.
- **"Sold" Status Tracking**: Added an `isSold(tokenId)` helper function to easily track primary sales status.
- **Bug Fixes**: Resolved syntax errors and dependency issues in the contract files.

## 2. Deployment (Amoy Testnet)

The contracts have been deployed to the Polygon Amoy Testnet.

| Contract | Address |
| :--- | :--- |
| **Implementation** | `0x11720b185c168421f4A930D7bF97A5ed1CEe15e9` |
| **Factory** | `0x608cFea5Cb87E6e2af991C61CFCaca4D4E720f28` |
| **Treasury** | `0x17116cC21Df3Fe56ecA56DA4B7C3f962A0f94471` |

> [!NOTE]
> Verification on PolygonScan was skipped due to a missing API key, but the contracts are fully functional.

## 3. Workflow & Automation

### TinaCMS Integration
- Added an **Artist** collection to `tina/config.ts`.
- Fields: `Name`, `Bio` (Rich Text), `Profile Image`.

### Minting Script (`scripts/mint-nft.js`)
- **IPFS Upload**: Uses Thirdweb SDK to upload metadata (including bio and attributes).
- **USD Pricing**: Includes logic to convert USD price to MATIC.
- **Automated Minting**: Deploys a new Artist Contract (if needed) via the Factory and mints the NFT.

### Documentation
- A detailed guide is available at [`docs/workflow.md`](file:///Users/andreasnahrgang/digitaloriginal.store/docs/workflow.md).
- It covers the manual workflow and how to automate it with an agent.

## 4. Next Steps

1.  **Frontend Integration**: Update your frontend to fetch the "Sold" status from the contract.
2.  **Thirdweb Dashboard**: Import the contracts into Thirdweb to verify the Royalty settings visually.
3.  **Run the Script**: Try running `npx hardhat run scripts/mint-nft.js --network amoy` to mint your first test NFT with the new workflow.
