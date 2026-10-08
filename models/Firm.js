const mongoose = require('mongoose');

const firmSchema = new mongoose.Schema({

    firmName: {
        type: String,
        required: true,
        unique: true
    },

    area: {
        type: String,
        required: true
    },

    category: [
        {
            type: String,
            enum: ['Veg', 'Non-Veg']
        }
    ],

    region: [
        {
            type: String,
            enum: [
                'South-Indian',
                'North-Indian',
                'Chinese',
                'Korean'
            ]
        }
    ],

    offer: {
        type: String
    },

    image: {
        type: String
    },

    vendor: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Vendor'
        }
    ],

    products: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product'
        }
    ]

});

const Firm = mongoose.model('Firm', firmSchema);

module.exports = Firm;