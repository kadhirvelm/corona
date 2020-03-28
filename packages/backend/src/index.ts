import express from "express";
import { PORT } from "@corona/api";
import { setRoutes } from "./routes";
import { configureSecurity } from "./security/configureSecurity";

const app = express();

configureSecurity(app);
setRoutes(app);

app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`Server started, listening on http://localhost:${PORT}`);
});
