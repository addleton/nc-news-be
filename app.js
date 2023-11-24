const express = require("express");
const app = express();
const { handlePsqlErrors, handleCustomErrors } = require("./errors");
const apiRouter = require("./routers/api-router");

app.use(express.json());
app.use("/api", apiRouter);

app.use(handlePsqlErrors);
app.use(handleCustomErrors);

module.exports = app;