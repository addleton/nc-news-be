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

describe("Invalid URL", () => {
    test("404: responds with status code when given an invalid url", () => {
        return request(app).get("/api/pepsi").expect(404);
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

describe("GET /api/articles", () => {
    test("200: responds with an array of all articles with relevant keys, sorted by date in descending order", () => {
        return request(app)
            .get("/api/articles")
            .expect(200)
            .then(({ body }) => {
                expect(body.articles).toHaveLength(13);
                expect(body.articles).toBeSortedBy("created_at", {
                    descending: true,
                });
                expect(body.articles.body).toBe(undefined);
                body.articles.forEach((article) => {
                    expect(article).toMatchObject({
                        author: expect.any(String),
                        title: expect.any(String),
                        article_id: expect.any(Number),
                        topic: expect.any(String),
                        created_at: expect.any(String),
                        votes: expect.any(Number),
                        article_img_url: expect.any(String),
                        comment_count: expect.any(String),
                    });
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
                expect(body.comments).toHaveLength(2);
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
    test("200: responds with an empty array when passed an article with no comments", () => {
        return request(app)
            .get("/api/articles/7/comments")
            .expect(200)
            .then(({ body }) => {
                expect(body.comments).toEqual([]);
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
    test("400: respond with error message when given an article id that is not a number", () => {
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
    test("404: responds with error message when given a number that does not exist", () => {
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
    });
});

describe("PATCH /api/articles/:article_id", () => {
    test("200: increments votes by amount passed in and responds with updated article", () => {
        const newVote = 5;
        return request(app)
            .patch("/api/articles/1")
            .send({ inc_votes: newVote })
            .expect(200)
            .then(({ body }) => {
                expect(body.article).toEqual({
                    article_id: 1,
                    title: "Living in the shadow of a great man",
                    topic: "mitch",
                    author: "butter_bridge",
                    body: "I find this existence challenging",
                    created_at: "2020-07-09T20:11:00.000Z",
                    votes: 105,
                    article_img_url:
                        "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
                });
            });
    });
    test("200: decrements votes by amount passed in and responds with updated article", () => {
        const newVote = -5;
        return request(app)
            .patch("/api/articles/1")
            .send({ inc_votes: newVote })
            .expect(200)
            .then(({ body }) => {
                expect(body.article).toEqual({
                    article_id: 1,
                    title: "Living in the shadow of a great man",
                    topic: "mitch",
                    author: "butter_bridge",
                    body: "I find this existence challenging",
                    created_at: "2020-07-09T20:11:00.000Z",
                    votes: 95,
                    article_img_url:
                        "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
                });
            });
    });
    test("200: does not decrement votes below 0", () => {
        const newVote = -1000;
        return request(app)
            .patch("/api/articles/1")
            .send({ inc_votes: newVote })
            .expect(200)
            .then(({ body }) => {
                expect(body.article).toEqual({
                    article_id: 1,
                    title: "Living in the shadow of a great man",
                    topic: "mitch",
                    author: "butter_bridge",
                    body: "I find this existence challenging",
                    created_at: "2020-07-09T20:11:00.000Z",
                    votes: 0,
                    article_img_url:
                        "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
                });
            });
    });
    test("400: responds with error when passed an article ID that is not a number", () => {
        const newVote = -5;
        return request(app)
            .patch("/api/articles/pepsi")
            .send({ inc_votes: newVote })
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("Bad request");
            });
    });
    test("404: responds with error when passed an article ID that is a number but does not exist", () => {
        const newVote = -5;
        return request(app)
            .patch("/api/articles/99")
            .send({ inc_votes: newVote })
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe("Article not found");
            });
    });
    test("400: responds with error when passed a vote that is not a number", () => {
        const newVote = "pepsi";
        return request(app)
            .patch("/api/articles/1")
            .send({ inc_votes: newVote })
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("Bad request");
            });
    });
});

describe("DELETE /api/comments/:comment_id", () => {
    test("204: responds with correct status", () => {
        return request(app).delete("/api/comments/2").expect(204);
    });
    test("400: responds with error message when given an ID that is not a number", () => {
        return request(app)
            .delete("/api/comments/pepsi")
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("Bad request");
            });
    });
    test("404: responds with error message when given an ID that does not exists", () => {
        return request(app)
            .delete("/api/comments/99")
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe("Comment not found");
            });
    });
});

describe("GET /api/users", () => {
    test("200: responds with an array of all users with relavant properties", () => {
        return request(app)
            .get("/api/users")
            .expect(200)
            .then(({ body }) => {
                expect(body.users).toHaveLength(4);
                body.users.forEach((user) => {
                    expect(user).toMatchObject({
                        username: expect.any(String),
                        name: expect.any(String),
                        avatar_url: expect.any(String),
                    });
                });
            });
    });
});

describe("GET /api/articles (topic query)", () => {
    test("200: responds with all articles matching the topic query", () => {
        return request(app)
            .get("/api/articles?topic=mitch")
            .expect(200)
            .then(({ body }) => {
                expect(body.articles).toHaveLength(12);
                body.articles.forEach((article) => {
                    expect(article.topic).toBe("mitch");
                });
            });
    });
    test("200: responds with an empty array when no articles contain the topic passed in", () => {
        return request(app)
            .get("/api/articles?topic=paper")
            .expect(200)
            .then(({ body }) => {
                expect(body.articles).toEqual([]);
            });
    });
    test("404: responds with a message when passed a query topic that does not exist", () => {
        return request(app)
            .get("/api/articles?topic=pepsi")
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe("Not found");
            });
    });
});

describe("GET /api/articles/:article_id (comment_count)", () => {
    test("200: responds with article with all relevant keys and a comment_count key", () => {
        return request(app)
            .get("/api/articles/1")
            .expect(200)
            .then(({ body }) => {
                expect(body.article).toMatchObject({
                    title: "Living in the shadow of a great man",
                    topic: "mitch",
                    author: "butter_bridge",
                    body: "I find this existence challenging",
                    created_at: "2020-07-09T20:11:00.000Z",
                    votes: 100,
                    article_img_url:
                        "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
                    comment_count: "11",
                });
            });
    });
    test("404: responds with error message when passed a number that does not match an article id", () => {
        return request(app)
            .get("/api/articles/99")
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe("Not Found");
            });
    });
    test("400: responds with error message when passed not a number", () => {
        return request(app)
            .get("/api/articles/pepsi")
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("Bad Request");
            });
    });
});

describe("GET /api/articles (sorting queries)", () => {
    test.only("200: responds with an array of all articles, sorted and ordered by the query passed in", () => {
        return request(app)
            .get("/api/articles?sort_by=article_id&order=asc")
            .expect(200)
            .then(({ body }) => {
                expect(body.articles).toBeSortedBy("article_id", {
                    ascending: true,
                });
            });
    });
});
