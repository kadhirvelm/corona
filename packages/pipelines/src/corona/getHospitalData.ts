import fetch from "node-fetch";
import { IHospitalSummary } from "@corona/api";
import lodash from "lodash";
import { getArcgisFipsCode } from "../utils/getCoronaDataScraperFipsCode";

interface IRawHospitalResponse {
    attributes: {
        HOSPITAL_NAME?: string | null;
        HOSPITAL_TYPE?: string | null;
        HQ_ADDRESS?: string | null;
        HQ_ADDRESS1?: string | null;
        HQ_CITY?: string | null;
        HQ_STATE?: string | null;
        HQ_ZIP_CODE?: string | null;
        COUNTY_NAME?: string | null;
        STATE_NAME?: string | null;
        STATE_FIPS?: string | null;
        CNTY_FIPS?: string | null;
        FIPS?: string | null;
        NUM_LICENSED_BEDS?: number | null;
        NUM_STAFFED_BEDS?: number | null;
        NUM_ICU_BEDS?: number | null;
        BED_UTILIZATION?: number | null;
        Potential_Increase_In_Bed_Capac?: number | null;
    };
}

interface IHospitalDataPoint {
    stateFips: string;
    countyFips: string;
    licensedBeds: number;
    staffedBeds: number;
    icuBeds: number;
}

export interface IFipsToHospitalSummary {
    [fipsCode: string]: IHospitalSummary;
}

function cleanUpDataPoint(rawResponsePoint: IRawHospitalResponse): IHospitalDataPoint {
    const { attributes } = rawResponsePoint;

    return {
        stateFips: attributes.STATE_FIPS ?? getArcgisFipsCode(attributes.STATE_FIPS ?? "N/A"),
        countyFips:
            attributes.FIPS ??
            getArcgisFipsCode(
                attributes.STATE_NAME ?? "N/A",
                attributes.FIPS ?? undefined,
                attributes.COUNTY_NAME ?? undefined,
            ),
        licensedBeds: attributes.NUM_LICENSED_BEDS ?? 0,
        staffedBeds: attributes.NUM_STAFFED_BEDS ?? 0,
        icuBeds: attributes.NUM_ICU_BEDS ?? 0,
    };
}

function addToFipsHospitalSummary(point: IHospitalSummary | undefined, summary: IHospitalSummary): IHospitalSummary {
    if (point === undefined) {
        return summary;
    }

    return lodash.mergeWith(point, summary, (a: number | "N/A", b: number | "N/A") => {
        const getNum = (num: number | "N/A") => (num === "N/A" ? 0 : num);

        return getNum(a) + getNum(b);
    });
}

function getSummaries(rawResponse: IRawHospitalResponse[]) {
    const summary: IFipsToHospitalSummary = {};

    rawResponse.forEach(singleResponse => {
        const cleanedResponse = cleanUpDataPoint(singleResponse);

        const responseSummary: IHospitalSummary = {
            totalLicensedBeds: cleanedResponse.licensedBeds,
            staffedBeds: cleanedResponse.staffedBeds,
            icuBeds: cleanedResponse.icuBeds,
            totalHospitals: 1,
        };

        summary[cleanedResponse.countyFips] = addToFipsHospitalSummary(
            summary[cleanedResponse.countyFips],
            responseSummary,
        );

        summary[cleanedResponse.stateFips] = addToFipsHospitalSummary(
            summary[cleanedResponse.stateFips],
            responseSummary,
        );
    });

    return summary;
}

export async function getHospitalData(): Promise<IFipsToHospitalSummary> {
    const rawResponse = await fetch(
        "https://services7.arcgis.com/LXCny1HyhQCUSueu/arcgis/rest/services/Definitive_Healthcare_USA_Hospital_Beds/FeatureServer/0/query?where=1%3D1&outFields=HOSPITAL_NAME,HOSPITAL_TYPE,HQ_ADDRESS,HQ_ADDRESS1,HQ_CITY,HQ_STATE,HQ_ZIP_CODE,COUNTY_NAME,STATE_NAME,STATE_FIPS,CNTY_FIPS,FIPS,NUM_LICENSED_BEDS,NUM_STAFFED_BEDS,NUM_ICU_BEDS,BED_UTILIZATION,Potential_Increase_In_Bed_Capac&returnGeometry=false&outSR=4326&f=json",
    );
    const response = (await rawResponse.json()).features as IRawHospitalResponse[];

    return getSummaries(response);
}
