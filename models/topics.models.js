const db = require("../db/connection");

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

exports.insertTopic = (newTopic) => {
    return db
        .query(
            `INSERT INTO topics
                    (slug, description)
                    VALUES
                    ($1, $2)
                    RETURNING *;`,
            [newTopic.slug, newTopic.description]
        )
        .then(({ rows }) => {
            return rows[0];
        });
};
