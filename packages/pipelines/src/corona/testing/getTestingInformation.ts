import fetch from "node-fetch";
import { ICoronaTestingInformation } from "@corona/api";
import { PIPELINE_LOGGER } from "@corona/logger";

interface IRawTestingInformation {
    positive: number;
    grade: string;
    negative: number;
    pending?: number;
    hospitalizedCurrently?: number;
    inIcuCurrently?: number;
    onVentilatorCurrently: number;
    lastUpdateEt: string;
    death: number;
    hospitalized: number;
    totalTestResults: number;
    fips: string;
}

function cleanDataPoint(rawRespose: IRawTestingInformation): { [fips: string]: ICoronaTestingInformation } {
    return {
        [rawRespose.fips]: {
            dataGrade: rawRespose.grade,
            death: rawRespose.death ?? "N/A",
            hospitalized: rawRespose.hospitalizedCurrently ?? "N/A",
            inIcu: rawRespose.inIcuCurrently ?? "N/A",
            onVentilator: rawRespose.onVentilatorCurrently ?? "N/A",
            lastUpdated: rawRespose.lastUpdateEt,
            negative: rawRespose.negative,
            positive: rawRespose.positive,
            pending: rawRespose.pending ?? "N/A",
            totalTests: rawRespose.totalTestResults,
        },
    };
}

export async function getTestingInformation(): Promise<{ [fips: string]: ICoronaTestingInformation }> {
    try {
        const rawResponse = await fetch("https://covidtracking.com/api/v1/states/current.json");
        const response = (await rawResponse.json()) as IRawTestingInformation[];

        return response.map(cleanDataPoint).reduce((previous, next) => ({ ...previous, ...next }));
    } catch (e) {
        PIPELINE_LOGGER.log({
            level: "error",
            message: `Something went wrong when trying to get the testing information from covid tracker: ${JSON.stringify(
                e,
            )} `,
        });

        return {};
    }
}
