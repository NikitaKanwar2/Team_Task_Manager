const Project = require('../models/Project');
const User = require('../models/User');

// @desc    Get all projects
// @route   GET /api/projects
// @access  Private
exports.getProjects = async (req, res, next) => {
  try {
    let query;

    // If admin, they might want all projects or just their own. 
    // Requirement says: "members only see their projects"
    // So for members, filter by membership. For admin, show all if they created them or are members?
    // Let's assume Admin sees all they created or are members of.
    
    if (req.user.role === 'admin') {
      query = Project.find({
        $or: [{ admin: req.user.id }, { members: req.user.id }],
      }).populate('admin members', 'name email');
    } else {
      query = Project.find({ members: req.user.id }).populate('admin members', 'name email');
    }

    const projects = await query;

    res.status(200).json({
      success: true,
      count: projects.length,
      data: projects,
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc    Get single project
// @route   GET /api/projects/:id
// @access  Private
exports.getProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id).populate('admin members', 'name email');

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    // Check if user is member or admin of project
    const isMember = project.members.some((m) => m._id.toString() === req.user.id);
    const isAdmin = project.admin._id.toString() === req.user.id;

    if (!isMember && !isAdmin && req.user.role !== 'admin') {
      return res.status(401).json({ success: false, message: 'Not authorized to access this project' });
    }

    res.status(200).json({
      success: true,
      data: project,
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc    Create new project
// @route   POST /api/projects
// @access  Private (Admin)
exports.createProject = async (req, res, next) => {
  try {
    // Add user to req.body as admin
    req.body.admin = req.user.id;
    
    // Add admin to members list automatically
    if (!req.body.members) req.body.members = [];
    if (!req.body.members.includes(req.user.id)) {
      req.body.members.push(req.user.id);
    }

    const project = await Project.create(req.body);

    res.status(201).json({
      success: true,
      data: project,
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private (Admin)
exports.updateProject = async (req, res, next) => {
  try {
    let project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    // Make sure user is project admin
    if (project.admin.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ success: false, message: 'Not authorized to update this project' });
    }

    project = await Project.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: project,
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private (Admin)
exports.deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    // Make sure user is project admin
    if (project.admin.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ success: false, message: 'Not authorized to delete this project' });
    }

    await project.deleteOne();

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc    Add member to project
// @route   PUT /api/projects/:id/members
// @access  Private (Admin)
exports.addMember = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    // Make sure user is project admin
    if (project.admin.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ success: false, message: 'Not authorized to add members' });
    }

    const { email } = req.body;
    const userToAdd = await User.findOne({ email });

    if (!userToAdd) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (project.members.includes(userToAdd._id)) {
      return res.status(400).json({ success: false, message: 'User is already a member' });
    }

    project.members.push(userToAdd._id);
    await project.save();

    res.status(200).json({
      success: true,
      data: project,
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};
