const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("DigitalOriginal Marketplace", function () {
    let factory;
    let implementation;
    let nftCollection;
    let owner;
    let artist;
    let buyer;
    let treasury;
    let galleryWallet;
    let addrs;

    // Constants
    const PLATFORM_FEE = 1000; // 10%
    const GALLERY_FEE = 500;   // 5%
    const ARTIST_ROYALTY = 1000; // 10%
    const BASIS_POINTS = 10000;

    beforeEach(async function () {
        [owner, artist, buyer, treasury, galleryWallet, ...addrs] = await ethers.getSigners();

        // Deploy Implementation
        const NFTCollectionUpgradeable = await ethers.getContractFactory("NFTCollectionUpgradeable");
        implementation = await NFTCollectionUpgradeable.deploy();
        await implementation.waitForDeployment();

        // Deploy Factory
        const OptimizedArtistFactory = await ethers.getContractFactory("OptimizedArtistFactory");
        factory = await OptimizedArtistFactory.deploy(
            await implementation.getAddress(),
            treasury.address,
            galleryWallet.address
        );
        await factory.waitForDeployment();
    });

    describe("Factory Deployment", function () {
        it("Should set the correct implementation address", async function () {
            expect(await factory.implementation()).to.equal(await implementation.getAddress());
        });

        it("Should set the correct treasury and gallery wallet", async function () {
            expect(await factory.treasury()).to.equal(treasury.address);
            expect(await factory.galleryWallet()).to.equal(galleryWallet.address);
        });
    });

    describe("Artist Contract Deployment", function () {
        it("Should deploy a new artist contract", async function () {
            const config = {
                name: "Artist Collection",
                symbol: "ART",
                treasury: treasury.address,
                galleryWallet: galleryWallet.address,
                artistRoyalty: ARTIST_ROYALTY
            };

            const tx = await factory.connect(owner).deployArtistContract(
                artist.address,
                "Test Artist",
                config
            );
            const receipt = await tx.wait();

            // Find the ArtistContractDeployed event
            const event = receipt.logs.find(log => {
                try {
                    const parsed = factory.interface.parseLog(log);
                    return parsed.name === 'ArtistContractDeployed';
                } catch (e) {
                    return false;
                }
            });

            const parsedEvent = factory.interface.parseLog(event);
            const contractAddress = parsedEvent.args.contractAddress;

            expect(contractAddress).to.not.equal(ethers.ZeroAddress);

            // Verify artist data
            const artistData = await factory.getArtistData(artist.address);
            expect(artistData.artistContract).to.equal(contractAddress);
            expect(artistData.artistName).to.equal("Test Artist");
        });
    });

    describe("NFT Functionality", function () {
        let artistContract;

        beforeEach(async function () {
            const config = {
                name: "Artist Collection",
                symbol: "ART",
                treasury: treasury.address,
                galleryWallet: galleryWallet.address,
                artistRoyalty: ARTIST_ROYALTY
            };

            const tx = await factory.connect(owner).deployArtistContract(
                artist.address,
                "Test Artist",
                config
            );
            const receipt = await tx.wait();

            const event = receipt.logs.find(log => {
                try {
                    const parsed = factory.interface.parseLog(log);
                    return parsed.name === 'ArtistContractDeployed';
                } catch (e) {
                    return false;
                }
            });
            const parsedEvent = factory.interface.parseLog(event);
            const contractAddress = parsedEvent.args.contractAddress;

            artistContract = await ethers.getContractAt("NFTCollectionUpgradeable", contractAddress);
        });

        describe("Batch Minting", function () {
            it("Should batch mint NFTs correctly", async function () {
                const recipients = [artist.address, artist.address];
                const uris = ["ipfs://1", "ipfs://2"];
                const artists = [artist.address, artist.address];
                const royalties = [ARTIST_ROYALTY, ARTIST_ROYALTY];
                const batchId = "batch1";

                await artistContract.connect(owner).batchMint(
                    recipients,
                    uris,
                    artists,
                    royalties,
                    batchId
                );

                expect(await artistContract.balanceOf(artist.address)).to.equal(2n);
                expect(await artistContract.ownerOf(1)).to.equal(artist.address);
                expect(await artistContract.ownerOf(2)).to.equal(artist.address);
            });
        });

        describe("Royalty Info (EIP-2981)", function () {
            it("Should return correct royalty info", async function () {
                // Mint one
                await artistContract.connect(owner).mintNFT(
                    artist.address,
                    "ipfs://1",
                    artist.address,
                    ARTIST_ROYALTY
                );

                const salePrice = ethers.parseEther("1.0");
                const [receiver, royaltyAmount] = await artistContract.royaltyInfo(1, salePrice);

                expect(receiver).to.equal(artist.address);
                expect(royaltyAmount).to.equal((salePrice * BigInt(ARTIST_ROYALTY)) / BigInt(BASIS_POINTS));
            });
        });

        describe("Sales and Tracking", function () {
            beforeEach(async function () {
                await artistContract.connect(owner).mintNFT(
                    artist.address,
                    "ipfs://1",
                    artist.address,
                    ARTIST_ROYALTY
                );
            });

            it("Should correctly report isSold status", async function () {
                // Initially not sold (owned by artist)
                expect(await artistContract.isSold(1)).to.be.false;

                // Transfer to buyer
                await artistContract.connect(artist).transferFrom(artist.address, buyer.address, 1);

                // Should be sold now (owner != artist)
                expect(await artistContract.isSold(1)).to.be.true;
            });

            it("Should execute internal purchase correctly", async function () {
                const price = ethers.parseEther("1.0");

                // List token
                await artistContract.connect(artist).listToken(1, price);

                // Record balances
                const buyerBalBefore = await ethers.provider.getBalance(buyer.address);
                const treasuryBalBefore = await ethers.provider.getBalance(treasury.address);
                const galleryBalBefore = await ethers.provider.getBalance(galleryWallet.address);
                const artistBalBefore = await ethers.provider.getBalance(artist.address);

                // Purchase
                const tx = await artistContract.connect(buyer).purchaseToken(1, { value: price });
                const receipt = await tx.wait();
                const gasUsed = receipt.gasUsed * receipt.gasPrice;

                // Verify balances
                const buyerBalAfter = await ethers.provider.getBalance(buyer.address);
                const treasuryBalAfter = await ethers.provider.getBalance(treasury.address);
                const galleryBalAfter = await ethers.provider.getBalance(galleryWallet.address);
                const artistBalAfter = await ethers.provider.getBalance(artist.address);

                expect(buyerBalAfter).to.equal(buyerBalBefore - price - gasUsed);
                expect(treasuryBalAfter).to.equal(treasuryBalBefore + (price * BigInt(PLATFORM_FEE)) / BigInt(BASIS_POINTS));
                expect(galleryBalAfter).to.equal(galleryBalBefore + (price * BigInt(GALLERY_FEE)) / BigInt(BASIS_POINTS));
                expect(artistBalAfter).to.equal(artistBalBefore + (price * BigInt(8500)) / BigInt(BASIS_POINTS));

                expect(await artistContract.ownerOf(1)).to.equal(buyer.address);
                expect(await artistContract.isSold(1)).to.be.true;
            });
        });
    });
});
