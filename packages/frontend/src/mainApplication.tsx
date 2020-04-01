import { CoronaService } from "@corona/api";
import * as React from "react";
import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";
import { VirusDataRenderer, Panels } from "./components";
import { ADD_DATA, SET_DEEP_DIVE_FIPS_CODE } from "./store";
import { IDataEntry } from "./typings";
import { DEFAULT_DATA_KEY } from "./common";

interface IDispatchProps {
    addData: (dataEntry: IDataEntry) => void;
    removeDeepDive: () => void;
}

type IProps = IDispatchProps;

async function getUnitedStatesData(addData: (dataEntry: IDataEntry) => void) {
    const data = await CoronaService.getUnitedStatesData.frontend({});
    addData({ key: DEFAULT_DATA_KEY, data });
}

class UnconnectedMainApplication extends React.PureComponent<IProps> {
    public componentDidMount() {
        const { addData } = this.props;
        getUnitedStatesData(addData);

        document.addEventListener("keydown", this.handleKeyDown);
    }

    public componentWillUnmount() {
        document.removeEventListener("keydown", this.handleKeyDown);
    }

    public render() {
        return (
            <>
                <Panels />
                <VirusDataRenderer />
            </>
        );
    }

    private handleKeyDown = (event: KeyboardEvent) => {
        const { removeDeepDive } = this.props;

        if (event.keyCode === 27) {
            removeDeepDive();
        }
    };
}

function mapDispatchToProps(dispatch: Dispatch): IDispatchProps {
    return {
        ...bindActionCreators({ addData: ADD_DATA.create }, dispatch),
        removeDeepDive: () => dispatch(SET_DEEP_DIVE_FIPS_CODE.create(undefined)),
    };
}

export const MainApplication = connect(undefined, mapDispatchToProps)(UnconnectedMainApplication);
