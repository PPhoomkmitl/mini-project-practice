const mongoose = require('mongoose');
const Schema = mongoose.Schema

const fileSchema = new Schema({
  originalName: {type : String},
  fileData: Buffer,
  category : { type : String },
  timeStamp : { type :  Date },
  user : { type : Schema.Types.ObjectId , ref: 'User' }
},
{
    collection : "File"
})

module.exports = mongoose.model('File', fileSchema);

