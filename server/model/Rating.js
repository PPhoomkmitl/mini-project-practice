const mongoose = require('mongoose')
const Schema = mongoose.Schema

let ratingSchema = new Schema({
    rating : { type : [] },
    date : { type : Date },  
    user : { type : Schema.Types.ObjectId , ref: 'User' },
    category : { type : String }
}, 
{
    collection : "Rating"
})

module.exports = mongoose.model('Rating', ratingSchema)