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
    covid_all_bed: "All hospital beds needed",
    covid_ICU_bed: "All ICU beds needed",
    invasive_ventilation: "Total invasive ventilators needed",
    bedover: "Bed shortage",
    icuover: "ICU shortage",
    peak_resource_usage: "Peak resource usage",
};

function translateMeasureName(name: string): string {
    return (TRANSLATE_KEY as any)[name] ?? name;
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
            peak: peakPoint?.date,
            peak_number: peakPoint?.mean,
            timeseries: singleMeasure.timeseries,
        };
    });
}

async function getHospitalizationProjection(
    projectionId: number,
): Promise<{ [measure: string]: ISingleProjectionMeasure }> {
    const rawResponse = await fetch(`https://covid19.healthdata.org/api/data/hospitalization?location=${projectionId}`);
    const response = (await rawResponse.json()) as IProjectionPointRaw[];

    const basicProjection = assembleBasicProjection(response);

    return addMaxProjectionTimes(basicProjection);
}

async function getInterventionData(projectionId: number): Promise<IIntervention[]> {
    const rawResponse = await fetch(`https://covid19.healthdata.org/api/data/intervention?location=${projectionId}`);
    const response = (await rawResponse.json()) as IInterventionRaw[];

    return response.map(
        (rawIntervention): IIntervention => ({
            date: rawIntervention.date_reported,
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
