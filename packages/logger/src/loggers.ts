import winston from "winston";

const logLocation = (logName: string) => `../../logs/${logName}.log`;

const BACKEND_LOGGER = winston.createLogger({
    level: "info",
    format: winston.format.json(),
    defaultMeta: { service: "corona-backend" },
    transports: [
        new winston.transports.File({ filename: logLocation("backend-error.log"), level: "error" }),
        new winston.transports.File({ filename: logLocation("backend-info.log"), level: "info" }),
    ],
});

const PIPELINE_LOGGER = winston.createLogger({
    level: "info",
    format: winston.format.json(),
    defaultMeta: { service: "corona-pipeline" },
    transports: [
        new winston.transports.File({ filename: logLocation("pipeline-error.log"), level: "error" }),
        new winston.transports.File({ filename: logLocation("pipeline-info.log"), level: "info" }),
    ],
});

export const LOGGERS = {
    BACKEND_LOGGER,
    PIPELINE_LOGGER,
};

if (process.env.NODE_ENV !== "production") {
    Object.values(LOGGERS).forEach(LOGGER => {
        LOGGER.add(new winston.transports.Console({ format: winston.format.simple() }));
    });
}
