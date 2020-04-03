import * as React from "react";
import { connect } from "react-redux";

function UnconnectedTablet() {
    return <div>Tablet baby!</div>;
}

export const Tablet = connect(undefined)(UnconnectedTablet);
