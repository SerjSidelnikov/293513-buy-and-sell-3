'use strict';

const {Router} = require(`express`);
const offer = require(`../api/offer`);
const category = require(`../api/category`);
const search = require(`../api/search`);
const {OfferService, CommentService, CategoryService, SearchService} = require(`../data-service`);

module.exports = (mockData) => {
  const app = new Router();

  offer(app, new OfferService(mockData), new CommentService());
  category(app, new CategoryService(mockData));
  search(app, new SearchService(mockData));

  return app;
};
