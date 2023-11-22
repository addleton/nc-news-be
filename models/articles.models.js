const db = require("../db/connection");

exports.selectArticleById = (id) => {
    if (isNaN(Number(id)) && id !== undefined) {
        return Promise.reject({ status: 400, msg: "Bad Request" });
    }

    let queryString = `SELECT * FROM articles `;
    const queryValues = [id];
    queryString += `WHERE article_id = $1 `;

    return db.query(queryString, queryValues).then(({ rows }) => {
        if (!rows[0]) {
            return Promise.reject({ status: 404, msg: "Not Found" });
        }
        return rows[0];
    });
};

exports.checkArticleExists = (id) => {
    if (isNaN(Number(id)) && id !== undefined) {
        return Promise.reject({ status: 400, msg: "Bad request" });
    }
    return db
        .query(`SELECT * FROM articles WHERE article_id = $1`, [id])
        .then(({ rows }) => {
            if (!rows.length) {
                return Promise.reject({
                    status: 404,
                    msg: "Article not found",
                });
            }
        });
};
exports.selectArticles = () => {
    const queryString = `
        SELECT articles.*, COALESCE(COUNT(comments.article_id), 0) AS comment_count
        FROM articles
        LEFT JOIN comments ON articles.article_id = comments.article_id
        GROUP BY articles.article_id
        ORDER BY articles.created_at DESC
    `;

    return db.query(queryString).then(({ rows }) => {
        return rows;
    });
};

exports.updateArticles = (id, vote) => {
    return db
        .query(
            `UPDATE articles
                    SET votes = votes + $1
                    WHERE article_id = $2
                    RETURNING *`,
            [vote.inc_votes, id]
        )
        .then(({ rows }) => {
            return rows[0];
        });
};
