import cors from "cors";
import { Express } from "express";
import { ORIGIN, PORT } from "@corona/api";

const CORS_OPTIONS: cors.CorsOptions = {
    origin: [new RegExp(`http://${ORIGIN}:${PORT}`)],
    methods: ["GET"],
};

export function configureSecurity(app: Express) {
    if (process.env.NODE_ENV === "production") {
        return;
    }

    app.use(cors(CORS_OPTIONS));
}
