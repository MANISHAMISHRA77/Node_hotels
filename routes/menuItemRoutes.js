const express=require('express');
const router=express.Router();
const MenuItem=require('./../models/MenuItem'); //  ../ bcz menu item do file pichhe h

//now router handling these operations 
router.post("/", async (req, res) => {
  //async bcz db operation may take time
  try {
    const data = req.body; //assuming request body contains data i.e client jo data bhej rha h and body parser storing in this req.body

    const newMenu = new MenuItem(data);
    // save the new menu to the database
    const savedMenu = await newMenu.save(); //jab tk hmara new document databse me addition process ni ho jata it may fail then it will redirect to catch direct from this line
    console.log("data saved");
    res.status(200).json(savedMenu);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/", async (req, res) => {
  try {
    const data = await MenuItem.find(); //data fetch krne me may be time lg jaye
    console.log("data fetched");
    res.status(200).json(data);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/:taste", async (req, res) => {
  try {
    //since taste is a parameter so we will use params in syntax
    //extract the taste from URL parameter
    const taste = req.params.taste; //it will store on which url user is sending request meaning on which taste
    //now adding validation bcz taste kuch bhi agr koi pass kr de to check krna pdega n
    if(taste=='sweet' || taste=='sour' || taste=='spicy'){
      //now db operations i.e find persoon with that work type-isme kuch time lg skta h so await
      const response=await MenuItem.find({taste:taste});
      console.log('response fetched');
      res.status(200).json(response);
    }else{
      res.status(404).json({error:'Invalid taste type'});
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal server error" });
  }
});


//comment added for testing
 //export
module.exports=router; 