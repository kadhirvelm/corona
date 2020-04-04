import { debounce } from "lodash-es";
import * as React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { v4 } from "uuid";
import { BasicInfo, BreakdownList, GrowthCurve, VirusDataRenderer } from "../components";
import { SET_DEEP_DIVE_FIPS_CODE } from "../store";
import styles from "./browser.module.scss";

interface IDispatchProps {
    removeDeepDive: () => void;
}

type IProps = IDispatchProps;

interface IState {
    resizeId: string;
}

class UnconnectedBrowser extends React.PureComponent<IProps, IState> {
    public state: IState = {
        resizeId: v4(),
    };

    private debounceResize: () => void;

    public constructor(props: IProps, context: any) {
        super(props, context);
        this.debounceResize = debounce(this.handleResize, 500);
    }

    public componentDidMount() {
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
            <div className={styles.browserContainer} key={resizeId}>
                <div className={styles.panelContainer}>
                    <BreakdownList />
                    <GrowthCurve />
                </div>
                <div className={styles.basicInfoContainer}>
                    <BasicInfo />
                </div>
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
        removeDeepDive: () => dispatch(SET_DEEP_DIVE_FIPS_CODE.create(undefined)),
    };
}

export const Browser = connect(undefined, mapDispatchToProps)(UnconnectedBrowser);
