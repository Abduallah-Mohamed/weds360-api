const path = require("path");
const Article = require("../models/Article");
const asyncHandler = require("../middleware/async");
const ErrorResponse = require("../utils/errorResponse");

/*
 * @desc    Get all Articles
 * @route   api/v1/articles
 * @access  Public
 */
exports.getArticles = asyncHandler(async (req, res, next) => {
  const articles = await Article.find();

  if (!articles) {
    return next(
      new ErrorResponse(`There is no articles in the database!!`, 404)
    );
  }
  res.status(200).json(articles);
});

/*
 * @desc    Get single Article
 * @route   api/v1/articles/:id
 * @access  Public
 */
exports.getSingleArticle = asyncHandler(async (req, res, next) => {
  const article = await Article.findById(req.params.id);

  if (!article) {
    return next(
      new ErrorResponse(
        `The article with id ${req.params.id} is not exist `,
        404
      )
    );
  }

  res.status(200).json(article);
});

/*
 * @desc    Create New Article
 * @route   api/v1/articles
 * @access  Public
 */
exports.createArticle = asyncHandler(async (req, res, next) => {
  // req.body.user = req.user._id;
  const article = await Article.create(req.body);

  res.status(201).json(article);
});

/*
 * @desc    Get single Article
 * @route   api/v1/articles/:id
 * @access  Private
 */
exports.updateSingleArticle = asyncHandler(async (req, res, next) => {
  const article = await Article.findByIdAndUpdate(req.params.id, req.body, {
    runValidators: true,
  });

  if (!article) {
    return next(
      new ErrorResponse(`There is no article with Id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json(article);
});

/*
 * @desc    Get single Article
 * @route   api/v1/articles/:id
 * @access  Private
 */
exports.deleteSingleArticle = async (req, res, next) => {
  try {
    await Article.findByIdAndDelete(req.params.id);
    res.status(200).json({
      success: true,
    });
  } catch (error) {
    next(error);
  }
};

/*
 * @desc    upload image
 * @route   api/v1/articles/:id
 * @access  Public
 */
exports.uploadFile = asyncHandler(async (req, res, next) => {
  const article = await Article.findById(req.params.id);

  if (!article) {
    return next(
      new ErrorResponse(
        `The article with id ${req.params.id} is not exist `,
        404
      )
    );
  }

  if (!req.files) {
    return next(new ErrorResponse(`Please Upload a file`, 400));
  }

  const file = req.files.file;

  // Make sure it is an image
  if (!file.mimetype.startsWith("image")) {
    return next(new ErrorResponse(`Please Upload an image`, 400));
  }

  // check the file size
  if (file.size > process.env.MAX_FILE_UPLOADS) {
    return next(
      new ErrorResponse(
        `Please, Upload an image is less than ${process.env.MAX_FILE_UPLOADS}`,
        400
      )
    );
  }

  // Create custom file photo to prevent the override for two identical names.
  // file.name = `photo_${req.params.id}.${file.mimetype.split("/")[1]}`;
  file.name = `photo_${req.params.id}${path.parse(file.name).ext}`;

  // save the file using mv function
  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
    if (err) {
      return next(
        new ErrorResponse(
          `There is a problem while uploading the image ... and we are working on it, thank you for visiting our site`,
          500
        )
      );
    }

    await Article.findByIdAndUpdate(req.params.id, { photo: file.name });

    res.status(200).json({
      success: true,
      data: file.name,
    });
  });

  console.log(file.name);
});
