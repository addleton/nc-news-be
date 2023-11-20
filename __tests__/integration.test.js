const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data/index");
const sorted = require("jest-sorted");

afterAll(() => {
  return db.end();
});

beforeEach(() => {
  return seed(data);
});

test("200: all returned topics have relevant keys", () => {
  return request(app)
    .get("/api/topics")
    .expect(200)
    .then((response) => {
      expect(response.body).toHaveLength(3);
      response.body.forEach((topic) => {
        expect(topic).toMatchObject({
          slug: expect.any(String),
          description: expect.any(String),
        });
      });
    });
});
