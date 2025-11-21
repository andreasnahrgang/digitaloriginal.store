import { createThirdwebClient, getContract } from "thirdweb";
import { defineChain } from "thirdweb/chains";
import { getContractMetadata } from "thirdweb/extensions/common";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const client = createThirdwebClient({
    secretKey: process.env.THIRDWEB_SECRET_KEY || "",
});

const chain = defineChain(80002); // Amoy

async function main() {
    const slug = "digiTAlorigiNal-44ef72";
    console.log(`Trying to resolve contract for slug: ${slug}`);

    try {
        // Try using the slug as address (unlikely but worth a shot if it's an alias)
        const contract = getContract({
            client,
            chain,
            address: slug,
        });

        const metadata = await getContractMetadata({ contract });
        console.log("Success! Metadata:", metadata);
        console.log("Address:", contract.address);
    } catch (e) {
        console.error("Failed with slug as address:", e instanceof Error ? e.message : String(e));
    }
}

main();
