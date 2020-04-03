import * as React from "react";
import { connect } from "react-redux";

function UnconnectedMobile() {
    return <div>Mobile baby!</div>;
}

export const Mobile = connect(undefined)(UnconnectedMobile);
