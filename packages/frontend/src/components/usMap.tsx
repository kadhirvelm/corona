import { IVirusData } from "@corona/api";
import * as React from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";

import "../static/us-state-topology.json";
import "../static/us-county-topology.json";

export interface IUSMap {
    data: IVirusData;
    geography: string;
    onClick: (name: string) => void;
}

export class USMap extends React.PureComponent<IUSMap> {
    public render() {
        const { geography } = this.props;
        return (
            <ComposableMap
                projectionConfig={{ scale: 1000 }}
                projection="geoAlbersUsa"
                width={window.innerWidth}
                height={window.innerHeight}
                style={{
                    width: "100%",
                    height: "auto",
                }}
            >
                <Geographies geography={geography}>
                    {data => data.geographies.map(this.renderSingleGeography)}
                </Geographies>
            </ComposableMap>
        );
    }

    private renderSingleGeography = (geography: any) => {
        const { data } = this.props;
        const hasData = data.breakdown[geography.id] !== undefined;
        console.log(geography, data.breakdown);
        return (
            <Geography
                geography={geography}
                key={geography.id}
                onClick={this.handleSelection(geography.properties.name)}
                style={{
                    default: {
                        fill: hasData ? "#FADBD8" : "#FDFEFE",
                        stroke: "#607D8B",
                        strokeWidth: 0.75,
                        outline: "none",
                    },
                    hover: {
                        fill: "#CFD8DC",
                        stroke: "#607D8B",
                        strokeWidth: 1,
                        outline: "none",
                    },
                    pressed: {
                        fill: "#FF5722",
                        stroke: "#607D8B",
                        strokeWidth: 1,
                        outline: "none",
                    },
                }}
            />
        );
    };

    private handleSelection = (name: string) => () => {
        const { onClick } = this.props;
        onClick(name);
    };
}
