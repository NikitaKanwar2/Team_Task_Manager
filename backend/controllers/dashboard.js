const Task = require('../models/Task');
const Project = require('../models/Project');
const User = require('../models/User');

// @desc    Get dashboard stats
// @route   GET /api/dashboard
// @access  Private
exports.getStats = async (req, res, next) => {
  try {
    let taskFilter = {};
    let projectFilter = {};

    if (req.user.role !== 'admin') {
      taskFilter = { assignedTo: req.user.id };
      projectFilter = { members: req.user.id };
    }

    const totalTasks = await Task.countDocuments(taskFilter);
    const todoTasks = await Task.countDocuments({ ...taskFilter, status: 'To Do' });
    const inProgressTasks = await Task.countDocuments({ ...taskFilter, status: 'In Progress' });
    const doneTasks = await Task.countDocuments({ ...taskFilter, status: 'Done' });
    
    const overdueTasks = await Task.countDocuments({
      ...taskFilter,
      status: { $ne: 'Done' },
      dueDate: { $lt: new Date() },
    });

    const totalProjects = await Project.countDocuments(projectFilter);

    // Tasks per user (Admin only)
    let tasksPerUser = [];
    if (req.user.role === 'admin') {
      tasksPerUser = await Task.aggregate([
        {
          $group: {
            _id: '$assignedTo',
            count: { $sum: 1 },
          },
        },
        {
          $lookup: {
            from: 'users',
            localField: '_id',
            foreignField: '_id',
            as: 'user',
          },
        },
        {
          $unwind: '$user',
        },
        {
          $project: {
            name: '$user.name',
            count: 1,
          },
        },
      ]);
    }

    res.status(200).json({
      success: true,
      data: {
        totalTasks,
        statusCounts: {
          todo: todoTasks,
          inProgress: inProgressTasks,
          done: doneTasks,
        },
        overdueTasks,
        totalProjects,
        tasksPerUser: req.user.role === 'admin' ? tasksPerUser : undefined,
      },
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};
