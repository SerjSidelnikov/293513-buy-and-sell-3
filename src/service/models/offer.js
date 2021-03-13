'use strict';

const {Model, DataTypes} = require(`sequelize`);

class Offer extends Model {}

const define = (sequelize) => Offer.init({
  type: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  sum: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  picture: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  sequelize,
  modelName: `Offer`,
  tableName: `offers`,
});

module.exports = define;
