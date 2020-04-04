import { ICoronaDataPoint, ICoronaDatapointTimeseriesDatapoint } from "@corona/api";
import * as React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { Button, NonIdealState } from "@blueprintjs/core";
import { Transitioner } from "../../common";
import { IStoreState, maybeGetDataForDeepDiveFips, SET_DEEP_DIVE_FIPS_CODE } from "../../store";
import styles from "./growthCurve.module.scss";
import { Timeseries } from "../visualization";

interface IStateProps {
    deepDiveInfo: ICoronaDataPoint | undefined;
}

interface IDispatchProps {
    closeDeepDiveInfo: () => void;
}

type IProps = IStateProps & IDispatchProps;

function maybeRenderGrowthCurve(
    timeseries: { [date: string]: ICoronaDatapointTimeseriesDatapoint } | undefined,
    fipsCode?: string,
) {
    if (timeseries === undefined) {
        return <NonIdealState description="No timeseries data available" />;
    }

    return <Timeseries key={fipsCode} timeseries={timeseries} />;
}

function renderTitle(county?: string, state?: string) {
    if (county !== undefined) {
        return `${county} growth curves`;
    }

    if (state !== undefined && state !== "") {
        return `${state} growth curves`;
    }

    return "USA growth curves";
}

function UnconnectedGrowthCurve(props: IProps) {
    const { closeDeepDiveInfo, deepDiveInfo } = props;

    return (
        <div className={styles.internalContainer}>
            <Transitioner<ICoronaDataPoint | undefined>
                show={deepDiveInfo !== undefined}
                transitionProps={deepDiveInfo}
            >
                {deepDiveInfoCopy => (
                    <div className={styles.deepDiveContainer}>
                        <div className={styles.title}>
                            {renderTitle(deepDiveInfoCopy?.county, deepDiveInfoCopy?.state)}
                            <Button icon="cross" minimal onClick={closeDeepDiveInfo} />
                        </div>
                        {maybeRenderGrowthCurve(deepDiveInfoCopy?.timeseries, deepDiveInfoCopy?.fipsCode)}
                    </div>
                )}
            </Transitioner>
        </div>
    );
}

function mapStateToProps(state: IStoreState): IStateProps {
    return {
        deepDiveInfo: maybeGetDataForDeepDiveFips(state),
    };
}

function mapDispatchToProps(dispatch: Dispatch): IDispatchProps {
    return {
        closeDeepDiveInfo: () => dispatch(SET_DEEP_DIVE_FIPS_CODE.create(undefined)),
    };
}

export const GrowthCurve = connect(mapStateToProps, mapDispatchToProps)(UnconnectedGrowthCurve);
