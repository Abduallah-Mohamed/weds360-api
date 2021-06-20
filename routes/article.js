const router = require("express").Router();
const {
  getArticles,
  createArticle,
  getSingleArticle,
  updateSingleArticle,
  deleteSingleArticle,
  uploadFile,
} = require("../controllers/article");

const { protect, authorize } = require("../middleware/auth");

router.route("/").get(getArticles).post(createArticle);

router
  .route("/:id")
  .get(getSingleArticle)
  .delete(deleteSingleArticle)
  .put(updateSingleArticle);

router.route("/:id/photo").put(uploadFile);

module.exports = router;
