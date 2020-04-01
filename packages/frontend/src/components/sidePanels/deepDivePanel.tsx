import { ICoronaDataPoint, ICoronaDatapointTimeseriesDatapoint } from "@corona/api";
import * as React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { Button } from "@blueprintjs/core";
import { Transitioner } from "../../common";
import { IStoreState, maybeGetDataForDeepDiveFips, SET_DEEP_DIVE_FIPS_CODE } from "../../store";
import styles from "./deepDivePanel.module.scss";
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
        return <div>No timeseries data available</div>;
    }

    return <Timeseries key={fipsCode} timeseries={timeseries} />;
}

function renderTitle(county?: string, state?: string) {
    if (county !== undefined) {
        return `${county} County growth curves`;
    }

    if (state !== undefined && state !== "") {
        return `${state} growth curves`;
    }

    return "USA growth curves";
}

function UnconnectedDeepDivePanel(props: IProps) {
    const [temporaryCopy, setTemporaryCopy] = React.useState<ICoronaDataPoint | undefined>(undefined);

    const { closeDeepDiveInfo, deepDiveInfo } = props;

    React.useEffect(() => {
        if (props.deepDiveInfo === undefined) {
            return;
        }

        setTemporaryCopy(props.deepDiveInfo);
    }, [deepDiveInfo]);

    const deepDiveInfoFinal = deepDiveInfo ?? temporaryCopy;

    return (
        <div className={styles.internalContainer}>
            <Transitioner show={deepDiveInfo !== undefined}>
                <div className={styles.deepDiveContainer}>
                    <div className={styles.title}>
                        {renderTitle(deepDiveInfoFinal?.county, deepDiveInfoFinal?.state)}
                        <Button icon="cross" minimal onClick={closeDeepDiveInfo} />
                    </div>
                    {maybeRenderGrowthCurve(deepDiveInfoFinal?.timeseries, deepDiveInfoFinal?.fipsCode)}
                </div>
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

export const DeepDivePanel = connect(mapStateToProps, mapDispatchToProps)(UnconnectedDeepDivePanel);
