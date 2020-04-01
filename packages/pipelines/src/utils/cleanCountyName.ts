export function cleanCountyName(fullCountyName?: string) {
    return fullCountyName?.replace(/(County)|(Borough)|(\.)|(')|(Parish)/g, "").trim();
}
