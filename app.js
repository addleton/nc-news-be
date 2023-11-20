const express = require("express");
const { getTopics, getArticleById } = require("./controllers/app.controllers");
const { handlePsqlErrors, handleCustomErrors } = require("./errors");

const app = express();
app.use(express.json());

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticleById);

app.use(handlePsqlErrors);
app.use(handleCustomErrors);

module.exports = app;
