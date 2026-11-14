const express = require('express');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://mongo:27017/bank_app';

app.use(express.json());

mongoose.connect(MONGO_URI)
  .then(() => console.log('Transactions service connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

const transactionSchema = new mongoose.Schema({
  accountNumber: String,
  amount: Number,
  type: String,
  date: { type: Date, default: Date.now }
});

const Transaction = mongoose.model('Transaction', transactionSchema);

app.get('/api/transactions', async (req, res) => {
  try {
    const transactions = await Transaction.find().sort({ date: -1 }).limit(50);
    res.json({ status: 'success', service: 'transactions-service', data: transactions });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

app.post('/api/transactions', async (req, res) => {
  try {
    const { accountNumber, amount, type } = req.body;
    const newTx = new Transaction({ accountNumber, amount, type });
    await newTx.save();
    res.status(201).json({ status: 'success', message: 'Transaction recorded', data: newTx });
  } catch (err) {
    res.status(400).json({ status: 'error', message: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Transactions microservice running on port ${PORT}`);
});