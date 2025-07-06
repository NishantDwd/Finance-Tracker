const Category = require('../models/Category');

// Get all categories
exports.getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    res.json(categories);
  } catch (err) {
    next(err);
  }
};

// Get single category by ID
exports.getCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ message: 'Category not found' });
    res.json(category);
  } catch (err) {
    next(err);
  }
};

// Create a new category
exports.createCategory = async (req, res, next) => {
  try {
    const { name, color } = req.body;
    const category = new Category({ name, color });
    await category.save();
    res.status(201).json(category);
  } catch (err) {
    // Handle duplicate key error for unique name
    if (err.code === 11000) {
      return res.status(400).json({ message: 'Category name must be unique' });
    }
    next(err);
  }
};

// Update a category
exports.updateCategory = async (req, res, next) => {
  try {
    const { name, color } = req.body;
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { name, color },
      { new: true, runValidators: true }
    );
    if (!category) return res.status(404).json({ message: 'Category not found' });
    res.json(category);
  } catch (err) {
    next(err);
  }
};

// Delete a category
exports.deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) return res.status(404).json({ message: 'Category not found' });
    res.json({ message: 'Category deleted' });
  } catch (err) {
    next(err);
  }
};