const express = require('express');
const {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
} = require('../controllers/tasks');

const router = express.Router({ mergeParams: true });

const { protect, authorize } = require('../middleware/auth');

router
  .route('/')
  .get(protect, getTasks)
  .post(protect, authorize('admin'), createTask);

router
  .route('/:id')
  .get(protect, getTask)
  .put(protect, updateTask)
  .delete(protect, authorize('admin'), deleteTask);

module.exports = router;
