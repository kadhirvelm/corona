import { CoronaService } from "@corona/api";
import * as React from "react";
import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";
import { debounce } from "lodash-es";
import { v4 } from "uuid";
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

interface IState {
    resizeId: string;
}

class UnconnectedMainApplication extends React.PureComponent<IProps, IState> {
    public state: IState = {
        resizeId: v4(),
    };

    private debounceResize: () => void;

    public constructor(props: IProps, context: any) {
        super(props, context);
        this.debounceResize = debounce(this.handleResize, 500);
    }

    public componentDidMount() {
        const { addData } = this.props;
        getUnitedStatesData(addData);

        document.addEventListener("keydown", this.handleKeyDown);
        window.addEventListener("resize", this.debounceResize);
    }

    public componentWillUnmount() {
        document.removeEventListener("keydown", this.handleKeyDown);
        window.removeEventListener("resize", this.debounceResize);
    }

    public render() {
        const { resizeId } = this.state;

        return (
            <div key={resizeId}>
                <Panels />
                <VirusDataRenderer />
            </div>
        );
    }

    private handleKeyDown = (event: KeyboardEvent) => {
        const { removeDeepDive } = this.props;

        if (event.keyCode === 27) {
            removeDeepDive();
        }
    };

    private handleResize = () => this.setState({ resizeId: v4() });
}

function mapDispatchToProps(dispatch: Dispatch): IDispatchProps {
    return {
        ...bindActionCreators({ addData: ADD_DATA.create }, dispatch),
        removeDeepDive: () => dispatch(SET_DEEP_DIVE_FIPS_CODE.create(undefined)),
    };
}

export const MainApplication = connect(undefined, mapDispatchToProps)(UnconnectedMainApplication);
