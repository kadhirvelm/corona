import express from "express";

const app = express();
const port = 8080;

app.get("/", (_, res) => {
    res.send("Hello world!");
});

app.listen(port, () => {
    console.log(`Server started, listening to http://localhost:${port}`);
});
