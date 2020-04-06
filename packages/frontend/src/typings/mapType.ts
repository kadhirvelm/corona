import { ICoronaDataPoint } from "@corona/api";

export interface IMapColoring {
    description: string;
    label: string;
    getDataPoint: (data: ICoronaDataPoint | undefined) => number;
}
