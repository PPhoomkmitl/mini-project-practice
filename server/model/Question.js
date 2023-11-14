const mongoose = require('mongoose')
const Schema = mongoose.Schema

let questionSchema = new Schema({
    content : { type : String },
    timeStamp : { type :  Date },
    comments:[{
        content : { type : String },
        timeStamp : { type :  Date },
        userId : { type : Schema.Types.ObjectId , ref: 'User' },
        userNameComment : {type : String},
        questionID : { type : Schema.Types.ObjectId , ref: 'Question' }
    }],
    category: { type : String } ,
    user : { type : Schema.Types.ObjectId , ref: 'User' },
}, 
{
    collection : "Question"
})

module.exports = mongoose.model('Question', questionSchema)


