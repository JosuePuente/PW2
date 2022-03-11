const mongoose = require('mongoose');

const Schema = mongoose.Schema;
//Modelo de la bd
const categorySchema = new Schema({
  idCategory: String,
  category: String
});

const model = mongoose.model('categoriesCollection', categorySchema);
module.exports = model;
