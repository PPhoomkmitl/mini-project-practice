const mongoose = require('mongoose')
const Schema = mongoose.Schema

let reviewSchema = new Schema({
    content : { type : String },
    timeStamp : { type :  Date },
    user : { type : Schema.Types.ObjectId , ref: 'User' },
    category: { type : String }
}, 
{
    collection : "Review"
})

module.exports = mongoose.model('Review', reviewSchema)