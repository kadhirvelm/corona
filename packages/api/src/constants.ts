export const PORT = process.env.NODE_ENV === "production" ? 80 : 3000;
export const ORIGIN = process.env.NODE_ENV === "production" ? process.env.PRODUCTION_HOST : "192.168.0.28";
