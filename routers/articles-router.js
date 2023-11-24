const articlesRouter = require("express").Router();
const {
    getArticles,
    getArticleById,
    patchArticles,
    postArticle,
} = require("../controllers/articles.controllers");
const {
    getComments,
    postCommentByArticle,
} = require("../controllers/comments.controllers");

articlesRouter.route("/").get(getArticles).post(postArticle);

articlesRouter.route("/:article_id").get(getArticleById).patch(patchArticles);

articlesRouter
    .route("/:article_id/comments")
    .get(getComments)
    .post(postCommentByArticle);

module.exports = articlesRouter;
