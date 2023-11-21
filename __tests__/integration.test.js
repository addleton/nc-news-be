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

describe("POST /api/articles/:article_id/comments", () => {
    test("201: inserts new comment into db and responds with posted comment", () => {
        const newComment = {
            username: "butter_bridge",
            body: "There are a lot of different mysterious places in this world and I would love to visit any of them.",
        };
        return request(app)
            .post("/api/articles/1/comments")
            .send(newComment)
            .expect(201)
            .then(({ body }) => {
                expect(body.comment).toMatchObject({
                    body: "There are a lot of different mysterious places in this world and I would love to visit any of them.",
                    author: "butter_bridge",
                    votes: expect.any(Number),
                    article_id: expect.any(Number),
                    created_at: expect.any(String),
                });
            });
    });
    test("400: responds with error message when new comment is missing a property", () => {
        const newComment = {
            body: "There are a lot of different mysterious places in this world and I would love to visit any of them.",
        };
        return request(app)
            .post("/api/articles/1/comments")
            .send(newComment)
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("Bad request");
            });
    });
    test('400: respond with error message when given an article id that is not a number', () => {
        const newComment = {
            username: "butter_bridge",
            body: "There are a lot of different mysterious places in this world and I would love to visit any of them.",
        };
        return request(app)
        .post("/api/articles/pepsi/comments")
        .send(newComment)
        .expect(400)
        .then(({ body }) => {
            expect(body.msg).toBe("Bad request");
        });
    });
    test('404: responds with error message when given a number that does not exist', () => {
        const newComment = {
            username: "butter_bridge",
            body: "There are a lot of different mysterious places in this world and I would love to visit any of them.",
        };
        return request(app)
        .post("/api/articles/99/comments")
        .send(newComment)
        .expect(404)
        .then(({ body }) => {
            expect(body.msg).toBe("Article not found");
        });
    })
});
