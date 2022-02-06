export const parseNumber = (value: string): number | undefined => {
    const parsed = parseInt(value);
    if (isNaN(parsed))
        return undefined;
    return parsed;
}
