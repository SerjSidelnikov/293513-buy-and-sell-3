'use strict';

const {Router} = require(`express`);
const api = require(`../api`).getAPI();
const asyncMiddleware = require(`../middleware/async-middleware`);

const myRouter = new Router();

myRouter.get(`/`, asyncMiddleware(async (req, res) => {
  const offers = await api.getOffers();
  res.render(`my-tickets`, {offers});
}));

myRouter.get(`/comments`, asyncMiddleware(async (req, res) => {
  const offers = await api.getOffers();
  res.render(`comments`, {offers: offers.slice(0, 3)});
}));

module.exports = myRouter;
