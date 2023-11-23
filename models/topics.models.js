const db = require("../db/connection");

const fs = require("fs/promises");
exports.selectTopics = () => {
    let queryString = `SELECT * FROM topics`;
    return db.query(queryString).then(({ rows }) => {
        return rows;
    });
};

exports.checkTopicExists = (topic) => {
    return db
        .query(`SELECT * FROM topics WHERE slug = $1`, [topic])
        .then(({ rows }) => {
            if (!rows.length) {
                return Promise.reject({
                    status: 404,
                    msg: "Not found",
                });
            }
        });
};
