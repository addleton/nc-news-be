const { checkArticleExists } = require("../models/articles.models");
const { selectComments, insertComment } = require("../models/comments.models");

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

exports.getComments = (req, res, next) => {
    const { article_id } = req.params;
    const commentPromises = [selectComments(article_id)];
    if (article_id) {
        commentPromises.push(checkArticleExists(article_id));
    }
    Promise.all(commentPromises)
        .then((resolvedPromises) => {
            const comments = resolvedPromises[0];
            res.status(200).send({ comments });
        })
        .catch(next);
};
