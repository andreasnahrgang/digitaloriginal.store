"use client";

import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useParams } from "next/navigation";

// Mock data - replace with ThirdWeb SDK fetch
const allNFTs = [
    {
        id: 1,
        title: "Abstract Digital #1",
        artist: "Artist One",
        price: "0.5 ETH",
        image: "https://ipfs.io/ipfs/QmUvMLF1mcjRujX7rGSQ9tY7pdBFSpicgpt85YVNiqPcW2",
        description: "A stunning exploration of abstract digital forms, blending chaos and order in a unique visual experience.",
        attributes: [
            { trait_type: "Background", value: "Dark" },
            { trait_type: "Style", value: "Abstract" },
            { trait_type: "Color", value: "Blue" },
        ],
    },
    {
        id: 2,
        title: "Neon Genesis",
        artist: "Artist Two",
        price: "0.8 ETH",
        image: "https://ipfs.io/ipfs/QmR7Spu6GLZHs2VHrjP2qNZiWrGoFSWzEZMUPDa6ejRyWg",
        description: "Neon lights and futuristic vibes collide in this masterpiece of digital art.",
        attributes: [
            { trait_type: "Background", value: "City" },
            { trait_type: "Style", value: "Cyberpunk" },
            { trait_type: "Color", value: "Neon" },
        ],
    },
    {
        id: 3,
        title: "Cyber Punk 2077",
        artist: "Artist Three",
        price: "1.2 ETH",
        image: "https://ipfs.io/ipfs/QmVTujrCe6vnShvUVfvBqcr8XAf9YmaZLAHof7thjjnHjQ",
        description: "A gritty look at a high-tech future.",
        attributes: [
            { trait_type: "Background", value: "Street" },
            { trait_type: "Style", value: "Cyberpunk" },
            { trait_type: "Color", value: "Yellow" },
        ],
    },
    {
        id: 4,
        title: "Digital Wave",
        artist: "Artist Four",
        price: "0.3 ETH",
        image: "https://ipfs.io/ipfs/QmdAnD7SoEMWGpV9NHpxNvB4cq2YuTo7eA4YAJQpHg2R8T",
        description: "Riding the wave of digital transformation.",
        attributes: [
            { trait_type: "Background", value: "Ocean" },
            { trait_type: "Style", value: "Fluid" },
            { trait_type: "Color", value: "Blue" },
        ],
    },
    {
        id: 5,
        title: "Future City",
        artist: "Artist Five",
        price: "2.0 ETH",
        image: "https://ipfs.io/ipfs/QmSz8zi3AHGXDTm35w4e9xybWJfRMkXk8Yd8MGtbn3HeZ4",
        description: "A glimpse into the metropolis of tomorrow.",
        attributes: [
            { trait_type: "Background", value: "Skyline" },
            { trait_type: "Style", value: "Futuristic" },
            { trait_type: "Color", value: "Silver" },
        ],
    },
    {
        id: 6,
        title: "Glitch Art",
        artist: "Artist Six",
        price: "0.1 ETH",
        image: "https://ipfs.io/ipfs/QmUTnPcmcRvBMQLg516wCUUxA2XZyrWPXZ6DHJahGV5qS5",
        description: "Embracing the beauty of errors.",
        attributes: [
            { trait_type: "Background", value: "Static" },
            { trait_type: "Style", value: "Glitch" },
            { trait_type: "Color", value: "RGB" },
        ],
    },
];

export default function NFTDetailPage() {
    const params = useParams();
    const id = params?.id ? Number(params.id) : 1;
    const nft = allNFTs.find((n) => n.id === id) || allNFTs[0]; // Fallback to first for demo if ID not found

    return (
        <main className="min-h-screen bg-background text-foreground">
            <Navbar />

            <div className="container mx-auto px-4 pt-24 pb-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Image Section */}
                    <div className="flex items-center justify-center">
                        <div className="relative w-full aspect-square max-w-xl rounded-xl overflow-hidden border border-border shadow-2xl shadow-primary/10">
                            <img
                                src={nft.image}
                                alt={nft.title}
                                className="object-cover w-full h-full"
                            />
                        </div>
                    </div>

                    {/* Details Section */}
                    <div className="flex flex-col justify-center space-y-8">
                        <div>
                            <h1 className="text-4xl md:text-5xl font-bold tracking-tighter text-white mb-2">{nft.title}</h1>
                            <p className="text-xl text-primary font-medium">Created by {nft.artist}</p>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-white">Description</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                {nft.description}
                            </p>
                        </div>

                        <Separator className="bg-border" />

                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-white">Attributes</h3>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                {nft.attributes.map((attr, index) => (
                                    <div key={index} className="bg-secondary/10 border border-border rounded-lg p-3 text-center">
                                        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">{attr.trait_type}</p>
                                        <p className="text-sm font-bold text-white">{attr.value}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <Separator className="bg-border" />

                        <div className="bg-secondary/5 border border-border rounded-xl p-6 space-y-4">
                            <div className="flex justify-between items-end">
                                <div>
                                    <p className="text-sm text-muted-foreground mb-1">Current Price</p>
                                    <p className="text-3xl font-bold text-white">{nft.price}</p>
                                </div>
                            </div>
                            <Button className="w-full bg-primary text-black hover:bg-primary/90 font-bold text-lg py-6">
                                Buy Now
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
