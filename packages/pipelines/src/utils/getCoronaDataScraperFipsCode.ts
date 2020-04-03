import { twoLetterCodeToFips, twoLetterCodeWithCountyToFips, convertStateToTwoLetterCode } from "@corona/utils";
import { PIPELINE_LOGGER } from "@corona/logger";
import { cleanCountyName } from "./cleanCountyName";

const IGNORED_COUNTIES = ["Tri", "Dukes and Nantucket", "Kansas City", "New York City", "Nashua", "Manchester"];

function getFinalFipsCode(state: string, county: string): { cleanedCountyName: string | undefined; fipsCode: string } {
    const cleanedCountyName = cleanCountyName(county);
    const countyKey = `${state}_${cleanedCountyName}`;
    return { cleanedCountyName, fipsCode: twoLetterCodeWithCountyToFips(countyKey) ?? countyKey };
}

export function getCoronaDataScraperFipsCode(state?: string, county?: string, city?: string) {
    if (city !== undefined) {
        return city;
    }

    if ((county === undefined || county === "") && (city === undefined || city === "")) {
        return twoLetterCodeToFips(state ?? "USA");
    }

    const { cleanedCountyName, fipsCode } = getFinalFipsCode(state ?? "USA", county ?? "");

    if (
        fipsCode.length > 5 &&
        !cleanedCountyName?.includes("Region") &&
        !cleanedCountyName?.includes("Unknown") &&
        !cleanedCountyName?.includes("unassigned") &&
        !cleanedCountyName?.includes("Counties") &&
        !IGNORED_COUNTIES.includes(cleanedCountyName ?? "")
    ) {
        PIPELINE_LOGGER.log({ level: "error", message: `CoronaScraper --> INVALID FIPS --> ${fipsCode}` });
    }

    return fipsCode;
}

// NOTE: arcgis is combining all of NYC into a single county incorrectly
const ARCGIS_BLACKLISTED_FIPS = ["36061"];

export function getArcgisFipsCode(state: string, fips?: string, county?: string) {
    // If the FIPS code is supposed to describe a county
    if (fips != null && !ARCGIS_BLACKLISTED_FIPS.includes(fips) && county != null && fips.length === 5) {
        return fips;
    }

    // If the FIPS code is supposed to describe a state
    if (fips != null && !ARCGIS_BLACKLISTED_FIPS.includes(fips) && fips.length !== 2 && county == null) {
        // NOTE: It seems arcgis suddenly decided to add a '900' to the beginning of some state fips codes..
        return fips.slice(-2);
    }

    const twoLetterState = state.length > 2 ? convertStateToTwoLetterCode(state) : state;

    if (county === undefined || county.includes("Out of") || county.includes("Unassigned")) {
        return twoLetterCodeToFips(twoLetterState);
    }

    const { cleanedCountyName, fipsCode } = getFinalFipsCode(twoLetterState, county);

    if (
        fipsCode.length > 5 &&
        !cleanedCountyName?.includes("unassigned") &&
        !IGNORED_COUNTIES.includes(cleanedCountyName ?? "")
    ) {
        PIPELINE_LOGGER.log({ level: "error", message: `Arcgis --> INVALID FIPS --> ${fipsCode}` });
    }

    return fipsCode;
}
