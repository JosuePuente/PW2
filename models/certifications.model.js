const mongoose = require('mongoose');

const Schema = mongoose.Schema;
//Modelo de la bd
const certificationSchema = new Schema({
  idCertification: String,
  student: String,
  course: String
});

const model = mongoose.model('certificationsCollection', certificationSchema);
module.exports = model;
