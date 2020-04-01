import { twoLetterCodeToFips, twoLetterCodeWithCountyToFips } from "@corona/utils";
import { cleanCountyName } from "./cleanCountyName";

const IGNORED_COUNTIES = ["Miami-Dade", "Tri", "Dukes and Nantucket"];

export function getCoronaDataScraperFipsCode(state?: string, county?: string) {
    if (county === undefined) {
        return twoLetterCodeToFips(state ?? "USA");
    }

    const cleanedCountyName = cleanCountyName(county);
    const countyKey = `${state}_${cleanedCountyName}`;
    const finalFipsCode = twoLetterCodeWithCountyToFips(countyKey) ?? countyKey;

    if (
        finalFipsCode.includes("unassigned") &&
        !county.includes("Region") &&
        county !== "(unassigned)" &&
        !county.includes("Counties") &&
        !IGNORED_COUNTIES.includes(cleanedCountyName ?? "") &&
        county !== ""
    ) {
        console.error("CoronaScraper -->", countyKey);
    }

    return finalFipsCode;
}
