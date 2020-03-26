import { PORT } from "@corona/api";
import express from "express";

const app = express();

app.get("/", (_, res) => {
    res.send("Running version 0.1.0");
});

// app.get(CORONA_ENDPOINTS.getUnitedStatesData(), (_, res) => {
//     res.status(200).send(getCoronaData.getUnitedStatesData());
// });

// app.get(CORONA_ENDPOINTS.getStateData(":state"), (_, res) => {
//     res.status(200).send(getCoronaData.getStateData(STATE.CALIFORNIA));
// });

app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`Server started, listening to http://localhost:${PORT}`);
});
