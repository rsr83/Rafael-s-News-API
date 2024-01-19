const articleIdRouter = require("express").Router();
const {
  getArticlesById,
  patchArticlesById,
} = require("../controllers/topics-controllers");
const commentsRouter = require("./comments.router");

articleIdRouter.route("/").get(getArticlesById).patch(patchArticlesById);

articleIdRouter.use("/comments", commentsRouter);

module.exports = articleIdRouter;
