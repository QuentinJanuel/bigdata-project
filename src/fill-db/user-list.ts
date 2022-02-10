import { readCSV } from "../csv";
import { Row } from "../csv/user-list";
import { PrismaClient } from "@prisma/client";

const getDate = function (date: string): Date | undefined {
    if (date === "")
        return undefined;
    return new Date(date);
}

const getInt = function (value: string): number | undefined {
    const v = parseInt(value);
    if (isNaN(v))
        return undefined;
    return v;
}

const getGenderName = function (gender: string): string {
    if (gender === "")
        return "Unknown";
    return gender;
}

export const fillFromCSV = async function (prisma: PrismaClient) {
    await readCSV({
        file: "UserList.csv",
        onRow: async (row: Row, index, max) => {
            console.log(`${ Math.floor(index / max * 100) }% (${ index }/${ max })`);
            const genderName = getGenderName(row.gender);
            const gender = await prisma.gender.findFirst({
                where: { name: genderName },
            }) ?? await prisma.gender.create({
                data: { name: genderName },
            });
            await prisma.user.create({
                data: {
                    id: parseInt(row.user_id),
                    name: row.username,
                    daysSpent: parseFloat(row.user_days_spent_watching),
                    birthday: getDate(row.birth_date),
                    joinedAt: getDate(row.join_date),
                    lastLogin: getDate(row.last_online),
                    rewatchs: getInt(row.stats_rewatched),
                    episodes: getInt(row.stats_episodes),
                    gender: {
                        connect: { id: gender.id },
                    },
                    location: row.location,
                },
            });
        },
    });
}
