const {
    selectTopics,
    selectArticleById,
    selectApi,
} = require("../models/app.models");

exports.getTopics = (req, res, next) => {
    selectTopics().then((topics) => {
        res.status(200).send({ topics });
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

exports.getApi = (req, res, next) => {
    selectApi().then((result) => {
        res.status(200).send(result);
    });
};
