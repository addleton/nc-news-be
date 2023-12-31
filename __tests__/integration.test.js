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

describe("Invalid URL", () => {
  test("404: responds with status code when given an invalid url", () => {
    return request(app).get("/api/pepsi").expect(404);
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
        expect(body.articles).toHaveLength(10);
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
          ascending: false,
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
  test("200: responds with an array of comments equal to the amount set by limit", () => {
    return request(app)
      .get("/api/articles/1/comments?limit=2")
      .expect(200)
      .then(({ body }) => {
        expect(body.comments).toHaveLength(2);
        expect(body.comments).toEqual([
          {
            comment_id: 5,
            body: "I hate streaming noses",
            article_id: 1,
            author: "icellusedkars",
            votes: 0,
            created_at: "2020-11-03T21:00:00.000Z",
          },
          {
            comment_id: 2,
            body: "The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.",
            article_id: 1,
            author: "butter_bridge",
            votes: 14,
            created_at: "2020-10-31T03:03:00.000Z",
          },
        ]);
      });
  });
  test("200: responds with array of comments when taking p query in", () => {
    return request(app)
      .get("/api/articles/1/comments?limit=2&p=3")
      .expect(200)
      .then(({ body }) => {
        expect(body.comments).toHaveLength(2);
        expect(body.comments).toEqual([
          {
            comment_id: 7,
            body: "Lobster pot",
            article_id: 1,
            author: "icellusedkars",
            votes: 0,
            created_at: "2020-05-15T20:19:00.000Z",
          },
          {
            comment_id: 8,
            body: "Delicious crackerbreads",
            article_id: 1,
            author: "icellusedkars",
            votes: 0,
            created_at: "2020-04-14T20:19:00.000Z",
          },
        ]);
      });
  });
  test("404: responds with error message when passed a number that does not match an article id", () => {
    return request(app)
      .get("/api/articles/99/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not found");
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
  test("400: should respond with a message when passed a non number for limit", () => {
    return request(app)
      .get("/api/articles/1/comments?limit=pepsi&p=2")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
  test("400: should respond with a message when passed a non number for page", () => {
    return request(app)
      .get("/api/articles/1/comments?limit=2&p=pepsi")
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
        expect(body.msg).toBe("Not found");
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
        expect(body.msg).toBe("Not found");
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
        expect(body.articles).toHaveLength(10);
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
  test("200: responds with an array of all articles, sorted and ordered by the query passed in", () => {
    return request(app)
      .get("/api/articles?sort_by=topic&order=asc")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toBeSortedBy("topic", {
          ascending: true,
        });
      });
  });
  test("400: responds with a message when passed an invalid sort by query", () => {
    return request(app)
      .get("/api/articles?sort_by=pepsi&order=asc")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
  test("400: responds with a message when passed an invalid order query", () => {
    return request(app)
      .get("/api/articles?sort_by=topic&order=pepsi")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
});

describe("GET /api/users/:username", () => {
  test("200: responds with a user object with the correct properties", () => {
    return request(app)
      .get("/api/users/icellusedkars")
      .expect(200)
      .then(({ body }) => {
        expect(body.user).toEqual({
          username: "icellusedkars",
          name: "sam",
          avatar_url:
            "https://avatars2.githubusercontent.com/u/24604688?s=460&v=4",
        });
      });
  });
  test("404: responds with a message when passed a username that does not exist", () => {
    return request(app)
      .get("/api/users/pepsi")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("User not found");
      });
  });
});

describe("PATCH /api/comments/:comment_id", () => {
  test("200: increments votes to comment id passed in and returns the updated comment", () => {
    const newVote = 5;
    return request(app)
      .patch("/api/comments/5")
      .send({ inc_votes: newVote })
      .expect(200)
      .then(({ body }) => {
        expect(body.comment).toEqual({
          comment_id: 5,
          body: "I hate streaming noses",
          votes: 5,
          author: "icellusedkars",
          article_id: 1,
          created_at: "2020-11-03T21:00:00.000Z",
        });
      });
  });
  test("200: decrements votes to comment id passed in and returns the updated comment", () => {
    const newVote = -50;
    return request(app)
      .patch("/api/comments/3")
      .send({ inc_votes: newVote })
      .expect(200)
      .then(({ body }) => {
        expect(body.comment).toEqual({
          comment_id: 3,
          body: "Replacing the quiet elegance of the dark suit and tie with the casual indifference of these muted earth tones is a form of fashion suicide, but, uh, call me crazy — onyou it works.",
          votes: 50,
          author: "icellusedkars",
          article_id: 1,
          created_at: "2020-03-01T01:13:00.000Z",
        });
      });
  });
  test("200: votes does not go below 0", () => {
    const newVote = -100;
    return request(app)
      .patch("/api/comments/5")
      .send({ inc_votes: newVote })
      .expect(200)
      .then(({ body }) => {
        expect(body.comment.votes).toBe(0);
      });
  });
  test("400: responds with error when passed a comment ID that is not a number", () => {
    const newVote = -5;
    return request(app)
      .patch("/api/comments/pepsi")
      .send({ inc_votes: newVote })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
  test("404: responds with error when passed a comment ID that is a number but does not exist", () => {
    const newVote = -5;
    return request(app)
      .patch("/api/comments/99")
      .send({ inc_votes: newVote })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Comment not found");
      });
  });
  test("400: responds with error when passed a vote that is not a number", () => {
    const newVote = "pepsi";
    return request(app)
      .patch("/api/comments/1")
      .send({ inc_votes: newVote })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
});

describe("POST /api/articles", () => {
  test("201: responds with the posted article with all the relevant properties", () => {
    const newArticle = {
      author: "lurker",
      title: "What is your favourite drink?",
      body: "Mine is pepsi",
      topic: "mitch",
      article_img_url:
        "https://www.megaretailer.com/media/catalog/product/cache/a6f4aec1db93cb13677a62a0babd5631/U/-/U-1PE3MCH0-15_11_2022_14_00_14.jpg",
    };
    return request(app)
      .post("/api/articles")
      .send(newArticle)
      .expect(201)
      .then(({ body }) => {
        expect(body.article).toEqual({
          author: "lurker",
          title: "What is your favourite drink?",
          body: "Mine is pepsi",
          topic: "mitch",
          article_img_url:
            "https://www.megaretailer.com/media/catalog/product/cache/a6f4aec1db93cb13677a62a0babd5631/U/-/U-1PE3MCH0-15_11_2022_14_00_14.jpg",
          article_id: 14,
          votes: 0,
          created_at: expect.any(String),
          comment_count: "0",
        });
      });
  });
  test("201: assigns default url to object when no url is provided", () => {
    const newArticle = {
      author: "lurker",
      title: "What is your favourite drink?",
      body: "Mine is pepsi",
      topic: "mitch",
    };
    return request(app)
      .post("/api/articles")
      .send(newArticle)
      .expect(201)
      .then(({ body }) => {
        expect(body.article.article_img_url).toBe(
          "https://img-rpba.s3.ap-southeast-2.amazonaws.com/wp-content/uploads/2022/09/21154112/siberianhuskycharacteristics-1024x766.jpg"
        );
      });
  });
  test("400: responds with a message when the new article is missing a property", () => {
    const newArticle = {
      author: "lurker",
      body: "Mine is pepsi",
      topic: "mitch",
    };
    return request(app)
      .post("/api/articles")
      .send(newArticle)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
  test("404: responds with a message if the user does not exist", () => {
    const newArticle = {
      author: "david",
      title: "What is your favourite drink?",
      body: "Mine is pepsi",
      topic: "mitch",
    };
    return request(app)
      .post("/api/articles")
      .send(newArticle)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not found");
      });
  });
  test("404: responds with a message if the topic does not exist", () => {
    const newArticle = {
      author: "lurker",
      title: "What is your favourite drink?",
      body: "Mine is pepsi",
      topic: "wallpaper",
    };
    return request(app)
      .post("/api/articles")
      .send(newArticle)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not found");
      });
  });
});

describe("GET /api/articles (pagination)", () => {
  test("200: responds with an array of articles equal to the amount set by limit and a total count of all articles", () => {
    return request(app)
      .get("/api/articles?limit=2")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toHaveLength(2);
        expect(body.total_count).toEqual("13");
        expect(body.articles).toEqual([
          {
            article_id: 3,
            title: "Eight pug gifs that remind me of mitch",
            topic: "mitch",
            author: "icellusedkars",
            body: "some gifs",
            created_at: "2020-11-03T09:12:00.000Z",
            votes: 0,
            article_img_url:
              "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
            comment_count: "2",
          },
          {
            article_id: 6,
            title: "A",
            topic: "mitch",
            author: "icellusedkars",
            body: "Delicious tin of cat food",
            created_at: "2020-10-18T01:00:00.000Z",
            votes: 0,
            article_img_url:
              "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
            comment_count: "1",
          },
        ]);
      });
  });
  test("200: responds with array of articles when taking p query in", () => {
    return request(app)
      .get("/api/articles?limit=2&p=3")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toHaveLength(2);
        expect(body.total_count).toBe("13");
        expect(body.articles).toEqual([
          {
            article_id: 12,
            title: "Moustache",
            topic: "mitch",
            author: "butter_bridge",
            body: "Have you seen the size of that thing?",
            created_at: "2020-10-11T11:24:00.000Z",
            votes: 0,
            article_img_url:
              "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
            comment_count: "0",
          },
          {
            article_id: 5,
            title: "UNCOVERED: catspiracy to bring down democracy",
            topic: "cats",
            author: "rogersop",
            body: "Bastet walks amongst us, and the cats are taking arms!",
            created_at: "2020-08-03T13:14:00.000Z",
            votes: 0,
            article_img_url:
              "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
            comment_count: "2",
          },
        ]);
      });
  });
  test("200: responds with correct total_count when passed any filters", () => {
    return request(app)
      .get("/api/articles?topic=mitch&limit=2")
      .expect(200)
      .then(({ body }) => {
        expect(body.total_count).toBe("12");
        expect(body.articles).toEqual([
          {
            article_id: 3,
            title: "Eight pug gifs that remind me of mitch",
            topic: "mitch",
            author: "icellusedkars",
            body: "some gifs",
            created_at: "2020-11-03T09:12:00.000Z",
            votes: 0,
            article_img_url:
              "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
            comment_count: "2",
          },
          {
            article_id: 6,
            title: "A",
            topic: "mitch",
            author: "icellusedkars",
            body: "Delicious tin of cat food",
            created_at: "2020-10-18T01:00:00.000Z",
            votes: 0,
            article_img_url:
              "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
            comment_count: "1",
          },
        ]);
      });
  });
  test("400: should respond with a message when passed a non number for limit", () => {
    return request(app)
      .get("/api/articles?limit=pepsi")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
  test("400: should respond with a message when passed a non number for page", () => {
    return request(app)
      .get("/api/articles?limit=2&p=pepsi")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
});

describe("POST /api/topics", () => {
  test("201: responds with the newly added topic passed in", () => {
    const newTopic = {
      slug: "test_topic",
      description: "test_desc",
    };
    return request(app)
      .post("/api/topics")
      .send(newTopic)
      .expect(201)
      .then(({ body }) => {
        expect(body.topic).toEqual({
          slug: "test_topic",
          description: "test_desc",
        });
      });
  });
  test("400: responds with a message when input is missing a property", () => {
    const newTopic = {
      description: "test_desc",
    };
    return request(app)
      .post("/api/topics")
      .send(newTopic)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
});

describe("DELETE /api/articles/:article_id", () => {
  test("204: responds with status code", () => {
    return request(app).delete("/api/articles/4").expect(204);
  });
  test("400: responds with an error message when passed an id that is not a number", () => {
    return request(app)
      .delete("/api/articles/pepsi")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
  test("404: responds with an error message when passed an id that does not exist", () => {
    return request(app)
      .delete("/api/articles/99")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not found");
      });
  });
});
