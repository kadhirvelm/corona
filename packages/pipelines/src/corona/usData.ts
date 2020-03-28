import fetch from "node-fetch";
import { IVirusData, IBreakdown } from "@corona/api";
import { convertStateToTwoLetterCode, twoLetterCodeToFips, twoLetterCodeWithCountyToFips } from "@corona/utils";

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
    featureId?: number;
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

function getId(dataPoint: IBasicCoronaData): string {
    if (dataPoint.state === undefined) {
        return `Unknown ID: ${Math.random() * 100}`;
    }

    const twoLetterCode = convertStateToTwoLetterCode(dataPoint.state);
    if (dataPoint.county === undefined) {
        return twoLetterCodeToFips(twoLetterCode);
    }

    const cleanCountyName = dataPoint.county.replace(/County/g, "").trim();

    return twoLetterCodeWithCountyToFips(`${twoLetterCode}_${cleanCountyName}`);
}

function getDatapoint(dataPoint: IBasicCoronaData): IBreakdown {
    return {
        cases: dataPoint.cases,
        coordinates: dataPoint.coordinates,
        deaths: dataPoint.deaths,
        duplicates: [],
        id: getId(dataPoint),
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
            const breakdownDatapoint = getDatapoint(dataPoint);
            const key = breakdownDatapoint.id;

            if (breakdown[key] === undefined && key !== state) {
                total += dataPoint.cases;
            } else if (breakdown[key] === undefined && key === state) {
                defaultTotal = dataPoint.cases;
            }

            if (breakdown[key] !== undefined) {
                breakdown[key].duplicates.push(breakdownDatapoint);
            } else {
                breakdown[key] = breakdownDatapoint;
            }
        });

        stateBreakdown[twoLetterCodeToFips(state)] = {
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
        const id = twoLetterCodeToFips(state);
        total += furtherBrokenDownStates[state].breakdown[state].cases;
        breakdown[id] = furtherBrokenDownStates[state].breakdown[state];
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
