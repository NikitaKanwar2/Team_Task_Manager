const express = require('express');
const {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  addMember,
} = require('../controllers/projects');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth');

router
  .route('/')
  .get(protect, getProjects)
  .post(protect, authorize('admin'), createProject);

router
  .route('/:id')
  .get(protect, getProject)
  .put(protect, authorize('admin'), updateProject)
  .delete(protect, authorize('admin'), deleteProject);

router.put('/:id/members', protect, authorize('admin'), addMember);

module.exports = router;
