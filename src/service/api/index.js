'use strict';

const {Router} = require(`express`);
const offer = require(`../api/offer`);
const category = require(`../api/category`);
const {OfferService, CommentService, CategoryService} = require(`../data-service`);
const getMockData = require(`../lib/get-mock-data`);

const app = new Router();

(async () => {
  const mockData = await getMockData();

  offer(app, new OfferService(mockData), new CommentService());
  category(app, new CategoryService(mockData));
})();

module.exports = app;
