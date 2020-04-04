import { CoronaService } from "@corona/api";
import * as React from "react";
import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";
import { UAParser } from "ua-parser-js";
import { DEFAULT_DATA_KEY } from "./common";
import styles from "./deviceDetector.module.scss";
import { Browser } from "./devices/browser";
import { TabletOrMobile } from "./devices/tabletOrMobile";
import { ADD_DATA, IStoreState, SET_DEVICE_TYPE } from "./store";
import { IDataEntry, IDevice, IDeviceType } from "./typings";

interface IStateProps {
    deviceType: IDeviceType | undefined;
}

interface IDispatchProps {
    addData: (dataEntry: IDataEntry) => void;
    setDeviceType: (deviceType: IDeviceType) => void;
}

type IProps = IStateProps & IDispatchProps;

interface IState {
    error: string | undefined;
}

class UnconnectedMainApplication extends React.PureComponent<IProps, IState> {
    public state: IState = {
        error: undefined,
    };

    public componentDidMount() {
        const { addData, setDeviceType } = this.props;
        this.getUnitedStatesData(addData);

        const userDevice = new UAParser().getDevice();
        setDeviceType(IDevice.getDeviceType(userDevice.type));
    }

    public componentDidCatch() {
        this.setState({ error: "Whoops, something went wrong. Try refreshing the page?" });
    }

    public render() {
        const { error } = this.state;
        if (error !== undefined) {
            return <div className={styles.centerError}>{error}</div>;
        }

        const { deviceType } = this.props;
        if (deviceType === undefined) {
            return null;
        }

        return IDevice.visitor(deviceType, {
            browser: () => <Browser />,
            mobile: () => <TabletOrMobile />,
            tablet: () => <TabletOrMobile />,
            unknown: () => (
                <div>
                    Unfortunately you&apos;re using an unsupported device. Please try again on a desktop, laptop,
                    mobile, or tablet.
                </div>
            ),
        });
    }

    private async getUnitedStatesData(addData: (dataEntry: IDataEntry) => void) {
        try {
            const data = await CoronaService.getUnitedStatesData.frontend({});
            addData({ key: DEFAULT_DATA_KEY, data });
        } catch {
            this.setState({ error: "It seems our servers are down. Please check again soon." });
        }
    }
}

function mapStateToProps(state: IStoreState): IStateProps {
    return {
        deviceType: state.interface.deviceType,
    };
}

function mapDispatchToProps(dispatch: Dispatch): IDispatchProps {
    return {
        ...bindActionCreators({ addData: ADD_DATA.create, setDeviceType: SET_DEVICE_TYPE.create }, dispatch),
    };
}

export const DeviceDetector = connect(mapStateToProps, mapDispatchToProps)(UnconnectedMainApplication);
