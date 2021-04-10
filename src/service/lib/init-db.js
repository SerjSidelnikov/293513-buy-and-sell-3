'use strict';

const defineModules = require(`../models/models`);
const Alias = require(`../models/alias`);

module.exports = async (sequelize, {offers, categories}) => {
  const {Offer, Category} = defineModules(sequelize);
  await sequelize.sync({force: true});

  const categoryModel = await Category.bulkCreate(
      categories.map((item) => ({name: item}))
  );

  const categoryIdByName = categoryModel.reduce((acc, item) => ({
    ...acc,
    [item.name]: item.id,
  }), {});

  const offerPromises = offers.map(async (offer) => {
    const offerModel = await Offer.create(offer, {include: [Alias.COMMENTS]});

    await offerModel.addCategories(
        offer.category.map((name) => categoryIdByName[name])
    );
  });

  await Promise.all(offerPromises);
};
