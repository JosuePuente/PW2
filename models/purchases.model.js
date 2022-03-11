const mongoose = require('mongoose');

const Schema = mongoose.Schema;
//Modelo de la bd
const purchaseSchema = new Schema({
  idPurchases: String,
  type: String,
  student: String,
  course: String,
  school: String
});

const model = mongoose.model('purchasesCollection', purchaseSchema);
module.exports = model;
