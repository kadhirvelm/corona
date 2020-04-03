import * as React from "react";
import { UAParser } from "ua-parser-js";
import { Browser } from "./browser";
import { Mobile } from "./mobile";
import { Tablet } from "./tablet";

export function DeviceDetector() {
    const userDevice = new UAParser().getDevice();

    if (userDevice.type === undefined) {
        return <Browser />;
    }

    if (userDevice.type === "mobile") {
        return <Mobile />;
    }

    if (userDevice.type === "tablet") {
        return <Tablet />;
    }

    return <div>Unsupported device detected: {userDevice.type} </div>;
}
