import fetch from "node-fetch";
import { ICoronaDataPoint } from "@corona/api";
import { twoLetterCodeToFips, convertStateToTwoLetterCode } from "@corona/utils";
import { IStatesKeyed, ICountiesKeyed, getTotalBreakdowns, ITotalBreakdown } from "./shared";

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
    if (admin2.startsWith("Out of") || admin2.startsWith("Unassigned")) {
        return undefined;
    }

    return admin2;
}

function getFipsCodeFromState(state: string) {
    return twoLetterCodeToFips(convertStateToTwoLetterCode(state));
}

function cleanRawArcDatapoint(dataPoint: IArcCoronaData): ICoronaDataPoint {
    return {
        activeCases: dataPoint.Active,
        county: maybeGetCounty(dataPoint.Admin2),
        deaths: dataPoint.Deaths,
        fipsCode: dataPoint.FIPS ?? getFipsCodeFromState(dataPoint.Province_State),
        lastUpdated: new Date(dataPoint.Last_Update),
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
            states[cleanedDataPoint.state] = cleanedDataPoint;
        } else if (cleanedDataPoint.fipsCode !== undefined) {
            counties[cleanedDataPoint.state] = (counties[cleanedDataPoint.state] ?? []).concat(cleanedDataPoint);
        }
    });

    return { states, counties };
}

export async function getCoronaDataArc(): Promise<ITotalBreakdown> {
    const rawData = await fetch(
        "https://services1.arcgis.com/0MSEUqKaxRlEPj5g/arcgis/rest/services/ncov_cases_US/FeatureServer/0/query?where=1%3D1&outFields=Province_State,Country_Region,Last_Update,Lat,Long_,Confirmed,Recovered,Deaths,Active,FIPS,Incident_Rate,People_Tested,Combined_Key,Admin2&returnGeometry=false&outSR=4326&f=json",
    );
    const json = (await rawData.json()).features as IRawArcCoronaData[];

    const { states, counties } = separateCountiesAndStates(json);

    return getTotalBreakdowns(states, counties);
}
