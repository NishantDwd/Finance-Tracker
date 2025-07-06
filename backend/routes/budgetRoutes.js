const express = require('express');
const router = express.Router();
const budgetController = require('../controllers/budgetController');

// CRUD routes
router.get('/', budgetController.getBudgets);
router.get('/:id', budgetController.getBudget);
router.post('/', budgetController.createBudget);
router.put('/:id', budgetController.updateBudget);
router.delete('/:id', budgetController.deleteBudget);

module.exports = router;