export const PORT = process.env.NODE_ENV === "production" ? 3001 : 3000;
export const ORIGIN = process.env.NODE_ENV === "production" ? process.env.PRODUCTION_HOST : "localhost";
