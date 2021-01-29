'use strict';

const {HttpCode} = require(`../../constants`);

const offerKeys = [`type`, `title`, `description`, `sum`, `picture`, `category`];

module.exports = (req, res, next) => {
  const newOffer = req.body;
  const keys = Object.keys(newOffer);
  const keysExists = offerKeys.every((key) => keys.includes(key));

  if (!keysExists) {
    return res.status(HttpCode.BAD_REQUEST).send(`Bad request`);
  }

  return next();
};
