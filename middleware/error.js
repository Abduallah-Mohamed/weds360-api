const ErrorResponse = require("../utils/errorResponse");

const errorHandler = (err, req, res, next) => {
  let error = { ...err }; // Make a copy of the The err.
  error.message = err.message;

  // Log the console for dev
  console.log(err);

  //   Mongoose Bad Object id
  if (err.name === "CastError") {
    const message = `The Resource is not exist with Id of ${err.value}`;
    error = new ErrorResponse(message, 404);
  }

  //   Mongoose Dublicate Error Handler
  if (err.code === 11000) {
    const message = "Your Artical Name must be a Unique!";
    error = new ErrorResponse(message, 400);
  }

  // Mongoose Validation Error
  if (err.name === "ValidationError") {
    // console.log(err.errors);
    const message = Object.values(err.errors).map((value) => value.message);
    error = new ErrorResponse(message, 400);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || "Server Error",
  });
};

module.exports = errorHandler;
