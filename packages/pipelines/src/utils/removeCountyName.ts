export function removeCountyName(fullCountyName?: string) {
    return fullCountyName?.replace(/County/g, "").trim();
}
