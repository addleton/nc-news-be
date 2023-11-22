const express = require("express");
const app = express();
const {
    getArticles,
    getArticleById,
} = require("./controllers/articles.controllers");
const { getApi } = require("./controllers/app.controllers");
const { getTopics } = require("./controllers/topics.controllers");
const {
    postCommentByArticle,
    getComments,
} = require("./controllers/comments.controllers");
const { handlePsqlErrors, handleCustomErrors, handleInvalidUrl } = require("./errors");
const { getUsers } = require("./controllers/users.controllers");

app.use(express.json());

app.get("/api", getApi);
app.get("/api/topics", getTopics);
app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id", getArticleById);
app.get("/api/articles/:article_id/comments", getComments);
app.get("/api/users", getUsers);

app.post("/api/articles/:article_id/comments", postCommentByArticle);

app.all('*', handleInvalidUrl)

app.use(handlePsqlErrors);
app.use(handleCustomErrors);
app.use(handleInvalidUrl)

module.exports = app;
