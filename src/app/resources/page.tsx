"use client";

import { Navbar } from "@/components/navbar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ExternalLink, Wallet, Coins, Image as ImageIcon, ShieldCheck } from "lucide-react";

export default function ResourcesPage() {
    return (
        <main className="min-h-screen bg-background text-foreground">
            <Navbar />

            <div className="container mx-auto px-4 pt-24 pb-12">
                <div className="max-w-6xl mx-auto space-y-12">
                    <header className="text-center space-y-6">
                        <h1 className="text-4xl md:text-6xl font-bold tracking-tighter text-white">
                            Learning <span className="text-primary">Resources</span>
                        </h1>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                            Your guide to understanding the world of Digital Art, NFTs, and the Ethereum blockchain.
                        </p>
                    </header>

                    <Separator className="bg-border" />

                    {/* Section 1: The Basics */}
                    <section className="space-y-8">
                        <div className="flex items-center gap-3">
                            <Coins className="w-8 h-8 text-primary" />
                            <h2 className="text-3xl font-bold text-white">The Basics</h2>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <Card className="bg-secondary/5 border-border hover:border-primary transition-colors">
                                <CardHeader>
                                    <CardTitle className="text-white">What is Ethereum?</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <p className="text-muted-foreground text-sm leading-relaxed">
                                        Ethereum is a decentralized blockchain platform that establishes a peer-to-peer network that securely executes and verifies application code, called smart contracts.
                                    </p>
                                    <Button variant="link" className="text-primary p-0 h-auto" asChild>
                                        <Link href="https://ethereum.org/en/what-is-ethereum/" target="_blank">
                                            Learn more at ethereum.org <ExternalLink className="w-3 h-3 ml-1" />
                                        </Link>
                                    </Button>
                                </CardContent>
                            </Card>

                            <Card className="bg-secondary/5 border-border hover:border-primary transition-colors">
                                <CardHeader>
                                    <CardTitle className="text-white">What are NFTs?</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <p className="text-muted-foreground text-sm leading-relaxed">
                                        NFTs (Non-Fungible Tokens) are unique digital assets verified using blockchain technology. Unlike cryptocurrencies, each NFT is one-of-a-kind and cannot be exchanged like-for-like.
                                    </p>
                                    <Button variant="link" className="text-primary p-0 h-auto" asChild>
                                        <Link href="https://ethereum.org/en/nft/" target="_blank">
                                            Read the NFT Guide <ExternalLink className="w-3 h-3 ml-1" />
                                        </Link>
                                    </Button>
                                </CardContent>
                            </Card>

                            <Card className="bg-secondary/5 border-border hover:border-primary transition-colors">
                                <CardHeader>
                                    <CardTitle className="text-white">Smart Contracts</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <p className="text-muted-foreground text-sm leading-relaxed">
                                        Smart contracts are self-executing contracts with the terms of the agreement between buyer and seller being directly written into lines of code.
                                    </p>
                                    <Button variant="link" className="text-primary p-0 h-auto" asChild>
                                        <Link href="https://chain.link/education/smart-contracts" target="_blank">
                                            Deep dive into Smart Contracts <ExternalLink className="w-3 h-3 ml-1" />
                                        </Link>
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    </section>

                    {/* Section 2: Wallets & Security */}
                    <section className="space-y-8">
                        <div className="flex items-center gap-3">
                            <Wallet className="w-8 h-8 text-primary" />
                            <h2 className="text-3xl font-bold text-white">Wallets & Security</h2>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            <Card className="bg-secondary/5 border-border hover:border-primary transition-colors">
                                <CardHeader>
                                    <CardTitle className="text-white">Setting up a Wallet</CardTitle>
                                    <CardDescription>Your passport to the digital economy</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <p className="text-muted-foreground text-sm leading-relaxed">
                                        To interact with NFTs, you need a digital wallet. MetaMask and Coinbase Wallet are popular choices that allow you to store ETH and your NFT collection securely.
                                    </p>
                                    <div className="flex gap-4 pt-2">
                                        <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-black" asChild>
                                            <Link href="https://metamask.io/" target="_blank">Get MetaMask</Link>
                                        </Button>
                                        <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-black" asChild>
                                            <Link href="https://www.coinbase.com/wallet" target="_blank">Get Coinbase Wallet</Link>
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="bg-secondary/5 border-border hover:border-primary transition-colors">
                                <CardHeader>
                                    <div className="flex items-center gap-2">
                                        <ShieldCheck className="w-5 h-5 text-primary" />
                                        <CardTitle className="text-white">Security Best Practices</CardTitle>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <ul className="list-disc list-inside text-muted-foreground text-sm space-y-2">
                                        <li><strong>Never share your Seed Phrase:</strong> This is the master key to your wallet. No support team will ever ask for it.</li>
                                        <li><strong>Use a Hardware Wallet:</strong> For significant value, use a Ledger or Trezor for offline storage.</li>
                                        <li><strong>Verify Links:</strong> Always check the URL before connecting your wallet to avoid phishing sites.</li>
                                    </ul>
                                </CardContent>
                            </Card>
                        </div>
                    </section>

                    {/* Section 3: Art & Ecosystem */}
                    <section className="space-y-8">
                        <div className="flex items-center gap-3">
                            <ImageIcon className="w-8 h-8 text-primary" />
                            <h2 className="text-3xl font-bold text-white">Art & Ecosystem</h2>
                        </div>

                        <div className="grid md:grid-cols-3 gap-6">
                            <Card className="bg-secondary/5 border-border hover:border-primary transition-colors">
                                <CardHeader>
                                    <CardTitle className="text-white">Digital Art History</CardTitle>
                                    <CardDescription>Understanding the evolution of art in the digital age</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <Button variant="link" className="text-primary p-0" asChild>
                                        <Link href="https://en.wikipedia.org/wiki/Digital_art" target="_blank">
                                            Read about Digital Art <ExternalLink className="w-3 h-3 ml-1" />
                                        </Link>
                                    </Button>
                                </CardContent>
                            </Card>

                            <Card className="bg-secondary/5 border-border hover:border-primary transition-colors">
                                <CardHeader>
                                    <CardTitle className="text-white">Foundation</CardTitle>
                                    <CardDescription>A platform for digital art and creative economy</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <Button variant="link" className="text-primary p-0" asChild>
                                        <Link href="https://foundation.app/" target="_blank">
                                            Visit Foundation <ExternalLink className="w-3 h-3 ml-1" />
                                        </Link>
                                    </Button>
                                </CardContent>
                            </Card>

                            <Card className="bg-secondary/5 border-border hover:border-primary transition-colors">
                                <CardHeader>
                                    <CardTitle className="text-white">Right Click Save</CardTitle>
                                    <CardDescription>In-depth articles on digital art culture</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <Button variant="link" className="text-primary p-0" asChild>
                                        <Link href="https://www.rightclicksave.com/" target="_blank">
                                            Read Articles <ExternalLink className="w-3 h-3 ml-1" />
                                        </Link>
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    </section>
                </div>
            </div>
        </main>
    );
}
