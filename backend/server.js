// Production Server
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

// Enable CORS with more robust options
// Enable CORS
app.use(cors({
  origin: true, // This reflects the request origin, which is required for credentials
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parser
app.use(express.json());

// Health check endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Team Task Manager API is running',
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString()
  });
});

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

// Validate essential environment variables
if (!process.env.MONGODB_URI) {
  console.warn('WARNING: MONGODB_URI is not defined in environment variables.');
}

// Connect to DB (asynchronously)
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('MongoDB Connected');
  })
  .catch((err) => {
    console.error(`MongoDB Connection Error: ${err.message}`);
    // We don't exit here to allow health checks to pass and to see logs in production
    console.info('Server will continue to run, but database features will be unavailable.');
  });

// Start Server
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.error(`Unhandled Rejection Error: ${err.message}`);
  // Close server & exit process
  // server.close(() => process.exit(1));
});
