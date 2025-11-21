"use client";

import * as React from "react";
import { Suspense } from "react";
import dynamic from "next/dynamic";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import Link from "next/link";

const Navbar = dynamic(
  () => import("@/components/navbar").then(mod => ({ default: mod.Navbar })),
  { ssr: false, loading: () => <nav className="fixed top-0 left-0 right-0 z-50 h-16 bg-black/80 backdrop-blur-md border-b border-border" /> }
);

// Mock data for the carousel - eventually this will come from the marketplace
const featuredNFTs = [
  {
    id: 1,
    title: "Abstract Digital #1",
    artist: "Artist One",
    image: "https://ipfs.io/ipfs/QmUvMLF1mcjRujX7rGSQ9tY7pdBFSpicgpt85YVNiqPcW2",
  },
  {
    id: 2,
    title: "Neon Genesis",
    artist: "Artist Two",
    image: "https://ipfs.io/ipfs/QmR7Spu6GLZHs2VHrjP2qNZiWrGoFSWzEZMUPDa6ejRyWg",
  },
  {
    id: 3,
    title: "Cyber Punk 2077",
    artist: "Artist Three",
    image: "https://ipfs.io/ipfs/QmVTujrCe6vnShvUVfvBqcr8XAf9YmaZLAHof7thjjnHjQ",
  },
];

export default function Home() {
  // Force rebuild: v1.0.1 - Restoring full Carousel UI
  const plugin = React.useRef(
    Autoplay({ delay: 4000, stopOnInteraction: true })
  );

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Suspense fallback={<nav className="fixed top-0 left-0 right-0 z-50 h-16 bg-black/80 backdrop-blur-md border-b border-border" />}>
        <Navbar />
      </Suspense>

      <section className="h-screen flex items-center justify-center p-4 pt-20">
        <Carousel
          plugins={[plugin.current]}
          className="w-full max-w-5xl"
          onMouseEnter={plugin.current.stop}
          onMouseLeave={plugin.current.reset}
        >
          <CarouselContent>
            {featuredNFTs.map((nft) => (
              <CarouselItem key={nft.id}>
                <Link href="/marketplace">
                  <div className="p-1 cursor-pointer group">
                    <Card className="bg-transparent border-none">
                      <CardContent className="flex aspect-[16/9] items-center justify-center p-0 relative overflow-hidden rounded-xl border border-border/50 group-hover:border-primary transition-colors duration-300">
                        <img
                          src={nft.image}
                          alt={nft.title}
                          className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <h3 className="text-2xl font-bold text-white">{nft.title}</h3>
                          <p className="text-primary">{nft.artist}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </Link>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-4 border-primary text-primary hover:bg-primary hover:text-black" />
          <CarouselNext className="right-4 border-primary text-primary hover:bg-primary hover:text-black" />
        </Carousel>
      </section>
    </main>
  );
}
