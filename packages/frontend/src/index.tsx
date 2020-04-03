import React from "react";
import ReactDOM from "react-dom";
import "./index.scss";
import { Provider } from "react-redux";
import { DeviceDetector } from "./deviceDetector";
import { configureStore } from "./store";

const store = configureStore();

ReactDOM.render(
    <Provider store={store}>
        <DeviceDetector />
    </Provider>,
    document.getElementById("main-app"),
);
