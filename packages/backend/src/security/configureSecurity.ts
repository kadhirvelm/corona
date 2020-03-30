import cors from "cors";
import { Express } from "express";

// const CORS_OPTIONS: cors.CorsOptions = {
//     origin: [new RegExp(`http://0.0.0.0:${PORT}`)],
//     methods: ["GET"],
// };

export function configureSecurity(app: Express) {
    if (process.env.NODE_ENV === "production") {
        return;
    }

    app.use(cors());
}
