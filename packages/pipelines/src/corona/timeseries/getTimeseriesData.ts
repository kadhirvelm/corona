import { PIPELINE_LOGGER } from "@corona/logger";
import { ICoronaDatapointTimeseriesDatapoint } from "@corona/api";
import { getTimeseriesCoronaScraper } from "./getTimeseriesCoronaScraper";
import { getTimeseriesNYTimes } from "./getTimeseriesNYTimes";
import { ITimeseriesBreakdown, ISingleTimeseriesBreakdown } from "../shared";
import lodash from "lodash";

function mergeTimeseriesDatasets(
    coronaScraper: ITimeseriesBreakdown,
    nyTimes: ITimeseriesBreakdown,
): ITimeseriesBreakdown {
    return lodash.mergeWith(
        coronaScraper,
        nyTimes,
        (
            coronaScraperPoint: ISingleTimeseriesBreakdown,
            nyTimesPoint: ISingleTimeseriesBreakdown,
        ): ISingleTimeseriesBreakdown => {
            return {
                fipsCode: coronaScraperPoint?.fipsCode ?? nyTimesPoint?.fipsCode,
                state: coronaScraperPoint?.state ?? nyTimesPoint?.state,
                county: coronaScraperPoint?.county ?? nyTimesPoint?.county,
                population: coronaScraperPoint?.population ?? nyTimesPoint?.population,
                timeseries: lodash.mergeWith(
                    coronaScraperPoint?.timeseries,
                    nyTimesPoint?.timeseries,
                    (
                        coronaScraperDatePoint?: ICoronaDatapointTimeseriesDatapoint,
                        nyTimesDatePoint?: ICoronaDatapointTimeseriesDatapoint,
                    ): ICoronaDatapointTimeseriesDatapoint => {
                        return {
                            cases: coronaScraperDatePoint?.cases ?? nyTimesDatePoint?.cases ?? "N/A",
                            deaths: coronaScraperDatePoint?.deaths ?? nyTimesDatePoint?.deaths ?? "N/A",
                            recovered: coronaScraperDatePoint?.recovered ?? "N/A",
                            active: coronaScraperDatePoint?.active ?? "N/A",
                            growthFactor: coronaScraperDatePoint?.growthFactor ?? "N/A",
                        };
                    },
                ),
            };
        },
    );
}

export async function getMergedCoronaTimeseries() {
    const [coronaDataScraper, nyTimes] = await Promise.all([getTimeseriesCoronaScraper(), getTimeseriesNYTimes()]);

    PIPELINE_LOGGER.log({ level: "info", message: "Fetched timeseries from coronascraper and nytimes." });

    return mergeTimeseriesDatasets(coronaDataScraper, nyTimes);
}
