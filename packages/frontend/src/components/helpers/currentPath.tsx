import * as React from "react";
import { Dispatch, bindActionCreators } from "redux";
import { connect } from "react-redux";
import { Icon } from "@blueprintjs/core";
import classNames from "classnames";
import { IGeography } from "../../typings";
import { IStoreState, UPDATE_GEOGRAPHY } from "../../store";
import styles from "./currentPath.module.scss";

interface IStateProps {
    geography: IGeography;
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
    const { geography, updateGeography } = props;

    const nationalBreadcrumb = renderBreadcrumb(
        "United States",
        () => updateGeography(IGeography.nationGeography()),
        true,
    );

    if (IGeography.isNationGeography(geography)) {
        return (
            <div className={classNames(styles.breadcrumbContainer, styles.breadcrumbBottomContainer)}>
                {renderBreadcrumb("United States")}
            </div>
        );
    }

    if (IGeography.isStateGeography(geography)) {
        return (
            <div className={styles.breadcrumbContainer}>
                <div className={styles.breadcrumbTopContainer}>{nationalBreadcrumb}</div>
                <div className={styles.breadcrumbBottomContainer}>{renderBreadcrumb(geography.name)}</div>
            </div>
        );
    }

    return (
        <div className={styles.breadcrumbContainer}>
            <div className={styles.breadcrumbTopContainer}>
                {nationalBreadcrumb}
                {renderBreadcrumb(geography.stateGeography.name, () => updateGeography(geography.stateGeography), true)}
            </div>
            <div className={styles.breadcrumbBottomContainer}>{renderBreadcrumb(geography.name)}</div>
        </div>
    );
}

function mapStateToProps(state: IStoreState): IStateProps {
    return {
        geography: state.interface.geography,
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
