import React from "react";
import ReactDOM from "react-dom";
import "./index.scss";
import { Provider } from "react-redux";
import { MainApplication } from "./mainApplication";
import { configureStore } from "./store";

const store = configureStore();

ReactDOM.render(
    <Provider store={store}>
        <MainApplication />
    </Provider>,
    document.getElementById("main-app"),
);
