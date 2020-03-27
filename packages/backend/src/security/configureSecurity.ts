import { Express } from "express";
import cors from "cors";

const CORS_OPTIONS: cors.CorsOptions = {
    origin: [new RegExp("http://localhost:*")],
    methods: ["GET"],
};

export function configureSecurity(app: Express) {
    app.use(cors(CORS_OPTIONS));
}
