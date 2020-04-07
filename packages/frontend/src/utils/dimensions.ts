import { IDimensions, IDeviceType, IDevice } from "../typings";

export function getTotalDimensionSpacing(dimensions: IDimensions): { widthSpacing: number; heightSpacing: number } {
    return {
        widthSpacing: (dimensions.margin?.left ?? 0) + (dimensions.margin?.right ?? 0),
        heightSpacing: (dimensions.margin?.top ?? 0) + (dimensions.margin?.bottom ?? 0),
    };
}

export function getDimensionsForMap(deviceType: IDeviceType | undefined) {
    return IDevice.visitor<IDimensions>(deviceType, {
        browser: () => ({
            height: document.body.clientHeight - 10,
            width: document.body.clientWidth - 5,
            margin: { left: 350, top: 75 },
        }),
        mobile: () => ({
            height: document.body.clientHeight * 0.5,
            width: document.body.clientWidth,
            margin: { right: 20 },
        }),
        tablet: () => ({
            height: document.body.clientHeight * 0.5,
            width: document.body.clientWidth,
            margin: { right: 20 },
        }),
        unknown: () => ({ height: document.body.clientHeight - 5, width: document.body.clientWidth }),
    });
}

export function getDimensionsForTimeseries(deviceType: IDeviceType | undefined) {
    return IDevice.visitor<IDimensions>(deviceType, {
        browser: () => ({
            height: 250,
            width: 380,
            margin: { top: 20, right: 20, bottom: 100, left: 50 },
        }),
        mobile: () => ({
            height: 400,
            width: document.body.clientWidth * 0.8,
            margin: { top: 20, right: 100, bottom: 120, left: 100 },
        }),
        tablet: () => ({
            height: 150,
            width: document.body.clientWidth * 0.8,
            margin: { top: 20, right: 100, bottom: 100, left: 100 },
        }),
        unknown: () => ({
            height: 250,
            width: 230,
            margin: { top: 20, right: 20, bottom: 100, left: 50 },
        }),
    });
}
