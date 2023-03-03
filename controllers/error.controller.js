const AppError = require('../utils/appError');

/**
 * It takes an error object and a response object as arguments, and returns a response object with the
 * status code, status, error, message, and stack properties.
 * @param err - the error object
 * @param res - The response object
 */

const handleCastError22P02 = () => {
  const message = 'Some type of data send does not match was expected';
  return new AppError(message, 400);
};

const handleJWTError = () => {
  return new AppError('Invalid token, please login again', 401);
};

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

/**
 * If the error is operational, send the error message to the client. If it's not, send a generic error
 * message to the client
 * @param err - the error object
 * @param res - the response object
 */
const sendErrorProd = (err, res) => {
  //Operational, trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    //Programming or other unknown error: don't leak error details
    console.error('ERROR 🧨', err);
    res.status(500).json({
      status: 'fail',
      message: 'Something went very wrong!',
    });
  }
};

/**
 * If the error is a CastError, then it will be handled by the handleCastError22P02 function.
 *
 * If the error is a JsonWebTokenError, then it will be handled by the handleJWTError function.
 *
 * If the error is a TokenExpiredError, then it will be handled by the handleJWTExpiredError function.
 *
 * If the error is none of the above, then it will be handled by the sendErrorProd function.
 * @param err - The error object that was thrown.
 * @param req - The request object.
 * @param res - The response object
 * @param next - This is a function that we call if we want to move on to the next middleware.
 */
const globalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'fail';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  }

  if (process.env.NODE_ENV === 'production') {
    let error = { ...err };

    if (!error.parent?.code) {
      error = err;
    }

    if (error.parent?.code === '22P02') error = handleCastError22P02(error);
    if (error.name === 'JsonWebTokenError') error = handleJWTError(error);

    sendErrorProd(error, res);
  }
};

module.exports = globalErrorHandler;
