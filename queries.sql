-- Все категории
SELECT id, name FROM categories;

-- Список категорий, для которых создано объявление
SELECT id, name FROM categories
  JOIN offer_categories
  ON id = category_id
  GROUP BY id;

-- Список категорий с количеством объявлений
SELECT id, name, COUNT(offer_id) FROM categories
  LEFT JOIN offer_categories
  ON id = category_id
  GROUP BY id;

-- Список объявлений, сначала свежие
SELECT
  offers.id AS id,
  title,
  sum,
  type,
  description,
  offers.created_at AS created_at,
  users.first_name,
  users.last_name,
  users.email,
  COUNT (comments.id) AS comments_count,
  STRING_AGG(DISTINCT categories.name, ', ') AS category_list
FROM offers
  JOIN offer_categories ON offers.id = offer_categories.offer_id
  JOIN categories ON categories.id = offer_categories.category_id
  LEFT JOIN comments ON comments.offer_id = offers.id
  JOIN users ON users.id = offers.user_id
  GROUP BY offers.id, users.id
  ORDER BY offers.created_at DESC;

-- Информация определённого объявления
SELECT
  offers.id AS id,
  title,
  sum,
  type,
  description,
  offers.created_at AS created_at,
  users.first_name,
  users.last_name,
  users.email,
  COUNT (comments.id) AS comments_count,
  STRING_AGG(DISTINCT categories.name, ', ') AS category_list
FROM offers
  JOIN offer_categories ON offers.id = offer_categories.offer_id
  JOIN categories ON categories.id = offer_categories.category_id
  LEFT JOIN comments ON comments.offer_id = offers.id
  JOIN users ON users.id = offers.user_id
WHERE offers.id = 1
  GROUP BY offers.id, users.id;

-- Список из 5 свежих комментариев
SELECT
  comments.id AS id,
  offer_id,
  users.first_name,
  users.last_name,
  text
FROM comments
  JOIN users ON users.id = comments.user_id
  ORDER BY comments.created_at DESC
  LIMIT 5;

-- Список комментариев для определённого объявления
SELECT
  comments.id AS id,
  offer_id,
  users.first_name,
  users.last_name,
  text
FROM comments
  JOIN users ON users.id = comments.user_id
WHERE comments.offer_id = 1
  ORDER BY comments.created_at DESC;

-- Два объявления о покупке
SELECT * FROM offers
WHERE type = 'offer'
  LIMIT 2;

-- Обновление заголовка
UPDATE offers
SET title = 'Уникальное предложение!'
WHERE id = 1;
