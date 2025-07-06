//lecture 2

//1.
// console.log("server is running")
// console.log(2+6);
// //differnt types of functions declaration
// let a=5;
// let b=9;
// // var add=function(a,b){
// //     return a+b;
// // }
// //arrow function
// // var add=(a,b)=>{
// //     return a+b;
// // }
// var add=(a,b)=>a+b;
// var res=add(2,3);
// console.log(res);
// (function(){
//     console.log("this will automatically run");
// })();

// //callback function
// var addFun=function(a,b,callback){
//     console.log(a+b);
//     callback();
// }

// function callback(){
//     console.log("add completed and it is first way");
// }
// addFun(2,3,callback);

// addFun(2,3,function(){
//     console.log("another way to pass a call back function");
// })

// addFun(2,3,()=>console.log('3rd way'));

//2nd

//now introducing modules
//import
// var fs = require('fs');
// var os=require('os');
// var user=os.userInfo();
// console.log(user);
// console.log(user.username);
// fs.appendFile('greeting.txt','Hi'+user.username+'!\n',()=>{
//     console.log('file is created');
// });

// //os all functionalities
// console.log(os);
// //fs functionalities
// console.log(fs);

//3rd
//importing another file
// const notes=require('./notes.js');//import
// console.log('server file is available');

// //variables and other things can only be accessed when exported from that file
// var age=notes.age;
// console.log(age);
// var result=notes.addNumber(age,34);
// console.log(result);

// //4th now use of lodash
// //import lodash
// var _=require('lodash');//variable name can be anything but it is convention to use '_' so use this
// var data=["person","person",1,2,3,1,2,'1','2','2','name'];
// var filter=_.uniq(data);
// console.log(filter);
// console.log(_.isString('manisha'));///true
// console.log(_.isString(3));//false
// console.log(_.isString(true));//false->bcz true is boolean so it is not a string hence it will return false

//lecture 3

//json string to object conversion
// const jsonString ='{"name":"John", "age":30, "city":"New York"}';//whole is a string
// const jsonObject=JSON.parse(jsonString);//convert JSON string to object
// console.log(jsonObject.name);//output: John

// //object to json string conversion
// const objectToConvert={name:"Alice", age:25};
// const json=JSON.stringify(objectToConvert);//convert object to JSON string
// console.log(json);//output: {"name":"Alice", "age":25}
// console.log(typeof json);//string

//now creating server

const express = require("express");

const app = express(); //blueprint of express js or instance
//import db
const db = require("./db");

//import env
require('dotenv').config();

//import body parser-it parses and extract data in required format and available in req.body
const bodyParser = require("body-parser");
app.use(bodyParser.json()); //bcz hm json data type bhej rhe h

//using variable from env file
const PORT=process.env.PORT||3000;//agr online port assign ni hota toh ye local host 3000 pe chlega 

//import Perosn named model
// const Person = require("./models/Person");
const MenuItem = require("./models/MenuItem");
//now we will create all connectivity and all operations in database through this model

//one method means endpoint
app.get("/", (req, res) => {
  //means localhost:3000/
  res.send("Welcome to my hotel, how i can help you??");
});

//another method- get ->localhost:3000/chicken
// app.get('/chicken',(req,res)=>{
//     res.send("sure sir, I would love to serve chicken")
// })
// //3rd endpoint
// app.get('/idli',(req,res)=>{
//   var customised_idli={
//     name:'rava idli',
//     size:'10 com diameter',
//     isSambhar:true,
//     isChutney:false
//   }
//     res.send(customised_idli);//return json object
// })
// app.get('/dal',(req,res)=>{
//   res.send("love to serve dal")
// })

// app.post('/items',(req,res)=>{
//   res.send("data is saved");
// })

// const db=require('./db'); if we put this line here then it doesnt make any sense bcz ye line yhn pe connection establish ni kr paega mongodb server k saath so saare http request se phle import kro

//POST route to add a person

