const Task = require('../models/Task');
const Project = require('../models/Project');

// @desc    Get all tasks for a project
// @route   GET /api/projects/:projectId/tasks
// @access  Private
exports.getTasks = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.projectId);

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    // Check if user is member of project
    if (!project.members.includes(req.user.id) && req.user.role !== 'admin') {
      return res.status(401).json({ success: false, message: 'Not authorized to view tasks for this project' });
    }

    let query;
    if (req.user.role === 'admin') {
      query = Task.find({ project: req.params.projectId }).populate('assignedTo', 'name email');
    } else {
      // Member only sees their assigned tasks? 
      // Requirement: "Members can only access assigned tasks"
      query = Task.find({ project: req.params.projectId, assignedTo: req.user.id }).populate('assignedTo', 'name email');
    }

    const tasks = await query;

    res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks,
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc    Get single task
// @route   GET /api/tasks/:id
// @access  Private
exports.getTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id).populate('assignedTo', 'name email');

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    // Check authorization
    if (task.assignedTo._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ success: false, message: 'Not authorized to view this task' });
    }

    res.status(200).json({
      success: true,
      data: task,
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc    Create new task
// @route   POST /api/projects/:projectId/tasks
// @access  Private (Admin)
exports.createTask = async (req, res, next) => {
  try {
    req.body.project = req.params.projectId;
    req.body.createdBy = req.user.id;

    const project = await Project.findById(req.params.projectId);

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    // Check if assigned user is in the project
    if (!project.members.includes(req.body.assignedTo)) {
      return res.status(400).json({ success: false, message: 'Assigned user is not a member of this project' });
    }

    const task = await Task.create(req.body);

    res.status(201).json({
      success: true,
      data: task,
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private
exports.updateTask = async (req, res, next) => {
  try {
    let task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    // Authorization: 
    // Admin can update everything. 
    // Member can only update status.
    
    if (req.user.role !== 'admin') {
        if (task.assignedTo.toString() !== req.user.id) {
            return res.status(401).json({ success: false, message: 'Not authorized to update this task' });
        }
        
        // If not admin, only allow status update
        const { status } = req.body;
        task = await Task.findByIdAndUpdate(req.params.id, { status }, {
            new: true,
            runValidators: true,
        });
    } else {
        task = await Task.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
    }

    res.status(200).json({
      success: true,
      data: task,
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private (Admin)
exports.deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    if (req.user.role !== 'admin') {
      return res.status(401).json({ success: false, message: 'Not authorized to delete tasks' });
    }

    await task.deleteOne();

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};
