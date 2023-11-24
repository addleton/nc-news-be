const articlesRouter = require("express").Router();
const {
    getArticles,
    getArticleById,
    patchArticles,
} = require("../controllers/articles.controllers");
const {
    getComments,
    postCommentByArticle,
} = require("../controllers/comments.controllers");

articlesRouter
.route("/")
.get(getArticles);

articlesRouter
.route("/:article_id")
.get(getArticleById)
.patch(patchArticles);

articlesRouter
    .route("/:article_id/comments")
    .get(getComments)
    .post(postCommentByArticle);

module.exports = articlesRouter;