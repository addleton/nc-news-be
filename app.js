const express = require("express");
const app = express();
const {
    getTopics,
    getArticleById,
    getApi,
    postCommentByArticle,
} = require("./controllers/app.controllers");
const { handlePsqlErrors, handleCustomErrors } = require("./errors");

app.use(express.json());

app.get("/api", getApi);

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticleById);

app.post("/api/articles/:article_id/comments", postCommentByArticle);

app.use(handlePsqlErrors);
app.use(handleCustomErrors);

module.exports = app;
