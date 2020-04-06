import * as React from "react";
import { Tabs, Tab } from "@blueprintjs/core";
import { connect } from "react-redux";
import { CurrentPath } from "../helpers";
import { BreakdownList } from "./breakdownList";
import { Stats } from "./stats";
import styles from "./panelContainer.module.scss";
import { IStoreState } from "../../store";
import { IGeography, IDevice, IDeviceType } from "../../typings";
import { Projections } from "./projections";
import { Exploration } from "./exploration";

interface IStateProps {
    deviceType: IDeviceType | undefined;
    geography: IGeography;
}

type IProps = IStateProps;

type IValidTabs = "stats" | "projections" | "list";

function UnconnectedPanelContainer(props: IProps) {
    const { deviceType, geography } = props;

    const [tabId, setTabId] = React.useState<IValidTabs>("list");

    React.useEffect(() => {
        if (IGeography.isNationGeography(geography)) {
            setTabId("list");
        } else {
            setTabId("stats");
        }
    }, [geography]);

    const updateTab = (newTabId: IValidTabs) => setTabId(newTabId);

    const typeOfStats = () => {
        return IGeography.visit(geography, {
            nation: () => "US",
            state: s => s.name,
            county: () => "County",
        });
    };

    const typeOfList = () => {
        return IGeography.visit(geography, {
            nation: () => "States",
            state: () => "Counties",
            county: c => `${c.stateGeography.name} Counties`,
        });
    };

    return (
        <div className={styles.panelContainer}>
            <CurrentPath />
            <Tabs
                className={styles.tabs}
                id="main-tab-container"
                onChange={updateTab}
                renderActiveTabPanelOnly
                selectedTabId={tabId}
            >
                <Tab id="stats" title={`${typeOfStats()} Stats`} panel={<Stats />} />
                <Tab
                    id="projections"
                    disabled={IGeography.isCountyGeography(geography)}
                    title={`${typeOfStats()} Projections`}
                    panel={<Projections />}
                />
                <Tab
                    id="exploration"
                    disabled={!IDevice.isBrowser(deviceType)}
                    title="Exploration"
                    panel={<Exploration />}
                />
                <Tab id="list" title={`${typeOfList()} List`} panel={<BreakdownList />} />
            </Tabs>
        </div>
    );
}

function mapStateToProps(state: IStoreState): IStateProps {
    return {
        deviceType: state.interface.deviceType,
        geography: state.interface.geography,
    };
}

export const PanelContainer = connect(mapStateToProps)(UnconnectedPanelContainer);
