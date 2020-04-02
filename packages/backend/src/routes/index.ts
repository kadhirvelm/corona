import Express from "express";
import { BACKEND_LOGGER } from "@corona/logger";
import { setCoronaRoutes } from "./corona";
import { setReactRoutes } from "./frontend";

export function setRoutes(app: Express.Express) {
    app.get("/", (_, res) => {
        BACKEND_LOGGER.log({ level: "info", message: "Ping for /" });
        res.redirect("/index.html");
    });

    app.get("/version", (_, res) => {
        BACKEND_LOGGER.log({ level: "info", message: "Ping for /version" });
        res.send(process.env.npm_package_version);
    });

    setCoronaRoutes(app);
    setReactRoutes(app);
}
