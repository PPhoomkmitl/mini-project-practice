// models/Secret.js
const mongoose = require('mongoose');

const secretSchema = new mongoose.Schema({
  value: String,
  email : { type : String , unique : true }
});

module.exports = mongoose.model('Secret', secretSchema)