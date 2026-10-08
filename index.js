const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);
const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const vendorRoutes = require('./routes/vendorRoutes');
const firmRoutes = require('./routes/firmRoutes');
const productRoutes = require('./routes/productRoutes');
const path = require('path');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5555;

app.use(bodyParser.json()); 

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected successfully"))
  .catch((error) => console.log("Database connection error:", error));

// Routes
app.use('/vendor', vendorRoutes);
app.use('/firm', firmRoutes);
app.use('/product',productRoutes);
app.use('/uploads', express.static('uploads'));

app.use('/home', (req, res) => {
    res.send("<h1>Welcome to Suby</h1>");
});

app.listen(PORT, () => {
    console.log(`Server is started and running at ${PORT}`);
});