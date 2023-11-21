const db = require("../db/connection");

const fs = require("fs/promises");
exports.selectTopics = () => {
    let queryString = `SELECT * FROM topics`;
    return db.query(queryString).then(({ rows }) => {
        return rows;
    });
};

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

exports.selectApi = () => {
    return fs
        .readFile(`${__dirname}/../endpoints.json`, "utf8")
        .then((contents) => {
            return JSON.parse(contents);
        });
};

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
