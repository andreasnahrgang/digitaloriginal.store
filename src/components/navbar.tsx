"use client";

import Link from "next/link";
import Image from "next/image";
import { ConnectButton } from "thirdweb/react";
import { createThirdwebClient } from "thirdweb";

const client = createThirdwebClient({
    clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID || "",
});

export function Navbar() {
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-black/80 backdrop-blur-md border-b border-border">
            <div className="flex items-center gap-2">
                {/* Logo Placeholder - replace with Image if needed, using text for now as per minimalist design or use the logo image if available */}
                <Link href="/" className="flex items-center gap-2" prefetch={false}>
                    <div className="relative h-8 w-40">
                        <Image
                            src="/logo.png"
                            alt="digitaloriginal"
                            fill
                            className="object-contain"
                            priority
                        />
                    </div>
                </Link>
            </div>

            <div className="hidden md:flex items-center gap-8">
                <Link href="/marketplace" className="text-sm font-medium text-white hover:text-primary transition-colors">
                    Marketplace
                </Link>
                <Link href="/about" className="text-sm font-medium text-white hover:text-primary transition-colors">
                    About Us
                </Link>
                <Link href="/resources" className="text-sm font-medium text-white hover:text-primary transition-colors">
                    Resources
                </Link>
                <Link href="/faq" className="text-sm font-medium text-white hover:text-primary transition-colors">
                    FAQ
                </Link>
                <Link href="/contact" className="text-sm font-medium text-white hover:text-primary transition-colors">
                    Contact
                </Link>
            </div>

            <div className="flex items-center gap-4">
                <ConnectButton client={client} theme={"dark"} />
            </div>
        </nav>
    );
}
