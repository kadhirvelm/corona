import { Express } from "express";
import { getUSCoronaData } from "@corona/pipeline";

export function setCoronaDataRoutes(app: Express) {
    app.get("/data/corona/update", async (_, response) => {
        // eslint-disable-next-line @typescript-eslint/await-thenable
        const data = await getUSCoronaData();

        response.status(200).send(data.country);
    });
}
