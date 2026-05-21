const mongoose = require('mongoose');

const VendorSchema = new mongoose.Schema({
  name:        { type: String, required: true },
  phone:       { type: String, required: true },
  email:       { type: String, default: '' },
  type:        { type: String, enum: ['local', 'outside'], required: true },
  supplyItems: { type: String, default: '' }, // what they supply

  // Local vendor fields
  addr:        { type: String, default: '' },

  // Outside vendor fields (company/manufacturer)
  company:     { type: String, default: '' },
  city:        { type: String, default: '' },
  state:       { type: String, default: '' },
  gst:         { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('Vendor', VendorSchema);
