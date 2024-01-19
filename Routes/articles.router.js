const articlesRouter = require("express").Router();
const {
  getArticles,
  getArticlesById,
  patchArticlesById,
  getCommentByArticleId,
  postCommentByArticleId,
} = require("../controllers/topics-controllers");

articlesRouter.get("/", getArticles);

articlesRouter
  .route("/:article_id")
  .get(getArticlesById)
  .patch(patchArticlesById);

articlesRouter
  .route("/:article_id/comments")
  .get(getCommentByArticleId)
  .post(postCommentByArticleId);

module.exports = articlesRouter;
