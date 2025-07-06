const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');
const { validateTransaction } = require('../middleware/validateTransaction');

// CRUD routes
router.get('/', transactionController.getTransactions);
router.get('/:id', transactionController.getTransaction);
router.post('/', validateTransaction, transactionController.createTransaction);
router.put('/:id', validateTransaction, transactionController.updateTransaction);
router.delete('/:id', transactionController.deleteTransaction);

module.exports = router;