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
