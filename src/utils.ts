import { promisify } from "util";
import child_process from "child_process";

const exec = promisify(child_process.exec);

export const countLines = async function (fileName: string): Promise<number> {
    const { stdout } = await exec(`wc -l ${ fileName }`);
    return parseInt(stdout.split(" ")[0]);
}
