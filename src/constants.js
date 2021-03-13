'use strict';

const DEFAULT_COMMAND = `--help`;
const USER_ARGV_INDEX = 2;
const MAX_ID_LENGTH = 6;
const MAX_COMMENTS = 4;

const CountOffer = {
  DEFAULT: 1,
  MAX: 1000,
};

const FilePath = {
  SENTENCES: `./data/sentences.txt`,
  TITLES: `./data/titles.txt`,
  CATEGORIES: `./data/categories.txt`,
  COMMENTS: `./data/comments.txt`,
  API_PREFIX: `/api`,
};

const FileName = {
  MOCKS: `mocks.json`,
  FILL_DB: `fill-db.sql`,
};

const ExitCode = {
  ERROR: 1,
  SUCCESS: 0,
};

const HttpCode = {
  OK: 200,
  CREATED: 201,
  NOT_FOUND: 404,
  BAD_REQUEST: 400,
  INTERNAL_SERVER_ERROR: 500,
};

const Env = {
  DEVELOPMENT: `development`,
  PRODUCTION: `production`,
};

const OfferType = {
  OFFER: `offer`,
  SALE: `sale`,
};

const SumRestrict = {
  MIN: 1000,
  MAX: 100000,
};

const PictureRestrict = {
  MIN: 1,
  MAX: 16,
};

const DbPoolConnection = {
  MIN: 0,
  MAX: 5,
}

module.exports = {
  DEFAULT_COMMAND,
  USER_ARGV_INDEX,
  MAX_ID_LENGTH,
  MAX_COMMENTS,
  CountOffer,
  FilePath,
  FileName,
  ExitCode,
  HttpCode,
  Env,
  OfferType,
  SumRestrict,
  PictureRestrict,
  DbPoolConnection,
};
