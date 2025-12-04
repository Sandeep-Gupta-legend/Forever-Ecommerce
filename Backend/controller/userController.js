import userModel from "../models/userModel.js";
import validator from "validator";
import bycrypt from "bcrypt";
import jwt from "jsonwebtoken";

const createToken=(id)=>{
    return jwt.sign({id},process.env.JWT_SECRET);

}
const registerUser = async (req, res) => {
  try {
    const{name,email,password}=req.body;
    const exit =await userModel.findOne({email});
    if(exit){
      return res.json({success:false,message:"User already exist"});
    }
    if(!validator.isEmail(email)){
      return res.json({success:false,message:"Invalid email"});
    }

    if(password.length<8){
      return res.json({success:false,message:"please enter strong password"});
    }
    
    const salt =await bycrypt.genSalt(10);
    const hashedPassword=await bycrypt.hash(password,salt);
    const newUser=new userModel(
        {name,email,password:hashedPassword

        });

        const user=await newUser.save();
        const token = createToken(user.id);
        res.json({success:true,token});

  } catch (error) {
    console.log(error);
    res.json({success:false,message:"Something went wrong"});
  }
};

const loginUser = async (req, res) => {
    try{
        const {email,password}=req.body;
        const user=await userModel.findOne({email});
        if(!user){
          return res.json({success:false,message:"User not found"});
        }
        const validPassword=await bycrypt.compare(password,user.password);
       
        if(validPassword){
        const token = createToken(user.id);
        res.json({success:true,token});
        }

        else{
          return res.json({success:false,message:"Invalid password"});
        }
    }catch{
         console.log(error);
    res.json({success:false,message:"Something went wrong"});
    }
  
};
const adminLogin = async (req, res) => {
  try{
    
    const {email,password}=req.body;
    if(email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD){
      const token = jwt.sign(email+password,process.env.JWT_SECRET);
      res.json({success:true,token});
    }
    else{
      return res.json({success:false,message:"Invalid password"});
    }
  }catch{
    console.log(error);
    res.json({success:false,message:"Something went wrong"});
  }
 
};

export { registerUser, loginUser, adminLogin };
