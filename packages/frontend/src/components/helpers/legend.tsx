import * as React from "react";
import { connect } from "react-redux";
import styles from "./legend.module.scss";
import { IMapColoring } from "../../typings/mapType";
import { IStoreState } from "../../store";
import { getNumberTextForLegend, getColors } from "../../utils";

interface IOwnProps {
    range: number[];
}

interface IStateProps {
    mapColoring: IMapColoring;
}

type IProps = IOwnProps & IStateProps;

function UnconnectedLegend(props: IProps) {
    const { mapColoring, range } = props;

    const { start, middle, end } = getColors(mapColoring);

    return (
        <div className={styles.legendContainer}>
            <div
                className={styles.legend}
                style={{ background: `linear-gradient(to right, ${start}, ${middle}, ${end})` }}
            />
            <div className={styles.legendTicks}>
                {range.map(num => (
                    <span key={num}>{getNumberTextForLegend(num)}</span>
                ))}
            </div>
        </div>
    );
}

function mapStateToProps(state: IStoreState): IStateProps {
    return {
        mapColoring: state.interface.mapColoring,
    };
}

export const Legend = connect(mapStateToProps)(UnconnectedLegend);
