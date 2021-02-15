'use strict';

const {nanoid} = require(`nanoid`);
const fs = require(`fs`).promises;
const chalk = require(`chalk`);
const {getRandomInt, shuffle} = require(`../../utils`);
const {
  ExitCode,
  FILE_NAME_MOCKS,
  MAX_ID_LENGTH,
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

const generateComments = (count, comments) => (
  Array(count).fill({}).map(() => ({
    id: nanoid(MAX_ID_LENGTH),
    text: shuffle(comments)
      .slice(0, getRandomInt(1, comments.length))
      .join(` `),
  }))
);

const generateOffers = (count, titles, categories, sentences, comments) => {
  return Array(count).fill({}).map(() => ({
    id: nanoid(MAX_ID_LENGTH),
    type: Object.values(OfferType)[Math.floor(Math.random() * Object.keys(OfferType).length)],
    title: titles[getRandomInt(0, titles.length - 1)],
    description: shuffle(sentences).slice(0, getRandomInt(1, 5)).join(` `),
    sum: getRandomInt(SumRestrict.MIN, SumRestrict.MAX),
    picture: getPictureFileName(getRandomInt(PictureRestrict.MIN, PictureRestrict.MAX)),
    category: shuffle(categories).slice(0, getRandomInt(1, 2)),
    comments: generateComments(getRandomInt(1, MAX_COMMENTS), comments),
  }));
};

module.exports = {
  name: `--generate`,
  async run(args) {
    const sentences = await readContent(FILE_SENTENCES_PATH);
    const titles = await readContent(FILE_TITLES_PATH);
    const categories = await readContent(FILE_CATEGORIES_PATH);
    const comments = await readContent(FILE_COMMENTS_PATH);

    const [count] = args;
    const countOffer = Number.parseInt(count, 10) || DEFAULT_COUNT_OFFER;

    if (countOffer > MAX_COUNT_OFFER) {
      console.info(chalk.red(`Не больше 1000 объявлений`));
      return;
    }

    const content = JSON.stringify(generateOffers(countOffer, titles, categories, sentences, comments), null, 2);

    try {
      await fs.writeFile(FILE_NAME_MOCKS, content);
      console.log(chalk.green(`Operation success. File created.`));
    } catch (err) {
      console.error(chalk.red(`Can't write data to file...`));
      process.exit(ExitCode.ERROR);
    }
  }
};
