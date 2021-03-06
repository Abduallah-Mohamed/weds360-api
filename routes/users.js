const express = require("express");
const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
} = require("../controllers/user");

// const User = require("../models/User");

const router = express.Router({ mergeParams: true });

// const advancedResults = require('../middleware/advancedResults');
const { protect, authorize } = require("../middleware/auth");

router.get("/", getUsers);

router.use(protect);
router.use(authorize("admin"));

router.route("/").post(createUser);

router.route("/:id").get(getUser).put(updateUser).delete(deleteUser);

module.exports = router;
