import fetch from "node-fetch";
import { IVirusData, IBreakdown } from "@corona/api";

interface IBasicCoronaData {
    maintainers: string[];
    url: string;
    aggregate: string;
    country: string;
    cases: number;
    deaths: number;
    county?: string;
    coordinates: number[];
    rating: number;
    state?: string;
    tz: string[];
    featureId: number;
    population: number;
}

interface IKeyedState {
    [key: string]: IBasicCoronaData[];
}

interface IStateBreakdown {
    [key: string]: IVirusData;
}

function keyData(filteredToUs: IBasicCoronaData[]): IKeyedState {
    const aggregateByState: IKeyedState = {};

    filteredToUs.forEach(dataPoint => {
        const key = dataPoint.state ?? "USA";
        if (aggregateByState[key] === undefined) {
            aggregateByState[key] = [];
        }

        aggregateByState[key].push(dataPoint);
    });

    return aggregateByState;
}

function getDatapoint(dataPoint: IBasicCoronaData): IBreakdown {
    return {
        cases: dataPoint.cases,
        coordinates: dataPoint.coordinates,
        deaths: dataPoint.deaths,
        duplicates: [],
        url: dataPoint.url,
    };
}

function furtherBreakDownStates(keyedStates: IKeyedState): IStateBreakdown {
    const stateBreakdown: IStateBreakdown = {};

    Object.keys(keyedStates).forEach(state => {
        let total = 0;
        let defaultTotal = 0;

        const breakdown: { [county: string]: IBreakdown } = {};

        keyedStates[state].forEach(dataPoint => {
            const key = dataPoint.county ?? state;
            if (breakdown[key] === undefined && key !== state) {
                total += dataPoint.cases;
            } else if (breakdown[key] === undefined && key === state) {
                defaultTotal = dataPoint.cases;
            }

            if (breakdown[key] !== undefined) {
                breakdown[key].duplicates.push(getDatapoint(dataPoint));
            } else {
                breakdown[key] = getDatapoint(dataPoint);
            }
        });

        stateBreakdown[state] = {
            total: total || defaultTotal,
            breakdown,
        };
    });

    return stateBreakdown;
}

function getCountryBreakdown(furtherBrokenDownStates: IStateBreakdown) {
    let total = 0;
    const breakdown: { [key: string]: IBreakdown } = {};

    Object.keys(furtherBrokenDownStates).forEach(state => {
        total += furtherBrokenDownStates[state].breakdown[state].cases;
        breakdown[state] = furtherBrokenDownStates[state].breakdown[state];
    });

    return {
        total,
        breakdown,
    };
}

export async function getUSCoronaData(): Promise<{ states: IStateBreakdown; country: IVirusData }> {
    const rawData = await fetch("https://coronadatascraper.com/data.json");
    const json = (await rawData.json()) as IBasicCoronaData[];

    const filteredToUs = json.filter(point => point.country === "USA");

    const aggregateByState = keyData(filteredToUs);

    const furtherBrokenDownStates = furtherBreakDownStates(aggregateByState);

    return {
        states: furtherBrokenDownStates,
        country: getCountryBreakdown(furtherBrokenDownStates),
    };
}
