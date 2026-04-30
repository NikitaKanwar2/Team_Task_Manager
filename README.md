# Ethara - Team Task Manager

A professional, full-stack Team Task Manager built with the **MERN stack** (MongoDB, Express, React, Node.js). It features role-based access control, a Kanban-style task board, real-time dashboard analytics, and a modern glassmorphic UI.

## 🌐 Live Application

- **Frontend**: [https://courteous-reverence-production.up.railway.app](https://courteous-reverence-production.up.railway.app)
- **Backend API**: [https://teamtaskmanager-production-923c.up.railway.app](https://teamtaskmanager-production-923c.up.railway.app)

## 📦 GitHub Repository

[https://github.com/NikitaKanwar2/Team_Task_Manager](https://github.com/NikitaKanwar2/Team_Task_Manager)

---

## ✨ Features

### Authentication & Authorization
- Secure **Signup and Login** using JWT tokens and Bcrypt password hashing
- Persistent sessions using `localStorage`

### Role-Based Access Control (RBAC)
- **Admin**: Create projects, add/remove team members, create/delete tasks, view all dashboard analytics
- **Member**: View assigned projects, update task status (To Do → In Progress → Done)

### Project Management
- Create team projects with name and description
- Add members by email to collaborate on projects
- View all projects with member count and admin info

### Task Board (Kanban)
- Interactive drag-style task management with three columns: **To Do**, **In Progress**, **Done**
- Tasks include title, description, priority (Low/Medium/High), due date, and assignee
- Move tasks between columns with one-click buttons

### Dashboard Analytics
- Total tasks, projects, and overdue task count
- Task status distribution (To Do, In Progress, Done)
- Tasks per user breakdown (Admin only)

### Premium UI/UX
- Modern **glassmorphic design** with dark theme
- Smooth animations and transitions
- Fully responsive layout
- Built with **Vanilla CSS** (no CSS frameworks)

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19, Vite, React Router v7, Axios, Lucide React |
| **Backend** | Node.js, Express 5, Mongoose 9 |
| **Database** | MongoDB Atlas |
| **Auth** | JSON Web Tokens (JWT), Bcrypt.js |
| **Deployment** | Railway (Frontend + Backend) |

---

## 🚀 Setup Instructions (Local Development)

### Prerequisites

- **Node.js** (v18 or higher)
- **npm** (v9 or higher)
- **MongoDB Atlas** account (free tier works) or local MongoDB instance

### 1. Clone the Repository

```bash
git clone https://github.com/NikitaKanwar2/Team_Task_Manager.git
cd Team_Task_Manager
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory:

```env
PORT=5001
NODE_ENV=development
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/taskmanager?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=30d
```

Start the backend server:

```bash
npm start
```

You should see:
```
MongoDB Connected
Server running in development mode on port 5001
```

### 3. Frontend Setup

Open a **new terminal** and run:

```bash
cd frontend
npm install
```

Create a `.env` file in the `frontend` directory:

```env
VITE_API_URL=http://localhost:5001/api
```

Start the frontend development server:

```bash
npm run dev
```

Open your browser at **http://localhost:5173**

---

## 🌍 Deployment Steps (Railway)

This application is deployed on **Railway** with separate services for frontend and backend.

### Backend Deployment

1. Create a new service on Railway linked to the GitHub repository
2. Set the **Root Directory** to `backend`
3. Add the following **Environment Variables**:
   - `NODE_ENV` = `production`
   - `MONGODB_URI` = Your MongoDB Atlas connection string
   - `JWT_SECRET` = Your secret key
   - `JWT_EXPIRE` = `30d`
4. Railway will auto-detect Node.js and run `npm start`

### Frontend Deployment

1. Create a new service on Railway linked to the same GitHub repository
2. Set the **Root Directory** to `frontend`
3. Set the **Build Command** to `npm run build`
4. Set the **Start Command** to `npm start`
5. Add the following **Environment Variable**:
   - `VITE_API_URL` = `https://your-backend-url.up.railway.app/api`
6. Railway will build and serve the static frontend

---

## 📁 Project Structure

```
Team_Task_Manager/
├── backend/
│   ├── controllers/       # Route handlers (auth, projects, tasks, dashboard)
│   ├── middleware/         # JWT authentication & role authorization
│   ├── models/             # Mongoose schemas (User, Project, Task)
│   ├── routes/             # Express route definitions
│   ├── server.js           # Main server entry point
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/     # Reusable UI components (Layout, Sidebar)
│   │   ├── context/        # React Context (AuthContext)
│   │   ├── pages/          # Page components (Login, Signup, Dashboard, Projects)
│   │   ├── App.jsx         # Main app with routing
│   │   └── main.jsx        # React entry point
│   ├── index.html
│   ├── package.json
│   └── .env.example
└── README.md
```

---

## 🔗 API Endpoints

### Auth
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/auth/register` | Register a new user | Public |
| POST | `/api/auth/login` | Login user | Public |
| GET | `/api/auth/me` | Get logged-in user | Private |

### Projects
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/projects` | Get all projects | Private |
| GET | `/api/projects/:id` | Get single project | Private |
| POST | `/api/projects` | Create project | Admin |
| PUT | `/api/projects/:id` | Update project | Admin |
| DELETE | `/api/projects/:id` | Delete project | Admin |
| PUT | `/api/projects/:id/members` | Add member | Admin |

### Tasks
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/projects/:projectId/tasks` | Get tasks for project | Private |
| POST | `/api/projects/:projectId/tasks` | Create task | Admin |
| PUT | `/api/tasks/:id` | Update task (status) | Private |
| DELETE | `/api/tasks/:id` | Delete task | Admin |

### Dashboard
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/dashboard` | Get dashboard stats | Private |

---

## 👤 Test Credentials

You can create a new account on the live application, or use the signup page to register:

1. **Admin Account**: Sign up with role "Admin" to access all features
2. **Member Account**: Sign up with role "Member" to test limited access

---

## 📄 License

MIT
