const Vendor = require('../models/vendor');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config();

const secretKey = process.env.WhatIsYourName

const vendorRegister = async(req,res)=>{
   const {username,email,password} = req.body;
   try{

    const vendorEmail = await Vendor.findOne({email});
    if(vendorEmail){
        return res.status(400).json({message:"Email already exists"});
    }
    const hashedPassword = await bcrypt.hash(password,10)
    const newVendor = new Vendor({
        username,
        email,
        password:hashedPassword 
    });
    await newVendor.save();
    res.status(201).json({
        message:"Vendor registered successfully"
    });

   }catch(error){
       res.status(500).json({error:"Internal server error"});
   }
}

const vendorLogin = async(req,res)=>{
    const {email,password} = req.body;
    try{
        const vendor = await Vendor.findOne({email});
        if(!vendor || !(await bcrypt.compare(password,vendor.password))){
            return res.status(401).json({error:"invalid username & password"});      
        }
        const token = jwt.sign({vendorId:vendor._id},secretKey,{expiresIn:'2h'})

        res.status(200).json({success:"Login successfull",token});
        console.log("this is the token",token);
    } catch(error){
        res.status(500).json({error:"internal server issue"})
}
}

const getAllVendors = async(req,res)=>{
    try{
        const vendors = await Vendor.find().populate('firm')
        res.json({vendors})

    }catch(error){
      console.error(error)
      res.status(500).json({message:"Internal server error"});
    }
}

const getVendorById = async(req,res)=>{
    const vendorId = req.params.id;
    try {
      const vendor = await Vendor.findById(vendorId).populate('firm')
      if(!vendor){
        return res.status(404).json({message:"Invalid Id vendor Not Found"})
      }
        res.status(200).json({vendor})
    } catch (error) {
        console.log(error)
        return res.status(500).json({error:"Internal server error"})
    }
}
module.exports = {vendorRegister,vendorLogin,getAllVendors,getVendorById}