const mongoose=require('mongoose');
//define the mongoose connection url
//mongodb installation k saath we get this url
const mongoURL='mongodb://localhost:27017/hotels' //hotels is just my database name

//setup mongoDB connection
mongoose.connect(mongoURL,{
    useNewUrlParser:true,
    useUnifiedTopology:true
    //these two parameters are imp to add bcz mongodb frequently updates itself 
})
//connection object
//get the default connection
//mongoose maintains a default connection object representing the MongoDB connection
const db=mongoose.connection;
//so we will establish a bridge using this db object,this db obj handles events and interact with the database


//define event listeners for databse connection
db.on('connected',()=>{
    console.log('nodeJS Server connected to MongoDB server');
});

db.on('disconnected',()=>{
    console.log('MongoDB disconnected ');
});

db.on('error',(err)=>{
    console.log('MongoDb connection error',err);
});
//but abhi connection establish ni hua
//ultimately to connect u have to export files and then run this on server file

//so export the connection object
//then import this in server.js file and then run the server.js file
module.exports=db;