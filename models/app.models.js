const db = require("../db/connection");
const fs = require("fs/promises");

exports.selectTopics = () => {
    let queryString = `SELECT * FROM topics`;
    return db.query(queryString).then(({ rows }) => {
        return rows;
    });
};

exports.selectApi = () => {
    return fs
        .readFile(`${__dirname}/../endpoints.json`, "utf8")
        .then((contents) => {
            return JSON.parse(contents);
        });
};

exports.selectArticles = () => {
    let queryString = `SELECT * FROM articles ORDER BY created_at DESC`;
    return db.query(queryString).then(({ rows }) => {
        return rows;
    });
};

exports.getCommentCount = (articles) => {
    const commentCount = articles.map((article) => {
        return db
            .query(
                `SELECT article_id, COUNT(*) FROM comments WHERE article_id = $1
            GROUP BY article_id`,
                [article.article_id]
            )
            .then(({ rows }) => {
                if (rows[0] === undefined) {
                    return { article_id: article.article_id };
                }
                return rows[0];
            });
    });
    return Promise.all(commentCount);
};

exports.addCommentCount = (comments) => {
    return db
        .query(
            `ALTER TABLE articles
            ADD comment_count INT`
        )
        .then(() => {
            const insertPromises = comments.map((comment) => {
                return db.query(
                    `UPDATE articles
                    SET comment_count = $1
                    WHERE article_id = $2`,
                    [comment.count, comment.article_id]
                );
            });
            return Promise.all(insertPromises);
        });
};
