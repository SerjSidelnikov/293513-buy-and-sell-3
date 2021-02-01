'use strict';

const express = require(`express`);
const request = require(`supertest`);

const offer = require(`./offer`);
const OfferService = require(`../data-service/offer`);
const CommentService = require(`../data-service/comment`);
const {HttpCode} = require(`../../constants`);

const mockData = [
  {
    "id": `qovgoG`,
    "type": `sale`,
    "title": `Куплю породистого кота.`,
    "description": `Пользовались бережно и только по большим праздникам., Если найдёте дешевле — сброшу цену. Даю недельную гарантию. Это настоящая находка для коллекционера! Кажется, что это хрупкая вещь.`,
    "sum": 95282,
    "picture": `item04.jpg`,
    "category": [
      `Посуда`,
      `Игры`
    ],
    "comments": [
      {
        "id": `hDQx3H`,
        "text": `Почему в таком ужасном состоянии? Вы что?! В магазине дешевле. Совсем немного... Оплата наличными или перевод на карту? Продаю в связи с переездом. Отрываю от сердца. А сколько игр в комплекте? А где блок питания? С чем связана продажа? Почему так дешёво? Неплохо, но дорого.`
      }
    ]
  },
  {
    "id": `FV0_Zl`,
    "type": `offer`,
    "title": `Куплю антиквариат.`,
    "description": `Продаю с болью в сердце... Мой дед не мог её сломать. Кому нужен этот новый телефон, если тут такое...`,
    "sum": 28450,
    "picture": `item02.jpg`,
    "category": [
      `Животные`
    ],
    "comments": [
      {
        "id": `jWt5Je`,
        "text": `С чем связана продажа? Почему так дешёво? Оплата наличными или перевод на карту? Вы что?! В магазине дешевле. А где блок питания? А сколько игр в комплекте?`
      }
    ]
  },
  {
    "id": `jCvt65`,
    "type": `offer`,
    "title": `Куплю антиквариат.`,
    "description": `Таких предложений больше нет! Если товар не понравится — верну всё до последней копейки. Две страницы заляпаны свежим кофе.`,
    "sum": 86958,
    "picture": `item09.jpg`,
    "category": [
      `Журналы`,
      `Животные`
    ],
    "comments": [
      {
        "id": `EdbfH4`,
        "text": `Оплата наличными или перевод на карту? Совсем немного... Продаю в связи с переездом. Отрываю от сердца. Неплохо, но дорого. А где блок питания? А сколько игр в комплекте? С чем связана продажа? Почему так дешёво?`
      }
    ]
  },
  {
    "id": `MOOZ3K`,
    "type": `offer`,
    "title": `Куплю детские санки.`,
    "description": `Это настоящая находка для коллекционера! При покупке с меня бесплатная доставка в черте города. Кому нужен этот новый телефон, если тут такое...`,
    "sum": 69970,
    "picture": `item06.jpg`,
    "category": [
      `Книги`
    ],
    "comments": [
      {
        "id": `JF2mqO`,
        "text": `Продаю в связи с переездом. Отрываю от сердца. А где блок питания? А сколько игр в комплекте? Почему в таком ужасном состоянии? Вы что?! В магазине дешевле. С чем связана продажа? Почему так дешёво? Неплохо, но дорого. Оплата наличными или перевод на карту?`
      }
    ]
  },
  {
    "id": `d0bYzE`,
    "type": `offer`,
    "title": `Продам отличную подборку фильмов на VHS.`,
    "description": `Не пытайтесь торговаться. Цену вещам я знаю. Кажется, что это хрупкая вещь. Мой дед не мог её сломать. Бонусом отдам все аксессуары.`,
    "sum": 1036,
    "picture": `item10.jpg`,
    "category": [
      `Посуда`
    ],
    "comments": [
      {
        "id": `HrVhSh`,
        "text": `Совсем немного... Неплохо, но дорого. Вы что?! В магазине дешевле. С чем связана продажа? Почему так дешёво? А где блок питания? А сколько игр в комплекте? Продаю в связи с переездом. Отрываю от сердца. Почему в таком ужасном состоянии? Оплата наличными или перевод на карту?`
      },
      {
        "id": `t17hZH`,
        "text": `А где блок питания? Почему в таком ужасном состоянии? Продаю в связи с переездом. Отрываю от сердца.`
      }
    ]
  }
];

const createAPI = () => {
  const app = express();
  app.use(express.json());

  const cloneData = JSON.parse(JSON.stringify(mockData));

  offer(app, new OfferService(cloneData), new CommentService());

  return app;
};

