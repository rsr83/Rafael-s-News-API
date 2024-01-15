const request = require("supertest");
const app = require("../app.js");
const db = require("../db/connection.js");
const data = require("../db/data/test-data");
const seed = require("../db/seeds/seed.js");

afterAll(() => {
  db.end();
});

beforeEach(() => seed(data));

describe.only("/api/topics", () => {
  test("GET 200: this request should return an array with nested objects containing all the treasures, youngest first by default ", () => {
    return request(app).get("/api/treasures").expect(200);
  });
});
