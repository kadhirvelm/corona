import { PIPELINE_LOGGER } from "@corona/logger";
import { ICoronaDatapointTimeseriesDatapoint } from "@corona/api";
import lodash from "lodash";
import { getTimeseriesCoronaScraper } from "./getTimeseriesCoronaScraper";
import { getTimeseriesNYTimes } from "./getTimeseriesNYTimes";
import { ITimeseriesBreakdown, ISingleTimeseriesBreakdown } from "../shared";
import { getTimeseriesUSFacts } from "./getTimeseriesUSFacts";
import { getPoint, getHighestPoint } from "../../utils/mergeDatapoints";

function mergeTimeseriesDatasets(
    coronaScraper: ITimeseriesBreakdown,
    nyTimes: ITimeseriesBreakdown,
    usFacts: ITimeseriesBreakdown,
): ITimeseriesBreakdown {
    return lodash.mergeWith(
        coronaScraper,
        nyTimes,
        usFacts,
        (
            coronaScraperPoint: ISingleTimeseriesBreakdown,
            nyTimesPoint: ISingleTimeseriesBreakdown,
            usFactsPoint: ISingleTimeseriesBreakdown,
        ): ISingleTimeseriesBreakdown => {
            const points = [coronaScraperPoint, nyTimesPoint, usFactsPoint];

            return {
                fipsCode: getPoint("fipsCode", "N/A", ...points),
                state: getPoint("state", "N/A", ...points),
                county: getPoint("county", "N/A", ...points),
                population: getPoint("population", undefined, ...points),
                timeseries: lodash.mergeWith(
                    coronaScraperPoint?.timeseries,
                    nyTimesPoint?.timeseries,
                    usFactsPoint.timeseries,
                    (
                        coronaScraperDatePoint?: ICoronaDatapointTimeseriesDatapoint,
                        nyTimesDatePoint?: ICoronaDatapointTimeseriesDatapoint,
                        usFactsDatePoint?: ICoronaDatapointTimeseriesDatapoint,
                    ): ICoronaDatapointTimeseriesDatapoint => {
                        const datePoints = [coronaScraperDatePoint, nyTimesDatePoint, usFactsDatePoint];

                        return {
                            cases: getHighestPoint("cases", ...datePoints),
                            deaths: getHighestPoint("deaths", ...datePoints),
                            recovered: getHighestPoint("recovered", ...datePoints),
                            active: getHighestPoint("active", ...datePoints),
                            growthFactor: getHighestPoint("growthFactor", ...datePoints),
                        };
                    },
                ),
            };
        },
    );
}

export async function getMergedCoronaTimeseries(): Promise<ITimeseriesBreakdown> {
    try {
        const [coronaDataScraper, nyTimes, usFacts] = await Promise.all([
            getTimeseriesCoronaScraper(),
            getTimeseriesNYTimes(),
            getTimeseriesUSFacts(),
        ]);

        PIPELINE_LOGGER.log({ level: "info", message: "Fetched timeseries from coronascraper, nytimes, and usfacts." });

        return mergeTimeseriesDatasets(coronaDataScraper, nyTimes, usFacts);
    } catch (e) {
        PIPELINE_LOGGER.log({
            level: "error",
            message: `Something went wrong when trying to merge all timeseries data together: ${JSON.stringify(e)} `,
        });

        return {};
    }
}
