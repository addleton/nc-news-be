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

describe("GET /api/topics", () => {
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
});

describe('GET /api', () => {
  test('200: responds with an object of all available endpoints and descriptions', () => {
    return request(app).get('/api').expect(200).then((response) => {
      expect(response.body).toMatchObject({
        "GET /api": {
          "description": "serves up a json representation of all the available endpoints of the api"
        },
        "GET /api/topics": {
          "description": "serves an array of all topics",
          "queries": [],
          "exampleResponse": {
            "topics": [{ "slug": "football", "description": "Footie!" }]
          }
        },
        "GET /api/articles": {
          "description": "serves an array of all articles",
          "queries": ["author", "topic", "sort_by", "order"],
          "exampleResponse": {
            "articles": [
              {
                "title": "Seafood substitutions are increasing",
                "topic": "cooking",
                "author": "weegembump",
                "body": "Text from the article..",
                "created_at": "2018-05-30T15:59:13.341Z",
                "votes": 0,
                "comment_count": 6
              }
            ]
          }
        }
      })
  });
});
})
