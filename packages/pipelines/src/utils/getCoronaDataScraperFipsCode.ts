import { PIPELINE_LOGGER } from "@corona/logger";
import { stateAndCountyToFips, stateToFips } from "@corona/utils";
import { cleanCountyName } from "./cleanCountyName";

const IGNORED_COUNTIES = ["DukesandNantucket", "KansasCity", "NewYorkCity"];

function getFinalFipsCode(state: string, county: string): { cleanedCountyName: string | undefined; fipsCode: string } {
    const cleanedCountyName = cleanCountyName(county);
    const countyKey = `${state}_${cleanedCountyName}`;
    return { cleanedCountyName, fipsCode: stateAndCountyToFips(countyKey) ?? countyKey };
}

export function getCoronaDataScraperFipsCode(state?: string, county?: string, city?: string) {
    if (state === "iso2:US-NY") {
        return "New York_NewYorkCity";
    }

    if (city !== undefined) {
        return city;
    }

    if ((county === undefined || county === "") && (city === undefined || city === "")) {
        return stateToFips(state ?? "United States");
    }

    const { cleanedCountyName, fipsCode } = getFinalFipsCode(state ?? "United States", county ?? "Unassigned");

    if (
        fipsCode.length > 5 &&
        !cleanedCountyName?.includes("Region") &&
        !cleanedCountyName?.includes("Unknown") &&
        !cleanedCountyName?.includes("unassigned") &&
        !cleanedCountyName?.includes("Counties") &&
        !cleanedCountyName?.includes(",") &&
        !cleanedCountyName?.includes("CensusArea") &&
        !IGNORED_COUNTIES.includes(cleanedCountyName ?? "")
    ) {
        PIPELINE_LOGGER.log({
            level: "warn",
            message: `CoronaScraper --> ${fipsCode}. State: ${state}, County: ${county}, City: ${city}`,
        });
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

    if (county === undefined || county.includes("Out of") || county.includes("Unassigned")) {
        return stateToFips(state);
    }

    const { cleanedCountyName, fipsCode } = getFinalFipsCode(state, county);

    if (
        fipsCode.length > 5 &&
        !cleanedCountyName?.includes("unassigned") &&
        !IGNORED_COUNTIES.includes(cleanedCountyName ?? "")
    ) {
        PIPELINE_LOGGER.log({ level: "warn", message: `Arcgis --> INVALID FIPS --> ${fipsCode}` });
    }

    return fipsCode;
}
