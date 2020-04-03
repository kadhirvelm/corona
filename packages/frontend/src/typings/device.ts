export interface IBrowserType {
    type: "browser";
}

export interface IMobileType {
    type: "mobile";
}

export interface ITabletType {
    type: "tablet";
}

export interface IUnknownType {
    type: "unknown";
}

export type IDeviceType = IBrowserType | IMobileType | ITabletType | IUnknownType;

interface IDeviceTypeVisitor<T = any> {
    browser: (device: IBrowserType) => T;
    mobile: (device: IMobileType) => T;
    tablet: (device: ITabletType) => T;
    unknown: (device: IUnknownType) => T;
}

export namespace IDevice {
    export const getDeviceType = (type: string | undefined): IDeviceType => {
        if (type === undefined) {
            return {
                type: "browser",
            };
        }

        if (type === "mobile") {
            return {
                type: "mobile",
            };
        }

        if (type === "tablet") {
            return {
                type: "tablet",
            };
        }

        return {
            type: "unknown",
        };
    };

    export const isBrowser = (device: IDeviceType | undefined): device is IBrowserType => {
        return device !== undefined && device.type === "browser";
    };

    export const isMobile = (device: IDeviceType | undefined): device is IMobileType => {
        return device !== undefined && device.type === "mobile";
    };

    export const isTablet = (device: IDeviceType | undefined): device is ITabletType => {
        return device !== undefined && device.type === "tablet";
    };

    export const isUnknown = (device: IDeviceType | undefined): device is IUnknownType => {
        return device !== undefined && device.type === "unknown";
    };

    export const visitor = <T = any>(device: IDeviceType | undefined, callbacks: IDeviceTypeVisitor<T>) => {
        if (device === undefined) {
            throw new Error("Called on the device type visitor with an unknown device type.");
        }

        if (isBrowser(device)) {
            return callbacks.browser(device);
        }

        if (isMobile(device)) {
            return callbacks.mobile(device);
        }

        if (isTablet(device)) {
            return callbacks.tablet(device);
        }

        return callbacks.unknown(device);
    };
}
