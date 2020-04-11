import lodash from "lodash";
import { ICoronaDataPoint } from "@corona/api";
import { PIPELINE_LOGGER } from "@corona/logger";
import { stateToFips } from "@corona/utils";
import { ITotalBreakdown, ISingleBreakdown } from "../shared";
import { getCoronaDataArc } from "./getCoronaDataArc";
import { getCoronaDataCoronaScraper } from "./getCoronaDataCoronaScraper";

function mergeCoronaDatapoints(dataPointA?: ICoronaDataPoint, dataPointB?: ICoronaDataPoint): ICoronaDataPoint {
    if (dataPointA === undefined && dataPointB === undefined) {
        PIPELINE_LOGGER.log({
            level: "error",
            message: "Something went wrong in the data pipeline, attempted to merge two undefined data points.",
        });

        return {
            fipsCode: "",
            totalCases: 0,
        };
    }

    return lodash.mergeWith(dataPointA, dataPointB, (a, b) => {
        if (a != null && b == null) {
            return a;
        }

        if (a == null && b != null) {
            return b;
        }

        if (b - a > 0 || (a === "" && b !== "")) {
            return b;
        }

        return a;
    }) as ICoronaDataPoint;
}

function mergeCoronaDatasets(usDataArc: ITotalBreakdown, usDataCoronaScraper: ITotalBreakdown): ITotalBreakdown {
    return lodash.mergeWith(
        usDataArc,
        usDataCoronaScraper,
        (dataArcState?: ISingleBreakdown, coronaScraperState?: ISingleBreakdown): ISingleBreakdown => {
            const stateDataMerged = mergeCoronaDatapoints(dataArcState?.stateTotal, coronaScraperState?.stateTotal);

            return {
                stateTotal: stateDataMerged,
                countiesBreakdown:
                    lodash.mergeWith(
                        dataArcState?.countiesBreakdown,
                        coronaScraperState?.countiesBreakdown,
                        (
                            dataArcCounty?: ICoronaDataPoint,
                            coronaScraperCounty?: ICoronaDataPoint,
                        ): ICoronaDataPoint => {
                            return mergeCoronaDatapoints(dataArcCounty, coronaScraperCounty);
                        },
                    ) ?? {},
            };
        },
    );
}

function getNumber(num: number | "N/A" | undefined) {
    if (num === undefined) {
        return undefined;
    }

    if (num === "N/A") {
        return 0;
    }

    return num;
}

function getHigherValueFromCounties(
    counties: ICoronaDataPoint[],
    key: "activeCases" | "deaths" | "recovered" | "totalCases",
    originalNumber?: number | "N/A",
) {
    const aggregatedValue = counties.reduce((previous, next) => previous + (getNumber(next[key]) ?? 0), 0);
    return Math.max(getNumber(originalNumber) ?? 0, aggregatedValue);
}

function verifyDatapoints(totalBreakdown: ITotalBreakdown): ITotalBreakdown {
    return Object.keys(totalBreakdown)
        .map((state): { [state: string]: ISingleBreakdown } => {
            const { stateTotal } = totalBreakdown[state];
            // NOTE: we only want the proper county counts here, we don't want to include the regions and other multi-county counts
            const counties = Object.values(totalBreakdown[state].countiesBreakdown).filter(
                // eslint-disable-next-line no-restricted-globals
                point => !isNaN(parseInt(point.fipsCode, 10)),
            );

            return {
                [state]: {
                    ...totalBreakdown[state],
                    stateTotal: {
                        ...stateTotal,
                        activeCases: getHigherValueFromCounties(counties, "activeCases", stateTotal?.activeCases),
                        deaths: getHigherValueFromCounties(counties, "deaths", stateTotal?.deaths),
                        recovered: getHigherValueFromCounties(counties, "recovered", stateTotal?.recovered),
                        totalCases: getHigherValueFromCounties(counties, "totalCases", stateTotal?.totalCases),
                        fipsCode: stateTotal?.fipsCode ?? stateToFips(state),
                    },
                },
            };
        })
        .reduce((previous, next) => ({ ...previous, ...next }), {});
}

export async function getMergedCoronaDatasets(): Promise<{
    nation: ICoronaDataPoint;
    verifiedDataPoints: ITotalBreakdown;
}> {
    try {
        const [arcGis, coronaDataScraper] = await Promise.all([getCoronaDataArc(), getCoronaDataCoronaScraper()]);

        PIPELINE_LOGGER.log({ level: "info", message: "Fetched data from arcgis and coronadatascraper." });

        const mergedDataPoints = mergeCoronaDatasets(arcGis, coronaDataScraper.states);

        return { nation: coronaDataScraper.nation, verifiedDataPoints: verifyDatapoints(mergedDataPoints) };
    } catch (e) {
        PIPELINE_LOGGER.log({
            level: "error",
            message: `Something went wrong when trying to merge all the corona information together: ${JSON.stringify(
                e,
            )} `,
        });

        return {
            nation: {
                fipsCode: "999",
                totalCases: "N/A",
            },
            verifiedDataPoints: {},
        };
    }
}
