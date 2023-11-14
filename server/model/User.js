const mongoose = require('mongoose')
const Schema = mongoose.Schema

let userSchema = new Schema({
    user_name : { type : String },
    first_name : { type : String , default : null },
    last_name : { type : String , default : null },
    email : { type : String , unique : true },
    password : { type: String } ,
}, 
{
    collection : "User"
})

module.exports = mongoose.model('User', userSchema)
