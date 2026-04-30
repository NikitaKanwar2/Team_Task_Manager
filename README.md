# Ethara - Team Task Manager

A professional, full-stack Team Task Manager built with the MERN stack.

## Features

- **Authentication**: Secure Signup and Login using JWT and Bcrypt hashing.
- **Role-Based Access Control**:
  - **Admin**: Create projects, add/remove members, manage all tasks.
  - **Member**: Access assigned tasks, update status.
- **Project Management**: Create team projects and manage memberships.
- **Task Board**: Interactive Kanban-style task board (To Do, In Progress, Done).
- **Dashboard**: Real-time stats, task distribution, and user productivity tracking.
- **Premium UI**: Modern glassmorphic design using Vanilla CSS.

## Tech Stack

- **Frontend**: React (Vite), Axios, Lucide React, React Router.
- **Backend**: Node.js, Express, MongoDB (Mongoose), JWT.

## Setup Instructions

### Prerequisites

- Node.js installed.
- MongoDB Atlas account or local MongoDB instance.

### 1. Backend Setup

1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file based on `.env.example`:
   ```bash
   cp ../.env.example .env
   ```
4. Update the `MONGODB_URI` and `JWT_SECRET` in the `.env` file.
5. Start the server:
   ```bash
   npm start
   ```

### 2. Frontend Setup

1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## Deployment Ready

- Use environment variables for all sensitive data.
- Prepared for deployment on platforms like Railway, Heroku, or Vercel.

## License

MIT
