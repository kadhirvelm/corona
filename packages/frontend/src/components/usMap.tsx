import * as React from "react";
import { IVirusData } from "@corona/api";

export interface IUSMap {
    data: IVirusData;
}

export class USMap extends React.PureComponent<IUSMap> {
    public render() {
        return <div>US Map here</div>;
    }
}
