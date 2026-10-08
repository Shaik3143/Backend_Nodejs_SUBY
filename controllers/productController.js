const Product = require('../models/Product');
const multer = require('multer');
const Firm = require('../models/Firm');
const path = require('path');

const storage = multer.diskStorage({

    destination: function (req, file, cb) {
        cb(null, "uploads/");
    },

    filename: function (req, file, cb) {
        const uniqueName =
            Date.now() + path.extname(file.originalname);

        cb(null, uniqueName);
    }
});

const upload = multer({
    storage: storage
});

const addProduct = async (req, res) => {

    try {

        const {
            productName,
            price,
            category,
            bestSeller,
            description
        } = req.body;

        const image = req.file
            ? req.file.filename
            : undefined;

        const firmId = req.params.firmId;

        // Check firm ID
        if (!firmId) {
            return res.status(404).json({
                error: "No Firm Found"
            });
        }

        // Find firm
        const firm = await Firm.findById(firmId);

        // Check firm exists
        if (!firm) {
            return res.status(404).json({
                error: "Firm not found"
            });
        }

        // Create product
        const product = new Product({

            productName,
            price,
            category,
            bestSeller,
            description,
            image,

            firm: firm._id
        });

       
        const savedProduct = await product.save();

        firm.products = firm.products || [];
        firm.products.push(savedProduct._id);

      
        await firm.save();

        
        res.status(200).json({
            message: "Product added successfully",
            product: savedProduct
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: "Internal server error",
            message: error.message
        });
    }
};
const getProductsByFirm = async (req, res) => {
    try {
        const firmId = req.params.firmId;
        const firm = await Firm.findById(firmId);

        if(!firm){
            return res.status(404).json({error:"no firm found"});
        }
        const restaurantName = firm.firmName
        const products = await Product.find({firm:firmId})
        res.status(200).json({ restaurantName,products});
    } catch (error) {
        console.error(error);
        return res.status(500).json({error:"Internal Server Error"});
    }
}
const deleteProductById = async(req,res)=>{
    try{
      const productId = req.params.productId;
      const deletedProduct = await Product.findByIdAndDelete(productId);
      if(!deletedProduct){
        return res.status(404).json({error:"no product found"});
      }
    }catch(error){
        console.error(error);
        return res.status(500).json({error:"Internal Server Error"});
    }
}
module.exports = {addProduct: [upload.single('image'),addProduct], getProductsByFirm,deleteProductById};