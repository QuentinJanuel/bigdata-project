import { PrismaClient } from "@prisma/client";
import { fillDatabase } from "./fill-db";
import { readCSV } from "./csv";

const prisma = new PrismaClient();

const main = async function () {
    await fillDatabase(prisma);
    console.log("Done");
}

main()
    .catch(console.error)
    .finally(async () => {
        await prisma.$disconnect();
    });
