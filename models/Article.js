const mongoose = require("mongoose");

const articleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      unique: true,
      trim: true,
      maxlength: [50, "The title Must be 50 character only!"],
      required: true,
    },
    authorName: {
      type: String,
      required: [true, "Please Enter your name!!"],
    },
    body: String,
    photo: {
      type: String,
      default: "no-photo.jpg",
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

module.exports = mongoose.model("Article", articleSchema);
