import * as React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { SET_DEEP_DIVE_FIPS_CODE } from "../store";
import styles from "./browser.module.scss";
import { VirusDataRenderer, DeepDivePanel, StatsPanel, BasicInfo } from "../components";

interface IDispatchProps {
    removeDeepDive: () => void;
}

type IProps = IDispatchProps;

class UnconnectedBrowser extends React.PureComponent<IProps> {
    public componentDidMount() {
        document.addEventListener("keydown", this.handleKeyDown);
    }

    public componentWillUnmount() {
        document.removeEventListener("keydown", this.handleKeyDown);
    }

    public render() {
        return (
            <>
                <div className={styles.panelContainer}>
                    <StatsPanel />
                    <DeepDivePanel />
                </div>
                <div className={styles.basicInfoContainer}>
                    <BasicInfo />
                </div>
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
        removeDeepDive: () => dispatch(SET_DEEP_DIVE_FIPS_CODE.create(undefined)),
    };
}

export const Browser = connect(undefined, mapDispatchToProps)(UnconnectedBrowser);
