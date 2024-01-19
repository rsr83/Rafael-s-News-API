const express = require("express");
const { getError } = require("./controllers/topics-controllers");
const apiRouter = require("./Routes/api.router");
const app = express();
app.use(express.json());

app.use("/api", apiRouter);

app.all("*", getError);

const errCodes = ["22P02", "42703", "42601", "23502"];
app.use((err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else if (errCodes.includes(err.code)) {
    res.status(400).send({ msg: "Bad Request" });
  } else if (err.code === "23503") {
    res.status(404).send({ msg: "Not Found" });
  } else {
    res.status(500).send({ msg: "Internal Server Error" });
  }
});

module.exports = app;
