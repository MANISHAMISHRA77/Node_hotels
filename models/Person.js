const mongoose=require('mongoose');

//this is basically a schema

//define the person schema->just a blueprint
const personSchema=new mongoose.Schema({
    name:{
        //details of name field
        type:String,
        required:true //means mandatory field ye documnet banate time name dalna hi h otherwise error
    },
    age:{
        type:Number
    },
    work:{
        type:String,
        enum:['chef','waiter','manager'],//means work inme se hi kuch hona chahiye and with same name manger ko koi owner likhega to ni chlega
        required:true
    },
    mobile:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true //means all documents should have unique email,koi do doc ka same email hone pe error aaega
    },
    address:{
        type:String
    },
    salary:{
        type:Number,
        required:true
    }
});
//so it provides flexibilty

//create Person model
const Person=mongoose.model('Person',personSchema);
module.exports=Person;
