import fs from "fs";
import path from "path";
import { parse } from "csv-parse";

interface Config {
    file: string;
    onRow: (row: any, index: number) => Promise<void>;
    maxRows?: number;
}

export const readCSV = async function (config: Config) {
    const file = path.join(__dirname, "..", "csv", config.file);
    const parser = fs
        .createReadStream(file)
        .pipe(parse({
            columns: true,
            to: config.maxRows,
        }));
    let index = 0;
    for await (const row of parser)
        await config.onRow(row, index++);
}
