const express = require("express");
const {
    getTopics,
    getArticleById,
    getApi,
    getComments,
} = require("./controllers/app.controllers");
const { handlePsqlErrors, handleCustomErrors } = require("./errors");

const app = express();

app.get("/api", getApi);

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/articles/:article_id/comments", getComments);

app.use(handlePsqlErrors);
app.use(handleCustomErrors);

module.exports = app;
