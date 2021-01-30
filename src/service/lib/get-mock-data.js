'use strict';

const chalk = require(`chalk`);
const fs = require(`fs`).promises;
const {FILE_NAME} = require(`../../constants`);

let data = [];

const getMockData = async () => {
  if (data.length > 0) {
    return data;
  }

  try {
    const fileContent = await fs.readFile(FILE_NAME);
    data = JSON.parse(fileContent);
  } catch (err) {
    return data;
  }

  return data;
};

module.exports = getMockData;
