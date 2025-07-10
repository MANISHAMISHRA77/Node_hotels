//jwtAuthMiddleware.js import
const jwt=require('jsonwebtoken');

//middleware function (jwt auth middleware function)->responsible for authentication via tokens
const jwtAuthMiddleware=(req,res,next)=>{
    //first check the request header has authorisation or not like if we dont pass any authorisation
    const authorization=req.headers.authorization;
    if(!authorization)return res.status(401).json({error:'Token not found'})

    console.log("JWT middleware triggered on:", req.method, req.originalUrl);
    //extract the JWT token from the request header->client send token through header section(from authorisation bearer token) and can also pass through authorization section from bearer token (in postman means from frontend in authorisaion bearer section)
    //so extract token from that request header 
    const token=req.headers.authorization.split(' ')[1];//meaning that header contains bearer then space then token so i am using js split method to get only token part 
    //if token is null means not containing any data toh kya hi decode krega use
    if(!token)return res.status(401).json({error:'Unauthorised'});
    //otherwise decode the token
    try{
        //verify the JWT token and verification is being done with the help of token and secret key
        const decoded=jwt.verify(token,process.env.JWT_SECRET);//after verification it returns payload so it is getting stored in decoded
        //attach user information to the request object (user information is being taken from payload section of token and it is attached to reques body(req) so that it can be accesed by other middleware functions or route handlers)
        req.user=decoded;
        next();//callback function to go to next middleware
    }catch(err){
        //agr yhn aa gye mtlb invalid token bcz token null to h ni
        console.log(err);
        res.status(401).json({error:'Invalid Token'});
    }
};

//function to generate JWT token (like on first signup or login when we pass username and password)
const generateToken=(userData)=>{
    //generate a new JWT token using userdata
    //kbhi kbhi expiresin kam ni krta toh make sure ki userData object format me pass kiya ho...usse ye resolve ho jata h
    return jwt.sign({userData},process.env.JWT_SECRET,{expiresIn:30000});//jwt sign function takes two parametrs - userdata and secret key
    //expiresIn is for expiry of this token ,it is in seconds i.e 30000sec bad ye token valid ni hoga
}
//export this middleware function and generateToken function
module.exports={jwtAuthMiddleware,generateToken};