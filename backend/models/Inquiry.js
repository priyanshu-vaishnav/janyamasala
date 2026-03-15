const mongoose = require('mongoose');

const inquirySchema = new mongoose.Schema({
  name:        { type: String, required: true },
  phone:       { type: String, required: true },
  email:       { type: String },
  city:        { type: String },
  type:        { type: String, enum: ['product', 'retailer', 'bulk', 'general'], default: 'general' },
  product:     { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  message:     { type: String, required: true },
  quantity:    { type: String },
  status:      { type: String, enum: ['new', 'contacted', 'converted', 'closed'], default: 'new' },
  notes:       { type: String }, // Admin notes
  source:      { type: String, default: 'website' }, // website, whatsapp, etc.
}, { timestamps: true });

module.exports = mongoose.model('Inquiry', inquirySchema);
