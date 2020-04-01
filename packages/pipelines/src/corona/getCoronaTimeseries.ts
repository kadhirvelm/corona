import lodash from "lodash";
import fetch from "node-fetch";
import { getCoronaDataScraperFipsCode } from "../utils/getCoronaDataScraperFipsCode";

interface ICoronaDataScraperTimeseriesRaw {
    [key: string]: {
        dates: {
            [date: string]: {
                cases?: number;
                deaths?: number;
                recovered?: number;
                active?: number;
                growthFactor?: number;
            };
        };
        maintainers: any[];
        url: string;
        curators: any[];
        aggregate: string;
        country: string;
        city?: string;
        county?: string;
        state: string;
        rating: number;
        sources: any[];
        coordinates: [number, number];
        tz: string[];
        featureId: number;
        population: number;
    };
}

export interface ICoronaDataScraperTimeseriesBreakdown {
    [fipsCode: string]: {
        population: number;
        timeseries: {
            [data: string]: {
                cases?: number;
                deaths?: number;
                recovered?: number;
                active?: number;
                growthFactor?: number;
            };
        };
    };
}

function filterToUS(data: ICoronaDataScraperTimeseriesRaw) {
    return Object.entries(data)
        .filter(entry => entry[0].includes("USA"))
        .map(entry => ({
            [getCoronaDataScraperFipsCode(entry[1].state, entry[1].county, entry[1].city)]: {
                population: entry[1].population,
                timeseries: entry[1].dates,
            },
        }))
        .reduce(lodash.merge);
}

export async function getCoronaDataTimeseries(): Promise<ICoronaDataScraperTimeseriesBreakdown> {
    const rawData = await fetch("https://coronadatascraper.com/timeseries-byLocation.json");
    const json = (await rawData.json()) as ICoronaDataScraperTimeseriesRaw;

    const filteredToJustUs = filterToUS(json);

    return filteredToJustUs;
}
