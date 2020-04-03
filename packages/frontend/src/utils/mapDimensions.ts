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
            margin: { left: 100, top: 50 },
        }),
        mobile: () => ({ height: window.innerHeight * 0.5, width: window.innerWidth, margin: { right: 20 } }),
        tablet: () => ({ height: window.innerHeight * 0.5, width: window.innerWidth, margin: { right: 20 } }),
        unknown: () => ({ height: window.innerHeight - 5, width: window.innerWidth }),
    });
}
