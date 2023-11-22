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
    removeComments,
} = require("./controllers/comments.controllers");
const {
    handlePsqlErrors,
    handleCustomErrors,
    handleInvalidUrl,
} = require("./errors");
const { getUsers } = require("./controllers/users.controllers");

app.use(express.json());

app.get("/api", getApi);
app.get("/api/topics", getTopics);
app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id", getArticleById);
app.get("/api/articles/:article_id/comments", getComments);
app.get("/api/users", getUsers);

app.post("/api/articles/:article_id/comments", postCommentByArticle);
app.patch("/api/articles/:article_id", patchArticles);
app.delete("/api/comments/:comment_id", removeComments);
app.all("*", handleInvalidUrl);

app.use(handlePsqlErrors);
app.use(handleCustomErrors);
app.use(handleInvalidUrl);

module.exports = app;
