import { CoronaService, STATE } from "@corona/api";
import * as React from "react";
import { isValidState } from "@corona/utils";
import { VirusDataRenderer } from "./components/virusData";
import { IGeographyKind } from "../typings/map";

export function MainApplication() {
    const [selectedState, setState] = React.useState<STATE | undefined>(undefined);

    const getDataSource = () =>
        selectedState === undefined
            ? CoronaService.getUnitedStatesData.frontend({})
            : CoronaService.getStateData.frontend(selectedState);

    const getGeography = (): IGeographyKind => (selectedState === undefined ? "states" : "counties");

    const handleItemClick = (item: string) => setState(isValidState(item) ? item : undefined);

    return (
        <VirusDataRenderer
            getData={getDataSource}
            geography={getGeography()}
            key={selectedState ?? "USA"}
            onItemClick={handleItemClick}
        />
    );
}
