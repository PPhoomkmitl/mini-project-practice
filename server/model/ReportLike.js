const mongoose = require('mongoose')
const Schema = mongoose.Schema

let ReportLikeSchema = new Schema({
    isLike : { type : Boolean },
    dislike : { type : Boolean },
    question :{type : Schema.Types.ObjectId , ref: 'Qusetion'},
    user : { type : Schema.Types.ObjectId , ref: 'User' }
}, 
{
    collection : "ReportLike",
    timestamps: true
})

module.exports = mongoose.model('ReportLike', ReportLikeSchema)

// หน้าบ้าน นับ count + 1 เเล้ว ไปเรียก api
// api เรียกใช้ update count 
// re หน้า count update

//socket ตัวช่วยให้ update ข้อมูลReal time
