const Transaction = require('../models/Transaction');
const Budget = require('../models/Budget');

// Get monthly expenses summary (bar chart data)
exports.getMonthlyExpenses = async (req, res, next) => {
  try {
    const { year } = req.query;
    const match = {};
    if (year) {
      match.date = {
        $gte: new Date(`${year}-01-01`),
        $lte: new Date(`${year}-12-31`)
      };
    }
    const data = await Transaction.aggregate([
      { $match: match },
      {
        $group: {
          _id: { $month: "$date" },
          total: { $sum: "$amount" }
        }
      },
      { $sort: { "_id": 1 } }
    ]);
    res.json(data);
  } catch (err) {
    next(err);
  }
};

// Get category-wise expense breakdown (pie chart data)
exports.getCategoryBreakdown = async (req, res, next) => {
  try {
    const { month, year } = req.query;
    const match = {};
    if (month && year) {
      match.date = {
        $gte: new Date(`${year}-${month}-01`),
        $lte: new Date(`${year}-${month}-31`)
      };
    } else if (year) {
      match.date = {
        $gte: new Date(`${year}-01-01`),
        $lte: new Date(`${year}-12-31`)
      };
    }
    const data = await Transaction.aggregate([
      { $match: match },
      {
        $group: {
          _id: "$category",
          total: { $sum: "$amount" }
        }
      },
      { $sort: { total: -1 } }
    ]);
    res.json(data);
  } catch (err) {
    next(err);
  }
};

// Get budget vs actual for a month
exports.getBudgetVsActual = async (req, res, next) => {
  try {
    const { month, year } = req.query;
    if (!month || !year) {
      return res.status(400).json({ message: "Month and year are required" });
    }
    // Get budgets for the month
    const budgets = await Budget.find({ month: Number(month), year: Number(year) });
    // Get actual expenses for the month by category
    const expenses = await Transaction.aggregate([
      {
        $match: {
          date: {
            $gte: new Date(`${year}-${month}-01`),
            $lte: new Date(`${year}-${month}-31`)
          }
        }
      },
      {
        $group: {
          _id: "$category",
          total: { $sum: "$amount" }
        }
      }
    ]);
    res.json({ budgets, expenses });
  } catch (err) {
    next(err);
  }
};

// Get recent transactions
exports.getRecentTransactions = async (req, res, next) => {
  try {
    const transactions = await Transaction.find().sort({ date: -1 }).limit(5);
    res.json(transactions);
  } catch (err) {
    next(err);
  }
};

// ...existing code...

// Get top N spending categories for a given month/year
exports.getTopCategories = async (req, res, next) => {
  try {
    const { month, year, limit = 5 } = req.query;
    const match = {};
    if (month && year) {
      match.date = {
        $gte: new Date(`${year}-${month}-01`),
        $lte: new Date(`${year}-${month}-31`)
      };
    } else if (year) {
      match.date = {
        $gte: new Date(`${year}-01-01`),
        $lte: new Date(`${year}-12-31`)
      };
    }
    const data = await Transaction.aggregate([
      { $match: match },
      {
        $group: {
          _id: "$category",
          total: { $sum: "$amount" }
        }
      },
      { $sort: { total: -1 } },
      { $limit: Number(limit) }
    ]);
    res.json(data);
  } catch (err) {
    next(err);
  }
};

// Get biggest N single expenses for a given month/year
exports.getBiggestExpenses = async (req, res, next) => {
  try {
    const { month, year, limit = 5 } = req.query;
    const filter = {};
    if (month && year) {
      filter.date = {
        $gte: new Date(`${year}-${month}-01`),
        $lte: new Date(`${year}-${month}-31`)
      };
    } else if (year) {
      filter.date = {
        $gte: new Date(`${year}-01-01`),
        $lte: new Date(`${year}-12-31`)
      };
    }
    const expenses = await Transaction.find(filter)
      .sort({ amount: -1 })
      .limit(Number(limit));
    res.json(expenses);
  } catch (err) {
    next(err);
  }
};