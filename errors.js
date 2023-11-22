exports.handlePsqlErrors = (err, req, res, next) => {
    if(err.code === '23502') {
        res.status(400).send({msg: 'Bad request'})
    }
    if(err.code === "23503") {
        res.status(404).send({msg: 'Article not found'})
    }
    next(err);
};
exports.handleCustomErrors = (err, req, res, next) => {
    if (err.status) {
        res.status(err.status).send({ msg: err.msg });
    }
    next(err);
};