import type { Metadata } from "next";
import "./globals.css";

import { ThirdwebProviderWrapper } from "@/components/thirdweb-provider";

export const runtime = "nodejs";

export const metadata: Metadata = {
  title: "Digital Original - NFT Art Marketplace",
  description: "A minimalist avant-garde NFT marketplace.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className="antialiased bg-background text-foreground"
        style={{ fontFamily: '"Verdana", system-ui, -apple-system, sans-serif' }}
      >
        <ThirdwebProviderWrapper>{children}</ThirdwebProviderWrapper>
      </body>
    </html>
  );
}
