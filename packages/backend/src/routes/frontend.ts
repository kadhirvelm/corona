import express from "express";

export function setReactRoutes(app: express.Express) {
    app.use(express.static("../frontend/dist"));
}
