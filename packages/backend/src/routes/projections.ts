import { Express } from "express";
import { isValidProjection } from "@corona/utils";
import { ProjectionService } from "@corona/api";
import { BACKEND_LOGGER } from "@corona/logger";
import { getProjection } from "../projection/getProjection";

export function setProjectionRoutes(app: Express) {
    app[ProjectionService.getProjection.method](ProjectionService.getProjection.endpoint, (request, response) => {
        const { name } = request.params;
        BACKEND_LOGGER.log({
            level: "info",
            message: `Ping for ${ProjectionService.getProjection.endpoint} with param ${name}`,
        });

        if (!isValidProjection(name)) {
            response.status(400).send({ error: `Invalid projection request: ${name}.` });
            return;
        }

        ProjectionService.getProjection.backend(name, response, getProjection);
    });
}
