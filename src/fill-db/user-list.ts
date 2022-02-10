import { readCSV } from "../csv";
import { Row } from "../csv/user-list";
import { PrismaClient } from "@prisma/client";

export const fillFromCSV = async function (prisma: PrismaClient) {
    await readCSV({
        file: "UserList.csv",
        onRow: async (row: Row, index, max) => {
            console.log(`${ Math.round(index / max * 100) }% (${ index }/${ max })`);
            const gender = await prisma.gender.findFirst({
                where: { name: row.gender },
            }) ?? await prisma.gender.create({
                data: { name: row.gender },
            });
            await prisma.user.create({
                data: {
                    id: parseInt(row.user_id),
                    name: row.username,
                    daysSpent: parseFloat(row.user_days_spent_watching),
                    birthday: new Date(row.birth_date),
                    joinedAt: new Date(row.join_date),
                    lastLogin: new Date(row.last_online),
                    rewatchs: parseInt(row.stats_rewatched),
                    episodes: parseInt(row.stats_episodes),
                    gender: {
                        connect: { id: gender.id },
                    },
                    location: row.location,
                },
            });
        },
    });
}
