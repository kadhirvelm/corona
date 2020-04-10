import express from "express";
import { getCountyHealthRankings } from "@corona/pipeline";

export function setDevelopmentRoutes(app: express.Express) {
    if (process.env.NODE_ENV === "production" || process.env.NODE_TLS_REJECT_UNAUTHORIZED === undefined) {
        return;
    }

    app.get("/county-health-rank/:measureId", async (req, res) => {
        const { measureId } = req.params;
        const numMeasureId = parseInt(measureId, 10);

        // eslint-disable-next-line no-restricted-globals
        if (isNaN(numMeasureId)) {
            res.status(400).send(`Invalid measure id: ${measureId}`);
            return;
        }

        await getCountyHealthRankings(numMeasureId);

        res.send(`Success check ${numMeasureId}.json in the root folder.`);
    });
}
