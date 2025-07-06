require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const transactionRoutes = require('./routes/transactionRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const budgetRoutes = require('./routes/budgetRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');

const app = express();

// Middleware
app.use(cors({
  origin: [
    "http://localhost:3000",
    "https://finance-tracker-frontend-rxcv.onrender.com",
    "https://finance-tracker-sandy-six.vercel.app/"
  ]
}));

app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch((err) => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

// Basic route for testing
app.get('/', (req, res) => {
  res.send('Finance Tracker API is running');
});

// Transaction API routes
app.use('/api/transactions', transactionRoutes);

// Category API routes
app.use('/api/categories', categoryRoutes);

// Budget API routes
app.use('/api/budgets', budgetRoutes);

// Analytics API routes
app.use('/api/analytics', analyticsRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal Server Error', error: err.message });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});