const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');

// Load env vars
dotenv.config();

// Route files
const auth = require('./routes/auth');
const projects = require('./routes/projects');
const tasks = require('./routes/tasks');
const dashboard = require('./routes/dashboard');

const app = express();

// Body parser
app.use(express.json());

// Enable CORS
app.use(cors());

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Mount routers
app.use('/api/auth', auth);
app.use('/api/projects', projects);
app.use('/api/tasks', tasks); // For direct task access (PUT/DELETE)
app.use('/api/projects/:projectId/tasks', tasks); // For project-specific tasks
app.use('/api/dashboard', dashboard);

const PORT = process.env.PORT || 5001;

// Connect to DB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('MongoDB Connected');
    app.listen(PORT, () => {
      console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error(`Error: ${err.message}`);
    process.exit(1);
  });