// app.post('/person',(req,res)=>{
//   const data=req.body //assuming request body contains the person data i.e client jo data bhej rha h wo yhin store hota h
//   //create a new Person document using the MOngoose model
//   const newPerson=new Person(data);
//   //here we can assign names in this way too but it will too complex to provide each person name age and evrything individually to all
//   // newPerson.name=data.name;
//   //so direct data hi dal do in the new person to give values to new person

//   //save the new person in the database
//   // this .save function returns callback func both error and message
//   newPerson.save((error,savedPerson)=>{

//     //in this operation we have used callbackfunc so it will not send request -> newPerson.save no longer accepts callback func so use async await instead
//     if(error){
//       console.log('Error saving person:',error);
//       res.status(500).json({error:'Internal server error'});
//       //we have used status also so it will show status also on error
//     }else{
//       console.log('data saved successfully');
//       res.status(200).json({savedPerson});
//     }
//   })

// })

//now using async await
// app.post("/person", async (req, res) => {
//   //async bcz db operation may take time
//   try {
//     const data = req.body; //assuming request body contains the person data i.e client jo data bhej rha h and body parser storing in this req.body
//     //create a new Person document using the MOngoose model
//     const newPerson = new Person(data);
//     // save the new person to the database
//     const savedPerson = await newPerson.save(); //jab tk hmara new document databse me addition process ni ho jata it may fail then it will redirect to catch direct from this line
//     console.log("data saved");
//     res.status(200).json(savedPerson);
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });

// //GET method to get the person(means to get the collections details)
// app.get("/person", async (req, res) => {
//   try {
//     const data = await Person.find(); //data fetch krne me may be time lg jaye
//     console.log("data fetched");
//     res.status(200).json(data);
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });

// app.post("/menu", async (req, res) => {
//   //async bcz db operation may take time
//   try {
//     const data = req.body; //assuming request body contains data i.e client jo data bhej rha h and body parser storing in this req.body

//     const newMenu = new MenuItem(data);
//     // save the new menu to the database
//     const savedMenu = await newMenu.save(); //jab tk hmara new document databse me addition process ni ho jata it may fail then it will redirect to catch direct from this line
//     console.log("data saved");
//     res.status(200).json(savedMenu);
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });

// app.get("/menu", async (req, res) => {
//   try {
//     const data = await MenuItem.find(); //data fetch krne me may be time lg jaye
//     console.log("data fetched");
//     res.status(200).json(data);
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });

//parameterised API calls-> if someone told to give a list of people who r only waiters
//then we wont create another end points like /person/waiter ->no bcz for each type of work or some other things it will be complex to make so many functions/methods to get dfrnt types of people or menus so we will use parameterised endpoints

// app.get("/person/:workType", async(req, res) => {
//   //workType is a variable i.e we pass parametr in url
//   try {
//     //since worktype is a parameter so we will use params in syntax
//     //extract the work type from URL parameter
//     const workType = req.params.workType; //it will store on which url user is sending request meaning on which work type
//     //now adding validation bcz work type kuch bhi agr koi pass kr de to check krna pdega n
//     if(workType=='chef' || workType=='waiter' || workType=='manager'){
//       //now db operations i.e find persoon with that work type-isme kuch time lg skta h so await
//       const response=await Person.find({work:workType});
//       console.log('response fetched');
//       res.status(200).json(response);
//     }else{
//       res.status(404).json({error:'Invalid work type'});
//     }
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });
//but the path will be like -> http://localhost:3000/person/manager (dont use /:manager in the url)

//import the router files
const personRoutes=require('./routes/personRoutes');
const menuItemRoutes=require('./routes/menuItemRoutes');
//here inserted /person in app.use bcz it was common in all the endpoints
//use the routes->means now it is using routes her in this server file and all endpoints will start with /person
app.use('/person',personRoutes);
app.use('/menu',menuItemRoutes);
//url is same as we were using earlier like /person/chef or whatever



app.listen(PORT, () => {
  console.log("server is active, listening on port 3000"); //if server would be active then it will be executed
}); //port no i.e room no means localhost:3000
