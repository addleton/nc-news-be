exports.changeUndefinedComments = (comments) => {
    return comments.map((comment) => {
        if (comment.count === undefined) {
            comment.count = 0;
        }
        return comment;
    });
};
