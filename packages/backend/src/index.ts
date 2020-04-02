import express from "express";
import { ORIGIN, PORT } from "@corona/api";
import compression from "compression";
import { BACKEND_LOGGER } from "@corona/logger";
import { setRoutes } from "./routes";
import { configureSecurity } from "./security/configureSecurity";

const app = express();

app.use(compression());

configureSecurity(app);
setRoutes(app);

app.listen(PORT, "0.0.0.0", () => {
    BACKEND_LOGGER.log({ level: "info", message: `Server started, listening on http://${ORIGIN}:${PORT}` });
});
