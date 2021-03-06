import { ICoronaDataPoint } from "@corona/api";
import fetch from "node-fetch";
import { PIPELINE_LOGGER } from "@corona/logger";
import { getArcgisFipsCode } from "../../utils/getCoronaDataScraperFipsCode";
import { getTotalBreakdowns, ICountiesKeyed, IStatesKeyed, ITotalBreakdown } from "../shared";
import { logArcgisAnomalies } from "../../utils/logAnomalies";

interface IRawArcCoronaData {
    attributes: IArcCoronaData;
}

interface IArcCoronaData {
    Province_State: string;
    Country_Region: string;
    Last_Update: string;
    Lat: number;
    Long_: number;
    Confirmed: number;
    Recovered: number;
    Deaths: number;
    Active: number;
    FIPS: string;
    Incident_Rate: number | null;
    People_Tested: number | null;
    CombinedKey: string;
    Admin2: string;
}

function maybeGetCounty(admin2: string) {
    if (admin2.startsWith("Out of") || admin2.startsWith("Unassigned") || admin2 === "") {
        return undefined;
    }

    return admin2;
}

function cleanRawArcDatapoint(dataPoint: IArcCoronaData): ICoronaDataPoint {
    const county = maybeGetCounty(dataPoint.Admin2);
    const finalFipsCode = getArcgisFipsCode(dataPoint.Province_State, dataPoint.FIPS, county);

    return {
        activeCases: dataPoint.Active,
        county: maybeGetCounty(dataPoint.Admin2),
        deaths: dataPoint.Deaths,
        fipsCode: finalFipsCode,
        lastUpdated: dataPoint.Last_Update,
        recovered: dataPoint.Recovered,
        state: dataPoint.Province_State,
        totalCases: dataPoint.Confirmed,
    };
}

function separateCountiesAndStates(data: IRawArcCoronaData[]) {
    const states: IStatesKeyed = {};
    const counties: ICountiesKeyed = {};

    data.forEach(dataPoint => {
        const cleanedDataPoint = cleanRawArcDatapoint(dataPoint.attributes);
        if (cleanedDataPoint.state === undefined) {
            return;
        }

        if (cleanedDataPoint.county === undefined) {
            // eslint-disable-next-line prefer-destructuring
            states[cleanedDataPoint.state] = cleanedDataPoint;
        } else if (cleanedDataPoint.fipsCode !== undefined) {
            counties[cleanedDataPoint.state] = (counties[cleanedDataPoint.state] ?? []).concat(cleanedDataPoint);
        }
    });

    return { states, counties };
}

export async function getCoronaDataArc(): Promise<ITotalBreakdown> {
    try {
        const rawData = await fetch(
            "https://services1.arcgis.com/0MSEUqKaxRlEPj5g/arcgis/rest/services/ncov_cases_US/FeatureServer/0/query?where=1%3D1&outFields=Province_State,Country_Region,Last_Update,Lat,Long_,Confirmed,Recovered,Deaths,Active,FIPS,Incident_Rate,People_Tested,Combined_Key,Admin2&returnGeometry=false&outSR=4326&f=json",
        );
        const json = (await rawData.json()).features as IRawArcCoronaData[];

        const { states, counties } = separateCountiesAndStates(json);

        logArcgisAnomalies(states, counties);

        return getTotalBreakdowns(states, counties);
    } catch (e) {
        PIPELINE_LOGGER.log({
            level: "error",
            message: `Something went wrong when trying to get the arc gis information: ${JSON.stringify(e)} `,
        });

        return {};
    }
}
