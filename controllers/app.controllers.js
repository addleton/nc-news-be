const {
    selectTopics,
    selectApi,
    selectArticles,
    getCommentCount,
    addCommentCount,
} = require("../models/app.models");
const { changeUndefinedComments } = require("../utils");

exports.getTopics = (req, res, next) => {
    selectTopics().then((topics) => {
        res.status(200).send(topics);
    });
};

exports.getApi = (req, res, next) => {
    selectApi().then((result) => {
        res.status(200).send(result);
    });
};

exports.getArticles = (req, res, next) => {
    selectArticles()
        .then((articles) => {
            return getCommentCount(articles);
        })
        .then((comments) => {
            const newComments = changeUndefinedComments(comments);
            return addCommentCount(newComments);
        })
        .then(() => {
            return selectArticles();
        })
        .then((articles) => {
            res.status(200).send({ articles });
        });
};
