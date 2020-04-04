import { IDimensions, IDeviceType, IDevice } from "../typings";

export function getTotalDimensionSpacing(dimensions: IDimensions): { widthSpacing: number; heightSpacing: number } {
    return {
        widthSpacing: (dimensions.margin?.left ?? 0) + (dimensions.margin?.right ?? 0),
        heightSpacing: (dimensions.margin?.left ?? 0) + (dimensions.margin?.right ?? 0),
    };
}

export function getDimensionsForMap(deviceType: IDeviceType | undefined) {
    return IDevice.visitor<IDimensions>(deviceType, {
        browser: () => ({
            height: window.innerHeight - 10,
            width: window.innerWidth - 5,
            margin: { left: 170, top: 75 },
        }),
        mobile: () => ({ height: window.innerHeight * 0.5, width: window.innerWidth, margin: { right: 20 } }),
        tablet: () => ({ height: window.innerHeight * 0.5, width: window.innerWidth, margin: { right: 20 } }),
        unknown: () => ({ height: window.innerHeight - 5, width: window.innerWidth }),
    });
}

export function getDimensionsForTimeseries(deviceType: IDeviceType | undefined) {
    return IDevice.visitor<IDimensions>(deviceType, {
        browser: () => ({
            height: 250,
            width: 230,
            margin: { top: 20, right: 20, bottom: 100, left: 50 },
        }),
        mobile: () => ({
            height: 350,
            width: window.innerWidth * 0.8,
            margin: { top: 20, right: 100, bottom: 100, left: 100 },
        }),
        tablet: () => ({
            height: 350,
            width: window.innerWidth * 0.8,
            margin: { top: 20, right: 100, bottom: 100, left: 100 },
        }),
        unknown: () => ({
            height: 250,
            width: 230,
            margin: { top: 20, right: 20, bottom: 100, left: 50 },
        }),
    });
}
