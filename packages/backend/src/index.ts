import { PORT } from "@corona/api";
import express from "express";
import { setRoutes } from "./routes";
import { configureSecurity } from "./security/configureSecurity";

const app = express();

configureSecurity(app);

setRoutes(app);

app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`Server started, listening to http://localhost:${PORT}`);
});
