const Budget = require('../models/Budget');

// Get all budgets (optionally filter by month/year)
exports.getBudgets = async (req, res, next) => {
  try {
    const { month, year } = req.query;
    const filter = {};
    if (month) filter.month = Number(month);
    if (year) filter.year = Number(year);
    const budgets = await Budget.find(filter);
    res.json(budgets);
  } catch (err) {
    next(err);
  }
};

// Get single budget by ID
exports.getBudget = async (req, res, next) => {
  try {
    const budget = await Budget.findById(req.params.id);
    if (!budget) return res.status(404).json({ message: 'Budget not found' });
    res.json(budget);
  } catch (err) {
    next(err);
  }
};

// Create a new budget
exports.createBudget = async (req, res, next) => {
  try {
    const { category, amount, month, year } = req.body;
    const budget = new Budget({ category, amount, month, year });
    await budget.save();
    res.status(201).json(budget);
  } catch (err) {
    // Handle duplicate key error for unique category/month/year
    if (err.code === 11000) {
      return res.status(400).json({ message: 'Budget for this category and month already exists' });
    }
    next(err);
  }
};

// Update a budget
exports.updateBudget = async (req, res, next) => {
  try {
    const { category, amount, month, year } = req.body;
    const budget = await Budget.findByIdAndUpdate(
      req.params.id,
      { category, amount, month, year },
      { new: true, runValidators: true }
    );
    if (!budget) return res.status(404).json({ message: 'Budget not found' });
    res.json(budget);
  } catch (err) {
    next(err);
  }
};

// Delete a budget
exports.deleteBudget = async (req, res, next) => {
  try {
    const budget = await Budget.findByIdAndDelete(req.params.id);
    if (!budget) return res.status(404).json({ message: 'Budget not found' });
    res.json({ message: 'Budget deleted' });
  } catch (err) {
    next(err);
  }
};