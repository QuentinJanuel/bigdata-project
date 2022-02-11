import { readCSV } from "../csv";
import {
    Row,
    getAired,
    getDuration,
    getId,
    getIds,
    parseArray,
    parseNumber,
    getRelated,
} from "../csv/anime-list";
import { PrismaClient } from "@prisma/client";

const fillWithoutRelations = async function (prisma: PrismaClient) {
    await readCSV({
        file: "anime_cleaned.csv",
        onRow: async (row: Row, index, max) => {
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


const fillRelations = async function (prisma: PrismaClient) {
    await readCSV({
        file: "AnimeList.csv",
        onRow: async (row: Row, index, max) => {
            console.log(`${ Math.round(index / max * 100) }% (${ index }/${ max })`);
            const fromId = parseInt(row.anime_id);
            const related = getRelated(row);
            for (const { name, anime_id: toId } of related) {
                const anime = await prisma.anime.findUnique({
                    where: { id: toId },
                });
                if (anime === null)
                    continue;
                const relation = await prisma.relation.findFirst({
                    where: { name },
                }) ?? await prisma.relation.create({
                    data: { name },
                });
                await prisma.link.create({
                    data: {
                        from: { connect: { id: fromId } },
                        to: { connect: { id: toId } },
                        relation: { connect: { id: relation.id } },
                    },
                });
            }
        },
    });
}

export const fillFromCSV = async function (prisma: PrismaClient) {
    await fillWithoutRelations(prisma);
    await fillRelations(prisma);
}
