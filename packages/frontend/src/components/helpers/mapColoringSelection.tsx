import classNames from "classnames";
import * as React from "react";
import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";
import { Tooltip } from "@blueprintjs/core";
import { MAP_COLORING_OPTIONS } from "../../constants";
import { IStoreState, SET_MAP_COLORING } from "../../store";
import { IDevice, IDeviceType } from "../../typings";
import { IMapColoring } from "../../typings/mapType";
import styles from "./mapColoringSelection.module.scss";

interface IStateProps {
    deviceType: IDeviceType | undefined;
    mapColoring: IMapColoring;
}

interface IDispatchProps {
    setMapColoring: (newMapColoring: IMapColoring) => void;
}

type IProps = IStateProps & IDispatchProps;

function UnconnectedMapColoringSelection(props: IProps) {
    const { deviceType, mapColoring, setMapColoring } = props;

    const setOption = (newColoring: IMapColoring) => () => setMapColoring(newColoring);

    return (
        <div className={styles.mapColorContainer}>
            {MAP_COLORING_OPTIONS.map(option => (
                <Tooltip content={option.description} disabled={!IDevice.isBrowser(deviceType)} hoverOpenDelay={500}>
                    <div
                        className={classNames(styles.singleOption, {
                            [styles.active]: option.label === mapColoring.label,
                        })}
                        onClick={setOption(option)}
                    >
                        <span className={styles.title}>{option.label}</span>
                    </div>
                </Tooltip>
            ))}
        </div>
    );
}

function mapStateToProps(state: IStoreState): IStateProps {
    return {
        deviceType: state.interface.deviceType,
        mapColoring: state.interface.mapColoring,
    };
}

function mapDispatchToProps(dispatch: Dispatch): IDispatchProps {
    return bindActionCreators({ setMapColoring: SET_MAP_COLORING.create }, dispatch);
}

export const MapColoringSelection = connect(mapStateToProps, mapDispatchToProps)(UnconnectedMapColoringSelection);
