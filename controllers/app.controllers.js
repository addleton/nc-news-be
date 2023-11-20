const { selectTopics, selectApi, selectArticles } = require("../models/app.models");

exports.getTopics = (req, res, next) => {
  selectTopics().then((topics) => {
    res.status(200).send(topics);
  });
};

exports.getApi = (req, res, next) => {
  selectApi().then((result) => {
    res.status(200).send(result);
  });
};

exports.getArticles = (req, res, next) => {
    selectArticles().then((articles) => {
        res.status(200).send({articles})
    })
}