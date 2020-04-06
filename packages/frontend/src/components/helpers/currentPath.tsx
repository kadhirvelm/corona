import * as React from "react";
import { Dispatch, bindActionCreators } from "redux";
import { connect } from "react-redux";
import { Icon, Button, Tooltip } from "@blueprintjs/core";
import classNames from "classnames";
import { IGeography, IDeviceType, IDevice } from "../../typings";
import { IStoreState, UPDATE_GEOGRAPHY } from "../../store";
import styles from "./currentPath.module.scss";
import { goToUserCounty } from "../../utils";

interface IStateProps {
    geography: IGeography;
    deviceType: IDeviceType | undefined;
}

interface IDispatchProps {
    updateGeography: (newGeography: IGeography) => void;
}

type IProps = IStateProps & IDispatchProps;

function renderBreadcrumb(text: string, onClick?: () => void, hasNext?: boolean) {
    return (
        <div
            className={classNames(styles.breadcrumb, { [styles.selectableBreadcrumb]: onClick !== undefined })}
            onClick={onClick}
        >
            {text} {hasNext && <Icon className={styles.breadcrumbIcon} icon="chevron-right" />}
        </div>
    );
}

function UnconnectedCurrentPath(props: IProps) {
    const { geography, deviceType, updateGeography } = props;

    const nationalBreadcrumb = renderBreadcrumb(
        "United States",
        () => updateGeography(IGeography.nationGeography()),
        true,
    );

    const goToMyCounty = () => goToUserCounty(updateGeography);

    const tooltipContet = (
        <div className={styles.goToMyCounty}>
            <span>Goes to your county, based on your browser&apos;s IP address.</span>
            <span className={styles.goToMyCountyMargin}>
                We use a public service from the FCC to locate this information. We do not store it or use the location
                information for anything.
            </span>
        </div>
    );

    if (IGeography.isNationGeography(geography)) {
        return (
            <div className={styles.nationalBreadcrumbContainer}>
                {renderBreadcrumb("United States")}
                <Tooltip
                    className={styles.goToMyCounty}
                    content={tooltipContet}
                    disabled={!IDevice.isBrowser(deviceType)}
                    position="right"
                >
                    <Button minimal icon="locate" onClick={goToMyCounty} text="My county" />
                </Tooltip>
            </div>
        );
    }

    const sharedClassName = classNames(styles.breadcrumbContainer);

    if (IGeography.isStateGeography(geography)) {
        return (
            <div className={sharedClassName}>
                <div className={styles.breadcrumbTopContainer}>{nationalBreadcrumb}</div>
                <div className={styles.breadcrumbBottomContainer}>{renderBreadcrumb(geography.name)}</div>
            </div>
        );
    }

    const getName = (name: string) => {
        if (name.length > 30) {
            return `${name.slice(0, 30)}…`;
        }

        return name;
    };

    return (
        <div className={sharedClassName}>
            <div className={styles.breadcrumbTopContainer}>
                {nationalBreadcrumb}
                {renderBreadcrumb(geography.stateGeography.name, () => updateGeography(geography.stateGeography), true)}
            </div>
            <div className={styles.breadcrumbBottomContainer}>{renderBreadcrumb(getName(geography.name))}</div>
        </div>
    );
}

function mapStateToProps(state: IStoreState): IStateProps {
    return {
        geography: state.interface.geography,
        deviceType: state.interface.deviceType,
    };
}

function mapDispatchToProps(dispatch: Dispatch): IDispatchProps {
    return bindActionCreators(
        {
            updateGeography: UPDATE_GEOGRAPHY.create,
        },
        dispatch,
    );
}

export const CurrentPath = connect(mapStateToProps, mapDispatchToProps)(UnconnectedCurrentPath);
