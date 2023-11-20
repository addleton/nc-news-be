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
    let queryString = `SELECT * FROM articles`
    return db.query(queryString).then(({rows}) => {
        return rows
    })
}