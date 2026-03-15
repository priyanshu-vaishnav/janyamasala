const express = require('express');
const router = express.Router();
const Inquiry = require('../models/Inquiry');
const { protect, adminOnly } = require('../middleware/auth');

// POST /api/inquiries — Public: submit inquiry
router.post('/', async (req, res) => {
  try {
    const inquiry = await Inquiry.create(req.body);
    res.status(201).json({ success: true, message: 'Inquiry submitted! We will contact you soon.', data: inquiry });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// GET /api/inquiries — Admin only
router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const { status, type, page = 1, limit = 20 } = req.query;
    let query = {};
    if (status) query.status = status;
    if (type) query.type = type;

    const total = await Inquiry.countDocuments(query);
    const inquiries = await Inquiry.find(query)
      .populate('product', 'name')
      .sort('-createdAt')
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({ success: true, total, page: Number(page), data: inquiries });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PATCH /api/inquiries/:id — Update status/notes (admin)
router.patch('/:id', protect, adminOnly, async (req, res) => {
  try {
    const inquiry = await Inquiry.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, data: inquiry });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// DELETE /api/inquiries/:id — Admin only
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    await Inquiry.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Inquiry deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
