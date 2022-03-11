const faker = require('faker');
const boom = require('@hapi/boom');
const ReviewsModel = require('./../models/reviews.model');

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
        review: faker.random.words()
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

  /////////////////////////////////////////////////////////////////////DB METHODS

  async findDB(limit, filter) {
    let reviewsDB = await ReviewsModel.find(filter);

    if (!reviewsDB || reviewsDB.length < 1)
      throw boom.notFound('No hay registros actualmente');

    reviewsDB = limit ? reviewsDB.filter((item, index) => item && index < limit) : reviewsDB;
    return reviewsDB;
  }

  async createDB(data) {
    const model = new ReviewsModel(data);
    await model.save();
    return data;
  }

  async findOneDB(id) {
    try {

      const review = await ReviewsModel.findOne({
        _id: id
      });
      if (!review)
        throw boom.notFound('No se ha encontrado coincidencia');
      return review;

    } catch (error) {
      throw boom.conflict("Error: " + error.message)
    }
  }

  async updateDB(id, changes) {
    let review = await ReviewsModel.findOne({
      _id: id
    });
    if (!review)
      throw boom.notFound('No se ha encontrado coincidencia');

    let reviewOrigin = {
      like: review.like,
      comment: review.comment,
      student: review.student,
      course: review.course
    };

    const { like, comment, student, course } = changes;
    review.like = like;
    review.comment = comment;
    review.student = student;
    review.course = course;
    review.save();

    return {
      old: reviewOrigin,
      changed: review
    }
  }

  async deleteDB(id) {
    let review = await ReviewsModel.findOne({
      _id: id
    });
    const { deletedCount } = await ReviewsModel.deleteOne({
      _id: id
    });
    if (deletedCount <= 0)
      throw boom.notFound('No se ha encontrado coincidencia');
    return review;
  }

}

module.exports = ReviewsService;
