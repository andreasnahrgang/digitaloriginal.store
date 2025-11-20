import { createThirdwebClient } from "thirdweb";
import { upload } from "thirdweb/storage";

const client = createThirdwebClient({
    clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID || "",
});

export async function uploadToIPFS(file: File) {
    try {
        const uri = await upload({
            client,
            files: [file],
        });
        return uri;
    } catch (error) {
        console.error("Error uploading to IPFS:", error);
        throw error;
    }
}

export async function uploadMetadataToIPFS(metadata: Record<string, any>) {
    try {
        const uri = await upload({
            client,
            files: [metadata],
        });
        return uri;
    } catch (error) {
        console.error("Error uploading metadata to IPFS:", error);
        throw error;
    }
}
