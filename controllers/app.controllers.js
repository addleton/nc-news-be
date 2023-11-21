const {
    selectTopics,
    selectArticleById,
    selectApi,
    insertComment,
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
    insertComment(newComment, article_id).then((comment) => {
        res.status(201).send({ comment });
    });
};
