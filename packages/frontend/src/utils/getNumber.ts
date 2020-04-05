export function getNumber(num?: number | "N/A") {
    if (num === undefined || num === "N/A") {
        return 0;
    }

    return num;
}
