const {
    selectTopics,
    selectApi,
    insertComment,
    checkArticleExists,
    selectArticles,
    selectArticleById,
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

exports.postCommentByArticle = (req, res, next) => {
    const newComment = req.body;
    const { article_id } = req.params;
    const promiseArray = [
        insertComment(newComment, article_id),
        checkArticleExists(article_id),
    ];
    Promise.all(promiseArray)
        .then((resolvedPromises) => {
            const comment = resolvedPromises[0];
            res.status(201).send({ comment });
        })
        .catch(next);
};
exports.getArticles = (req, res, next) => {
    selectArticles().then((articles) => {
        res.status(200).send({ articles });
    });
};
