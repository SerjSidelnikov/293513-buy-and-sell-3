'use strict';

const express = require(`express`);

const mainRoutes = require(`./routes/main-routes`);
const myRoutes = require(`./routes/my-routes`);
const offersRoutes = require(`./routes/offers-routes`);

const DEFAULT_PORT = 8080;

const app = express();

app.use(`/`, mainRoutes);
app.use(`/my`, myRoutes);
app.use(`/offers`, offersRoutes);

app.listen(DEFAULT_PORT, () => console.log(`Server is running on the port ${DEFAULT_PORT}`));
