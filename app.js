const express = require("express");
const {
    getTopics,
    getApi,
    getArticles,
} = require("./controllers/app.controllers");

const app = express();

app.get("/api", getApi);

app.get("/api/topics", getTopics);

app.get("/api/articles", getArticles);

module.exports = app;
