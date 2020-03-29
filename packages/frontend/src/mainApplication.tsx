import { CoronaService } from "@corona/api";
import * as React from "react";
import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";
import { VirusDataRenderer } from "./components/virusData";
import { ADD_DATA } from "./store";
import { IDataEntry } from "./typings/data";
import { DEFAULT_DATA_KEY } from "./common/constants";

interface IDispatchProps {
    addData: (dataEntry: IDataEntry) => void;
}

type IProps = IDispatchProps;

async function getUnitedStatesData(addData: (dataEntry: IDataEntry) => void) {
    console.log("FETCHIN US DATA");
    const data = await CoronaService.getUnitedStatesData.frontend({});
    addData({ key: DEFAULT_DATA_KEY, data });
}

function UnconnectedMainApplication(props: IProps) {
    React.useEffect(() => {
        const { addData } = props;
        getUnitedStatesData(addData);
    }, []);

    return <VirusDataRenderer />;
}

function mapDispatchToProps(dispatch: Dispatch): IDispatchProps {
    return bindActionCreators({ addData: ADD_DATA.create }, dispatch);
}

export const MainApplication = connect(undefined, mapDispatchToProps)(UnconnectedMainApplication);
