import Express from "express";
import { setCoronaRoutes } from "./setCoronaRoutes";

export function setRoutes(app: Express.Express) {
    app.get("/", (_, res) => {
        res.send("Running version 0.1.0");
    });

    setCoronaRoutes(app);
}
