import { CORONA_ENDPOINTS, PORT } from "@corona/api";
import express from "express";
import { getCoronaData } from "./coronaData/getCoronaData";
import { isValidState } from "./utils/isValidState";

const app = express();

app.get("/", (_, res) => {
    res.send("Running version 0.1.0");
});

app.get(CORONA_ENDPOINTS.getUnitedStatesData(), (_, res) => {
    res.status(200).send(getCoronaData.getUnitedStatesData());
});

app.get(CORONA_ENDPOINTS.getStateData(":state"), (req, res) => {
    if (!isValidState(req.params.state)) {
        res.status(400).send({ error: "Invalid state", payload: req.params.state });
        return;
    }

    res.status(200).send(getCoronaData.getStateData(req.params.state));
});

app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`Server started, listening to http://localhost:${PORT}`);
});
