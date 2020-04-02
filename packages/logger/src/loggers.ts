import winston from "winston";

const logLocation = (logName: string) => `../../logs/${logName}.log`;
const format = winston.format.combine(winston.format.timestamp(), winston.format.json());

const BACKEND_LOGGER = winston.createLogger({
    level: "info",
    format,
    defaultMeta: { service: "corona-backend" },
    transports: [
        new winston.transports.File({ filename: logLocation("backend-error"), level: "error" }),
        new winston.transports.File({ filename: logLocation("backend-info"), level: "info" }),
    ],
});

const PIPELINE_LOGGER = winston.createLogger({
    level: "info",
    format,
    defaultMeta: { service: "corona-pipeline" },
    transports: [
        new winston.transports.File({ filename: logLocation("pipeline-error"), level: "error" }),
        new winston.transports.File({ filename: logLocation("pipeline-info"), level: "info" }),
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
