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

describe("GET /api/articles/:article_id", () => {
    test("200: returns an article by id with all relevant properties", () => {
        return request(app)
            .get("/api/articles/3")
            .expect(200)
            .then(({ body }) => {
                expect(body).toMatchObject({
                    author: expect.any(String),
                    title: expect.any(String),
                    article_id: 3,
                    body: expect.any(String),
                    topic: expect.any(String),
                    created_at: expect.any(String),
                    votes: expect.any(Number),
                    article_img_url: expect.any(String),
                });
            });
    });
    test('400: returns "bad request" message when given an ID that is not a number', () => {
        return request(app)
            .get("/api/articles/pepsi")
            .expect(400)
            .then(({ body }) => {
              expect(body.msg).toBe('Bad Request')
            });
    });
});
