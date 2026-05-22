const router = require('express').Router();
const Product = require('../models/Product');

// GET all active products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find({ isDeleted: false })
      .sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET all deleted products
router.get('/deleted', async (req, res) => {
  try {
    const products = await Product.find({ isDeleted: true })
      .sort({ deletedAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create product
router.post('/', async (req, res) => {
  try {
    const product = new Product(req.body);
    const saved = await product.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT update product
router.put('/:id', async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(
      req.params.id, req.body, { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// SOFT DELETE product
router.delete('/:id', async (req, res) => {
  try {
    await Product.findByIdAndUpdate(req.params.id, {
      isDeleted: true,
      deletedAt: new Date()
    });
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// RESTORE deleted product
router.put('/:id/restore', async (req, res) => {
  try {
    await Product.findByIdAndUpdate(req.params.id, {
      isDeleted: false,
      deletedAt: null
    });
    res.json({ message: 'Product restored' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
