const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const User = require("../models/User");

/*
 * @desc    Register User
 * @route   api/v1/auth/Register
 * @access  Public
 */

exports.register = asyncHandler(async (req, res, next) => {
  const { name, email, password, role } = req.body;

  const user = await User.create({
    name,
    email,
    password,
    role,
  });

  //   Create token with id as a payload
  const token = user.getSignJwtToken();

  sendTokenResponse(user, 200, res);
});

/*
 * @desc    Login User
 * @route   api/v1/auth/login
 * @access  Public
 */

exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  //   Validate email and password
  if (!email || !password) {
    return next(
      new ErrorResponse("Please, Enter the email and password fields !!", 400)
    );
  }

  //   check for a user is in a database or not
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorResponse("Invalid credintials!", 401));
  }

  //   Check if password matching
  const isMatch = await user.matchPasswords(password);

  if (!isMatch) {
    return next(new ErrorResponse("Invalid Credentials!!", 401));
  }

  //   Create token with id as a payload
  const token = user.getSignJwtToken();

  sendTokenResponse(user, 200, res);
});

// * @desc      Log user out / clear cookie
// * @route     GET /api/v1/auth/logout
// * @access    Public
exports.logout = asyncHandler(async (req, res, next) => {
  res.cookie("token", "none", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    data: {},
  });
});

// Get token from a model, create a cookie and send response.
const sendTokenResponse = (user, statusCode, res) => {
  //   Create token with id as a payload
  const token = user.getSignJwtToken();

  const options = {
    expires: new Date(
      Date.now + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  //   to be sent with an http(s)
  // if (process.env.NODE_ENV === "production") {
  //   opotions.secure = true;
  // }

  res
    .status(statusCode)
    .cookie("token", token, options)
    .json({ sucess: true, token });
};

/*
 * @desc    Get Current Logged User
 * @route   api/v1/auth/me
 * @access  Private
 */
exports.getMe = asyncHandler(async (req, res, next) => {
  console.log(req.user);
  const user = await User.findOne(req.user._id);

  res.status(200).json({ success: true, data: user });
});
