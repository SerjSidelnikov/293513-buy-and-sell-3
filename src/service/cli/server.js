'use strict';

const express = require(`express`);
const {HttpCode, ExitCode, API_PREFIX} = require(`../../constants`);
const routes = require(`../api/api`);
const getMockData = require(`../lib/get-mock-data`);
const {getLogger} = require(`../lib/logger`);

module.exports = {
  name: `--server`,
  async run(args) {
    const DEFAULT_PORT = 3000;
    const app = express();
    const mockData = await getMockData();
    const logger = getLogger({name: `api`});

    app.use(express.json());

    app.use((req, res, next) => {
      logger.debug(`Request on route ${req.url}`);

      res.on(`finish`, () => {
        logger.info(`Response status code ${res.statusCode}`);
      });

      next();
    });

    app.use(API_PREFIX, routes(mockData));

    app.use((req, res) => {
      res.status(HttpCode.NOT_FOUND).send(`Not found`);
      logger.error(`Route not found: ${req.url}`);
    });

    app.use((err, _req, _res, _next) => {
      logger.error(`An error occurred on processing request: ${err.message}`);
    });

    const [customPort] = args;
    const port = Number.parseInt(customPort, 10) || DEFAULT_PORT;

    app.listen(port, (err) => {
      if (err) {
        logger.error(`An error occurred on server created ${err.message}`);
        process.exit(ExitCode.ERROR);
      }

      return logger.info(`Listening to connection on ${port}`);
    });
  }
};
