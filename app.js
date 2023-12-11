const express = require("express");
const app = express();
const { handlePsqlErrors, handleCustomErrors } = require("./errors");
const apiRouter = require("./routers/api-router");
const cors = require("cors");

app.use(cors());
app.use(express.json());
app.use("/api", apiRouter);

app.use(handlePsqlErrors);
app.use(handleCustomErrors);

module.exports = app;
