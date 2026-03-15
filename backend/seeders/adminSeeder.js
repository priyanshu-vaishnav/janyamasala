const User = require('../models/User');
const Product = require('../models/Product');

const seedAdmin = async () => {
  try {
    const adminExists = await User.findOne({ role: 'admin' });
    if (!adminExists) {
      await User.create({
        name: 'Janya Admin',
        email: process.env.ADMIN_EMAIL || 'janyamasala@gmail.com',
        password: process.env.ADMIN_PASSWORD || 'admin123',
        role: 'admin',
        isActive: true,
        isApproved: true
      });
      console.log('✅ Admin user created: janyamasala@gmail.com / admin123');
    }

    // Seed sample products
    const productCount = await Product.countDocuments();
    if (productCount === 0) {
      await Product.insertMany([
        {
          name: 'Jeera',
          nameHindi: 'जीरा',
          category: 'whole-spice',
          description: 'Premium quality whole cumin seeds from Unjha, Gujarat. Machine cleaned for superior purity and rich aroma.',
          features: ['Machine Cleaned', 'Rich Aroma', 'Premium Quality', 'Hygienically Packed'],
          origin: 'Unjha, Gujarat',
          isFeatured: true,
          variants: [
            { weight: '250g', price: 65, mrp: 75, stock: 500, sku: 'JM-JEERA-250' },
            { weight: '500g', price: 125, mrp: 140, stock: 500, sku: 'JM-JEERA-500' },
            { weight: '1kg', price: 250, mrp: 280, stock: 1000, sku: 'JM-JEERA-1KG' }
          ],
          tags: ['cumin', 'jeera', 'whole-spice', 'gujarati']
        },
        {
          name: 'Haldi Powder',
          nameHindi: 'हल्दी पाउडर',
          category: 'powder',
          description: 'Pure turmeric powder with high curcumin content. Naturally processed, vibrant yellow colour.',
          features: ['High Curcumin', 'Natural Processing', 'Deep Yellow', 'Pure & Natural'],
          origin: 'Unjha, Gujarat',
          isFeatured: true,
          variants: [
            { weight: '200g', price: 45, mrp: 55, stock: 300, sku: 'JM-HALDI-200' },
            { weight: '500g', price: 110, mrp: 125, stock: 300, sku: 'JM-HALDI-500' },
            { weight: '1kg', price: 210, mrp: 240, stock: 500, sku: 'JM-HALDI-1KG' }
          ],
          tags: ['turmeric', 'haldi', 'powder']
        },
        {
          name: 'Lal Mirch Powder',
          nameHindi: 'लाल मिर्च पाउडर',
          category: 'powder',
          description: 'Bold, fiery red chilli powder. Perfect heat, deep red colour, machine cleaned for pure quality.',
          features: ['Bold Flavour', 'Deep Red Colour', 'Machine Cleaned', 'Premium Heat'],
          origin: 'Unjha, Gujarat',
          isFeatured: false,
          variants: [
            { weight: '200g', price: 55, mrp: 65, stock: 300, sku: 'JM-MIRCH-200' },
            { weight: '500g', price: 130, mrp: 150, stock: 300, sku: 'JM-MIRCH-500' },
            { weight: '1kg', price: 250, mrp: 280, stock: 500, sku: 'JM-MIRCH-1KG' }
          ],
          tags: ['chilli', 'mirch', 'powder', 'spicy']
        }
      ]);
      console.log('✅ Sample products seeded');
    }
  } catch (err) {
    console.error('Seeder error:', err.message);
  }
};

seedAdmin();
module.exports = seedAdmin;
