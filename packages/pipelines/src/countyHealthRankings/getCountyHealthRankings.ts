import fetch from "node-fetch";
import lodash from "lodash";
import { writeFileSync } from "fs";
import { STATE_TO_FIPS } from "@corona/utils";

async function getData(url: string) {
    const data = await fetch(url);
    const response = await data.json();

    return response;
}

async function getDataForState(fipsCode: string, measureId: number) {
    try {
        const measures = await getData(`https://countyhealthrankings.org/measures/2019/${fipsCode}/${measureId}`);

        const singleMeasure = measures.measures.find((m: any) => m.id === measureId);

        const countyNames = lodash.mapValues(measures.counties, c => `${c.state_fips}${c.county_fips}`);
        const values = lodash.mapKeys(measures.measureValues, (_, k: string) => countyNames[k]);

        return { measure: singleMeasure, values };
    } catch {
        return { measure: undefined, values: [] };
    }
}

async function getAndWriteDataForSingleMeasure(measureId: number) {
    const allMeasures = await Promise.all(
        Object.values(STATE_TO_FIPS).map(fips => {
            return getDataForState(fips, measureId);
        }),
    );

    const measure = allMeasures.find(m => m.measure !== undefined);
    const mergedValues = lodash.merge({}, ...allMeasures.map(m => m.values));

    writeFileSync(`../../${measureId}.json`, JSON.stringify({ measure, values: mergedValues }, null, 2));
}

export async function getCountyHealthRankings(measureId: number) {
    await getAndWriteDataForSingleMeasure(measureId);
}
