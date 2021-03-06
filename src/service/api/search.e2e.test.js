'use strict';

const express = require(`express`);
const request = require(`supertest`);

const search = require(`./search`);
const SearchService = require(`../data-service/search`);
const {HttpCode} = require(`../../constants`);

const mockData = [
  {
    "id": `rRiNg5`,
    "type": `offer`,
    "title": `Продам новую приставку Sony Playstation 5.`,
    "description": `Не пытайтесь торговаться. Цену вещам я знаю. Кому нужен этот новый телефон, если тут такое... Две страницы заляпаны свежим кофе. Пользовались бережно и только по большим праздникам.,`,
    "sum": 69817,
    "picture": `item08.jpg`,
    "category": [
      `Посуда`
    ],
    "comments": [
      {
        "id": `_vsn8o`,
        "text": `Вы что?! В магазине дешевле. Оплата наличными или перевод на карту? А где блок питания?`
      }
    ]
  },
  {
    "id": `hGZrH4`,
    "type": `offer`,
    "title": `Отдам в хорошие руки подшивку «Мурзилка».`,
    "description": `Даю недельную гарантию. При покупке с меня бесплатная доставка в черте города. Мой дед не мог её сломать.`,
    "sum": 1376,
    "picture": `item03.jpg`,
    "category": [
      `Книги`,
      `Животные`
    ],
    "comments": [
      {
        "id": `z2SUH4`,
        "text": `А сколько игр в комплекте? Почему в таком ужасном состоянии? Совсем немного... С чем связана продажа? Почему так дешёво? Неплохо, но дорого. А где блок питания? Оплата наличными или перевод на карту? Вы что?! В магазине дешевле. Продаю в связи с переездом. Отрываю от сердца.`
      },
      {
        "id": `rmTeuC`,
        "text": `А где блок питания? Совсем немного... А сколько игр в комплекте? Продаю в связи с переездом. Отрываю от сердца. Почему в таком ужасном состоянии?`
      }
    ]
  },
  {
    "id": `ee_maT`,
    "type": `sale`,
    "title": `Куплю породистого кота.`,
    "description": `Мой дед не мог её сломать. Если найдёте дешевле — сброшу цену. Кому нужен этот новый телефон, если тут такое...`,
    "sum": 32850,
    "picture": `item02.jpg`,
    "category": [
      `Журналы`
    ],
    "comments": [
      {
        "id": `u1TvKP`,
        "text": `Вы что?! В магазине дешевле. А сколько игр в комплекте? Почему в таком ужасном состоянии? А где блок питания? Оплата наличными или перевод на карту? Неплохо, но дорого. Совсем немного...`
      }
    ]
  },
  {
    "id": `cH6N5D`,
    "type": `sale`,
    "title": `Продам новую приставку Sony Playstation 5.`,
    "description": `Если товар не понравится — верну всё до последней копейки. Это настоящая находка для коллекционера!`,
    "sum": 5569,
    "picture": `item14.jpg`,
    "category": [
      `Игры`
    ],
    "comments": [
      {
        "id": `ImyBW2`,
        "text": `Неплохо, но дорого. Почему в таком ужасном состоянии? Вы что?! В магазине дешевле. Продаю в связи с переездом. Отрываю от сердца. А где блок питания? Оплата наличными или перевод на карту? А сколько игр в комплекте?`
      },
      {
        "id": `zN5K3O`,
        "text": `А сколько игр в комплекте? Продаю в связи с переездом. Отрываю от сердца. Оплата наличными или перевод на карту? Неплохо, но дорого. Почему в таком ужасном состоянии?`
      }
    ]
  },
  {
    "id": `k5KsGG`,
    "type": `sale`,
    "title": `Отдам в хорошие руки подшивку «Мурзилка».`,
    "description": `Кому нужен этот новый телефон, если тут такое...`,
    "sum": 10602,
    "picture": `item05.jpg`,
    "category": [
      `Разное`
    ],
    "comments": [
      {
        "id": `SMbIv_`,
        "text": `Почему в таком ужасном состоянии? Оплата наличными или перевод на карту? Вы что?! В магазине дешевле. А сколько игр в комплекте? А где блок питания?`
      },
      {
        "id": `kUh0zT`,
        "text": `Вы что?! В магазине дешевле. Неплохо, но дорого.`
      },
      {
        "id": `mHqNND`,
        "text": `С чем связана продажа? Почему так дешёво? А где блок питания? А сколько игр в комплекте?`
      }
    ]
  }
];

const app = express();
app.use(express.json());
search(app, new SearchService(mockData));

describe(`API returns offers based on search query`, () => {
  let response;

  beforeAll(async () => {
    response = await request(app)
      .get(`/search`)
      .query({
        query: `Продам новую приставку`
      });
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Two offer found`, () => expect(response.body.length).toBe(2));
  test(`Offer has correct id`, () => expect(response.body[0].id).toBe(`rRiNg5`));
});

test(`API returns code 404 if nothing is found`, async () => {
  await request(app).get(`/search`).query({
    query: `Продам свою душу`,
  }).expect(HttpCode.NOT_FOUND);
});

test(`API returns code 400 when query string is absent`, async () => {
  await request(app).get(`/search`).expect(HttpCode.BAD_REQUEST);
});
