const db = require("../db/connection");

exports.selectTopics = () => {
    let queryString = `SELECT * FROM topics`;
    return db.query(queryString).then(({ rows }) => {
        return rows;
    });
};

exports.selectArticleById = (id) => {
    if (isNaN(Number(id))) {
        return Promise.reject({ status: 400, msg: "Bad Request" });
    }
    let queryString = `SELECT * FROM articles `;
    if (id) {
        queryString += `WHERE article_id = ${id} `;
    }
    return db.query(queryString).then(({ rows }) => {
        if (!rows[0]) {
            return Promise.reject({ status: 404, msg: "Not Found" });
        }
        return rows[0];
    });
};
