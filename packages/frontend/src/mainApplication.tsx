import { CoronaService, STATE } from "@corona/api";
import * as React from "react";
import { isValidState } from "@corona/utils";
import { VirusDataRenderer } from "./components/virusData";
import { IFeatureSeletion, IGeographyKind, stateGeography, countyGeography } from "../typings/map";

interface IStateFeatureSelection extends IFeatureSeletion {
    name: STATE;
}

function isStateFeatureSelection(selection: IFeatureSeletion): selection is IStateFeatureSelection {
    return isValidState(selection.name);
}

export function MainApplication() {
    const [selectedState, setState] = React.useState<IStateFeatureSelection | undefined>(undefined);

    const getDataSource = () =>
        selectedState === undefined
            ? CoronaService.getUnitedStatesData.frontend({})
            : CoronaService.getStateData.frontend(selectedState.name);

    const getGeography = (): IGeographyKind =>
        selectedState === undefined ? stateGeography() : countyGeography(selectedState.fipsCode);

    const handleItemClick = (seletion: IFeatureSeletion) => {
        setState(isStateFeatureSelection(seletion) ? seletion : undefined);
    };

    return <VirusDataRenderer getData={getDataSource} geography={getGeography()} onItemClick={handleItemClick} />;
}
