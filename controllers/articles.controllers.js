const {
    selectArticles,
    selectArticleById,
    updateArticles,
    checkArticleExists,
} = require("../models/articles.models");
const { checkTopicExists } = require("../models/topics.models");

exports.getArticles = (req, res, next) => {
    const [query] = Object.keys(req.query);
    const { sort_by, order } = req.query;
    const { topic } = req.query;
    const articlePromises = [selectArticles(sort_by, order, topic)];
    if (query) {
        articlePromises.push(checkArticleExists(undefined, query));
    }
    if (topic) {
        articlePromises.push(checkTopicExists(topic));
    }
    Promise.all(articlePromises)
        .then((resolvedPromises) => {
            const articles = resolvedPromises[0];
            res.status(200).send({ articles });
        })
        .catch(next);
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
