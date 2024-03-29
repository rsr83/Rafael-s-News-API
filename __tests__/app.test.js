const request = require("supertest");
const app = require("../app.js");
const db = require("../db/connection.js");
const data = require("../db/data/test-data");
const seed = require("../db/seeds/seed.js");

afterAll(() => {
  db.end();
});

beforeEach(() => seed(data));

describe("/api/topics", () => {
  test("GET 200: initial test to check if everything is workimg properly", () => {
    return request(app).get("/api/topics").expect(200);
  });
  test("GET 200: return all the topics", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then((response) => {
        expect(response.body.topics.length).toBe(3);
        response.body.topics.forEach((topic) => {
          expect(typeof topic.slug).toBe("string");
          expect(typeof topic.description).toBe("string");
        });
      });
  });
  test("GET 404: this request should return an error if the user send any other request path", () => {
    return request(app)
      .get("/banana")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Invalid Request");
      });
  });
});

describe("/api", () => {
  test("GET 200: receive a description of all other endpoints available", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then((response) => {
        expect(Object.keys(response.body.api)).toEqual([
          "GET /api",
          "GET /api/topics",
          "GET api/articles/:article_id",
          "PATCH api/articles/:article_id",
          "GET /api/articles",
          "GET /api/articles/:article_id/comments",
          "POST /api/articles/:article_id/comments",
          "DELETE /api/comments/:comment_id",
          "GET /api/users",
        ]);
      });
  });
});

describe("/api/articles/:article_id", () => {
  test("GET 200: receive a the article requested by their respective id", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then((response) => {
        expect(response.body.article.article_id).toBe(1);
        expect(response.body.article.title).toBe(
          "Living in the shadow of a great man"
        );
        expect(response.body.article.topic).toBe("mitch");
        expect(response.body.article.author).toBe("butter_bridge");
        expect(response.body.article.body).toBe(
          "I find this existence challenging"
        );
        expect(response.body.article.created_at).toBe(
          "2020-07-09T20:11:00.000Z"
        );
        expect(response.body.article.votes).toBe(100);
        expect(response.body.article.article_img_url).toBe(
          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
        );
      });
  });
  test("GET 200: the same as the test before adding comment_count", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then((response) => {
        expect(response.body.article.article_id).toBe(1);
        expect(response.body.article.comment_count).toBe("11");
      });
  });
  test("GET:404 sends an appropriate status and error message when given a valid but non-existent id", () => {
    return request(app)
      .get("/api/articles/999")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Article not found");
      });
  });
  test("GET:400 sends an appropriate status and error message when given an invalid id", () => {
    return request(app)
      .get("/api/articles/not-an-article")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad Request");
      });
  });
  describe("PATCH: update votes number in a given article_id", () => {
    it("PATCH 200: increment by 1", () => {
      return request(app)
        .patch("/api/articles/1")
        .send({
          inc_votes: 1,
        })
        .expect(200)
        .then((response) => {
          expect(response.body.article.votes).toBe(101);
          expect(response.body.article.article_id).toBe(1);
          expect(response.body.article).toMatchObject({
            title: "Living in the shadow of a great man",
            topic: "mitch",
            author: "butter_bridge",
            body: "I find this existence challenging",
            article_img_url:
              "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
          });
        });
    });
    it("PATCH 200: decrement by 100", () => {
      return request(app)
        .patch("/api/articles/1")
        .send({
          inc_votes: -100,
        })
        .expect(200)
        .then((response) => {
          expect(response.body.article.votes).toBe(0);
          expect(response.body.article.article_id).toBe(1);
        });
    });
    it("PATCH:404 sends an error message when given a valid but non-existent article_id", () => {
      return request(app)
        .patch("/api/articles/999")
        .send({
          inc_votes: 1,
        })
        .expect(404)
        .then((response) => {
          expect(response.body.msg).toBe("Article not found");
        });
    });
    it("PATCH:400 sends an error message when given a invalid article_id", () => {
      return request(app)
        .patch("/api/articles/not_an_article")
        .send({
          inc_votes: 1,
        })
        .expect(400)
        .then((response) => {
          expect(response.body.msg).toBe("Bad Request");
        });
    });
    it("PATCH:400 sends an error message when the patch is missing/have wrong data in its body", () => {
      return request(app)
        .patch("/api/articles/not_an_article")
        .send({
          banana: 1,
        })
        .expect(400)
        .then((response) => {
          expect(response.body.msg).toBe("Bad Request");
        });
    });
  });
});

