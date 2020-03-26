import React from "react";
import ReactDOM from "react-dom";
import "./index.scss";
import { Provider } from "react-redux";
import { configureStore } from "./store/configureStore";
import { MainApplication } from "./mainApplication";

const store = configureStore();

ReactDOM.render(
    <Provider store={store}>
        <MainApplication />
    </Provider>,
    document.getElementById("main-app"),
);
