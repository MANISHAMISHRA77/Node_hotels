const mongoose=require('mongoose');
const menuItemSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    taste:{
        type:String,
        enum:['sweet','spicy','sour'],
        required:true
    },
    is_drink:{
        type:Boolean,
        default:false//if client doent give any value then by default it will set false
    },
    ingredients:{
        type:[String],//[] is for array of strings
        default:[] //by default -> empty
    },
    num_sales:{
        type:Number,
        default:0
    }
})

//create menu model
const MenuItem=mongoose.model('MenuItem',menuItemSchema);
module.exports=MenuItem;