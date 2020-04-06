import { InputGroup, Icon } from "@blueprintjs/core";
import { ICoronaBreakdown, ICoronaDataPoint } from "@corona/api";
import classNames from "classnames";
import * as React from "react";
import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";
import { getDataBreakdown, IStoreState, maybeGetDataForGeography, UPDATE_GEOGRAPHY } from "../../store";
import { IDataBreakdown, IGeography } from "../../typings";
import styles from "./breakdownList.module.scss";
import { IMapColoring } from "../../typings/mapType";

interface IStateProps {
    geography: IGeography;
    data: ICoronaBreakdown | undefined;
    dataBreakdown: IDataBreakdown[];
    mapColoring: IMapColoring;
}

interface IDispatchProps {
    backToNation: () => void;
    updateGeography: (geography: IGeography) => void;
}

type IProps = IStateProps & IDispatchProps;

function renderDataBreakdown(dataBreakdown: IDataBreakdown[], dataBreakdownProps: IProps) {
    const { geography, mapColoring, updateGeography } = dataBreakdownProps;

    const handleClick = (dataPoint: ICoronaDataPoint) => () => {
        if (IGeography.isNationGeography(geography) && geography.fipsCode !== dataPoint.fipsCode) {
            updateGeography(
                IGeography.stateGeography({
                    fipsCode: dataPoint.fipsCode,
                    name: dataPoint.state ?? "Unknown state",
                }),
            );
        }

        if (IGeography.isStateGeography(geography) && geography.fipsCode !== dataPoint.fipsCode) {
            updateGeography(
                IGeography.countyGeography({
                    countyStateGeography: geography,
                    fipsCode: dataPoint.fipsCode,
                    name: dataPoint.county ?? "Unknown county",
                }),
            );
        }

        if (IGeography.isCountyGeography(geography) && geography.fipsCode !== dataPoint.fipsCode) {
            updateGeography(
                IGeography.countyGeography({
                    countyStateGeography: geography.stateGeography,
                    fipsCode: dataPoint.fipsCode,
                    name: dataPoint.county ?? "Unknown county",
                }),
            );
        }
    };

    return (
        <div className={classNames(styles.caseBreakdownContainer)}>
            {dataBreakdown.map(breakdown => (
                <div
                    className={classNames(styles.singleBreakdown, {
                        [styles.isOpen]: geography.fipsCode === breakdown.dataPoint.fipsCode,
                    })}
                    onClick={handleClick(breakdown.dataPoint)}
                >
                    <span>{breakdown.name}</span>
                    <span className={styles.totalCasesColumn}>
                        {mapColoring.getDataPoint(breakdown.dataPoint).toLocaleString()}
                    </span>
                </div>
            ))}
        </div>
    );
}

interface ISortMethod {
    field: "number" | "name";
    ascOrDesc: "asc" | "desc";
    sort: (a: IDataBreakdown, b: IDataBreakdown, getNumber: (dataPoint: ICoronaDataPoint) => number) => number;
}

interface ISortMethods {
    number: {
        asc: ISortMethod;
        desc: ISortMethod;
    };
    name: {
        asc: ISortMethod;
        desc: ISortMethod;
    };
}

const SORT_METHODS: ISortMethods = {
    number: {
        asc: {
            field: "number",
            ascOrDesc: "asc",
            sort: (a: IDataBreakdown, b: IDataBreakdown, getNumber: (dataPoint: ICoronaDataPoint) => number) =>
                getNumber(a.dataPoint) > getNumber(b.dataPoint) ? 1 : -1,
        },
        desc: {
            field: "number",
            ascOrDesc: "desc",
            sort: (a: IDataBreakdown, b: IDataBreakdown, getNumber: (dataPoint: ICoronaDataPoint) => number) =>
                getNumber(a.dataPoint) > getNumber(b.dataPoint) ? -1 : 1,
        },
    },
    name: {
        asc: {
            field: "name",
            ascOrDesc: "asc",
            sort: (a: IDataBreakdown, b: IDataBreakdown) => a.name.localeCompare(b.name),
        },
        desc: {
            field: "name",
            ascOrDesc: "desc",
            sort: (a: IDataBreakdown, b: IDataBreakdown) => b.name.localeCompare(a.name),
        },
    },
};

function maybeRenderIconForSort(sortMethod: "number" | "name", currentSortMethod: ISortMethod) {
    if (currentSortMethod.field !== sortMethod) {
        return null;
    }

    if (currentSortMethod.field === "number") {
        return (
            <Icon className={styles.sortIcon} icon={currentSortMethod.ascOrDesc === "asc" ? "sort-asc" : "sort-desc"} />
        );
    }

    return (
        <Icon
            className={styles.sortIcon}
            icon={currentSortMethod.ascOrDesc === "asc" ? "sort-alphabetical" : "sort-alphabetical-desc"}
        />
    );
}

function UnconnectedBreakdownList(props: IProps) {
    const { data, dataBreakdown, mapColoring } = props;

    const [filter, setFilter] = React.useState("");
    const [sortMethod, setSortMethod] = React.useState<ISortMethod>(SORT_METHODS.number.desc);

    if (data === undefined) {
        return <div className={styles.breakdownListContainer} />;
    }

    const updateFilterValue = (event: React.ChangeEvent<HTMLInputElement>) => setFilter(event.currentTarget.value);

    const updateSort = (typeOfSort: "number" | "name") => () => {
        if (sortMethod.field === typeOfSort) {
            setSortMethod(
                sortMethod.ascOrDesc === "asc" ? SORT_METHODS[typeOfSort].desc : SORT_METHODS[typeOfSort].asc,
            );
        } else if (sortMethod.field === "number") {
            setSortMethod(SORT_METHODS.name.asc);
        } else {
            setSortMethod(SORT_METHODS.number.desc);
        }
    };

    return (
        <div className={styles.breakdownListContainer}>
            <div className={styles.filterContainer}>
                <InputGroup leftIcon="search" onChange={updateFilterValue} value={filter} />
                <div className={styles.columnHeaders}>
                    <div className={styles.sortContainer} onClick={updateSort("name")}>
                        Name{maybeRenderIconForSort("name", sortMethod)}
                    </div>
                    <div className={styles.sortContainer} onClick={updateSort("number")}>
                        {mapColoring.label}
                        {maybeRenderIconForSort("number", sortMethod)}
                    </div>
                </div>
            </div>
            {renderDataBreakdown(
                dataBreakdown
                    .sort((a, b) => sortMethod.sort(a, b, mapColoring.getDataPoint))
                    .filter(breakdown => breakdown.name.toLowerCase().includes(filter.toLowerCase())),
                props,
            )}
        </div>
    );
}

function mapStateToProps(state: IStoreState): IStateProps {
    return {
        geography: state.interface.geography,
        data: maybeGetDataForGeography(state),
        dataBreakdown: getDataBreakdown(state),
        mapColoring: state.interface.mapColoring,
    };
}

function mapDispatchToProps(dispatch: Dispatch): IDispatchProps {
    return {
        ...bindActionCreators(
            {
                updateGeography: UPDATE_GEOGRAPHY.create,
            },
            dispatch,
        ),
        backToNation: () => dispatch(UPDATE_GEOGRAPHY.create(IGeography.nationGeography())),
    };
}

export const BreakdownList = connect(mapStateToProps, mapDispatchToProps)(UnconnectedBreakdownList);
