const mongoose = require('mongoose');

const PurchaseSchema = new mongoose.Schema({
  itemName: { type: String, required: true },
  price:    { type: Number, required: true },
  qty:      { type: Number, default: 1 },
  date:     { type: Date, default: Date.now },
  deleted:  { type: Boolean, default: false }
});

const CustomerSchema = new mongoose.Schema({
  name:      { type: String, required: true },
  phone:     { type: String, required: true },
  email:     { type: String, default: '' },
  addr:      { type: String, default: '' },
  purchases: [PurchaseSchema]
}, { timestamps: true });

module.exports = mongoose.model('Customer', CustomerSchema);
