import { ICoronaBreakdown } from "@corona/api";

export interface IDataEntry {
    /**
     * The key for the data entry, either "USA" or the state name.
     */
    key: string;
    /**
     * The data returned from the backend about the key.
     */
    data: ICoronaBreakdown;
}

export interface IDataBreakdown {
    name: string;
    cases: number;
}
