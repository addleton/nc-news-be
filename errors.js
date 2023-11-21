exports.handlePsqlErrors = (err, req, res, next) => {
    next(err);
};
exports.handleCustomErrors = (err, req, res, next) => {
    if (err.status) {
        res.status(err.status).send({ msg: err.msg });
    }
    next(err);
};
