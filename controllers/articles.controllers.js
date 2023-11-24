const {
    selectArticles,
    selectArticleById,
    updateArticles,
    checkArticleExists,
    insertArticle,
    selectCount,
    deleteArticle,
} = require("../models/articles.models");
const { checkTopicExists } = require("../models/topics.models");

exports.getArticles = (req, res, next) => {
    const [query] = Object.keys(req.query);
    const { sort_by, order, limit, p } = req.query;
    const { topic } = req.query;

    const articlePromises = [
        selectArticles(sort_by, order, topic, limit, p),
        selectCount(topic),
    ];

    if (query) {
        articlePromises.push(checkArticleExists(undefined, query));
    }
    if (topic) {
        articlePromises.push(checkTopicExists(topic));
    }

    Promise.all(articlePromises)
        .then((resolvedPromises) => {
            const articles = resolvedPromises[0];
            const { total_count } = resolvedPromises[1];
            res.status(200).send({ articles, total_count });
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

exports.postArticle = (req, res, next) => {
    const newArticle = req.body;
    insertArticle(newArticle)
        .then((article) => {
            return selectArticleById(article.article_id);
        })
        .then((article) => {
            res.status(201).send({ article });
        })
        .catch(next);
};

exports.removeArticle = (req, res, next) => {
    const { article_id } = req.params;
    const articlePromises = [
        checkArticleExists(article_id),
        deleteArticle(article_id),
    ];
    Promise.all(articlePromises)
        .then((resolvedPromises) => {
            res.status(204).send();
        })
        .catch(next);
};