describe("/api/articles", () => {
  test("GET 200: return all the articles sorted by date in descending order", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((response) => {
        expect(response.body.articles.length).toBe(13);
        response.body.articles.forEach((article) => {
          expect(typeof article.author).toBe("string");
          expect(typeof article.title).toBe("string");
          expect(typeof article.article_id).toBe("number");
          expect(typeof article.topic).toBe("string");
          expect(typeof article.created_at).toBe("string");
          expect(typeof article.votes).toBe("number");
          expect(typeof article.article_img_url).toBe("string");
          expect(typeof article.comment_count).toBe("string");
        });
        expect(response.body.articles).toBeSortedBy("created_at", {
          descending: true,
        });
      });
  });
  test("GET 200: return all the articles sorted by article_id in descending order (default)", () => {
    return request(app)
      .get("/api/articles?sort_by=article_id")
      .expect(200)
      .then((response) => {
        expect(response.body.articles.length).toBe(13);
        response.body.articles.forEach((article) => {
          expect(typeof article.author).toBe("string");
          expect(typeof article.title).toBe("string");
          expect(typeof article.article_id).toBe("number");
          expect(typeof article.topic).toBe("string");
          expect(typeof article.created_at).toBe("string");
          expect(typeof article.votes).toBe("number");
          expect(typeof article.article_img_url).toBe("string");
          expect(typeof article.comment_count).toBe("string");
        });
        expect(response.body.articles).toBeSortedBy("article_id", {
          descending: true,
        });
      });
  });
  test("GET 200: return all the articles sorted by author in ascending order (default)", () => {
    return request(app)
      .get("/api/articles?sort_by=author&order=ASC")
      .expect(200)
      .then((response) => {
        expect(response.body.articles.length).toBe(13);
        response.body.articles.forEach((article) => {
          expect(typeof article.author).toBe("string");
          expect(typeof article.title).toBe("string");
          expect(typeof article.article_id).toBe("number");
          expect(typeof article.topic).toBe("string");
          expect(typeof article.created_at).toBe("string");
          expect(typeof article.votes).toBe("number");
          expect(typeof article.article_img_url).toBe("string");
          expect(typeof article.comment_count).toBe("string");
        });
        expect(response.body.articles).toBeSortedBy("author", {
          descending: false,
        });
      });
  });
  test("GET 200: return articles filtered by topics", () => {
    return request(app)
      .get("/api/articles?topic=mitch")
      .expect(200)
      .then((response) => {
        expect(response.body.articles.length).toBe(12);
        response.body.articles.forEach((article) => {
          expect(article.topic).toBe("mitch");
        });
      });
  });
  test("GET 400: return error message if sorted by an inexistent column", () => {
    return request(app)
      .get("/api/articles?sort_by=banana")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad Request");
      });
  });
  test("GET 400: return error message if orderd by anything but ASC or DESC", () => {
    return request(app)
      .get("/api/articles?sort_by=author&order=banana")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad Request");
      });
  });
  test("GET 404: return error message if the topic was not found", () => {
    return request(app)
      .get("/api/articles?topic=banana")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Topic Not Found");
      });
  });
});

describe("/api/articles/:article_id/comments", () => {
  test("GET 200: receive all the comments from a specific article passed sorted by date in descending order", () => {
    return request(app)
      .get("/api/articles/3/comments")
      .expect(200)
      .then((response) => {
        expect(response.body.comments.length).toBe(2);
        response.body.comments.forEach((comment) => {
          expect(comment.article_id).toBe(3);
          expect(typeof comment.comment_id).toBe("number");
          expect(typeof comment.body).toBe("string");
          expect(typeof comment.author).toBe("string");
          expect(typeof comment.votes).toBe("number");
          expect(typeof comment.created_at).toBe("string");
        });
        expect(response.body.comments).toBeSortedBy("created_at", {
          descending: true,
        });
      });
  });
  test("GET:404 sends an appropriate status and error message when passed a valid but non-existent article_id", () => {
    return request(app)
      .get("/api/articles/999/comments")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Article not found");
      });
  });
  test("GET:400 sends an appropriate status and error message when passed an invalid article_id", () => {
    return request(app)
      .get("/api/articles/not-an-article/comments")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad Request");
      });
  });
  test("GET 200: receive an empty array when the article has no comments", () => {
    return request(app)
      .get("/api/articles/2/comments")
      .expect(200)
      .then((response) => {
        expect(response.body.comments.length).toBe(0);
      });
  });
  test("POST 201: add a comment in a especific article passed", () => {
    return request(app)
      .post("/api/articles/3/comments")
      .send({
        username: "lurker",
        body: "this is a test",
      })
      .expect(201)
      .then((response) => {
        expect(response.body.comment).toMatchObject({
          comment_id: 19,
          body: "this is a test",
          article_id: 3,
          author: "lurker",
          votes: 0,
        });
      });
  });
  test("POST:404 responds with an error if the username does not exists ", () => {
    return request(app)
      .post("/api/articles/3/comments")
      .send({
        username: "banana",
        body: "this is a test",
      })
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Not Found");
      });
  });
  test("POST:400 responds with an error message when missing data in the body passed ", () => {
    return request(app)
      .post("/api/articles/3/comments")
      .send({
        body: "this is a test",
      })
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad Request");
      });
  });
  test("POST:404 responds with an error message when trying to comment in a nonexistent article ", () => {
    return request(app)
      .post("/api/articles/999/comments")
      .send({
        username: "lurker",
        body: "this is a test",
      })
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Not Found");
      });
  });
  test("POST:400 responds with an error message when trying to comment in an invalid article_id", () => {
    return request(app)
      .post("/api/articles/not_an_article/comments")
      .send({
        username: "lurker",
        body: "this is a test",
      })
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad Request");
      });
  });
});

describe("/api/comments/:comment_id", () => {
  test("DELETE 204: deletes a comment given its comment_id", () => {
    return request(app).delete("/api/comments/1").expect(204);
  });
  test("DELETE:404 responds with an appropriate status and error message when given a non-existent id", () => {
    return request(app)
      .delete("/api/comments/999")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Comment Not Found");
      });
  });
  test("DELETE:400 responds with an appropriate status and error message when given an invalid id", () => {
    return request(app)
      .delete("/api/comments/not-a-comment")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad Request");
      });
  });
});

describe("/api/users", () => {
  test("GET 200: return all the users", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then((response) => {
        expect(response.body.users.length).toBe(4);
        response.body.users.forEach((user) => {
          expect(typeof user.username).toBe("string");
          expect(typeof user.name).toBe("string");
          expect(typeof user.avatar_url).toBe("string");
        });
      });
  });
});
