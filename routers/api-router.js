const apiRouter = require("express").Router();
const articlesRouter = require("./articles-router");
const commentsRouter = require("./comments-router");
const topicsRouter = require("./topics-router");
const usersRouter = require("./users-router");
const fs = require('fs/promises')

apiRouter.get("/", (req, res, next) => {
    return fs
        .readFile("./endpoints.json", "utf-8")
        .then((contents) => {
            const endpoints = JSON.parse(contents);
            res.status(200).send({ endpoints });
        })
        .catch(next);
});

apiRouter.use("/articles", articlesRouter);
apiRouter.use("/users", usersRouter);
apiRouter.use("/topics", topicsRouter);
apiRouter.use("/comments", commentsRouter);

module.exports = apiRouter;
