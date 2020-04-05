import { PROJECTION } from "@corona/api";

const VALID_PROJECTIONS = Object.values(PROJECTION);

export function isValidProjection(projection: string): projection is PROJECTION {
    return VALID_PROJECTIONS.includes(projection as PROJECTION);
}
