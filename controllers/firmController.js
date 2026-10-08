const Firm = require('../models/Firm')
const Vendor = require('../models/vendor');
const path = require('path');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/");
    },

    filename: function (req, file, cb) {
        const uniqueName = Date.now() + path.extname(file.originalname);
        cb(null, uniqueName);
    }
});
const upload = multer({storage:storage});

const addFirm = async(req,res)=>{
    try{
    const{firmName,area,category,region,offer} = req.body;
    const image = req.file? req.file.filename:undefined

    
    const vendor = await Vendor.findById(req.vendorId);
     if(!vendor){
        res.status(404).json({message:"Vendor not Found"});
     }
    const firm = new Firm({
        firmName,area,category,region,offer,image,vendor:vendor._id
    })
     const savedfirm = await firm.save();

     vendor.firm.push(savedfirm)
     await vendor.save()

      return res.status(200).json({message:"Firm added Successfully"});
}catch(error){
   console.error(error)
   return res.status(500).json({message:"Internal Server error"})
}
}

const deleteFirmById = async(req,res)=>{
    try{
      const firmId = req.params.firmId;
      const deletedfirm = await Firm.findByIdAndDelete(firmId);
      if(!deletedfirm){
        return res.status(404).json({error:"no firm found"});
      }
    }catch(error){
        console.error(error);
        return res.status(500).json({error:"Internal Server Error"});
    }
}

module.exports ={addFirm:[upload.single('image'),addFirm],deleteFirmById}