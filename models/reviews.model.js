const mongoose = require('mongoose');

const Schema = mongoose.Schema;
//Modelo de la bd
const reviewSchema = new Schema({
  idReview: String,
  like: Number,
  comment: String,
  student: String,
  course: String
});

const model = mongoose.model('reviewsCollection', reviewSchema);
module.exports = model;
