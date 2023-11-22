const express = require("express");
const app = express();
const {
    getArticles,
    getArticleById,
    patchArticles,
} = require("./controllers/articles.controllers");
const { getApi } = require("./controllers/app.controllers");
const { getTopics } = require("./controllers/topics.controllers");
const {
    postCommentByArticle,
    getComments,
} = require("./controllers/comments.controllers");
const { handlePsqlErrors, handleCustomErrors } = require("./errors");







app.use(express.json());

app.get("/api", getApi);
app.get("/api/topics", getTopics);
app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id", getArticleById);
app.get("/api/articles/:article_id/comments", getComments);
app.post("/api/articles/:article_id/comments", postCommentByArticle);
app.patch("/api/articles/:article_id", patchArticles);

app.use(handlePsqlErrors);
app.use(handleCustomErrors);

module.exports = app;
