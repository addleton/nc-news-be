const {
    selectArticles,
    selectArticleById,
    updateArticles,
    checkArticleExists,
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
    const articlePromises = [
        updateArticles(article_id, newVote),
        checkArticleExists(article_id),
    ];
    Promise.all(articlePromises)
        .then((resolvedPromises) => {
            const article = resolvedPromises[0];
            res.status(200).send({ article });
        })
        .catch(next);
};
