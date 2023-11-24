const db = require("../db/connection");

exports.selectArticleById = (id) => {
    if (isNaN(Number(id)) && id !== undefined) {
        return Promise.reject({ status: 400, msg: "Bad Request" });
    }

    const queryString = `
    SELECT articles.*, COALESCE(COUNT(comments.article_id), 0) AS comment_count
    FROM articles
    LEFT JOIN comments ON articles.article_id = comments.article_id
    WHERE articles.article_id = $1
    GROUP BY articles.article_id
`;

    return db.query(queryString, [id]).then(({ rows }) => {
        if (!rows[0]) {
            return Promise.reject({ status: 404, msg: "Not Found" });
        }
        return rows[0];
    });
};

exports.checkArticleExists = (id, query) => {
    const validQueries = ["topic", "sort_by"];
    if (query && !validQueries.includes(query)) {
        return Promise.reject({ status: 400, msg: "Bad request" });
    }
    if (id) {
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
    }
};

exports.selectArticles = (sort_by = "created_at", order = "desc", topic) => {
    const validSortBy = [
        "article_id",
        "topic",
        "author",
        "title",
        "votes",
        "created_at",
    ];
    const validOrder = ["asc", "desc"];
    if (
        (sort_by && !validSortBy.includes(sort_by)) ||
        (order && !validOrder.includes(order))
    ) {
        return Promise.reject({ status: 400, msg: "Bad request" });
    }
    const queryArray = [];
    let queryString = `
        SELECT articles.*, COALESCE(COUNT(comments.article_id), 0) AS comment_count
        FROM articles
        LEFT JOIN comments ON articles.article_id = comments.article_id `;
    if (topic) {
        queryArray.push(topic);
        queryString += `WHERE articles.topic = $1`;
    }
    queryString += `GROUP BY articles.article_id 
                    ORDER BY ${sort_by} ${order} `;

    return db.query(queryString, queryArray).then(({ rows }) => {
        return rows;
    });
};

exports.updateArticles = (id, vote) => {
    return db
        .query(
            `UPDATE articles
                    SET votes = GREATEST(votes + $1, 0)
                    WHERE article_id = $2
                    RETURNING *`,
            [vote.inc_votes, id]
        )
        .then(({ rows }) => {
            return rows[0];
        });
};
