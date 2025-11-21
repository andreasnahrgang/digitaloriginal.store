export interface NFTMetadata {
  id: number;
  title: string;
  artist: string;
  description: string;
  price: string;
  image: string;
  category: string;
  rarity: "common" | "uncommon" | "rare" | "legendary";
  contractAddress?: string;
  tokenId?: string;
}

export const allNFTs: NFTMetadata[] = [
  {
    id: 1,
    title: "Ethereal Canvas #001",
    artist: "Digital Visionary",
    description: "A stunning abstract composition exploring the boundaries between digital and physical art. This piece represents the intersection of technology and human creativity.",
    price: "0.5 ETH",
    image: "https://ipfs.io/ipfs/QmUvMLF1mcjRujX7rGSQ9tY7pdBFSpicgpt85YVNiqPcW2",
    category: "Abstract",
    rarity: "uncommon",
  },
  {
    id: 2,
    title: "Neon Synthesis",
    artist: "Luminous Creator",
    description: "A mesmerizing neon-inspired artwork that captures the essence of cyberpunk aesthetics. Limited edition digital art piece.",
    price: "0.8 ETH",
    image: "https://ipfs.io/ipfs/QmR7Spu6GLZHs2VHrjP2qNZiWrGoFSWzEZMUPDa6ejRyWg",
    category: "Cyberpunk",
    rarity: "uncommon",
  },
  {
    id: 3,
    title: "Void Architect #42",
    artist: "Architectural Dreamer",
    description: "Exploring futuristic architecture in a digital space. This NFT represents a unique vision of 2077.",
    price: "1.2 ETH",
    image: "https://ipfs.io/ipfs/QmVTujrCe6vnShvUVfvBqcr8XAf9YmaZLAHof7thjjnHjQ",
    category: "Sci-Fi",
    rarity: "rare",
  },
  {
    id: 4,
    title: "Digital Flux",
    artist: "Wave Collector",
    description: "A dynamic representation of data flow and digital waves. This piece embodies the continuous nature of digital innovation.",
    price: "0.3 ETH",
    image: "https://ipfs.io/ipfs/QmdAnD7SoEMWGpV9NHpxNvB4cq2YuTo7eA4YAJQpHg2R8T",
    category: "Abstract",
    rarity: "common",
  },
  {
    id: 5,
    title: "Metropolitan Dreams",
    artist: "Urban Visionary",
    description: "An immersive cityscape visualization that transcends traditional urban art. This NFT captures the pulse of modern metropolises.",
    price: "2.0 ETH",
    image: "https://ipfs.io/ipfs/QmSz8zi3AHGXDTm35w4e9xybWJfRMkXk8Yd8MGtbn3HeZ4",
    category: "Urban",
    rarity: "legendary",
  },
  {
    id: 6,
    title: "Glitch Consciousness",
    artist: "Error Poet",
    description: "A thought-provoking piece about digital consciousness and the beauty in imperfection. Rare glitch art exploration.",
    price: "0.1 ETH",
    image: "https://ipfs.io/ipfs/QmUTnPcmcRvBMQLg516wCUUxA2XZyrWPXZ6DHJahGV5qS5",
    category: "Experimental",
    rarity: "rare",
  },
];

// Helper function to validate NFT metadata
export function validateNFTMetadata(nft: Partial<NFTMetadata>): boolean {
  return !!(
    nft.id &&
    nft.title?.trim() &&
    nft.artist?.trim() &&
    nft.description?.trim() &&
    nft.price &&
    nft.image?.startsWith("https://")
  );
}

// Helper function to format price for display
export function formatPrice(price: string): string {
  return price || "Contact for price";
}

// Helper function to get rarity color
export function getRarityColor(rarity: NFTMetadata["rarity"]): string {
  const colors: Record<NFTMetadata["rarity"], string> = {
    common: "text-gray-400",
    uncommon: "text-green-400",
    rare: "text-blue-400",
    legendary: "text-purple-400",
  };
  return colors[rarity];
}
