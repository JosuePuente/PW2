const mongoose = require('mongoose');

const Schema = mongoose.Schema;
//Modelo de la bd
const levelSchema = new Schema({
  idLevel: String,
  title: String,
  video: String,
  description: String,
  number: Number,
  course: String
});

const model = mongoose.model('levelsCollection', levelSchema);
module.exports = model;
