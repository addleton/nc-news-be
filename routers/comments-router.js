const commentsRouter = require("express").Router();
const {
    removeComments,
    patchComments,
} = require("../controllers/comments.controllers");

commentsRouter
    .route("/:comment_id")
    .delete(removeComments)
    .patch(patchComments);

module.exports = commentsRouter;
