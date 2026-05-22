const express  = require('express');
const mongoose = require('mongoose');
const cors     = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/hardwareshop';

mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB error:', err));

// Load models first
const Product  = require('./Product');
const Customer = require('./Customer');
const Bill     = require('./Bill');
const Vendor   = require('./Vendor');

// Products Routes
const productsRouter = require('express').Router();
productsRouter.get('/', async (req, res) => {
  try { res.json(await Product.find().sort({ createdAt: -1 })); }
  catch (err) { res.status(500).json({ error: err.message }); }
});
productsRouter.post('/', async (req, res) => {
  try { res.status(201).json(await new Product(req.body).save()); }
  catch (err) { res.status(400).json({ error: err.message }); }
});
productsRouter.put('/:id', async (req, res) => {
  try { res.json(await Product.findByIdAndUpdate(req.params.id, req.body, { new: true })); }
  catch (err) { res.status(400).json({ error: err.message }); }
});
productsRouter.delete('/:id', async (req, res) => {
  try { await Product.findByIdAndDelete(req.params.id); res.json({ message: 'Deleted' }); }
  catch (err) { res.status(500).json({ error: err.message }); }
});

// Customers Routes
const customersRouter = require('express').Router();
customersRouter.get('/', async (req, res) => {
  try { res.json(await Customer.find().sort({ createdAt: -1 })); }
  catch (err) { res.status(500).json({ error: err.message }); }
});
customersRouter.post('/', async (req, res) => {
  try { res.status(201).json(await new Customer(req.body).save()); }
  catch (err) { res.status(400).json({ error: err.message }); }
});
customersRouter.delete('/:id', async (req, res) => {
  try { await Customer.findByIdAndDelete(req.params.id); res.json({ message: 'Deleted' }); }
  catch (err) { res.status(500).json({ error: err.message }); }
});

// Bills Routes
const billsRouter = require('express').Router();
billsRouter.get('/', async (req, res) => {
  try { res.json(await Bill.find().sort({ createdAt: -1 })); }
  catch (err) { res.status(500).json({ error: err.message }); }
});
billsRouter.post('/', async (req, res) => {
  try {
    const { customer, items, total, date } = req.body;
    for (const item of items) {
      await Product.findByIdAndUpdate(item.productId, { $inc: { stock: -item.qty } });
    }
    res.status(201).json(await new Bill({ customer, items, total, date }).save());
  } catch (err) { res.status(400).json({ error: err.message }); }
});
billsRouter.delete('/:id', async (req, res) => {
  try { await Bill.findByIdAndDelete(req.params.id); res.json({ message: 'Deleted' }); }
  catch (err) { res.status(500).json({ error: err.message }); }
});

// Vendors Routes
const vendorsRouter = require('express').Router();
vendorsRouter.get('/', async (req, res) => {
  try { res.json(await Vendor.find().sort({ createdAt: -1 })); }
  catch (err) { res.status(500).json({ error: err.message }); }
});
vendorsRouter.post('/', async (req, res) => {
  try { res.status(201).json(await new Vendor(req.body).save()); }
  catch (err) { res.status(400).json({ error: err.message }); }
});
vendorsRouter.delete('/:id', async (req, res) => {
  try { await Vendor.findByIdAndDelete(req.params.id); res.json({ message: 'Deleted' }); }
  catch (err) { res.status(500).json({ error: err.message }); }
});

app.use('/api/products',  productsRouter);
app.use('/api/customers', customersRouter);
app.use('/api/bills',     billsRouter);
app.use('/api/vendors',   vendorsRouter);

app.get('/', (req, res) => res.send('Hardware Shop API running'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log('Server running on port ' + PORT));
