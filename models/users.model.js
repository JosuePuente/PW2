const mongoose = require('mongoose');

const Schema = mongoose.Schema;
//Modelo de la bd
const userSchema = new Schema({
  id: String,
  name: String,
  email: String,
  password: String,
  avatar: String,
  type: Number
});

const model = mongoose.model('usersCollection', userSchema);
module.exports = model;
