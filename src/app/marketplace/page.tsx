"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";
import { allNFTs, getRarityColor, validateNFTMetadata } from "@/data/nft-metadata";

const Navbar = dynamic(
  () => import("@/components/navbar").then(mod => ({ default: mod.Navbar })),
  { ssr: false, loading: () => <nav className="fixed top-0 left-0 right-0 z-50 h-16 bg-black/80 backdrop-blur-md border-b border-border" /> }
);
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

// Validate all NFT metadata on load
const validatedNFTs = allNFTs.filter(nft => validateNFTMetadata(nft));

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
                    {validatedNFTs.length > 0 ? (
                        validatedNFTs.map((nft) => (
                            <Link href={`/nft/${nft.id}`} key={nft.id}>
                                <Card className="bg-black border border-border hover:border-primary transition-colors duration-300 overflow-hidden group h-full flex flex-col">
                                    <CardHeader className="p-0">
                                        <div className="aspect-square overflow-hidden relative bg-neutral-900">
                                            <img
                                                src={nft.image}
                                                alt={nft.title}
                                                className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                                                onError={(e) => {
                                                    e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Crect fill="%23222" width="400" height="400"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23666" font-size="16" font-family="Verdana"%3EImage unavailable%3C/text%3E%3C/svg%3E';
                                                }}
                                                loading="lazy"
                                            />
                                        </div>
                                    </CardHeader>
                                    <CardContent className="p-6 flex-grow">
                                        <CardTitle className="text-xl font-bold text-white mb-1" style={{ fontFamily: '"Verdana", system-ui, -apple-system, sans-serif' }}>
                                            {nft.title}
                                        </CardTitle>
                                        <p className="text-sm text-muted-foreground mb-3">by <span className="text-primary" style={{ fontFamily: '"Verdana", system-ui, -apple-system, sans-serif' }}>{nft.artist}</span></p>
                                        <p className="text-xs text-neutral-400 line-clamp-2" style={{ fontFamily: '"Verdana", system-ui, -apple-system, sans-serif' }}>
                                            {nft.description}
                                        </p>
                                        {nft.category && (
                                            <span className="inline-block mt-2 px-2 py-1 text-xs bg-neutral-800 text-neutral-300 rounded">
                                                {nft.category}
                                            </span>
                                        )}
                                    </CardContent>
                                    <CardFooter className="p-6 pt-0 flex justify-between items-center">
                                        <div className="flex flex-col gap-1">
                                            <span className="text-lg font-bold text-white" style={{ fontFamily: '"Verdana", system-ui, -apple-system, sans-serif' }}>
                                                {nft.price}
                                            </span>
                                            {nft.rarity && (
                                                <span className={`text-xs font-semibold ${getRarityColor(nft.rarity)}`}>
                                                    {nft.rarity.toUpperCase()}
                                                </span>
                                            )}
                                        </div>
                                        <Button 
                                            variant="outline" 
                                            className="border-primary text-primary hover:bg-primary hover:text-black" 
                                            style={{ fontFamily: '"Verdana", system-ui, -apple-system, sans-serif' }}
                                        >
                                            View Details
                                        </Button>
                                    </CardFooter>
                                </Card>
                            </Link>
                        ))
                    ) : (
                        <div className="col-span-full text-center py-12">
                            <p className="text-muted-foreground">No NFTs available. Please check back soon.</p>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}
