import { twoLetterCodeToFips, twoLetterCodeWithCountyToFips } from "@corona/utils";
import { removeCountyName } from "./removeCountyName";

export function getCoronaDataScraperFipsCode(state?: string, county?: string) {
    if (county === undefined) {
        return twoLetterCodeToFips(state ?? "USA");
    }

    return twoLetterCodeWithCountyToFips(`${state}_${removeCountyName(county)}`) ?? "unassigned";
}
