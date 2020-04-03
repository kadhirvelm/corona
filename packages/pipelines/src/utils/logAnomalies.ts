import { ICoronaDataPoint, STATE } from "@corona/api";
import { PIPELINE_LOGGER } from "@corona/logger";
import lodash from "lodash";
import { IStatesKeyed, ICountiesKeyed } from "../corona/shared";

function getStatesNotDisplayed(states: IStatesKeyed) {
    const uniqueStates = lodash.uniq(Object.values(states).map(point => point.state));
    return lodash.difference(uniqueStates, Object.values(STATE));
}

function getStatesWithInvalidFipsCode(states: IStatesKeyed) {
    return Object.values(states).filter(state => state.fipsCode.length !== 2);
}

function getUndefinedFips(dataPoints: ICoronaDataPoint[]) {
    return dataPoints.filter(point => point.fipsCode === undefined);
}

function sharedChecks(service: string, states: IStatesKeyed, counties: ICountiesKeyed) {
    const statesNotDisplayed = getStatesNotDisplayed(states);
    if (statesNotDisplayed.length > 0) {
        PIPELINE_LOGGER.log({
            level: "error",
            message: `Missing some state data from ${service}: ${statesNotDisplayed}`,
        });
    }

    const statesWithInvalidFips = getStatesWithInvalidFipsCode(states);
    if (statesWithInvalidFips.length > 0) {
        PIPELINE_LOGGER.log({
            level: "error",
            message: `Some states getting invalid FIPS from ${service}: ${statesWithInvalidFips}`,
        });
    }

    const undefinedFipsCodes = getUndefinedFips(lodash.flatten(Object.values(counties)).concat(Object.values(states)));
    if (undefinedFipsCodes.length > 0) {
        PIPELINE_LOGGER.log({
            level: "error",
            message: `Some counties receiving undefined FIPS from ${service}: ${undefinedFipsCodes}`,
        });
    }
}

export function logArcgisAnomalies(states: IStatesKeyed, counties: ICountiesKeyed) {
    return new Promise(() => {
        sharedChecks("arcgis", states, counties);
    });
}

export function logCoronaScraperAnomalies(nation: ICoronaDataPoint[], states: IStatesKeyed, counties: ICountiesKeyed) {
    return new Promise(() => {
        sharedChecks("coronaScraper", states, counties);

        if (nation.length > 1) {
            PIPELINE_LOGGER.log({
                level: "error",
                message: `Unexpectedly found more than one nation entry: ${nation.length}`,
            });
        }

        if (nation[0].fipsCode !== "999") {
            PIPELINE_LOGGER.log({
                level: "error",
                message: `First nation entry not getting the right FIPS code: ${nation[0].fipsCode}`,
            });
        }
    });
}
