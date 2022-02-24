const faker = require('faker');
const boom = require('@hapi/boom');

class ReviewsService {

  constructor() {
    this.reviews = [];
    this.generate();
  }

  generate() {
    const limit = 50;
    for (let index = 0; index < limit; index++) {
      let gustar = faker.datatype.number();
      gustar = gustar % 2;
      this.reviews.push({
        idReview: faker.datatype.uuid(),
        like: gustar,
        comment: faker.random.words(),
        student: faker.name.findName(),
        course: faker.random.words()
      });
    }
  }

  find(size) {
    const reviews = this.reviews.filter((item, index) => item && index < size);
    if (!reviews || reviews.length < 1)
      throw boom.notFound('No hay reseñas aún');
    return reviews;
  }

  create(data) {
    const newReview = {
      idReview: faker.datatype.uuid(),
      ...data //PASAR TODOS LOS ELEMENTOS
    }
    this.reviews.push(newReview);
    return newReview;
  }

  findOne(idReview) {
    const review = this.reviews.find((item) => item.idReview === idReview)
    if (!review)
      throw boom.notFound('Id Reseña no encontrado');
    return review;
  }

  update(idReview, changes) {
    const index = this.reviews.findIndex(item => item.idReview === idReview);
    if (index === -1)
      throw boom.notFound('No existe esa reseña');

    var currentReviews = this.reviews[index];
    this.reviews[index] = {
      ...currentReviews,
      ...changes
    };
    return {
      old: currentReviews,
      changed: this.reviews[index]
    }
  }

  delete(idReview) {
    const index = this.reviews.findIndex(item => item.idReview === idReview);
    if (index === -1)
      throw boom.notFound('Reseña no encontrada para eliminar');
    var currentReviews = this.reviews[index];
    this.reviews.splice(index, 1);
    return currentReviews;
  }

}

module.exports = ReviewsService;
