import cors from "cors";
import { Express } from "express";
import { ORIGIN, PORT } from "@corona/api";

const CORS_OPTIONS: cors.CorsOptions = {
    origin: [
        new RegExp(`http://${ORIGIN}:${PORT}`),
        ...(process.env.NODE_ENV === "production"
            ? ["http://dashboardus.live", "http://corona-dashboard.us", "https://corona-dashboard.us"]
            : []),
    ],
    methods: ["GET"],
};

export function configureSecurity(app: Express) {
    app.use(process.env.NODE_ENV === "production" ? cors(CORS_OPTIONS) : cors());
}
