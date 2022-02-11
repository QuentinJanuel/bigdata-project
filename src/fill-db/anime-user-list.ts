import { readCSV } from "../csv";
import { Row } from "../csv/anime-user-list";
import { PrismaClient } from "@prisma/client";

const getDate = function(date: string): Date | undefined {
    if (date === "0000-00-00")
        return undefined;
    return new Date(date);
}

const isRewatching = function (rewatch: string): boolean {
    return rewatch === "1.0";
}

const statusIds: Array<number> = [];
const getStatusId = async function(
    prisma: PrismaClient,
    status: string,
): Promise<number> {
    const id = parseInt(status);
    if (statusIds.includes(id))
        return id;
    await prisma.status.create({
        data: {
            id,
            name: {
                1: "watching",
                2: "completed",
                3: "on hold",
                4: "dropped",
                6: "plan to watch",
            }[id] ?? "",
        },
    });
    statusIds.push(id);
    return id;
}

const validAnimeIds: Array<number> = [];
const invalidAnimeIds: Array<number> = [];
const getAnimeId = async function(
    prisma: PrismaClient,
    animeIdStr: string,
): Promise<number | undefined> {
    const id = parseInt(animeIdStr);
    if (validAnimeIds.includes(id))
        return id;
    if (invalidAnimeIds.includes(id))
        return undefined;
    const anime = await prisma.anime.findUnique({
        where: { id },
        select: { id: true },
    });
    if (anime === null) {
        invalidAnimeIds.push(id);
        return undefined;
    }
    validAnimeIds.push(id);
    return id;
}

let lastUser: {
    name: string,
    id: number,
} | undefined = undefined;
const getUserId = async function (
    prisma: PrismaClient,
    username: string,
): Promise<number | undefined> {
    if (lastUser?.name === username)
        return lastUser.id;
    const user = await prisma.user.findFirst({
        where: { name: username },
        select: { id: true },
    });
    if (user === null) {
        lastUser = undefined;
        return undefined;
    }
    lastUser = {
        name: username,
        id: user.id,
    }
    return user.id;
}

export const fillFromCSV = async function (prisma: PrismaClient) {
    await readCSV({
        file: "animelists_cleaned.csv",
        max: 1000,
        onRow: async (row: Row, index, max) => {
            console.log(`${ Math.floor(index / max * 100) }% (${ index }/${ max })`);
            const userId = await getUserId(prisma, row.username);
            if (userId === undefined)
                return;
            const animeId = await getAnimeId(prisma, row.anime_id);
            if (animeId === undefined)
                return;
            await prisma.review.create({
                data: {
                    user: { connect: { id: userId } },
                    anime: { connect: { id: animeId } },
                    watchedEpisodes: parseInt(row.my_watched_episodes),
                    start: getDate(row.my_start_date),
                    end: getDate(row.my_finish_date),
                    score: parseFloat(row.my_score),
                    status: { connect: {
                        id: await getStatusId(prisma, row.my_status),
                    } },
                    rewatching: isRewatching(row.my_rewatching),
                    rewatchedEpisodes: parseInt(row.my_rewatching_ep),
                    updatedAt: getDate(row.my_last_updated)!,
                },
            });
        },
    });
}
