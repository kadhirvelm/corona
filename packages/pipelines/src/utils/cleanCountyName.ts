export function cleanCountyName(fullCountyName?: string) {
    return fullCountyName?.replace(/(County)|(Borough)|(\.)|(')|(Parish)|(Municipality)|\s/g, "").trim();
}
