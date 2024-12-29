const mongoose = require("mongoose");
const {Schema} = mongoose;

const meetingSchema = new Schema({
    host:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    participant:{
         type:mongoose.Schema.Types.ObjectId,
        ref:"User"

    },
    meetingURL :{
        type:String,
        default:""
    },
    startTime :{
        type:String,
        required:true
    },
    endingTime:{
        type:String,
        required:true
    },
    status:{
        type:String,
        default:"request"
    },
    day:{
        type:Date,
        required:true
    }
})

module.exports = mongoose.model("meeting",meetingSchema);