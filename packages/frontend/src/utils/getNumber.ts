export function getNumber(num?: number | "N/A") {
    if (num === undefined || num === "N/A") {
        return 0;
    }

    return num;
}

export function getNumberWithUndefined(num?: number | "N/A") {
    if (num === undefined || num === "N/A") {
        return undefined;
    }

    return num;
}
