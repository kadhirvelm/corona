import express from "express";
import { ORIGIN, PORT } from "@corona/api";
import { setRoutes } from "./routes";
import { configureSecurity } from "./security/configureSecurity";

const app = express();

configureSecurity(app);
setRoutes(app);

app.listen(PORT, "0.0.0.0", () => {
    // eslint-disable-next-line no-console
    console.log(`Server started, listening on http://${ORIGIN}:${PORT}`);
});
