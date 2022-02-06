import { PrismaClient } from "@prisma/client";
import { readCSV } from "./csv";
import {
    Row as AnimeListRow,
    getAired,
    getDuration,
    getId,
    getIds,
    parseArray,
} from "./csv/anime-list";
import { parseNumber } from "./utils";

const prisma = new PrismaClient();

const main = async function () {
    const max = 14478;
    await readCSV({
        file: "AnimeList.csv",
        // max: 1,
        // skip: 4384,
        onRow: async (row: AnimeListRow, index) => {
            console.log(`${ Math.round(index / max * 100) }% (${ index }/${ max })`);
            const aired = getAired(row);
            await prisma.anime.create({
                data: {
                    id: parseInt(row.anime_id),
                    title: row.title_japanese,
                    titleEnglish: row.title_english,
                    titleSynonyms: {
                        create: row.title_synonyms.split(", ")
                            .map(name => ({ name })),
                    },
                    image: row.image_url,
                    type: { connect: { id: await getId(prisma, row, "type") } },
                    source: { connect: { id: await getId(prisma, row, "source") } },
                    episodes: parseInt(row.episodes),
                    airingFrom: aired.from,
                    airingTo: aired.to,
                    duration: getDuration(row),
                    rating: { connect: { id: await getId(prisma, row, "rating") } },
                    score: parseFloat(row.score),
                    scoredBy: parseInt(row.scored_by),
                    rank: parseNumber(row.rank),
                    popularity: parseInt(row.popularity),
                    members: parseInt(row.members),
                    favorites: parseInt(row.favorites),
                    background: row.background,
                    premiered: row.premiered,
                    broadcast: row.broadcast,
                    producers: { connect: await getIds(prisma, row, "producer") },
                    licensors: { connect: await getIds(prisma, row, "licensor") },
                    studios: { connect: await getIds(prisma, row, "studio") },
                    genres: { connect: await getIds(prisma, row, "genre") },
                    openings: {
                        create: parseArray(row.opening_theme)
                            .map(name => ({ name })),
                    },
                    endings: {
                        create: parseArray(row.ending_theme)
                            .map(name => ({ name })),
                    },
                },
            });
        },
    });
}

main()
    .catch(console.error)
    .finally(async () => {
        await prisma.$disconnect();
    });
