import { PrismaClient } from "@prisma/client";
import { readCSV } from "./csv";

const prisma = new PrismaClient();

const main = async function () {
    // const users = await prisma.user.findMany();
    // console.log(users);
    await readCSV({
        file: "AnimeList.csv",
        maxRows: 3,
        onRow: async (row, index) => {
            console.log(`Row ${ index }:`);
            console.log(row.title);
            await new Promise(resolve => setTimeout(resolve, 1000));
        },
    });
}

main()
.catch(console.error)
.finally(async () => {
    await prisma.$disconnect();
});
