const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());
mongoose.connect(process.env.MONGO_URI||'mongodb://localhost:27017/hardwareshop')
.then(()=>console.log('MongoDB connected'))
.catch(err=>console.log(err));
app.use('/api/products',  require('./routes/products'));
app.use('/api/customers', require('./routes/customers'));
app.use('/api/bills',     require('./routes/bills'));
app.use('/api/vendors',   require('./routes/vendors'));
app.get('/',(req,res)=>res.send('OK'));
app.listen(process.env.PORT||5000,()=>console.log('Server running'));
