const router = require('express').Router();
const Customer = require('../models/Customer');

router.get('/', async (req, res) => {
  try {
    const customers = await Customer.find().sort({ createdAt: -1 });
    res.json(customers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const customer = new Customer(req.body);
    const saved = await customer.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const updated = await Customer.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await Customer.findByIdAndDelete(req.params.id);
    res.json({ message: 'Customer deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST add a purchase
router.post('/:id/purchases', async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) return res.status(404).json({ error: 'Customer not found' });
    customer.purchases.push(req.body);
    await customer.save();
    res.json(customer);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// SOFT DELETE a purchase (mark as deleted)
router.put('/:id/purchases/:pid/delete', async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    const purchase = customer.purchases.id(req.params.pid);
    if (!purchase) return res.status(404).json({ error: 'Purchase not found' });
    purchase.deleted = true;
    await customer.save();
    res.json(customer);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// RESTORE a purchase
router.put('/:id/purchases/:pid/restore', async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    const purchase = customer.purchases.id(req.params.pid);
    if (!purchase) return res.status(404).json({ error: 'Purchase not found' });
    purchase.deleted = false;
    await customer.save();
    res.json(customer);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PERMANENT delete a purchase
router.delete('/:id/purchases/:pid', async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    customer.purchases = customer.purchases.filter(p => p._id.toString() !== req.params.pid);
    await customer.save();
    res.json(customer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
