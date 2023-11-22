const {
    selectArticles,
    selectArticleById,
    updateArticles,
} = require("../models/articles.models");

exports.getArticles = (req, res, next) => {
    selectArticles().then((articles) => {
        res.status(200).send({ articles });
    });
};

exports.getArticleById = (req, res, next) => {
    const { article_id } = req.params;
    selectArticleById(article_id)
        .then((article) => {
            res.status(200).send({ article });
        })
        .catch(next);
};

exports.patchArticles = (req, res, next) => {
    const newVote = req.body;
    const { article_id } = req.params;
    updateArticles(article_id, newVote).then((article) => {
        res.status(200).send({ article });
    });
};
