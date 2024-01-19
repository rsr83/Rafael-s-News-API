const apiRouter = require("express").Router();
const {
  getApi,
  getTopics,
  getUsers,
} = require("../controllers/topics-controllers");
const articlesRouter = require("./articles.router");
const commentsRouter = require("./comments.router");

apiRouter.get("/", getApi);

apiRouter.get("/topics", getTopics);

apiRouter.use("/articles", articlesRouter);

apiRouter.get("/users", getUsers);

apiRouter.use("/comments", commentsRouter);

module.exports = apiRouter;
