import { twoLetterCodeToFips, twoLetterCodeWithCountyToFips, convertStateToTwoLetterCode } from "@corona/utils";
import { cleanCountyName } from "./cleanCountyName";

const IGNORED_COUNTIES = ["Miami-Dade", "Tri", "Dukes and Nantucket", "Kansas City"];

function getFinalFipsCode(state: string, county: string): { cleanedCountyName: string | undefined; fipsCode: string } {
    const cleanedCountyName = cleanCountyName(county);
    const countyKey = `${state}_${cleanedCountyName}`;
    return { cleanedCountyName, fipsCode: twoLetterCodeWithCountyToFips(countyKey) ?? countyKey };
}

export function getCoronaDataScraperFipsCode(state?: string, county?: string, city?: string) {
    if (city !== undefined) {
        return city;
    }

    if (county === undefined && city === undefined) {
        return twoLetterCodeToFips(state ?? "USA");
    }

    const { cleanedCountyName, fipsCode } = getFinalFipsCode(state ?? "USA", county ?? "");

    if (
        fipsCode.length > 5 &&
        !cleanedCountyName?.includes("Region") &&
        !cleanedCountyName?.includes("unassigned") &&
        !cleanedCountyName?.includes("Counties") &&
        !IGNORED_COUNTIES.includes(cleanedCountyName ?? "")
    ) {
        console.error("CoronaScraper -->", fipsCode);
    }

    return fipsCode;
}

// NOTE: arcgis is combining all of NYC into a single county incorrectly
const ARCGIS_BLACKLISTED_FIPS = ["36061"];

export function getArcgisFipsCode(state: string, fips?: string, county?: string) {
    if (fips != null && !ARCGIS_BLACKLISTED_FIPS.includes(fips)) {
        return fips;
    }

    const twoLetterState = convertStateToTwoLetterCode(state);

    if (county === undefined || county.includes("Out of") || county.includes("Unassigned")) {
        return twoLetterCodeToFips(twoLetterState);
    }

    const { cleanedCountyName, fipsCode } = getFinalFipsCode(twoLetterState, county);

    if (fipsCode.length > 5 && !IGNORED_COUNTIES.includes(cleanedCountyName ?? "")) {
        console.error("Arcgis -->", fipsCode);
    }

    return fipsCode;
}
