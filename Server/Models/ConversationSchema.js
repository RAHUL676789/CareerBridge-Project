const mongoose = require("mongoose");
const {Schema} = mongoose;


const converSationSchema = new Schema({
    sender:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    receiver:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    message:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"message"
        }
    ]
},{ timestamps: true }
)

module.exports = mongoose.model("converSation",converSationSchema);