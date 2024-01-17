const express = require("express");
const {
  getTopics,
  getError,
  getApi,
  getArticlesById,
  getArticles,
  getCommentByArticleId,
  postCommentByArticleId,
  patchArticlesById,
} = require("./controllers/topics-controllers");
const app = express();
app.use(express.json());

app.get("/api/topics", getTopics);

app.get("/api", getApi);

app.get("/api/articles/:article_id", getArticlesById);
app.patch("/api/articles/:article_id", patchArticlesById);

app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id/comments", getCommentByArticleId);
app.post("/api/articles/:article_id/comments", postCommentByArticleId);

app.all("*", getError);

app.use((err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else if (err.code === "22P02") {
    res.status(400).send({ msg: "Bad Request" });
  } else if (err.code === "23502") {
    res.status(400).send({ msg: "Post Missing Data" });
  } else if (err.code === "23503") {
    res.status(404).send({ msg: "Not Found" });
  } else {
    res.status(500).send({ msg: "Internal Server Error" });
  }
});

module.exports = app;
