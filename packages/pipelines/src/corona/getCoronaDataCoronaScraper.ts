import { ICoronaDataPoint } from "@corona/api";
import { convertTwoLetterCodeToState } from "@corona/utils";
import fetch from "node-fetch";
import { cleanCountyName } from "../utils/cleanCountyName";
import { getCoronaDataScraperFipsCode } from "../utils/getCoronaDataScraperFipsCode";
import { getTotalBreakdowns, ICountiesKeyed, IStatesKeyed, ITotalBreakdown } from "./shared";

interface ICoronaDataScraperData {
    city?: string;
    county?: string;
    state?: string;
    country: string;
    cases: number;
    deaths?: number;
    recovered?: number;
    tested?: number;
    active?: number;
    population?: number;
    lat?: number;
    long?: number;
    url?: string;
    aggregate?: string;
}

export interface ICoronaDataScraperBreakdown {
    nation: ICoronaDataPoint;
    states: ITotalBreakdown;
}

function cleanRawCoronaDataScraperDatapoint(dataPoint: ICoronaDataScraperData): ICoronaDataPoint[] {
    const cleanedCounty = cleanCountyName(dataPoint.county);

    if (cleanedCounty === "Dukes and Nantucket") {
        return [
            ...cleanRawCoronaDataScraperDatapoint({ ...dataPoint, county: "Dukes" }),
            ...cleanRawCoronaDataScraperDatapoint({ ...dataPoint, county: "Nantucket" }),
        ];
    }

    return [
        {
            activeCases: dataPoint.active,
            county: cleanedCounty === "(unassigned)" ? "Unassigned" : cleanedCounty,
            deaths: dataPoint.deaths,
            fipsCode: getCoronaDataScraperFipsCode(dataPoint.state, cleanedCounty),
            lastUpdated: undefined,
            recovered: dataPoint.recovered,
            state: convertTwoLetterCodeToState(dataPoint.state ?? ""),
            totalCases: dataPoint.cases,
        },
    ];
}

function separateIntoNationStatesAndCounties(data: ICoronaDataScraperData[]) {
    const nation: ICoronaDataPoint[] = [];
    const states: IStatesKeyed = {};
    const counties: ICountiesKeyed = {};

    data.forEach(dataPoint => {
        if (dataPoint.country !== "USA") {
            return;
        }

        const cleanedDataPoint = cleanRawCoronaDataScraperDatapoint(dataPoint);

        if (
            cleanedDataPoint[0].state !== undefined &&
            cleanedDataPoint[0].state !== "" &&
            cleanedDataPoint[0].county !== undefined
        ) {
            counties[cleanedDataPoint[0].state] = (counties[cleanedDataPoint[0].state] ?? []).concat(cleanedDataPoint);
        } else if (
            cleanedDataPoint[0].state !== undefined &&
            cleanedDataPoint[0].state !== "" &&
            dataPoint.city === undefined
        ) {
            // eslint-disable-next-line prefer-destructuring
            states[cleanedDataPoint[0].state] = cleanedDataPoint[0];
        } else if (cleanedDataPoint[0].fipsCode === "999") {
            nation.push(cleanedDataPoint[0]);
        }
    });

    return { nation, states, counties };
}

export async function getCoronaDataCoronaScraper(): Promise<ICoronaDataScraperBreakdown> {
    const rawData = await fetch("https://coronadatascraper.com/data.json");
    const json = (await rawData.json()) as ICoronaDataScraperData[];

    const { nation, states, counties } = separateIntoNationStatesAndCounties(json);

    return {
        nation: nation[0],
        states: getTotalBreakdowns(states, counties),
    };
}
