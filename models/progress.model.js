const mongoose = require('mongoose');

const Schema = mongoose.Schema;
//Modelo de la bd
const progressSchema = new Schema({
  idProgress: String,
  student: String,
  course: String,
  level: String
});

const model = mongoose.model('progressCollection', progressSchema);
module.exports = model;
