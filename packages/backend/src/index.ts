import express from "express";

const app = express();
const port = 8080;

app.get("/", (_, res) => {
    res.send("Hello world! 2");
});

app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`Server started, listening to http://localhost:${port}`);
});
