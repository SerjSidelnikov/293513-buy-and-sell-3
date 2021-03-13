'use strict';

const defineCategory = require(`./category`);
const defineComment = require(`./comment`);
const defineOffer = require(`./offer`);
const defineOfferCategory = require(`./offer-category`);
// const defineUser = require(`./user`);
const Alias = require(`./alias`);

const define = (sequelize) => {
  const Category = defineCategory(sequelize);
  const Comment = defineComment(sequelize);
  const Offer = defineOffer(sequelize);
  const OfferCategory = defineOfferCategory(sequelize);
  // const User = defineUser(sequelize);

  Offer.hasMany(Comment, {as: Alias.COMMENTS, foreignKey: `offer_id`});
  Comment.belongsTo(Offer, {as: Alias.OFFERS, foreignKey: `offer_id`});

  Offer.belongsToMany(Category, {through: OfferCategory, as: Alias.CATEGORIES});
  Category.belongsToMany(Offer, {through: OfferCategory, as: Alias.OFFERS});
  Category.hasMany(OfferCategory, {as: Alias.OFFER_CATEGORIES, foreignKey: `category_id`});

  return {
    Category,
    Offer,
    Comment,
    OfferCategory,
  };
};

module.exports = define;
