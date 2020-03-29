import { CoronaService } from "@corona/api";
import * as React from "react";
import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";
import { VirusDataRenderer, StatsPanel } from "./components";
import { ADD_DATA } from "./store";
import { IDataEntry } from "./typings";
import { DEFAULT_DATA_KEY } from "./common";

interface IDispatchProps {
    addData: (dataEntry: IDataEntry) => void;
}

type IProps = IDispatchProps;

async function getUnitedStatesData(addData: (dataEntry: IDataEntry) => void) {
    const data = await CoronaService.getUnitedStatesData.frontend({});
    addData({ key: DEFAULT_DATA_KEY, data });
}

function UnconnectedMainApplication(props: IProps) {
    React.useEffect(() => {
        const { addData } = props;
        getUnitedStatesData(addData);
    }, []);

    return (
        <>
            <StatsPanel />
            <VirusDataRenderer />
        </>
    );
}

function mapDispatchToProps(dispatch: Dispatch): IDispatchProps {
    return bindActionCreators({ addData: ADD_DATA.create }, dispatch);
}

export const MainApplication = connect(undefined, mapDispatchToProps)(UnconnectedMainApplication);
