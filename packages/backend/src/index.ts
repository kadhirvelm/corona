import express from "express";
import { ORIGIN, PORT } from "@corona/api";
import { setRoutes } from "./routes";
import { configureSecurity } from "./security/configureSecurity";

const app = express();

configureSecurity(app);
setRoutes(app);

app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(process.env.NODE_ENV, process.env.PRODUCTION_HOST);
    console.log(`Server started, listening on http://${ORIGIN}:${PORT}`);
});
