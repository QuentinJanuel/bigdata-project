import { PrismaClient } from "@prisma/client";
import { fillFromCSV as fillFromCSVAnimeList } from "./anime-list";

export const fillDatabase = async function (prisma: PrismaClient) {
    await fillFromCSVAnimeList(prisma);
}
