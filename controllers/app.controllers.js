const {
    selectTopics,
    selectArticleById,
    selectApi,
    selectComments,
    checkIfArticleExists,
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

exports.getComments = (req, res, next) => {
    const { article_id } = req.params;

    const commentPromises = [selectComments(article_id)];

    if (article_id) {
        commentPromises.push(checkIfArticleExists(article_id));
    }

    Promise.all(commentPromises)
        .then((resolvedPromises) => {
            const comments = resolvedPromises[0];
            res.status(200).send({ comments });
        })
        .catch(next);
};
