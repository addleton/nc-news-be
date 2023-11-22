const { selectApi } = require("../models/app.models");

exports.getApi = (req, res, next) => {
    selectApi().then((result) => {
        res.status(200).send(result);
    });
};
