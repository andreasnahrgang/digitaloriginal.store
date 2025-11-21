"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";

const Navbar = dynamic(
  () => import("@/components/navbar").then(mod => ({ default: mod.Navbar })),
  { ssr: false, loading: () => <nav className="fixed top-0 left-0 right-0 z-50 h-16 bg-black/80 backdrop-blur-md border-b border-border" /> }
);
import { Separator } from "@/components/ui/separator";

export default function AboutPage() {
    return (
        <main className="min-h-screen bg-background text-foreground">
            <Suspense fallback={<nav className="fixed top-0 left-0 right-0 z-50 h-16 bg-black/80 backdrop-blur-md border-b border-border" />}>
        <Navbar />
      </Suspense>

            <div className="container mx-auto px-4 pt-24 pb-12">
                <div className="max-w-4xl mx-auto space-y-12">
                    {/* Hero Section */}
                    <section className="text-center space-y-6">
                        <h1 className="text-4xl md:text-6xl font-bold tracking-tighter text-white">
                            About <span className="text-primary">Digital Original</span>
                        </h1>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                            We are dedicated to bringing the world's most iconic artworks into the digital age through carefully curated NFT collections.
                        </p>
                    </section>

                    <Separator className="bg-border" />

                    {/* Mission Section */}
                    <section className="grid md:grid-cols-2 gap-12 items-center">
                        <div className="space-y-6">
                            <h2 className="text-3xl font-bold text-white">Our Mission</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                Digital Original bridges the gap between classical art and modern technology. We believe that the world's greatest masterpieces should be accessible to everyone, preserved for future generations, and celebrated in new digital formats.
                            </p>
                            <p className="text-muted-foreground leading-relaxed">
                                Our carefully curated collection features digital interpretations of iconic paintings from legendary artists like Andy Warhol, Vincent van Gogh, and Salvador Dalí. Each NFT is meticulously crafted to honor the original artwork while embracing the possibilities of blockchain technology.
                            </p>
                        </div>
                        <div className="relative aspect-square rounded-2xl overflow-hidden border border-border shadow-2xl shadow-primary/5">
                            {/* Placeholder for an 'About' image - using one of the IPFS images for now */}
                            <img
                                src="https://ipfs.io/ipfs/QmUvMLF1mcjRujX7rGSQ9tY7pdBFSpicgpt85YVNiqPcW2"
                                alt="Digital Art Collection"
                                className="object-cover w-full h-full opacity-80 hover:opacity-100 transition-opacity duration-500"
                            />
                        </div>
                    </section>

                    {/* Core Values */}
                    <section className="grid md:grid-cols-3 gap-8">
                        <div className="bg-secondary/5 border border-border rounded-xl p-8 space-y-4 hover:border-primary transition-colors duration-300">
                            <h3 className="text-xl font-bold text-white">Authenticity</h3>
                            <p className="text-muted-foreground">
                                Every NFT in our collection is carefully researched and authenticated, ensuring the highest quality digital representations of classical masterpieces.
                            </p>
                        </div>
                        <div className="bg-secondary/5 border border-border rounded-xl p-8 space-y-4 hover:border-primary transition-colors duration-300">
                            <h3 className="text-xl font-bold text-white">Accessibility</h3>
                            <p className="text-muted-foreground">
                                We make art collecting accessible to everyone, breaking down traditional barriers and democratizing ownership of cultural treasures.
                            </p>
                        </div>
                        <div className="bg-secondary/5 border border-border rounded-xl p-8 space-y-4 hover:border-primary transition-colors duration-300">
                            <h3 className="text-xl font-bold text-white">Innovation</h3>
                            <p className="text-muted-foreground">
                                By leveraging blockchain technology, we ensure permanent ownership, provenance tracking, and secure transactions for all collectors.
                            </p>
                        </div>
                    </section>

                    <Separator className="bg-border" />

                    {/* Commitment Section */}
                    <section className="text-center space-y-6 max-w-3xl mx-auto">
                        <h2 className="text-3xl font-bold text-white">Our Commitment</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            We are committed to maintaining the highest standards of quality and authenticity in our digital art collection. Our team works closely with art historians, digital artists, and blockchain experts to ensure each NFT meets our rigorous standards.
                        </p>
                        <p className="text-lg text-white font-medium pt-4">
                            Join us in celebrating the intersection of classical art and cutting-edge technology. Discover, collect, and own a piece of art history in the digital age.
                        </p>
                    </section>
                </div>
            </div>
        </main>
    );
}
