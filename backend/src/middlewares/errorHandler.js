const errorhandler = (err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

    res.statusCode = statusCode

    console.log(err);

    res.status(statusCode).json({
        message: err.message,
        stack: process.env.NODE_ENV === "production" ? null : err.stack,
    });
};

module.exports = errorhandler