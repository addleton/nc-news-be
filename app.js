const express = require("express");
const {
    getTopics,
    getApi,
    getArticles,
    getArticleById,
} = require("./controllers/app.controllers");

const { handlePsqlErrors, handleCustomErrors } = require("./errors");
const app = express();

app.get("/api", getApi);

app.get("/api/topics", getTopics);
app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id", getArticleById);

app.use(handlePsqlErrors);
app.use(handleCustomErrors);

module.exports = app;
