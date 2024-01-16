const express = require("express");
const {
  getTopics,
  getError,
  getApi,
  getArticlesById,
  getArticles,
} = require("./controllers/topics-controllers");
const app = express();

app.get("/api/topics", getTopics);

app.get("/api", getApi);

app.get("/api/articles/:articles_id", getArticlesById);

app.get("/api/articles", getArticles);

app.all("*", getError);

app.use((err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else if (err.code === "22P02") {
    res.status(400).send({ msg: "Bad Request" });
  } else {
    res.status(500).send({ msg: "Internal Server Error" });
  }
});

module.exports = app;
