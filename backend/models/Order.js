const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderNumber: { type: String, unique: true },
  retailer:    { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  items: [{
    product:   { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    variant:   { type: String },
    quantity:  { type: Number, required: true },
    price:     { type: Number, required: true },
    total:     { type: Number, required: true }
  }],
  subtotal:    { type: Number, required: true },
  discount:    { type: Number, default: 0 },
  total:       { type: Number, required: true },
  status:      { 
    type: String, 
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  shippingAddress: {
    name:    String,
    phone:   String,
    address: String,
    city:    String,
    state:   String,
    pincode: String
  },
  paymentMethod: { type: String, enum: ['cod', 'bank', 'upi'], default: 'cod' },
  paymentStatus: { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' },
  notes:       { type: String },
  adminNotes:  { type: String },
  trackingId:  { type: String },
}, { timestamps: true });

// Auto-generate order number
orderSchema.pre('save', async function(next) {
  if (!this.orderNumber) {
    const count = await mongoose.model('Order').countDocuments();
    this.orderNumber = `JM${new Date().getFullYear()}${String(count + 1).padStart(5, '0')}`;
  }
  next();
});

module.exports = mongoose.model('Order', orderSchema);
