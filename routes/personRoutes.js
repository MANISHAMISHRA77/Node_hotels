//express provides express routes
//first import express
const express=require('express');
//store express router function in router variable
const router=express.Router();
//express router is a way to modularise and organise ur route handling code in express.js application
//organise and manage end points


//import Person model otherwise it will throw error
//import Perosn named model
const Person = require("./../models/Person");//used ../ bcz person file do file pichhe h

//import jwt midllware function and jwt creation function
const {jwtAuthMiddleware, generateToken}=require('./../jwt');//bcz now we will be using jwt verification and creation function while passing routes thats why imported here


//post route to add a person
//removed person from /person from all methods i.e in endpoints here bcz all has common person and that will be passed in app.use() so every rout(path) will have /person thats why inserted there in server.js at app.use('/person,..)
router.post("/signup", async (req, res) => {
  //async bcz db operation may take time
  try {
    const data = req.body; //assuming request body contains the person data i.e client jo data bhej rha h and body parser storing in this req.body
    //create a new Person document using the MOngoose model
    const newPerson = new Person(data);
    // save the new person to the database
    const savedPerson = await newPerson.save(); //jab tk hmara new document databse me addition process ni ho jata it may fail then it will redirect to catch direct from this line
    console.log("data saved");

    const payload={//to pass more than one things in payload and it should be in object format
      id:savedPerson.id,//no need to write _id ,to extract unique id normal id is used 
      username:savedPerson.username
    }

    //now generating token for new person saved
    // const token=generateToken(savedPerson.username);//savedPerson.username is payload for generate function for that token
    //if we want to pass payload in proper object form having id and username means more info then 
    const token=generateToken(payload);
    console.log(JSON.stringify(payload));
    console.log('Token is: ',token);

    res.status(200).json({response:savedPerson,token:token});
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal server error" });
  }
});


//login function->at login time client send username and password to the server and server checks that username and password in database. if the user exists with that password then it returns token for the user at the time of login(it is not signup) otherwise error
router.post('/login',async (req,res)=>{//post method cuz we have to send data to server
  try{
    //extract username and paaword form requset body
    const {username,password}=req.body;
    //find user by username
    const user=await Person.findOne({username:username});
    //if user doesnt exist or password doesnt match, return error
    if(!user || !(await user.comparePassword(password))){
      return res.status(401).json({error:'Invalid username or password'});
    }
    //generate token
    const payload={
      id: user.id,
      username: user.username
    }
    const token=generateToken(payload);
    //return token as response
    res.json({token});
  }catch(err){
    console.log(err);
    res.status(500).json({ error: "Internal server error" });
  }
});


//profile route->it is protected route bcz we wre adding authentication to this route
//in jwt auth middleware function the decoded value is stored in req.user (watch jwt middleware func)payload is stored in request object
router.get('/profile',jwtAuthMiddleware,async (req,res)=>{//this route demand token in http get request
  try{
    const userData=req.user;//accesing user info from req.user
    console.log("Userdata: ",userData);//u can watch data using console

    const userId=userData.id;//uesr data contains id information abt user too
    const user=await Person.findById(userId);//now find the person with this userid
    //return respones as user
    res.status(200).json({user});
  }catch(err){
    console.log(err);
    res.status(500).json({ error: "Internal server error" });
  }
})
//GET method to get the person(means to get the collections details)
router.get("/",jwtAuthMiddleware, async (req, res) => {//protected route->now we have added the jwt middleware so it will demand for token with http request to verify
  try {
    const data = await Person.find(); //data fetch krne me may be time lg jaye
    console.log("data fetched");
    res.status(200).json(data);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/:workType", async(req, res) => {
  //workType is a variable i.e we pass parametr in url
  try {
    //since worktype is a parameter so we will use params in syntax
    //extract the work type from URL parameter
    const workType = req.params.workType; //it will store on which url user is sending request meaning on which work type
    //now adding validation bcz work type kuch bhi agr koi pass kr de to check krna pdega n
    if(workType=='chef' || workType=='waiter' || workType=='manager'){
      //now db operations i.e find persoon with that work type-isme kuch time lg skta h so await
      const response=await Person.find({work:workType});
      console.log('response fetched');
      res.status(200).json(response);
    }else{
      res.status(404).json({error:'Invalid work type'});
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//update method -> passing a parameter to find which document we have to update
//client is sending id through parameter and is send data in body through json ->preferrable way
//client can also send this id in body through json also 
router.put('/:id',async(req,res)=>{//here id is just a variable name
    try{
        const personId=req.params.id;//Extract the id from the URL parameter
        const updatedPersonData=req.body;//Updated data for the person ->jo bhi client body me data bhejega use body parser extract nd modify krke req.body me store krega hm use access kr rhe h yhn
        //mongodb has predefined function find by id and update
        const response =await Person.findByIdAndUpdate(personId,updatedPersonData,{
            new:true,//return the updated document->basically response variable will now conatin the updated document
            runValidators:true,//Run mongoose validation (means it will check all the fields which client is providing for updation should be in correct format and acc to schema)
        })

        //when the id sent by client doesnt exist so that will return null hence at that time this will give 404 error
        if(!response){
            return res.status(404).json({error:'Person not found'});
        }
        console.log('data updated');
        res.status(200).json(response);
    }catch(err){
        console.log(err);
        res.status(500).json({ error: "Internal Server Error" });
    }

})

//delete method
//client have to pass parameter (unique identifier ) to delete any document
router.delete('/:id',async (req,res)=>{
    try{
        const personId=req.params.id;//Extract the id from the URL parameter
        //assuming u have person model
        //mogodb has predefined function to delete
        const response=await Person.findByIdAndDelete(personId);
        //again if the id doesnt exist
        if(!response){
            return res.status(404).json({error:'Person not found'});
        }
        console.log('data deleted');
        res.status(200).json({message:'Person deleted successfully'});
    }catch(err){
        //this will run when something breaks or some error comes in above delete action
        console.log(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
})

module.exports=router;//export 