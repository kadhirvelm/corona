import * as React from "react";
import { connect } from "react-redux";
import { Dispatch, bindActionCreators } from "redux";
import { Button, Popover } from "@blueprintjs/core";
import classNames from "classnames";
import { IMapColoring } from "../../typings/mapType";
import { IStoreState, SET_MAP_COLORING } from "../../store";
import styles from "./mapColoringSelection.module.scss";
import { MAP_COLORING_OPTIONS } from "../../constants";

interface IStateProps {
    mapColoring: IMapColoring;
}

interface IDispatchProps {
    setMapColoring: (newMapColoring: IMapColoring) => void;
}

type IProps = IStateProps & IDispatchProps;

function renderMapColoringOptions(mapColoring: IMapColoring, setMapColoring: (newMapColoring: IMapColoring) => void) {
    const setOption = (newColoring: IMapColoring) => () => setMapColoring(newColoring);

    return (
        <div className={styles.optionsContainer}>
            {MAP_COLORING_OPTIONS.map(option => (
                <div
                    className={classNames(styles.singleOption, { [styles.active]: option.label === mapColoring.label })}
                    onClick={setOption(option)}
                >
                    <span className={styles.title}>{option.label}</span>
                    <span>{option.description}</span>
                </div>
            ))}
        </div>
    );
}

function UnconnectedMapColoringSelection(props: IProps) {
    const { mapColoring, setMapColoring } = props;

    return (
        <div className={styles.mapColorContainer}>
            <Popover content={renderMapColoringOptions(mapColoring, setMapColoring)} position="left">
                <Button rightIcon="edit" text={`Color by the ${mapColoring.label}`} minimal />
            </Popover>
        </div>
    );
}

function mapStateToProps(state: IStoreState): IStateProps {
    return {
        mapColoring: state.interface.mapColoring,
    };
}

function mapDispatchToProps(dispatch: Dispatch): IDispatchProps {
    return bindActionCreators({ setMapColoring: SET_MAP_COLORING.create }, dispatch);
}

export const MapColoringSelection = connect(mapStateToProps, mapDispatchToProps)(UnconnectedMapColoringSelection);
