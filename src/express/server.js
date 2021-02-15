'use strict';

const express = require(`express`);
const path = require(`path`);

const mainRoutes = require(`./routes/main-routes`);
const myRoutes = require(`./routes/my-routes`);
const offersRoutes = require(`./routes/offers-routes`);
const {HttpCode} = require(`../constants`);
const {getLogger} = require(`../service/lib/logger`);

const PORT = process.env.PORT || 8080;
const PUBLIC_DIR = `public`;
const UPLOAD_DIR = `upload`;

const app = express();
const logger = getLogger({name: `server`});

app.use(express.static(path.resolve(__dirname, PUBLIC_DIR)));
app.use(express.static(path.resolve(__dirname, UPLOAD_DIR)));

app.set(`views`, path.resolve(__dirname, `templates`));
app.set(`view engine`, `pug`);

app.use(`/`, mainRoutes);
app.use(`/my`, myRoutes);
app.use(`/offers`, offersRoutes);

app.use((req, res) => res.status(HttpCode.BAD_REQUEST).render(`errors/404`));
app.use((err, req, res, _next) => {
  logger.error(`An error occurred on processing request: ${err.message}`);
  res.status(HttpCode.INTERNAL_SERVER_ERROR).render(`errors/500`);
});

app.listen(PORT, () => {
  logger.info(`Listening to connection on ${PORT}`);
}).on(`error`, (err) => {
  logger.error(`An error occurred on server created ${err.message}`);
});