describe(`API returns a list of all offers`, () => {
  const app = createAPI();
  let response;

  beforeAll(async () => {
    response = await request(app).get(`/offers`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Returns a list of 5 offers`, () => expect(response.body.length).toBe(5));
  test(`First offer's id equals "qovgoG"`, () => expect(response.body[0].id).toBe(`qovgoG`));
});

describe(`API returns an offer with given id`, () => {
  const app = createAPI();
  let response;

  beforeAll(async () => {
    response = await request(app).get(`/offers/qovgoG`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Offer's title is "Куплю породистого кота."`, () => {
    expect(response.body.title).toBe(`Куплю породистого кота.`);
  });
});

describe(`API creates an offer if data is valid`, () => {
  const newOffer = {
    category: `Котики`,
    title: `Дам погладить котика`,
    description: `Дам погладить котика. Дорого. Не гербалайф`,
    picture: `cat.jpg`,
    type: `OFFER`,
    sum: 100500
  };

  const app = createAPI();
  let response;

  beforeAll(async () => {
    response = await request(app).post(`/offers`).send(newOffer);
  });

  test(`Status code 201`, () => expect(response.statusCode).toBe(HttpCode.CREATED));
  test(`Returns offer created`, () => {
    expect(response.body).toEqual(expect.objectContaining(newOffer));
  });
  test(`Offers count is changed`, async () => {
    await request(app).get(`/offers`).expect((res) => expect(res.body.length).toBe(6));
  });
});

describe(`API refuses to create an offer if data is invalid`, () => {
  const newOffer = {
    category: `Котики`,
    title: `Дам погладить котика`,
    description: `Дам погладить котика. Дорого. Не гербалайф`,
    picture: `cat.jpg`,
    type: `OFFER`,
    sum: 100500
  };

  const app = createAPI();

  test(`Without any required property response code is 400`, async () => {
    for (const key of Object.keys(newOffer)) {
      const badOffer = {...newOffer};
      delete badOffer[key];

      await request(app).post(`/offers`).send(badOffer).expect(HttpCode.BAD_REQUEST);
    }
  });
});

describe(`API changes existent offer`, () => {
  const newOffer = {
    category: `Котики`,
    title: `Дам погладить котика`,
    description: `Дам погладить котика. Дорого. Не гербалайф`,
    picture: `cat.jpg`,
    type: `OFFER`,
    sum: 100500
  };

  const app = createAPI();
  let response;

  beforeAll(async () => {
    response = await request(app).put(`/offers/qovgoG`).send(newOffer);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Returns changed offer`, () => {
    expect(response.body).toEqual(expect.objectContaining(newOffer));
  });
  test(`Offer is really changed`, async () => {
    await request(app).get(`/offers/qovgoG`)
      .expect((res) => expect(res.body.title).toBe(`Дам погладить котика`));
  });
});

test(`API returns status code 404 when trying to change non-existent offer`, async () => {
  const newOffer = {
    category: `Котики`,
    title: `Дам погладить котика`,
    description: `Дам погладить котика. Дорого. Не гербалайф`,
    picture: `cat.jpg`,
    type: `OFFER`,
    sum: 100500
  };

  const app = createAPI();

  await request(app).put(`/offers/noexsist`).send(newOffer).expect(HttpCode.NOT_FOUND);
});

test(`API returns status 400 when trying to change an offer with invalid data`, async () => {
  const invalidOffer = {
    category: `Котики`,
    title: `Дам погладить котика`,
    description: `Дам погладить котика. Дорого. Не гербалайф`,
    picture: `cat.jpg`,
    type: `OFFER`,
  };

  const app = createAPI();

  await request(app).put(`/offers/qovgoG`).send(invalidOffer).expect(HttpCode.BAD_REQUEST);
});

describe(`API correctly deletes an offer`, () => {
  const app = createAPI();
  let response;

  beforeAll(async () => {
    response = await request(app).delete(`/offers/qovgoG`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Returns deleted offer`, () => expect(response.body.id).toBe(`qovgoG`));
  test(`Offers count is 4 now`, async () => {
    await request(app).get(`/offers`).expect((res) => expect(res.body.length).toBe(4));
  });
});

test(`API returns to delete non-existent offer`, async () => {
  const app = createAPI();
  await request(app).delete(`/offers/noexists`).expect(HttpCode.NOT_FOUND);
});

describe(`API returns a list of comments to given offer`, () => {
  const app = createAPI();
  let response;

  beforeAll(async () => {
    response = await request(app).get(`/offers/d0bYzE/comments`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Returns list of 2 comments`, () => expect(response.body.length).toBe(2));
  test(`First comment's id is HrVhSh`, () => expect(response.body[0].id).toBe(`HrVhSh`));
});

describe(`API creates a comment if data is valid`, () => {
  const newComment = {
    text: `Валидному комментарию достаточно этого поля`
  };

  const app = createAPI();
  let response;

  beforeAll(async () => {
    response = await request(app).post(`/offers/d0bYzE/comments`).send(newComment);
  });

  test(`Status code 201`, () => expect(response.statusCode).toBe(HttpCode.CREATED));
  test(`Returns comment created`, () => {
    expect(response.body).toEqual(expect.objectContaining(newComment));
  });
  test(`Comments count is changed`, async () => {
    await request(app).get(`/offers/d0bYzE/comments`)
      .expect((res) => expect(res.body.length).toBe(3));
  });
});

test(`API refuses to create a comment to non-existent offer and return status code 404`, async () => {
  const app = createAPI();

  await request(app).post(`/offers/noexists/comments`).send({text: `comment`})
    .expect(HttpCode.NOT_FOUND);
});

test(`API refuses to create a comment when data is invalid, and returns status code 400`, async () => {
  const app = createAPI();
  await request(app).post(`/offers/d0bYzE/comments`).send({})
    .expect(HttpCode.BAD_REQUEST);
});

describe(`API correctly deletes a comment`, () => {
  const app = createAPI();
  let response;

  beforeAll(async () => {
    response = await request(app).delete(`/offers/d0bYzE/comments/HrVhSh`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Returns comment deleted`, () => expect(response.body.id).toBe(`HrVhSh`));
  test(`Comments count is 1 now`, async () => {
    await request(app).get(`/offers/d0bYzE/comments`)
      .expect((res) => expect(res.body.length).toBe(1));
  });
});

test(`API refuses to delete non-existent comment`, async () => {
  const app = createAPI();
  await request(app).delete(`/offers/d0bYzE/comments/noexists`).expect(HttpCode.NOT_FOUND);
});

test(`API refuses to delete a comment to non-existent offer`, async () => {
  const app = createAPI();
  await request(app).delete(`/offers/noexists/HrVhSh`).expect(HttpCode.NOT_FOUND);
});
