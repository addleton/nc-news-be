const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data/index");
const sorted = require("jest-sorted");
const fs = require("fs/promises");

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

            .then(({ body }) => {
                expect(body.topics).toHaveLength(3);
                body.topics.forEach((topic) => {
                    expect(topic).toMatchObject({
                        slug: expect.any(String),
                        description: expect.any(String),
                    });
                });
            });
    });
});
describe("GET /api", () => {
    test("200: responds with an object of all available endpoints and descriptions", () => {
        return request(app)
            .get("/api")
            .expect(200)
            .then((response) => {
                return fs
                    .readFile(`${__dirname}/../endpoints.json`, "utf8")
                    .then((contents) => {
                        const parsedContents = JSON.parse(contents);
                        expect(response.body).toEqual(parsedContents);
                    });
            });
    });
});

describe("GET /api/articles/:article_id/comments", () => {
    test("200: responds with comment with all relavant keys, most recent first", () => {
        return request(app)
            .get("/api/articles/5/comments")
            .expect(200)
            .then(({ body }) => {
                expect(body.comments).toBeSorted("created_at", {
                    ascending: true,
                });
                body.comments.forEach((comment) => {
                    expect(comment).toMatchObject({
                        comment_id: expect.any(Number),
                        votes: expect.any(Number),
                        created_at: expect.any(String),
                        author: expect.any(String),
                        body: expect.any(String),
                        article_id: expect.any(Number),
                    });
                });
            });
    });
    test("200: is added to api endpoint", () => {
        return request(app)
            .get("/api")
            .expect(200)
            .then((response) => {
                return fs
                    .readFile(`${__dirname}/../endpoints.json`, "utf8")
                    .then((contents) => {
                        const parsedContents = JSON.parse(contents);
                        expect(
                            Object.hasOwn(
                                response.body,
                                "GET /api/articles/:article_id/comments"
                            )
                        ).toBe(true);
                    });
            });
    });
    test("404: responds with error message when passed a number that does not match an article id", () => {
        return request(app)
            .get("/api/articles/99/comments")
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe("Article not found");
            });
    });
    test("400: responds with error messahe when passed not a number", () => {
        return request(app)
            .get("/api/articles/pepsi/comments")
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("Bad request");
            });
    });
});
