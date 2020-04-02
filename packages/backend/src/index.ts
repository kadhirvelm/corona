import express from "express";
import { ORIGIN, PORT } from "@corona/api";
import compression from "compression";
import { setRoutes } from "./routes";
import { configureSecurity } from "./security/configureSecurity";

const app = express();

app.use(compression());

configureSecurity(app);
setRoutes(app);

app.listen(PORT, "0.0.0.0", () => {
    // eslint-disable-next-line no-console
    console.log(`Server started, listening on http://${ORIGIN}:${PORT}`);
});
