import * as React from "react";
import { IProjectionPoint, PROJECTION, ProjectionService, IIntervention, ISingleProjectionMeasure } from "@corona/api";
import { Dispatch, bindActionCreators } from "redux";
import { connect } from "react-redux";
import { isValidProjection } from "@corona/utils";
import { Spinner, NonIdealState, Icon } from "@blueprintjs/core";
import classNames from "classnames";
import { IStoreState, ADD_PROJECTION_DATA, maybeGetProjectionData } from "../../store";
import { IGeography } from "../../typings";
import { getDateString, getGeograhyTitle, PARSE_TIME } from "../../utils";
import styles from "./projections.module.scss";

interface IStateProps {
    geography: IGeography;
    projection: IProjectionPoint | undefined;
}

interface IDispatchProps {
    addProjectionData: (newData: { projection: PROJECTION; data: IProjectionPoint }) => void;
}

type IProps = IStateProps & IDispatchProps;

async function getProjectionData(
    projectionName: PROJECTION,
    addProjectionData: (newData: { projection: PROJECTION; data: IProjectionPoint }) => void,
    setIsLoading: (isLoading: boolean) => void,
) {
    setIsLoading(true);
    const projectionData = await ProjectionService.getProjection.frontend(projectionName);
    setIsLoading(false);

    addProjectionData({ projection: projectionName, data: projectionData });
}

function maybeRenderCheck(totalNumber: number | undefined, measureName: string) {
    if (totalNumber === undefined || !measureName.endsWith("shortage")) {
        return null;
    }

    return totalNumber <= 0 ? (
        <Icon className={classNames(styles.icon, styles.green)} icon="thumbs-up" />
    ) : (
        <Icon className={classNames(styles.icon, styles.red)} icon="thumbs-down" />
    );
}

function maybeRenderNumber(totalNumber: number | undefined) {
    if (totalNumber === undefined) {
        return null;
    }

    return `at ${totalNumber.toLocaleString()}`;
}

function renderProjections(projections: { [measureName: string]: ISingleProjectionMeasure }) {
    const measures = Object.keys(projections);
    if (measures.length === 0) {
        return <NonIdealState description="No projections" />;
    }

    return (
        <div className={styles.projectionsDataContainer}>
            {measures
                .sort((a, b) => (projections[a].priority > projections[b].priority ? 1 : -1))
                .map(measureName => {
                    const totalNumber =
                        measureName !== "Overall resource usage" ? projections[measureName].peak_number : undefined;

                    return (
                        <div className={styles.singleProjectionContainer}>
                            <div className={styles.upperText}>{measureName}</div>
                            <div className={styles.bottomText}>
                                <span className={styles.spacingForDate}>
                                    will peak on {getDateString(PARSE_TIME(projections[measureName].peak ?? ""))}
                                </span>
                                <span>
                                    {maybeRenderNumber(totalNumber)}
                                    {maybeRenderCheck(totalNumber, measureName)}
                                </span>
                            </div>
                        </div>
                    );
                })}
        </div>
    );
}

function maybeRenderIcon(measureDescription: string) {
    if (measureDescription === "People instructed to stay at home") {
        return <Icon className={styles.descriptionIcon} icon="home" />;
    }

    if (measureDescription === "Educational facilities closed") {
        return <Icon className={styles.descriptionIcon} icon="learning" />;
    }

    if (measureDescription === "Non-essential services closed (i.e., bars/restaurants)") {
        return <Icon className={styles.descriptionIcon} icon="office" />;
    }

    if (measureDescription === "Travel severely limited") {
        return <Icon className={styles.descriptionIcon} icon="airplane" />;
    }

    return null;
}

function renderInterventions(interventions: IIntervention[], geography: IGeography) {
    const title = getGeograhyTitle(geography);

    if (interventions.length === 0) {
        return null;
    }

    return (
        <div className={styles.interventionsContainer}>
            <div className={styles.interventionsTitle}>{title} wide interventions</div>
            {interventions.map(intervention => (
                <div className={styles.singleInterventionContainer}>
                    <div className={styles.description}>
                        {maybeRenderIcon(intervention.measureDescription)}
                        {intervention.measureDescription}
                    </div>
                    <div className={styles.date}>Enacted on: {getDateString(PARSE_TIME(intervention.date))}</div>
                </div>
            ))}
        </div>
    );
}

function UnconnectedProjections(props: IProps) {
    const { addProjectionData, geography, projection } = props;

    const [isLoading, setIsLoading] = React.useState(false);

    React.useEffect(() => {
        if (projection !== undefined) {
            return;
        }

        if (IGeography.isNationGeography(geography)) {
            getProjectionData(PROJECTION.UNITED_STATES, addProjectionData, setIsLoading);
            return;
        }

        if (IGeography.isStateGeography(geography) && isValidProjection(geography.name)) {
            getProjectionData(geography.name, addProjectionData, setIsLoading);
        }
    }, [geography]);

    if (projection === undefined && !isLoading) {
        return (
            <NonIdealState
                className={styles.nonIdealState}
                description="No projection data found. Please note we currently do not have projection data for counties"
            />
        );
    }

    if (isLoading) {
        return <Spinner className={styles.spinner} size={Spinner.SIZE_SMALL} />;
    }

    return (
        <div className={classNames(styles.projectionContainer)}>
            {renderProjections(projection?.projections ?? {})}
            {renderInterventions(projection?.interventions ?? [], geography)}
        </div>
    );
}

function mapStateToProps(state: IStoreState): IStateProps {
    return {
        geography: state.interface.geography,
        projection: maybeGetProjectionData(state),
    };
}

function mapDispatchToProps(dispatch: Dispatch): IDispatchProps {
    return bindActionCreators({ addProjectionData: ADD_PROJECTION_DATA.create }, dispatch);
}

export const Projections = connect(mapStateToProps, mapDispatchToProps)(UnconnectedProjections);
