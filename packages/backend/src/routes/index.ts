import { BACKEND_LOGGER } from "@corona/logger";
import Express from "express";
import { setCoronaRoutes } from "./corona";
import { setDevelopmentRoutes } from "./development";
import { setReactRoutes } from "./frontend";
import { setProjectionRoutes } from "./projections";

export function setRoutes(app: Express.Express) {
    app.get("/version", (_, res) => {
        BACKEND_LOGGER.log({ level: "info", message: "Ping for /version" });
        res.send(process.env.npm_package_version);
    });

    setCoronaRoutes(app);
    setProjectionRoutes(app);
    setReactRoutes(app);
    setDevelopmentRoutes(app);

    app.get("/", (_, res) => {
        BACKEND_LOGGER.log({ level: "info", message: "Ping for /" });
        res.sendFile("/index.html");
    });
}
