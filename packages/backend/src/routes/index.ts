import Express from "express";
import { setCoronaRoutes } from "./corona";
import { setReactRoutes } from "./frontend";

export function setRoutes(app: Express.Express) {
    app.get("/", (_, res) => {
        res.redirect("/index.html");
    });

    app.get("/version", (_, res) => {
        res.send(process.env.npm_package_version);
    });

    setCoronaRoutes(app);
    setReactRoutes(app);
}
