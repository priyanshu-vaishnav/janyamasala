const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name:        { type: String, required: true, trim: true },
  nameHindi:   { type: String },
  slug:        { type: String, unique: true },
  category:    { type: String, enum: ['whole-spice', 'powder', 'blend'], default: 'whole-spice' },
  description: { type: String, required: true },
  image:       { type: String, default: '' },
  variants: [{
    weight:    { type: String, required: true }, // e.g. "1kg", "500g"
    price:     { type: Number, required: true },
    mrp:       { type: Number },
    stock:     { type: Number, default: 0 },
    sku:       { type: String }
  }],
  features:    [{ type: String }],
  tags:        [{ type: String }],
  origin:      { type: String, default: 'Unjha, Gujarat' },
  isFeatured:  { type: Boolean, default: false },
  isActive:    { type: Boolean, default: true },
  totalSold:   { type: Number, default: 0 },
  rating:      { type: Number, default: 0, min: 0, max: 5 },
}, { timestamps: true });

// Auto-generate slug
productSchema.pre('save', function(next) {
  if (this.isModified('name')) {
    this.slug = this.name.toLowerCase()
      .replace(/[^a-z0-9 ]/g, '')
      .replace(/\s+/g, '-');
  }
  next();
});

module.exports = mongoose.model('Product', productSchema);
