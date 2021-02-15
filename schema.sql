CREATE DATABASE buy_and_sell
  WITH
  OWNER = postgres
  ENCODING = 'UTF8'
  CONNECTION LIMIT = -1;

DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS offers CASCADE;
DROP TABLE IF EXISTS comments;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS offer_categories;

CREATE TABLE users(
  id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  first_name varchar(255) NOT NULL,
  last_name varchar(255) NOT NULL,
  password_hash varchar(255) NOT NULL,
  avatar varchar(50) NOT NULL,
  email varchar(255) UNIQUE NOT NULL
);

CREATE TABLE offers(
  id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  user_id integer NOT NULL,
  type varchar(5) NOT NULL,
  title varchar(255) NOT NULL,
  description text NOT NULL,
  sum integer NOT NULL,
  picture varchar(50) NOT NULL,
  created_at timestamp DEFAULT current_timestamp,
  FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

CREATE TABLE comments(
  id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  offer_id integer NOT NULL,
  user_id integer NOT NULL,
  text text NOT NULL,
  created_at timestamp DEFAULT current_timestamp,
  FOREIGN KEY (offer_id) REFERENCES offers(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

CREATE TABLE categories(
  id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name varchar(255) NOT NULL
);

CREATE TABLE offer_categories(
  offer_id integer NOT NULL,
  category_id integer NOT NULL,
  PRIMARY KEY (offer_id, category_id),
  FOREIGN KEY (offer_id) REFERENCES offers(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  FOREIGN KEY (category_id) REFERENCES categories(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);
