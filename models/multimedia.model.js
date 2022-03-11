const mongoose = require('mongoose');

const Schema = mongoose.Schema;
//Modelo de la bd
const multimediaSchema = new Schema({
  idMultimedia: String,
  path: String,
  type: String,
  description: String,
  level: String
});

const model = mongoose.model('multimediasCollection', multimediaSchema);
module.exports = model;
