'use strict';

const fs = require(`fs`).promises;
const chalk = require(`chalk`);
const {getRandomInt, shuffle} = require(`../../utils`);
const {
  ExitCode,
  FILE_NAME_FILL_DB,
  DEFAULT_COUNT_OFFER,
  MAX_COUNT_OFFER,
  MAX_COMMENTS,
  FILE_SENTENCES_PATH,
  FILE_TITLES_PATH,
  FILE_CATEGORIES_PATH,
  FILE_COMMENTS_PATH,
  OfferType,
  SumRestrict,
  PictureRestrict,
} = require(`../../constants`);

const readContent = async (filePath) => {
  try {
    const content = await fs.readFile(filePath, `utf8`);
    return content.trim().split(`\n`);
  } catch (err) {
    console.error(chalk.red(err));
    return [];
  }
};

const getPictureFileName = (number) => `item${number.toString().padStart(2, `0`)}.jpg`;

const generateComments = (count, offerId, userCount, comments) => (
  Array(count).fill({}).map(() => ({
    userId: getRandomInt(1, userCount),
    offerId,
    text: shuffle(comments)
      .slice(0, getRandomInt(1, comments.length))
      .join(` `),
  }))
);

const generateOffers = (count, titles, categoryCount, userCount, sentences, comments) => {
  return Array(count).fill({}).map((_, index) => ({
    userId: getRandomInt(1, userCount),
    type: Object.values(OfferType)[Math.floor(Math.random() * Object.keys(OfferType).length)],
    title: titles[getRandomInt(0, titles.length - 1)],
    description: shuffle(sentences).slice(0, getRandomInt(1, 5)).join(` `),
    sum: getRandomInt(SumRestrict.MIN, SumRestrict.MAX),
    picture: getPictureFileName(getRandomInt(PictureRestrict.MIN, PictureRestrict.MAX)),
    category: [getRandomInt(1, categoryCount)],
    comments: generateComments(getRandomInt(1, MAX_COMMENTS), index + 1, userCount, comments),
  }));
};

module.exports = {
  name: `--fill`,
  async run(args) {
    const sentences = await readContent(FILE_SENTENCES_PATH);
    const titles = await readContent(FILE_TITLES_PATH);
    const categories = await readContent(FILE_CATEGORIES_PATH);
    const commentSentences = await readContent(FILE_COMMENTS_PATH);

    const users = [
      {
        email: `ivanov@example.com`,
        passwordHash: `5f4dcc3b5aa765d61d8327deb882cf99`,
        firstName: `Иван`,
        lastName: `Иванов`,
        avatar: `avatar1.jpg`
      },
      {
        email: `petrov@example.com`,
        passwordHash: `5f4dcc3b5aa765d61d8327deb882cf99`,
        firstName: `Пётр`,
        lastName: `Петров`,
        avatar: `avatar2.jpg`
      }
    ];

    const [count] = args;
    const countOffer = Number.parseInt(count, 10) || DEFAULT_COUNT_OFFER;

    if (countOffer > MAX_COUNT_OFFER) {
      console.info(chalk.red(`Не больше 1000 объявлений`));
      return;
    }

    const offers = generateOffers(countOffer, titles, categories.length, users.length, sentences, commentSentences);
    const comments = offers.flatMap((offer) => offer.comments);
    const offerCategories = offers.map((offer, index) => ({offerId: index + 1, categoryId: offer.category[0]}));

    const userValues = users.map(({firstName, lastName, passwordHash, avatar, email}) =>
      `('${firstName}', '${lastName}', '${passwordHash}', '${avatar}', '${email}')`
    ).join(`,\n`);

    const offerValues = offers.map(({userId, type, title, description, sum, picture}) =>
      `(${userId}, '${type}', '${title}', '${description}', ${sum}, '${picture}')`
    ).join(`,\n`);

    const commentValues = comments.map(({offerId, userId, text}) =>
      `(${offerId}, ${userId}, '${text}')`
    ).join(`,\n`);

    const categoryValues = categories.map((name) => `('${name}')`).join(`,\n`);

    const offerCategoryValues = offerCategories.map(({offerId, categoryId}) =>
      `(${offerId}, ${categoryId})`
    ).join(`,\n`);

    const content = `
INSERT INTO users(first_name, last_name, password_hash, avatar, email) VALUES
${userValues};

ALTER TABLE offers DISABLE TRIGGER ALL;
INSERT INTO offers(user_id, type, title, description, sum, picture) VALUES
${offerValues};
ALTER TABLE offers ENABLE TRIGGER ALL;

ALTER TABLE comments DISABLE TRIGGER ALL;
INSERT INTO comments(offer_id, user_id, text) VALUES
${commentValues};
ALTER TABLE comments ENABLE TRIGGER ALL;

INSERT INTO categories(name) VALUES
${categoryValues};

ALTER TABLE offer_categories DISABLE TRIGGER ALL;
INSERT INTO offer_categories(offer_id, category_id) VALUES
${offerCategoryValues};
ALTER TABLE offer_categories ENABLE TRIGGER ALL;
    `.trim();

    try {
      await fs.writeFile(FILE_NAME_FILL_DB, content);
      console.log(chalk.green(`Operation success. File created.`));
    } catch (err) {
      console.error(chalk.red(`Can't write data to file...`));
      process.exit(ExitCode.ERROR);
    }
  }
};
