const db = require("../db/connection");

const fs = require("fs/promises");

exports.selectApi = () => {
    return fs
        .readFile(`${__dirname}/../endpoints.json`, "utf8")
        .then((contents) => {
            return JSON.parse(contents);
        });
};
