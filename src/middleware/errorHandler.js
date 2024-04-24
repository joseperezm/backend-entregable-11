const errorCodes = require('../utils/errorCodes');

function errorHandler(err, req, res, next) {
    const error = errorCodes[err.code] || errorCodes.INTERNAL_SERVER_ERROR;
    res.status(error.statusCode).json({ message: error.message });
}

module.exports = errorHandler;