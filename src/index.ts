import { PrismaClient } from "@prisma/client";
import { gen } from "./gen";
import { fillDatabase } from "./fill-db";

const prisma = new PrismaClient();

const main = async function () {
    await fillDatabase(prisma);
    await gen(prisma);
    console.log("Done");
}

main()
    .catch(console.error)
    .finally(async () => {
        await prisma.$disconnect();
    });
