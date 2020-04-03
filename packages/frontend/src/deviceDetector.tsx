import { CoronaService } from "@corona/api";
import { debounce } from "lodash-es";
import * as React from "react";
import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";
import { UAParser } from "ua-parser-js";
import { v4 } from "uuid";
import { Browser } from "./devices/browser";
import { DEFAULT_DATA_KEY } from "./common";
import styles from "./deviceDetector.module.scss";
import { ADD_DATA, SET_DEVICE_TYPE, IStoreState } from "./store";
import { TabletOrMobile } from "./devices/tabletOrMobile";
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
    resizeId: string;
}

class UnconnectedMainApplication extends React.PureComponent<IProps, IState> {
    public state: IState = {
        error: undefined,
        resizeId: v4(),
    };

    private debounceResize: () => void;

    public constructor(props: IProps, context: any) {
        super(props, context);
        this.debounceResize = debounce(this.handleResize, 500);
    }

    public componentDidMount() {
        const { addData, setDeviceType } = this.props;
        this.getUnitedStatesData(addData);

        window.addEventListener("resize", this.debounceResize);

        const userDevice = new UAParser().getDevice();
        setDeviceType(IDevice.getDeviceType(userDevice.type));
    }

    public componentWillUnmount() {
        window.removeEventListener("resize", this.debounceResize);
    }

    public componentDidCatch() {
        this.setState({ error: "Whoops, something went wrong. Try refreshing the page?" });
    }

    public render() {
        const { error, resizeId } = this.state;
        if (error !== undefined) {
            return <div className={styles.centerError}>{error}</div>;
        }

        const { deviceType } = this.props;
        if (deviceType === undefined) {
            return null;
        }

        return IDevice.visitor(deviceType, {
            browser: () => <Browser key={resizeId} />,
            mobile: () => <TabletOrMobile key={resizeId} />,
            tablet: () => <TabletOrMobile key={resizeId} />,
            unknown: () => (
                <div>
                    Unfortunately you&apos;re using an unsupported device. Please try again on a desktop, laptop,
                    mobile, or tablet.
                </div>
            ),
        });
    }

    private handleResize = () => this.setState({ resizeId: v4() });

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
