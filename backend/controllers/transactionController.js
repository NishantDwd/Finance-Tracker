const Transaction = require('../models/Transaction');

// Get all transactions (with optional pagination and filtering)
exports.getTransactions = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, category, startDate, endDate } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }
    const transactions = await Transaction.find(filter)
      .sort({ date: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));
    const total = await Transaction.countDocuments(filter);
    res.json({ transactions, total });
  } catch (err) {
    next(err);
  }
};

// Get single transaction by ID
exports.getTransaction = async (req, res, next) => {
  try {
    const transaction = await Transaction.findById(req.params.id);
    if (!transaction) return res.status(404).json({ message: 'Transaction not found' });
    res.json(transaction);
  } catch (err) {
    next(err);
  }
};

// Create a new transaction
exports.createTransaction = async (req, res, next) => {
  try {
    const { amount, date, description, category } = req.body;
    const transaction = new Transaction({ amount, date, description, category });
    await transaction.save();
    res.status(201).json(transaction);
  } catch (err) {
    next(err);
  }
};

// Update a transaction
exports.updateTransaction = async (req, res, next) => {
  try {
    const { amount, date, description, category } = req.body;
    const transaction = await Transaction.findByIdAndUpdate(
      req.params.id,
      { amount, date, description, category },
      { new: true, runValidators: true }
    );
    if (!transaction) return res.status(404).json({ message: 'Transaction not found' });
    res.json(transaction);
  } catch (err) {
    next(err);
  }
};

// Delete a transaction
exports.deleteTransaction = async (req, res, next) => {
  try {
    const transaction = await Transaction.findByIdAndDelete(req.params.id);
    if (!transaction) return res.status(404).json({ message: 'Transaction not found' });
    res.json({ message: 'Transaction deleted' });
  } catch (err) {
    next(err);
  }
};