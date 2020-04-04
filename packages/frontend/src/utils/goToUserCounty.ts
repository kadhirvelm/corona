import { isValidState } from "@corona/utils";
import { IGeography } from "../typings";

function isValidCounty(county: any | undefined, state: any | undefined) {
    if (county === undefined || state === undefined) {
        return false;
    }

    if (county.FIPS.length !== 5 || state.FIPS.length !== 2) {
        return false;
    }

    return county.name != null && isValidState(state.name);
}

export async function goToUserCounty(updateGeography: (newGeography: IGeography) => void) {
    try {
        const rawIpResponse = await fetch("http://ip-api.com/json");
        const ipResponse = await rawIpResponse.json();

        const rawFCCResponse = await fetch(
            `https://geo.fcc.gov/api/census/block/find?latitude=${ipResponse.lat}&longitude=${ipResponse.lon}&format=json`,
        );
        const fccResponse = await rawFCCResponse.json();

        if (!isValidCounty(fccResponse.County, fccResponse.State)) {
            return;
        }

        updateGeography(
            IGeography.countyGeography({
                fipsCode: fccResponse.County.FIPS,
                name: fccResponse.County.name,
                countyStateGeography: IGeography.stateGeography({
                    fipsCode: fccResponse.State.FIPS,
                    name: fccResponse.State.name,
                }),
            }),
        );
    } catch (error) {
        // eslint-disable-next-line no-console
        console.error(`Attempted to take user to their county using FCC APIs but the request was blocked: ${error}`);
    }
}
