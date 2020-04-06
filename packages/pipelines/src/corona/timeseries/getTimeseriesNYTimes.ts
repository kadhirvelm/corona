import fetch from "node-fetch";
import { ITimeseriesBreakdown } from "../shared";

interface ICleanedNYTimesPoint {
    date: string;
    county?: string;
    state: string;
    fips: string;
    cases: number;
    deaths: number;
}

function cleanCSV(csv: string, cleanPoint: (point: string[]) => ICleanedNYTimesPoint) {
    const timeseriesBreakdown: ITimeseriesBreakdown = {};

    const keyedByFips: ICleanedNYTimesPoint[] = csv
        .split("\n")
        .slice(1)
        .map(point => {
            const separatedPoints = point.split(",");
            return cleanPoint(separatedPoints);
        });

    keyedByFips.forEach(point => {
        timeseriesBreakdown[point.fips] = {
            state: point.state,
            fipsCode: point.fips ?? "N/A",
            county: point.county,
            timeseries: {
                ...timeseriesBreakdown[point.fips]?.timeseries,
                [point.date]: {
                    cases: point.cases,
                    deaths: point.deaths,
                },
            },
        };
    });

    return timeseriesBreakdown;
}

async function getCoronaNYTimesCounties() {
    const rawResponse = await fetch("https://raw.githubusercontent.com/nytimes/covid-19-data/master/us-counties.csv");
    const response = await rawResponse.text();

    return cleanCSV(response, separatedPoints => ({
        date: separatedPoints[0],
        county: separatedPoints[1],
        state: separatedPoints[2],
        fips: separatedPoints[3],
        cases: parseInt(separatedPoints[4], 10),
        deaths: parseInt(separatedPoints[5], 10),
    }));
}

async function getCoronaNYTimesStates() {
    const rawResponse = await fetch("https://raw.githubusercontent.com/nytimes/covid-19-data/master/us-states.csv");
    const response = await rawResponse.text();

    return cleanCSV(response, separatedPoints => ({
        date: separatedPoints[0],
        state: separatedPoints[1],
        fips: separatedPoints[2],
        cases: parseInt(separatedPoints[3], 10),
        deaths: parseInt(separatedPoints[4], 10),
    }));
}

export async function getTimeseriesNYTimes() {
    const [states, counties] = await Promise.all([getCoronaNYTimesStates(), getCoronaNYTimesCounties()]);

    return {
        ...states,
        ...counties,
    };
}
