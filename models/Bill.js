const mongoose = require('mongoose');

const BillSchema = new mongoose.Schema({
  customer: {
    id:    { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' },
    name:  String,
    phone: String
  },
  items: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    name:  String,
    price: Number,
    qty:   Number
  }],
  total:  { type: Number, required: true },
  date:   { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Bill', BillSchema);
