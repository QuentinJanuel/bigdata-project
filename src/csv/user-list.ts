import { PrismaClient } from "@prisma/client";

export interface Row {
    username: string,
    user_id: string,
    user_watching: string,
    user_completed: string,
    user_onhold: string,
    user_dropped: string,
    user_plantowatch: string,
    user_days_spent_watching: string,
    gender: string,
    location: string,
    birth_date: string,
    access_rank: string,
    join_date: string,
    last_online: string,
    stats_mean_score: string,
    stats_rewatched: string,
    stats_episodes: string,
}
