import { CoronaService, STATE } from "@corona/api";
import * as React from "react";
import { isValidState } from "@corona/utils";
import { VirusDataRenderer } from "./components/virusDataRenderer";

interface IState {
    selectedState: STATE | undefined;
}

export class MainApplication extends React.PureComponent<{}, IState> {
    public state: IState = {
        selectedState: undefined,
    };

    public render() {
        const { selectedState } = this.state;

        return (
            <VirusDataRenderer
                getData={this.getDataSource}
                geography={this.getGeography()}
                key={selectedState ?? "USA"}
                onItemClick={this.handleItemClick}
            />
        );
    }

    private getGeography = () => {
        const { selectedState } = this.state;
        if (selectedState === undefined) {
            return "/us-state-topology.json";
        }

        return "/us-county-topology.json";
    };

    private getDataSource = () => {
        const { selectedState } = this.state;
        if (selectedState === undefined) {
            return CoronaService.getUnitedStatesData.frontend({});
        }

        return CoronaService.getStateData.frontend(selectedState);
    };

    private handleItemClick = (item: string) => {
        if (!isValidState(item)) {
            this.setState({ selectedState: undefined });
            return;
        }

        this.setState({ selectedState: item });
    };
}
