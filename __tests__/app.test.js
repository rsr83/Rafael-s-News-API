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
