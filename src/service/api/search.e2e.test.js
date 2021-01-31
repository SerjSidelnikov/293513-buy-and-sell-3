'use strict';

const express = require(`express`);
const request = require(`supertest`);

const search = require(`./search`);
const SearchService = require(`../data-service/search`);
const {HttpCode, mockData} = require(`../../constants`);

const app = express();
app.use(express.json());
search(app, new SearchService(mockData));

describe(`API returns offers based on search query`, () => {
  let response;

  beforeAll(async () => {
    response = await request(app)
      .get(`/search`)
      .query({
        query: `Продам новую приставку`
      });
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Two offer found`, () => expect(response.body.length).toBe(2));
  test(`Offer has correct id`, () => expect(response.body[0].id).toBe(`rRiNg5`));
});

test(`API returns code 404 if nothing is found`, async () => {
  await request(app).get(`/search`).query({
    query: `Продам свою душу`,
  }).expect(HttpCode.NOT_FOUND);
});

test(`API returns code 400 when query string is absent`, async () => {
  await request(app).get(`/search`).expect(HttpCode.BAD_REQUEST);
});
