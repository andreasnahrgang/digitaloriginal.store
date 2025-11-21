"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";

const Navbar = dynamic(
    () => import("@/components/navbar").then(mod => ({ default: mod.Navbar })),
    { ssr: false, loading: () => <nav className="fixed top-0 left-0 right-0 z-50 h-16 bg-black/80 backdrop-blur-md border-b border-border" /> }
);

const CreateNFTForm = dynamic(
    () => import("@/components/create-nft-form").then(mod => ({ default: mod.CreateNFTForm })),
    { ssr: false, loading: () => <div className="h-96 flex items-center justify-center text-white">Loading form...</div> }
);

export default function CreateNFTPage() {
    return (
        <main className="min-h-screen bg-background text-foreground">
            <Suspense fallback={<nav className="fixed top-0 left-0 right-0 z-50 h-16 bg-black/80 backdrop-blur-md border-b border-border" />}>
                <Navbar />
            </Suspense>

            <div className="container mx-auto px-4 pt-24 pb-12 max-w-2xl">
                <h1 className="text-3xl font-bold mb-8 text-white">Create NFT</h1>
                <Suspense fallback={<div className="h-96 flex items-center justify-center text-white">Loading form...</div>}>
                    <CreateNFTForm />
                </Suspense>
            </div>
        </main>
    );
}

