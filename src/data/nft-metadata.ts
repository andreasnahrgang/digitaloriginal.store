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
    title: "Abstract Digital Artwork #1",
    artist: "Robert Zielasco",
    description: "A stunning abstract composition exploring the boundaries between digital and physical art. Visit Robert's work at robertzielasco.com",
    price: "0.5 ETH",
    image: "https://ipfs.io/ipfs/QmUvMLF1mcjRujX7rGSQ9tY7pdBFSpicgpt85YVNiqPcW2",
    category: "Abstract",
    rarity: "uncommon",
  },
  {
    id: 2,
    title: "Abstract Digital Artwork #2",
    artist: "Robert Zielasco",
    description: "A mesmerizing neon-inspired artwork capturing the essence of contemporary digital aesthetics. More at robertzielasco.com",
    price: "0.8 ETH",
    image: "https://ipfs.io/ipfs/QmR7Spu6GLZHs2VHrjP2qNZiWrGoFSWzEZMUPDa6ejRyWg",
    category: "Cyberpunk",
    rarity: "uncommon",
  },
  {
    id: 3,
    title: "Abstract Digital Artwork #3",
    artist: "Robert Zielasco",
    description: "Exploring futuristic visions in digital space. This piece showcases innovative artistic direction. See more at robertzielasco.com",
    price: "1.2 ETH",
    image: "https://ipfs.io/ipfs/QmVTujrCe6vnShvUVfvBqcr8XAf9YmaZLAHof7thjjnHjQ",
    category: "Sci-Fi",
    rarity: "rare",
  },
  {
    id: 4,
    title: "Abstract Digital Artwork #4",
    artist: "Robert Zielasco",
    description: "A dynamic representation of data flow and digital waves. Discover Robert's creative vision at robertzielasco.com",
    price: "0.3 ETH",
    image: "https://ipfs.io/ipfs/QmdAnD7SoEMWGpV9NHpxNvB4cq2YuTo7eA4YAJQpHg2R8T",
    category: "Abstract",
    rarity: "common",
  },
  {
    id: 5,
    title: "Abstract Digital Artwork #5",
    artist: "Robert Zielasco",
    description: "An immersive visualization that transcends traditional digital art boundaries. Visit robertzielasco.com to explore more.",
    price: "2.0 ETH",
    image: "https://ipfs.io/ipfs/QmSz8zi3AHGXDTm35w4e9xybWJfRMkXk8Yd8MGtbn3HeZ4",
    category: "Urban",
    rarity: "legendary",
  },
  {
    id: 6,
    title: "Abstract Digital Artwork #6",
    artist: "Robert Zielasco",
    description: "A thought-provoking exploration of digital consciousness and artistic innovation. Learn more at robertzielasco.com",
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
