import { PrismaClient } from "@prisma/client";
import path from "path";
import fs from "fs";

const gen1 = async function (prisma: PrismaClient) {
    const genres = await prisma.genre.findMany({
        select: { name: true },
    });
    const reviews = await prisma.review.findMany({
        select: {
            score: true,
            user: {
                select: {
                    episodes: true,
                    gender: {
                        select: {
                            id: true,
                        },
                    },
                },
            },
            anime: {
                select: {
                    id: true,
                    score: true,
                    scoredBy: true,
                    genres: {
                        select: {
                            name: true,
                        },
                    },
                },
            },
        },
    });
    const total = [];
    for (const { score, anime, user } of reviews) {
        const obj: {
            [key: string]: any;
        } = {
            score,
            globalScore: anime.score,
            scoredBy: anime.scoredBy,
            gender: user.gender.id,
            episodes: user.episodes,
        }
        for (const { name: genre } of genres) {
            obj[genre] = anime.genres.some(({ name }) => name === genre);
        }
        total.push(obj);
    }
    let csv = "";
    csv += Object.keys(total[0]).join(",");
    csv += "\n";
    for (const obj of total) {
        csv += Object.keys(obj)
            .map(key => obj[key])
            .join(",");
        csv += "\n";
    }
    const filename = path.join(__dirname, "..", "csv", "data.csv");
    await fs.promises.writeFile(filename, csv);
}

const gen2 = async function (prisma: PrismaClient) {
    const reviews = await prisma.review.findMany({
        select: {
            score: true,
            userId: true,
            animeId: true,
        },
    });
    const total = [];
    for (const { score, userId, animeId } of reviews) {
        const obj: { [key: string]: any } = {
            user: userId,
            product: animeId,
            rating: score,
        };
        total.push(obj);
    }
    let csv = "";
    csv += Object.keys(total[0]).join(",");
    csv += "\n";
    for (const obj of total) {
        csv += Object.keys(obj)
            .map(key => obj[key])
            .join(",");
        csv += "\n";
    }
    const filename = path.join(__dirname, "..", "csv", "data2.csv");
    await fs.promises.writeFile(filename, csv);
}

export const gen = async function (prisma: PrismaClient) {
    await gen1(prisma);
    await gen2(prisma);
}
