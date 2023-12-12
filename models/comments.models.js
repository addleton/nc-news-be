const db = require("../db/connection");

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

exports.selectComments = (id, limit = 10, p = 1) => {
    const offset = limit * (p - 1);
    return db
        .query(
            `SELECT * FROM comments
            WHERE article_id = $1
            ORDER BY created_at DESC
            LIMIT $2 OFFSET $3`,
            [id, limit, offset]
        )
        .then(({ rows }) => {
            return rows;
        });
};

exports.deleteComments = (id) => {
    return db.query(`DELETE FROM comments WHERE comment_id = $1`, [id]);
};

exports.checkCommentExists = (id) => {
    if (isNaN(Number(id)) && id !== undefined) {
        return Promise.reject({ status: 400, msg: "Bad request" });
    }
    return db
        .query(`SELECT * FROM comments WHERE comment_id = $1`, [id])
        .then(({ rows }) => {
            if (!rows.length) {
                return Promise.reject({
                    status: 404,
                    msg: "Comment not found",
                });
            }
        });
};

exports.updateComments = (id, vote) => {
    return db
        .query(
            `UPDATE comments
                    SET votes = GREATEST(votes + $1, 0)
                    WHERE comment_id = $2
                    RETURNING *`,
            [vote, id]
        )
        .then(({ rows }) => {
            return rows[0];
        });
};
