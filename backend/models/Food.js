const mongoose = require('mongoose');

const foodSchema = new mongoose.Schema(
  {
    foodId: { type: String, required: true, unique: true, trim: true },
    name: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    cuisine: { type: String, required: true, trim: true },
    ingredients: { type: [String], required: true, default: [] },
    price: { type: Number, required: true, min: 0 },
    quantity: { type: Number, required: true, min: 0, validate: Number.isInteger },
    description: { type: String, default: '' },
    imageUrl: { type: String, default: '' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Food', foodSchema);
