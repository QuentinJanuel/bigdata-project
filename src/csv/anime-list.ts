import { PrismaClient } from "@prisma/client";

export interface Row {
    anime_id: string;
    title: string;
    title_english: string;
    title_japanese: string;
    title_synonyms: string;
    image_url: string;
    type: string;
    source: string;
    episodes: string;
    status: string;
    airing: string;
    aired_string: string;
    aired: string;
    duration: string;
    rating: string;
    score: string;
    scored_by: string;
    rank: string;
    popularity: string;
    members: string;
    favorites: string;
    background: string;
    premiered: string;
    broadcast: string;
    related: string;
    producer: string;
    licensor: string;
    studio: string;
    genre: string;
    opening_theme: string;
    ending_theme: string;
}

interface Aired {
    from?: Date;
    to?: Date;
}

export const getAired = function (row: Row): Aired {
    const aired = JSON.parse(
        row.aired
            .replace(/'/g, '"')
            .replace(/None/g, '""')
    );
    if (aired.from.length > 0)
        aired.from = new Date(aired.from);
    else
        aired.from = undefined;
    if (aired.to.length > 0)
        aired.to = new Date(aired.to);
    else
        aired.to = undefined;
    return aired;
}

export const getDuration = function (row: Row): number | undefined {
    const { duration } = row;
    if (duration === "Unknown")
        return undefined;
    const h = duration.match(/(\d+)\shr\./);
    let hours = 0;
    if (h !== null)
        hours = parseInt(h[1]);
    const m = duration.match(/(\d+)\smin\./);
    let minutes = 0;
    if (m !== null)
        minutes = parseInt(m[1]);
    let s = duration.match(/(\d+)\ssec\./);
    let seconds = 0;
    if (s !== null)
        seconds = parseInt(s[1]);
    return hours * 3600 + minutes * 60 + seconds;
}

export const getId = async function (
    prisma: PrismaClient,
    row: Row,
    table: "type" | "source" | "rating",
): Promise<number> {
    const name = row[table];
    const { id } = await prisma[table].findFirst({
        where: { name },
    }) ?? await (prisma[table].create as any)({
        data: { name },
    });
    return id;
}

export const getIds = async function (
    prisma: PrismaClient,
    row: Row,
    table: "producer" | "licensor" | "studio" | "genre",
): Promise<Array<{ id: number }>> {
    const names = row[table].split(", ").filter(p => p.length > 0);
    const ids: Array<{ id: number }> = [];
    for (const name of names) {
        const { id } = await prisma[table].findFirst({
            where: { name },
        }) ?? await (prisma[table].create as any)({
            data: { name },
        });
        ids.push({ id });
    }
    return ids;
}

export const parseArray = function (array: string):Array<string> {
    return JSON.parse(
        array
            .replace(/\"/g, "\\\"")
            .replace(/'/g, "\"")
    );
}
