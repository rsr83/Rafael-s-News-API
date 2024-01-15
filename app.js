const express = require("express");
const {
  getTopics,
  getError,
  getApi,
} = require("./controllers/topics-controllers");
const app = express();

app.get("/api/topics", getTopics);

app.get("/api", getApi);

app.all("*", getError);

app.use((err, req, res, next) => {
  // handle custom errors
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  }
  // handle specific psql errors
  else if (err.code === "22P02") {
    res.status(400).send({ msg: err.message || "Bad Request" });
  } else {
    // if the error hasn't been identified,
    // respond with an internal server error
    res.status(500).send({ msg: "Internal Server Error" });
  }
});

module.exports = app;
