const router = require('express').Router();
const Bill    = require('./Bill');
const Product = require('./Product');

// GET all bills
router.get('/', async (req, res) => {
  try {
    const bills = await Bill.find().sort({ createdAt: -1 });
    res.json(bills);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create bill (also reduces stock)
router.post('/', async (req, res) => {
  try {
    const { customer, items, total, date } = req.body;

    // Reduce stock for each item
    for (const item of items) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { stock: -item.qty }
      });
    }

    const bill = new Bill({ customer, items, total, date });
    const saved = await bill.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE bill
router.delete('/:id', async (req, res) => {
  try {
    await Bill.findByIdAndDelete(req.params.id);
    res.json({ message: 'Bill deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
