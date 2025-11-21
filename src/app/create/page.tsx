"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { Suspense } from "react";

const Navbar = dynamic(
  () => import("@/components/navbar").then(mod => ({ default: mod.Navbar })),
  { ssr: false, loading: () => <nav className="fixed top-0 left-0 right-0 z-50 h-16 bg-black/80 backdrop-blur-md border-b border-border" /> }
);
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { uploadToIPFS, uploadMetadataToIPFS } from "@/lib/thirdweb";
import { useActiveAccount } from "thirdweb/react";

export default function CreateNFTPage() {
    const account = useActiveAccount();
    const [file, setFile] = useState<File | null>(null);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [uploading, setUploading] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleUpload = async () => {
        if (!file || !name || !account) return;

        setUploading(true);
        try {
            // 1. Upload image to IPFS
            const imageUri = await uploadToIPFS(file);

            // 2. Upload metadata to IPFS
            const metadata = {
                name,
                description,
                image: imageUri,
            };
            const metadataUri = await uploadMetadataToIPFS(metadata);

            console.log("Metadata uploaded:", metadataUri);
            alert(`NFT Metadata uploaded successfully! URI: ${metadataUri}`);

            // Next steps: Contract interaction to mint NFT using this URI

        } catch (error) {
            console.error("Upload failed:", error);
            alert("Upload failed. See console for details.");
        } finally {
            setUploading(false);
        }
    };

    return (
        <main className="min-h-screen bg-background text-foreground">
            <Suspense fallback={<nav className="fixed top-0 left-0 right-0 z-50 h-16 bg-black/80 backdrop-blur-md border-b border-border" />}>
        <Navbar />
      </Suspense>

            <div className="container mx-auto px-4 pt-24 pb-12 max-w-2xl">
                <h1 className="text-3xl font-bold mb-8 text-white">Create NFT</h1>

                <div className="space-y-6 bg-secondary/5 p-8 rounded-xl border border-border">
                    <div className="space-y-2">
                        <Label htmlFor="name" className="text-white">Name</Label>
                        <Input
                            id="name"
                            placeholder="NFT Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="bg-black border-border text-white"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description" className="text-white">Description</Label>
                        <Input
                            id="description"
                            placeholder="Description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="bg-black border-border text-white"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="file" className="text-white">Image File (Max 5MB)</Label>
                        <Input
                            id="file"
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="bg-black border-border text-white cursor-pointer"
                        />
                    </div>

                    <Button
                        onClick={handleUpload}
                        disabled={uploading || !file || !name || !account}
                        className="w-full bg-primary text-black hover:bg-primary/90 font-bold"
                    >
                        {uploading ? "Uploading..." : "Upload to IPFS"}
                    </Button>

                    {!account && (
                        <p className="text-sm text-red-500 text-center">Please connect your wallet to create an NFT.</p>
                    )}
                </div>
            </div>
        </main>
    );
}
