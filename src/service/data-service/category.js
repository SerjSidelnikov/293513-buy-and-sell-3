'use strict';

class CategoryService {
  constructor(offers) {
    this._offers = offers;
  }

  findAll() {
    const categories = this._offers.reduce((acc, offer) => {
      offer.category.forEach((item) => acc.add(item));
      return acc;
    }, new Set());

    return [...categories];
  }
}

module.exports = CategoryService;
