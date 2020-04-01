export function cleanCountyName(fullCountyName?: string) {
    return fullCountyName?.replace(/(County)|(\.)|(')|(Parish)/g, "").trim();
}
