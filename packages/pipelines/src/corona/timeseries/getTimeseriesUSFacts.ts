import fetch from "node-fetch";
import lodash from "lodash";
import { convertTwoLetterCodeToState } from "@corona/utils";
import { ICoronaDatapointTimeseriesDatapoint } from "@corona/api";
import { PIPELINE_LOGGER } from "@corona/logger";
import { ITimeseriesBreakdown, ISingleTimeseriesBreakdown } from "../shared";

function maybeAddZerosToFips(fips: string, expectedNumber: number) {
    if (fips.length === expectedNumber) {
        return fips;
    }

    const neededZeros = expectedNumber - fips.length;

    return `${lodash
        .range(neededZeros)
        .map(() => "0")
        .join("")}${fips}`;
}

function cleanDate(dateString: string) {
    return dateString.match(/\d+\/\d+\/\d+/g)?.[0] ?? dateString;
}

function getTimeseriesDatapoint(headers: string[], splitCsv: string[], type: "cases" | "deaths") {
    const singleTimeseriesBreakdown: { [date: string]: ICoronaDatapointTimeseriesDatapoint } = {};

    splitCsv.slice(4).forEach((timepoint, index) => {
        singleTimeseriesBreakdown[cleanDate(headers[index + 4])] = {
            [type]: parseInt(timepoint, 10),
        };
    });

    return singleTimeseriesBreakdown;
}

function getPoint(csvRow: string, type: "cases" | "deaths", headers: string[]): ISingleTimeseriesBreakdown {
    const splitCSVRow = csvRow.split(",");

    return {
        fipsCode:
            splitCSVRow[0].length === 1
                ? maybeAddZerosToFips(splitCSVRow[3], 2)
                : maybeAddZerosToFips(splitCSVRow[0], 5),
        county: splitCSVRow[1].includes("Statewide") ? "N/A" : splitCSVRow[1],
        state: convertTwoLetterCodeToState(splitCSVRow[2]),
        timeseries: getTimeseriesDatapoint(headers, splitCSVRow, type),
    };
}

function cleanCSV(csv: string, type: "cases" | "deaths") {
    const timeseriesBreakdown: ITimeseriesBreakdown = {};

    const splitCsv = csv.split("\n");
    const headers = splitCsv[0].split(",");

    splitCsv.slice(1).forEach(row => {
        const cleanedPoint = getPoint(row, type, headers);
        timeseriesBreakdown[cleanedPoint.fipsCode] = cleanedPoint;
    });

    return timeseriesBreakdown;
}

async function getDeaths() {
    const rawResponse = await fetch(
        "https://usafactsstatic.blob.core.windows.net/public/data/covid-19/covid_deaths_usafacts.csv",
    );
    const response = await rawResponse.text();

    return cleanCSV(response, "deaths");
}

async function getConfirmedCases() {
    const rawResponse = await fetch(
        "https://usafactsstatic.blob.core.windows.net/public/data/covid-19/covid_confirmed_usafacts.csv",
    );
    const response = await rawResponse.text();

    return cleanCSV(response, "cases");
}

export async function getTimeseriesUSFacts(): Promise<ITimeseriesBreakdown> {
    try {
        const [deaths, cases] = await Promise.all([getDeaths(), getConfirmedCases()]);

        return lodash.merge(deaths, cases);
    } catch (e) {
        PIPELINE_LOGGER.log({
            level: "error",
            message: `Something went wrong when trying to get the USFacts timeseries data: ${JSON.stringify(e)} `,
        });

        return {};
    }
}
