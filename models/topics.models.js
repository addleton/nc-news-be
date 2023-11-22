const db = require("../db/connection");

const fs = require("fs/promises");
exports.selectTopics = () => {
    let queryString = `SELECT * FROM topics`;
    return db.query(queryString).then(({ rows }) => {
        return rows;
    });
};