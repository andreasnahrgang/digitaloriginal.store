"use client";

import { Navbar } from "@/components/navbar";

export default function FAQPage() {
    return (
        <main className="min-h-screen bg-background text-foreground">
            <Navbar />

            <div className="container mx-auto px-4 pt-24 pb-12">
                <div className="max-w-3xl mx-auto">
                    <header className="text-center mb-12 space-y-4">
                        <h1 className="text-4xl md:text-5xl font-bold tracking-tighter text-white">
                            Frequently Asked <span className="text-primary">Questions</span>
                        </h1>
                        <p className="text-xl text-muted-foreground">
                            Everything you need to know about collecting with Digital Original.
                        </p>
                    </header>

                    <div className="space-y-6">
                        {/* Using standard details/summary if Accordion component is not available, 
                            but checking imports suggests we might need to check if Accordion exists.
                            If not, I'll use a custom implementation. 
                            Wait, I didn't check for Accordion in the list_dir. 
                            Let's assume it's NOT there based on the previous list_dir of components/ui.
                            I will build a custom one or just use simple divs.
                        */}

                        <div className="bg-secondary/5 border border-border rounded-xl overflow-hidden">
                            <div className="p-6 space-y-4">
                                <h3 className="text-xl font-bold text-white">How do I purchase an NFT?</h3>
                                <p className="text-muted-foreground leading-relaxed">
                                    Connect your wallet, browse our collections, and click "Collect Now" on any NFT you'd like to purchase.
                                </p>
                            </div>
                        </div>

                        <div className="bg-secondary/5 border border-border rounded-xl overflow-hidden">
                            <div className="p-6 space-y-4">
                                <h3 className="text-xl font-bold text-white">What wallets do you support?</h3>
                                <p className="text-muted-foreground leading-relaxed">
                                    We support all major Ethereum wallets including MetaMask, WalletConnect, and Coinbase Wallet.
                                </p>
                            </div>
                        </div>

                        <div className="bg-secondary/5 border border-border rounded-xl overflow-hidden">
                            <div className="p-6 space-y-4">
                                <h3 className="text-xl font-bold text-white">What are Gas Fees?</h3>
                                <p className="text-muted-foreground leading-relaxed">
                                    Gas fees are transaction fees paid to validators on the Ethereum network. They fluctuate based on network demand. We use the Polygon network to keep these fees as low as possible.
                                </p>
                            </div>
                        </div>

                        <div className="bg-secondary/5 border border-border rounded-xl overflow-hidden">
                            <div className="p-6 space-y-4">
                                <h3 className="text-xl font-bold text-white">Do artists get royalties?</h3>
                                <p className="text-muted-foreground leading-relaxed">
                                    Yes! One of the key benefits of NFTs is that artists can earn royalties on secondary sales. Our smart contracts ensure a percentage of every resale goes back to the original creator.
                                </p>
                            </div>
                        </div>

                        <div className="bg-secondary/5 border border-border rounded-xl overflow-hidden">
                            <div className="p-6 space-y-4">
                                <h3 className="text-xl font-bold text-white">Do I own the copyright?</h3>
                                <p className="text-muted-foreground leading-relaxed">
                                    Purchasing an NFT gives you ownership of the specific token and the right to display the artwork. However, unless explicitly stated, the original copyright usually remains with the artist.
                                </p>
                            </div>
                        </div>

                        <div className="bg-secondary/5 border border-border rounded-xl overflow-hidden">
                            <div className="p-6 space-y-4">
                                <h3 className="text-xl font-bold text-white">Can I resell my NFT?</h3>
                                <p className="text-muted-foreground leading-relaxed">
                                    Absolutely. You can resell your NFT on our marketplace or any other platform that supports the ERC-721 standard, such as OpenSea or Rarible.
                                </p>
                            </div>
                        </div>

                        <div className="bg-secondary/5 border border-border rounded-xl overflow-hidden">
                            <div className="p-6 space-y-4">
                                <h3 className="text-xl font-bold text-white">How can I display my NFTs?</h3>
                                <p className="text-muted-foreground leading-relaxed">
                                    You can display your NFTs in digital frames, virtual galleries (like OnCyber), or simply view them in your wallet app.
                                </p>
                            </div>
                        </div>

                        <div className="bg-secondary/5 border border-border rounded-xl overflow-hidden">
                            <div className="p-6 space-y-4">
                                <h3 className="text-xl font-bold text-white">What about the environmental impact?</h3>
                                <p className="text-muted-foreground leading-relaxed">
                                    We are conscious of our environmental footprint. By utilizing Layer 2 scaling solutions like Polygon, we significantly reduce the energy consumption associated with minting and trading compared to the Ethereum mainnet.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
