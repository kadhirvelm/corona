import { ICoronaDataPoint } from "@corona/api";

export interface IMapColoring {
    description: string;
    label: string;
    getDataPoint: (data: ICoronaDataPoint | undefined) => number | undefined;
    getLabel: (number: number | undefined) => string;
    colors?: {
        start?: string;
        middle?: string;
        end?: string;
    };
}
