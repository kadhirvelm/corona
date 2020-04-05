import lodash from "lodash";
import fetch from "node-fetch";
import { getCoronaDataScraperFipsCode } from "../utils/getCoronaDataScraperFipsCode";
import { ITimeseriesBreakdown } from "./shared";

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

function filterToUS(data: ICoronaDataScraperTimeseriesRaw): ITimeseriesBreakdown {
    return Object.entries(data)
        .filter(entry => entry[1].country === "United States" || entry[1].state === "iso2:US-NY")
        .map(entry => {
            const fipsCode = getCoronaDataScraperFipsCode(entry[1].state, entry[1].county, entry[1].city);
            return {
                [fipsCode]: {
                    fipsCode,
                    state: entry[1].state,
                    county: entry[1].county,
                    population: entry[1].population,
                    timeseries: entry[1].dates,
                },
            };
        })
        .reduce(lodash.merge);
}

export async function getTimeseriesCoronaScraper(): Promise<ITimeseriesBreakdown> {
    const rawData = await fetch("https://coronadatascraper.com/timeseries-byLocation.json");
    const json = (await rawData.json()) as ICoronaDataScraperTimeseriesRaw;

    const filteredToJustUs = filterToUS(json);

    return filteredToJustUs;
}
