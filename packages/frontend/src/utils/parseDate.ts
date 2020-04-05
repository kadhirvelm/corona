import { timeParse } from "d3-time-format";

/**
 * There are some discrepancies between Safari, Chrome and Mobile that are causing date parsing to be generally off.
 *
 * Using d3-time parse as the global standard, it seems to just work.
 */
export const PARSE_TIME = timeParse("%Y-%m-%d");
