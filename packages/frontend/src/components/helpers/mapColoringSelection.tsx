import * as React from "react";
import { connect } from "react-redux";
import { Dispatch, bindActionCreators } from "redux";
import { Button, Popover } from "@blueprintjs/core";
import classNames from "classnames";
import { IMapColoring } from "../../typings/mapType";
import { IStoreState, SET_MAP_COLORING } from "../../store";
import styles from "./mapColoringSelection.module.scss";
import { MAP_COLORING_OPTIONS } from "../../constants";
import { IDeviceType, IDevice } from "../../typings";

interface IStateProps {
    deviceType: IDeviceType | undefined;
    mapColoring: IMapColoring;
}

interface IDispatchProps {
    setMapColoring: (newMapColoring: IMapColoring) => void;
}

type IProps = IStateProps & IDispatchProps;

function renderMapColoringOptions(
    mapColoring: IMapColoring,
    setMapColoring: (newMapColoring: IMapColoring) => void,
    deviceType: IDeviceType | undefined,
) {
    const setOption = (newColoring: IMapColoring) => () => setMapColoring(newColoring);

    return (
        <div className={styles.optionsContainer}>
            {MAP_COLORING_OPTIONS.map(option => (
                <div
                    className={classNames(styles.singleOption, { [styles.active]: option.label === mapColoring.label })}
                    onClick={setOption(option)}
                >
                    <span className={styles.title}>{option.label}</span>
                    {!IDevice.isMobile(deviceType) && <span>{option.description}</span>}
                </div>
            ))}
        </div>
    );
}

function UnconnectedMapColoringSelection(props: IProps) {
    const { deviceType, mapColoring, setMapColoring } = props;

    const getText = () => (!IDevice.isMobile(deviceType) ? `Color by the ${mapColoring.label}` : "");

    return (
        <div className={styles.mapColorContainer}>
            <Popover
                content={renderMapColoringOptions(mapColoring, setMapColoring, deviceType)}
                position={IDevice.isMobile(deviceType) ? "auto" : "left"}
            >
                <Button rightIcon="edit" text={getText()} minimal />
            </Popover>
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
