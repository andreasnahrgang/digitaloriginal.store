"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";

const Navbar = dynamic(
  () => import("@/components/navbar").then(mod => ({ default: mod.Navbar })),
  { ssr: false, loading: () => <nav className="fixed top-0 left-0 right-0 z-50 h-16 bg-black/80 backdrop-blur-md border-b border-border" /> }
);
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

// Mock data - replace with ThirdWeb SDK fetch
const allNFTs = [
    {
        id: 1,
        title: "Abstract Digital #1",
        artist: "Artist One",
        price: "0.5 ETH",
        image: "https://ipfs.io/ipfs/QmUvMLF1mcjRujX7rGSQ9tY7pdBFSpicgpt85YVNiqPcW2",
    },
    {
        id: 2,
        title: "Neon Genesis",
        artist: "Artist Two",
        price: "0.8 ETH",
        image: "https://ipfs.io/ipfs/QmR7Spu6GLZHs2VHrjP2qNZiWrGoFSWzEZMUPDa6ejRyWg",
    },
    {
        id: 3,
        title: "Cyber Punk 2077",
        artist: "Artist Three",
        price: "1.2 ETH",
        image: "https://ipfs.io/ipfs/QmVTujrCe6vnShvUVfvBqcr8XAf9YmaZLAHof7thjjnHjQ",
    },
    {
        id: 4,
        title: "Digital Wave",
        artist: "Artist Four",
        price: "0.3 ETH",
        image: "https://ipfs.io/ipfs/QmdAnD7SoEMWGpV9NHpxNvB4cq2YuTo7eA4YAJQpHg2R8T",
    },
    {
        id: 5,
        title: "Future City",
        artist: "Artist Five",
        price: "2.0 ETH",
        image: "https://ipfs.io/ipfs/QmSz8zi3AHGXDTm35w4e9xybWJfRMkXk8Yd8MGtbn3HeZ4",
    },
    {
        id: 6,
        title: "Glitch Art",
        artist: "Artist Six",
        price: "0.1 ETH",
        image: "https://ipfs.io/ipfs/QmUTnPcmcRvBMQLg516wCUUxA2XZyrWPXZ6DHJahGV5qS5",
    },
];

export default function MarketplacePage() {
    return (
        <main className="min-h-screen bg-background text-foreground">
            <Suspense fallback={<nav className="fixed top-0 left-0 right-0 z-50 h-16 bg-black/80 backdrop-blur-md border-b border-border" />}>
        <Navbar />
      </Suspense>

            <div className="container mx-auto px-4 pt-24 pb-12">
                <header className="mb-12 text-center">
                    <h1 className="text-4xl font-bold tracking-tighter mb-4 text-white">Marketplace</h1>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        Discover and collect unique digital art from our curated selection of artists.
                    </p>
                </header>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {allNFTs.map((nft) => (
                        <Link href={`/nft/${nft.id}`} key={nft.id}>
                            <Card className="bg-black border border-border hover:border-primary transition-colors duration-300 overflow-hidden group h-full flex flex-col">
                                <CardHeader className="p-0">
                                    <div className="aspect-square overflow-hidden relative">
                                        <img
                                            src={nft.image}
                                            alt={nft.title}
                                            className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                                        />
                                    </div>
                                </CardHeader>
                                <CardContent className="p-6 flex-grow">
                                    <CardTitle className="text-xl font-bold text-white mb-2">{nft.title}</CardTitle>
                                    <p className="text-sm text-muted-foreground">by <span className="text-primary">{nft.artist}</span></p>
                                </CardContent>
                                <CardFooter className="p-6 pt-0 flex justify-between items-center">
                                    <span className="text-lg font-bold text-white">{nft.price}</span>
                                    <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-black">
                                        View Details
                                    </Button>
                                </CardFooter>
                            </Card>
                        </Link>
                    ))}
                </div>
            </div>
        </main>
    );
}
