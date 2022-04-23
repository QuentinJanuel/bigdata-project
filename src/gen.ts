import { PrismaClient } from "@prisma/client";
import path from "path";
import fs from "fs";

export const gen = async function (prisma: PrismaClient) {
    // const genres = await prisma.genre.findMany({
    //     select: { name: true },
    // });
    const reviews = await prisma.review.findMany({
        select: {
            score: true,
            userId: true,
            animeId: true,
            // user: {
            //     select: {
            //         episodes: true,
            //         gender: {
            //             select: {
            //                 id: true,
            //             },
            //         },
            //     },
            // },
            // anime: {
            //     select: {
            //         id: true,
            //         score: true,
            //         scoredBy: true,
            //         genres: {
            //             select: {
            //                 name: true,
            //             },
            //         },
            //     },
            // },
        },
    });
    const total = [];
    for (const { score, /*anime, user*/ userId, animeId } of reviews) {
        // const obj: {
        //     [key: string]: any;
        // } = {
        //     score,
        //     globalScore: anime.score,
        //     scoredBy: anime.scoredBy,
        //     gender: user.gender.id,
        //     episodes: user.episodes,
        // }
        const obj: { [key: string]: any } = {
            user: userId,
            product: animeId,
            rating: score,
        };
        // for (const { name: genre } of genres) {
        //     obj[genre] = anime.genres.some(({ name }) => name === genre);
        // }
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
