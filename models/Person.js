const mongoose=require('mongoose');
const bcrypt=require('bcrypt');

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
    },
    username:{
        required:true,
        type:String
        //it is basically use to authenticate thats why we will save in our db when user sends their username and password 
        //and this field is must
    },
    password:{
        required:true,
        type:String
    }
});
//so it provides flexibilty


//pre middleware is applied on schema
//pre is a middleware function which got triggered when save operation is performed
personSchema.pre('save',async function(next){
    const person=this;//means person Schema k sare person k liye
    //this is representing any person of this model ->means har record ko save krne se phle ye async wala function chlega

    //hash the password only if it has been modified (or is new) means if new passowrd is generated or existing passowrd gets modified only then hashing of password will occur ni toh direct next() function call hoga means no hashing of password will be happening then
    //bcz wo already hashed hoga agr koi nya ya modification ni ho rha password me toh hashed version already saved in the databse so no need of any hashing operation
    if(!person.isModified('password'))return next();//datbse me direct save krlo
    try{
        ///hash password generation
        const salt=await bcrypt.genSalt(10);//bcrypt generates random string ,10  is ideal value bcz number jitna bda hoga uski security toh bdh jaegai but complexity bhi bdhega hashing ka meaning time increases so ideal is 10
        
        //hash password
        const hashedPassword=await bcrypt.hash(person.password,salt);//gen hashed password using password of person and salt
        //hashedPassword->salt+hashed password
        //override the plain password with hashed one
        person.password=hashedPassword;

        next();//it is callback function = it tells ki pre function perform ho gya ab tm databse me save kr lo
    }catch(err){
        return next(err);
    }
})

personSchema.methods.comparePassword=async function(candidatePassword){
    try{
        //use bcrypt to compare the provided password with hashed password
        const isMatch=await bcrypt.compare(candidatePassword,this.password); //mtlb provided password nd person schema k perosn k password me compare krega
        return isMatch;
    }catch(err){
        throw err;
    }
}

//how this compare func works?->interview qstn important
//it automatically extracts the salt from stored hashed password(phle se databse me jo person me stored h) and uses it to hash the entered password (entered password k saath wo salt milke ek nya hashedpassword bnata h and use compare krta h storedpassword k hashed password se).it then compares the resulting hash with the stored hash.
//eg->
//prince---->sadjashdhiuhewldasolijaliJJK (prince is stored password)
//now on logging again it asks for username and password let say we enterd password---->agarwal
//it doesnt do like iska bhi hashed password bnake dono hashe dpassword compare kr rha h
//what happens actually is->extract salt from original password

//sadjashdhiuhewldasolijaliJJK----->extract salt(dsgsid)
//then salt+agrawal ---->will make a hashed password of it---->sadgfywhwqkpasjbcjsdynqiwp
//then compare both 

//create Person model
const Person=mongoose.model('Person',personSchema);
module.exports=Person;
