const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');

router.get('/monthly-expenses', analyticsController.getMonthlyExpenses);
router.get('/category-breakdown', analyticsController.getCategoryBreakdown);
router.get('/budget-vs-actual', analyticsController.getBudgetVsActual);
router.get('/recent-transactions', analyticsController.getRecentTransactions);
router.get('/top-categories', analyticsController.getTopCategories);
router.get('/biggest-expenses', analyticsController.getBiggestExpenses);

module.exports = router;