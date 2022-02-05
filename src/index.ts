import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const main = async function () {
    // const users = await prisma.user.findMany();
    // console.log(users);
    const download = "https://www.kaggle.com/azathoth42/myanimelist/download";
}

main()
.catch(console.error)
.finally(async () => {
    await prisma.$disconnect();
});
