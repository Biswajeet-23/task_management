# Ticklr - Task Management Application

A full-stack task management application with user authentication, CRUD operations, responsive UI, and a comprehensive dashboard. Built as a take-home assignment for a Full Stack Developer role.

## 🚀 Live Demo

- **Frontend:** [https://task-management-ivory-two.vercel.app](https://task-management-ivory-two.vercel.app/login)
- **Backend API:** [https://task-management-api-8zdu.onrender.com](https://task-management-api-8zdu.onrender.com)
- **Demo Account:** email: test@gmail.com  password: Test@123

> 📸 **Screenshots :** See the [Screenshots](#-screenshots) section below.

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [API Documentation](#-api-documentation)
- [Project Structure](#-project-structure)
- [Screenshots](#-screenshots)
- [Bonus Features](#-bonus-features)
- [Architecture](#-architecture)
- [License](#-license)

---

## ✨ Features

### User Authentication

- ✅ User registration with email and password (with validation)
- ✅ User login with JWT-based authentication
- ✅ Protected routes — only authenticated users can access task management
- ✅ Logout functionality that clears the session/token
- ✅ Persistent login state across page refreshes

### Task Management (CRUD)

- ✅ Create tasks with: Title, Description, Priority (Low/Medium/High), Due Date, Status (To Do/In Progress/Done)
- ✅ View all tasks with filtering by Status and Priority
- ✅ Sort tasks by Due Date or creation date
- ✅ Update existing tasks (all fields editable)
- ✅ Delete tasks with confirmation prompt

### Dashboard

- ✅ Summary view: total tasks, tasks grouped by status, overdue task count
- ✅ Visual priority indicators (color-coded badges)
- ✅ Interactive charts/statistics
- ✅ Drag-and-drop Kanban board view

### UI/UX

- ✅ Fully responsive design (mobile-friendly)
- ✅ Dark mode toggle
- ✅ Clean, modern interface with Tailwind CSS
- ✅ Loading states and error handling
- ✅ Form validation (client-side + server-side)

---

## 🛠 Tech Stack

| Layer                | Technology                           |
| -------------------- | ------------------------------------ |
| **Frontend**         | React 19 + Vite + TypeScript         |
| **Styling**          | Tailwind CSS                         |
| **State Management** | React Context API                    |
| **Routing**          | React Router DOM                     |
| **HTTP Client**      | Axios                                |
| **Backend**          | NestJS + TypeScript                  |
| **Database**         | MongoDB + Mongoose ODM               |
| **Authentication**   | JWT (jsonwebtoken) + bcrypt          |
| **Validation**       | class-validator + class-transformer  |
| **Testing**          | Jest + Supertest (E2E)               |
| **Containerization** | Docker + Docker Compose              |
| **CI/CD**            | GitHub Actions                       |
| **Deployment**       | Vercel (frontend) + Render (backend) |

---

## 🏁 Getting Started

### Prerequisites

- Node.js 24+
- Docker & Docker Compose (optional, for containerized setup)
- MongoDB (local or Atlas URI)

### Local Development Setup

#### 1. Clone the Repository

```bash
git clone https://github.com/Biswajeet-23/task_management.git
cd task_management
```

#### 2. Backend Setup

```bash
cd api
npm install
```

Create a `.env` file (see [.env.example](./api/.env.example)):

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/taskdb
JWT_SECRET=your-super-secret-jwt-key
FRONTEND_URL=http://localhost:5173
```

Start the backend:

```bash
npm run start:dev
```

#### 3. Frontend Setup

```bash
cd ../client
npm install
```

Create a `.env` file:

```env
VITE_API_URL=http://localhost:3000
```

Start the frontend:

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

### Docker Setup (One-Command Startup)

```bash
docker compose up --build
```

This starts:

- MongoDB on port `27017`
- Backend API on port `3000`
- Frontend on port `8080`

Front-end local url: http://127.0.0.1:8080/

### Running Tests

```bash
# E2E tests (requires Docker)
docker compose up --build backend-test

# Or locally (requires MongoDB running)
cd api
npm run test:e2e
```

---

## 🔐 Environment Variables

### Backend (`api/.env`)

| Variable       | Description                | Required |
| -------------- | -------------------------- | -------- |
| `PORT`         | Server port                | Yes      |
| `MONGODB_URI`  | MongoDB connection string  | Yes      |
| `JWT_SECRET`   | Secret key for JWT signing | Yes      |
| `FRONTEND_URL` | Allowed CORS origin        | Yes      |

### Frontend (`client/.env`)

| Variable       | Description          | Required |
| -------------- | -------------------- | -------- |
| `VITE_API_URL` | Backend API base URL | Yes      |

---

## 📡 API Documentation

Interactive API documentation is available via **Swagger UI** at: [Swagger](https://task-management-api-8zdu.onrender.com/api/docs)

## 🗂 Project Structure

```
task_management/
├── api/                          # NestJS Backend
│   ├── src/
│   │   ├── auth/                 # Authentication module
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── auth.module.ts
│   │   │   └── dto/
│   │   ├── tasks/                # Tasks module
│   │   │   ├── tasks.controller.ts
│   │   │   ├── tasks.service.ts
│   │   │   ├── tasks.module.ts
│   │   │   ├── tasks.schema.ts
│   │   │   └── dto/
│   │   ├── users/                # Users module
│   │   │   ├── users.service.ts
│   │   │   └── users.schema.ts
│   │   ├── app.module.ts
│   │   └── main.ts
│   ├── test/                     # E2E tests
│   │   ├── auth.e2e-spec.ts
│   │   ├── tasks.e2e-specs.ts
│   │   ├── setup.ts
│   │   └── jest-e2e.json
│   ├── Dockerfile
│   └── package.json
│
├── client/                       # React Frontend
│   ├── src/
│   │   ├── components/           # Reusable UI components
│   │   ├── pages/                # Page components
│   │   │   ├── LoginPage.tsx
│   │   │   ├── RegisterPage.tsx
│   │   │   ├── DashboardPage.tsx
│   │   │   └── TasksPage.tsx
│   │   ├── hooks/                # Custom React hooks
│   │   ├── providers/            # Context providers
│   │   │   ├── AuthProvider.tsx
│   │   │   ├── TaskProvider.tsx
│   │   │   └── ThemeProvider.tsx
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── Dockerfile
│   └── package.json
│
├── docker-compose.yml            # Docker orchestration
├── .github/
│   └── workflows/
│       └── ci-cd.yml             # GitHub Actions CI/CD
└── README.md
```

---

## 📸 Screenshots

| Screen Name | Light Mode | Dark Mode |
|-------------|-------------|------------|
| **Login Page** | ![Login Light](./screenshots/Login_light.png) | ![Login Dark](./screenshots/Login_dark.png) |
| **Register Page** | ![Register Light](./screenshots/Register_light.png) | ![Register Dark](./screenshots/Register_dark.png) |
| **Dashboard** | ![Dashboard Light](./screenshots/Dashboard_light.png) | ![Dashboard Dark](./screenshots/Dashboard_dark.png) |
| **Kanban** | ![Kanban Light](./screenshots/Dashboard_kanban_light.png) | ![Kanban Dark](./screenshots/Dashboard_kanban_dark.png) |
| **Tasks List** | ![Tasks Light](./screenshots/Tasks_light.png) | ![Tasks Dark](./screenshots/Tasks_dark.png) |
| **Create Task** | ![Create Task Light](./screenshots/Create_Task_light.png) | ![Create Task Dark](./screenshots/Create_Task_dark.png) |

---

## 🎁 Bonus Features

| Feature                                          | Status      |
| ------------------------------------------------ | ----------- |
| ✅ **Drag-and-Drop Kanban Board**                | Implemented |
| ✅ **Unit/Integration Tests (Jest + Supertest)** | Implemented |
| ✅ **CI/CD Pipeline (GitHub Actions)**           | Implemented |
| ✅ **Dockerized Setup (docker-compose)**         | Implemented |
| ✅ **Dark Mode Toggle**                          | Implemented |
| ✅ **API documentation via Swagger / OpenAPI**   | Implemented |

---

## 🏗 Architecture

For detailed architecture decisions, folder structure rationale, database schema design, authentication flow, and trade-offs, see [ARCHITECTURE.md](./ARCHITECTURE.md).

---

## 🧪 Testing

```bash
# Run E2E tests in Docker
docker compose up --build backend-test

# Run E2E tests locally
cd api && npm run test:e2e
```

Tests cover:

- Authentication (register, login)
- Task CRUD operations

---

## 📄 License

This project was built as a take-home assignment. All rights reserved.

---

## 👤 Author

**Biswajeet** - [GitHub](https://github.com/Biswajeet-23)
