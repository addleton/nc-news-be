const commentsRouter = require("express").Router();
const { removeComments } = require("../controllers/comments.controllers");

commentsRouter
.route("/:comment_id")
.delete(removeComments);

module.exports = commentsRouter;