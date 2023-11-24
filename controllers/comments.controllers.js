const { checkArticleExists } = require("../models/articles.models");
const {
    selectComments,
    insertComment,
    deleteComments,
    checkCommentExists,
    updateComments,
} = require("../models/comments.models");

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

exports.removeComments = (req, res, next) => {
    const { comment_id } = req.params;
    const commentPromises = [
        deleteComments(comment_id),
        checkCommentExists(comment_id),
    ];
    Promise.all(commentPromises)
        .then((resolvedPromises) => {
            res.status(204).send();
        })
        .catch(next);
};

exports.patchComments = (req, res, next) => {
    const { inc_votes } = req.body;
    const { comment_id } = req.params;
    const commentsPromises = [
        updateComments(comment_id, inc_votes),
        checkCommentExists(comment_id),
    ];
    Promise.all(commentsPromises)
        .then((resolvedPromises) => {
            const comment = resolvedPromises[0];
            res.status(200).send({ comment });
        })
        .catch(next);
};
