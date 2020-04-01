import * as React from "react";
import { ICoronaDataPoint } from "@corona/api";
import { connect } from "react-redux";
import { IStoreState, maybeGetDataForHighlightedFips } from "../../store";
import styles from "./highlightedFipsInfo.module.scss";
import { Transitioner } from "../../common";

interface IStateProps {
    highlightedInfo: ICoronaDataPoint | undefined;
}

type IProps = IStateProps;

function maybeGetDateString(date?: Date) {
    if (date === undefined) {
        return "No timestamp available";
    }

    return new Intl.DateTimeFormat("en-US", {
        year: "2-digit",
        month: "numeric",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
    }).format(new Date(date));
}

function renderLastUpdated(date: Date | undefined) {
    return (
        <div className={styles.dateInfo}>
            <div className={styles.dateLabel}>Last updated</div>
            <div className={styles.dateValue}>{maybeGetDateString(date)}</div>
        </div>
    );
}

function renderSingleLabel(label: string, value?: string) {
    return (
        <div className={styles.info}>
            <div className={styles.label}>{label}</div>
            <div className={styles.connector} />
            <div className={styles.value}>{value ?? "No data"}</div>
        </div>
    );
}

function maybeRenderPopulationPercent(totalCases?: number, population?: number) {
    if (totalCases === undefined || population === undefined) {
        return null;
    }

    return renderSingleLabel("Infection rate", `${Math.abs((totalCases / population) * 100).toFixed(3)}%`);
}

function UnconnectedHighlightedFipsInfo(props: IProps) {
    const { highlightedInfo } = props;

    const [temporaryCopy, setTemporaryCopy] = React.useState<ICoronaDataPoint | undefined>(undefined);

    React.useEffect(() => {
        if (props.highlightedInfo === undefined) {
            return;
        }

        setTemporaryCopy(props.highlightedInfo);
    }, [highlightedInfo]);

    const finalHighlightedInfo = highlightedInfo ?? temporaryCopy;

    return (
        <div className={styles.internalContainer}>
            <Transitioner className={styles.transitioner} show={highlightedInfo !== undefined}>
                <div className={styles.hoverInfo}>
                    <div className={styles.title}>
                        {finalHighlightedInfo?.county ?? finalHighlightedInfo?.state ?? "None selected"}
                    </div>
                    <div className={styles.infoContainer}>
                        {renderSingleLabel("Total", finalHighlightedInfo?.totalCases.toLocaleString())}
                        {renderSingleLabel("Recovered", finalHighlightedInfo?.recovered?.toLocaleString())}
                        {renderSingleLabel("Active", finalHighlightedInfo?.activeCases?.toLocaleString())}
                        {renderSingleLabel("Deaths", finalHighlightedInfo?.deaths?.toLocaleString())}
                        {renderSingleLabel("Population", finalHighlightedInfo?.population?.toLocaleString())}
                        {maybeRenderPopulationPercent(
                            finalHighlightedInfo?.totalCases,
                            finalHighlightedInfo?.population,
                        )}
                        {renderLastUpdated(finalHighlightedInfo?.lastUpdated)}
                    </div>
                </div>
            </Transitioner>
        </div>
    );
}

function mapStateToProps(state: IStoreState): IStateProps {
    return {
        highlightedInfo: maybeGetDataForHighlightedFips(state),
    };
}

export const HighlightedFipsInfo = connect(mapStateToProps)(UnconnectedHighlightedFipsInfo);
