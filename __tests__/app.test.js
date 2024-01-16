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
          "GET /api/articles",
        ]);
      });
  });
});

describe("/api/articles/:articles_id", () => {
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
});

describe("/api/articles/:articles_id", () => {
  test("GET 200: receive all the comments from a especific article passed", () => {
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
});

//api/articles/:article_id/comments
