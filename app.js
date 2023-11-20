const express = require("express");
const { getTopics, getApi } = require("./controllers/app.controllers");

const app = express();

app.get ('/api', getApi)

app.get("/api/topics", getTopics);

module.exports = app;
