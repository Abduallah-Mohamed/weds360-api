const jwt = require("jsonwebtoken");
const asyncHandler = require("./async");
const ErrorResponse = require("../utils/errorResponse");
const User = require("../models/User");

// Protect router
exports.protect = asyncHandler(async (req, res, next) => {
  let token;
  if (req.cookies.token) {
    console.log("from the auth middleware ...  this is cookies");
    token = req.cookies.token;
  } else if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    console.log("from the auth middleware ...  this header");
    token = req.headers.authorization.split(" ")[1];
  } else {
    console.log("there is no token in header or cookies");
  }

  if (!token) {
    return next(
      new ErrorResponse(
        "You are not allowed to access this route!! because there is no token",
        401
      )
    );
  }

  try {
    //   if the token is exist we need to verify it
    console.log("from try");
    const decoded = await jwt.decode(token, process.env.JWT_SECRET);

    console.log(decoded);

    req.user = await User.findById(decoded.id);

    next();
  } catch (error) {
    console.log("form protect middleware");
    return next(
      new ErrorResponse("You are not allowed to access this route!!", 401)
    );
  }
});

// Grant access to specific routes
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorResponse(
          `User Role ${req.user.role} is not allowed to do access this route!!!!!!!!`,
          401
        )
      );
    }

    next();
  };
};
