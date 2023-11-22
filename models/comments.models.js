const db = require("../db/connection");

const fs = require("fs/promises");

exports.insertComment = (comment, id) => {
    return db
        .query(
            `INSERT INTO comments
                    (author, body, article_id)
                    VALUES
                    ($1, $2, $3) RETURNING *`,
            [comment.username, comment.body, id]
        )
        .then(({ rows }) => {
            return rows[0];
        });
};

exports.selectComments = (id) => {
    return db
        .query(
            `SELECT * FROM comments
            WHERE article_id = $1
            ORDER BY created_at ASC`,
            [id]
        )
        .then(({ rows }) => {
            return rows;
        });
};