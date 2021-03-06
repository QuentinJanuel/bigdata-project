import { PrismaClient } from "@prisma/client";
import { fillFromCSV as fillFromCSVAnimeList } from "./anime-list";
import { fillFromCSV as fillFromCSVUserList } from "./user-list";
import { fillFromCSV as fillFromCSVAnimeUserList } from "./anime-user-list";

export const fillDatabase = async function (prisma: PrismaClient) {
    await fillFromCSVAnimeList(prisma);
    await fillFromCSVUserList(prisma);
    await fillFromCSVAnimeUserList(prisma);
}
