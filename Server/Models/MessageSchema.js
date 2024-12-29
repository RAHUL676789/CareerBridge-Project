const mongoose = require("mongoose");
const {Schema} = mongoose;

const messageSchema = new Schema({
    sender:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    receiver:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"

    },
    text:{
        type:String,
    
    },
    accepted:{
        type:Boolean,
        default:false
    },
    imageUrl:{
        type:String,
        default:""
    },
    videoUrl:{
        type:String,
        default:""
    },
    seen:{
        type:Boolean,
        default:true
    }
})

module.exports=mongoose.model("message",messageSchema);