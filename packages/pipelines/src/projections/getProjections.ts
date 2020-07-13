import lodash from "lodash";
import fetch from "node-fetch";
import {
    PROJECTION,
    ISingleProjectionPoint,
    IIntervention,
    ISingleProjectionMeasure,
    IProjectionPoint,
} from "@corona/api";
import { getProjectionId } from "@corona/utils";

interface IProjectionPointRaw {
    date_reported: string;
    data_type_name: string;
    location_id: string;
    mean: number;
    upper: number;
    lower: number;
    covid_measure_name: string;
}

interface IInterventionRaw {
    date_reported: string;
    covid_intervention_id: number;
    location_id: number;
    covid_intervention_measure_id: number;
    covid_intervention_measure_name: string;
}

const TRANSLATE_KEY = {
    deaths: "Deaths per day",
    total_death: "Total deaths",
    covid_all_bed: "Hospital beds needed",
    covid_ICU_bed: "Intensive care units needed",
    invasive_ventilation: "Invasive ventilators needed",
    bedover: "Hospital beds shortage",
    icuover: "Intensive care units shortage",
    peak_resource_usage: "Overall resource usage",
    infections: "Infections",
    total_death_smoothed: "Total deaths, smoothed",
    deaths_smoothed: "Deaths, smoothed",
    composite_mobility: "Composite mobility",
    positive_tests: "Positive tests",
    tests: "Tests",
};

function translateMeasureName(name: string): string {
    return (TRANSLATE_KEY as any)[name] ?? name;
}

const TRANSLATE_KEY_TO_PRIORITY = {
    deaths: 7,
    total_death: 6,
    covid_all_bed: 1,
    covid_ICU_bed: 3,
    invasive_ventilation: 5,
    bedover: 2,
    icuover: 4,
    peak_resource_usage: 1,
};

function translateMeasureNameToPriority(name: string): number {
    return (TRANSLATE_KEY_TO_PRIORITY as any)[name] ?? 99;
}

function cleanProjectionPoint(rawPoint: IProjectionPointRaw): ISingleProjectionPoint {
    return {
        mean: rawPoint.mean,
        upper: rawPoint.upper,
        lower: rawPoint.lower,
        date: rawPoint.date_reported,
    };
}

function assembleBasicProjection(rawPoints: IProjectionPointRaw[]): { [measure: string]: ISingleProjectionMeasure } {
    const cleanedResponses: { [measure: string]: ISingleProjectionMeasure } = {};

    rawPoints.forEach(point => {
        cleanedResponses[translateMeasureName(point.covid_measure_name)] = {
            priority: translateMeasureNameToPriority(point.covid_measure_name),
            timeseries: (cleanedResponses[translateMeasureName(point.covid_measure_name)]?.timeseries ?? []).concat(
                cleanProjectionPoint(point),
            ),
        };
    });

    return cleanedResponses;
}

function addMaxProjectionTimes(cleanedResponses: {
    [measure: string]: ISingleProjectionMeasure;
}): { [measure: string]: ISingleProjectionMeasure } {
    return lodash.mapValues(cleanedResponses, singleMeasure => {
        const peakPoint = lodash.maxBy(singleMeasure.timeseries, point => point.mean);
        return {
            description: "Something here",
            // NOTE: the frontend is having a hard time rendering these dates with a time period of 00:00:00
            peak: peakPoint?.date.split(" ")[0],
            peak_number: peakPoint?.mean,
            priority: singleMeasure.priority,
            timeseries: singleMeasure.timeseries,
        };
    });
}

async function getHospitalizationProjection(
    projectionId: number,
): Promise<{ [measure: string]: ISingleProjectionMeasure }> {
    const rawResponse = await fetch(`https://covid19.healthdata.org/api/data/hospitalization?location=${projectionId}`);
    const response = await rawResponse.json();
    const responseParsed = response.values.map((v: any) => lodash.zipObject(response.keys, v)) as IProjectionPointRaw[];

    const basicProjection = assembleBasicProjection(responseParsed);

    return addMaxProjectionTimes(basicProjection);
}

async function getInterventionData(projectionId: number): Promise<IIntervention[]> {
    const rawResponse = await fetch(`https://covid19.healthdata.org/api/data/intervention?location=${projectionId}`);
    const response = await rawResponse.json();
    const responseParsed = response.values.map((v: any) => lodash.zipObject(response.keys, v)) as IInterventionRaw[];

    return responseParsed.map(
        (rawIntervention): IIntervention => ({
            // NOTE: the frontend is having a hard time rendering these dates with a time period of 00:00:00
            date: rawIntervention.date_reported.split(" ")[0],
            measureId: rawIntervention.covid_intervention_measure_id,
            measureDescription: rawIntervention.covid_intervention_measure_name,
        }),
    );
}

export async function getProjections(state: PROJECTION): Promise<IProjectionPoint> {
    const projectionId = getProjectionId(state);

    const [projections, interventions] = await Promise.all([
        getHospitalizationProjection(projectionId),
        getInterventionData(projectionId),
    ]);

    return {
        interventions,
        projections,
    };
}
