//import passport and passport-local strategy
//sets up passport with local authentication strategy
const passport=require('passport');
const LocalStrategy=require('passport-local').Strategy;
const Person=require('./models/Person')

//now configuring passport strategy
passport.use(new LocalStrategy(async (USERNAME,password,done)=>{ //done is callback function and this verifcation function expects parameters in this sequence only (variable name cam be anything but sequence should be same)
  //authentication logic here->this function takes credentials(usrename and password from req.body so if we pass usrename and password in body then it will access that too bcz body-parser will store that req.body bhle hi hm get method kyo n use kr rhe ho 
  // //agr body me kuchh likha h toh wo jaega hi and body-parser usko convert krega hi)->so we can pass credentials from body or at params too in key and value (in postman app)
  
  try{
    //console.log('Received credentials:',USERNAME,password);//printing password is not secure bcz password should not be publically visible
    const user=await Person.findOne({username:USERNAME});//checking in Person collection if there exists some document with this usrname(Person is that model)
    //if user doesnt exist so authentication completed but no user exist so this is the syntax for done callback function in that case 
    if(!user){
      return done(null,false,{message:'Incorrect username'});//false means no user
    }
      //if user found,then check for password of that user
    //   const isPasswordMatch=user.password===password?true:false; 

    //since password is now hashed so we will have to use a function defined in personschema on comparing passwords
    const isPasswordMatch=await user.comparePassword(password);//await ni lgaogi toh wo wait ni krega compare krne ka and always it will give ki password match kr rhe h so true

      if(isPasswordMatch){
        return done(null,user);//then return kr do user ko
      }else{
        return done(null,false,{message:'Incorrect password'});
      }
  }catch(err){
    //agr bich me koi error aata h toh yhn aajaega
    return done(err);//return the error
  }
}));

//export configured passport
module.exports=passport;