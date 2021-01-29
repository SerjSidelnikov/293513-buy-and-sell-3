'use strict';

const {nanoid} = require(`nanoid`);
const {MAX_ID_LENGTH} = require(`../../constants`);

class CommentService {
  findAll(offer) {
    return offer.comments;
  }

  remove(offer, commentId) {
    const removedComment = offer.comments.find((comment) => comment.id === commentId);

    if (!removedComment) {
      return null;
    }

    offer.comments = offer.comments.filter((comment) => comment.id !== commentId);

    return removedComment;
  }

  create(offer, comment) {
    const newComment = Object.assign({
      id: nanoid(MAX_ID_LENGTH),
    }, comment);

    offer.comments.push(newComment);
    return newComment;
  }
}

module.exports = CommentService;
