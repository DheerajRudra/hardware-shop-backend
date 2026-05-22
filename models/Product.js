const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name:         { type: String, required: true },
  category:     { type: String, default: 'Other' },
  actualPrice:  { type: Number, required: true },
  sellingPrice: { type: Number, required: true },
  stock:        { type: Number, default: 0 },
  alert:        { type: Number, default: 5 },
  isDeleted:    { type: Boolean, default: false },
  deletedAt:    { type: Date, default: null }
}, { timestamps: true });

module.exports = mongoose.model('Product', ProductSchema);
