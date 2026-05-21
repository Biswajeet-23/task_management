# Architecture Overview

## Project Overview

TaskFlow is a full-stack task management application built with React (frontend) and NestJS (backend). It follows a modular architecture with clear separation of concerns, enabling scalability and maintainability.

---

## Folder Structure Rationale

```
task_management/
├── api/              # Backend (NestJS)
│   ├── src/
│   │   ├── auth/     # Auth module: controllers, services, DTOs
│   │   ├── tasks/    # Tasks module: CRUD operations
│   │   ├── users/    # Users module: user data management
│   │   └── main.ts   # Application entry point
│   └── test/         # E2E tests mirroring src structure
│
└── client/           # Frontend (React + Vite)
    ├── src/
    │   ├── components/   # Reusable UI components
    │   ├── pages/        # Route-level page components
    │   ├── hooks/        # Custom React hooks
    │   └── providers/    # Context providers for state management
```

**Why this structure?**

- **Backend (NestJS):** Follows NestJS conventions with feature-based modules (`auth/`, `tasks/`, `users/`). Each module encapsulates its own controller, service, schema, and DTOs, making the codebase modular and testable.
- **Frontend (React):** Separates concerns into `pages/` (routing), `components/` (UI), `hooks/` (logic reuse), and `providers/` (global state). This avoids prop drilling and keeps components pure and reusable.

---

## Database Schema Design

### User Collection

| Field       | Type     | Constraints               |
| ----------- | -------- | ------------------------- |
| `_id`       | ObjectId | Primary key               |
| `email`     | String   | Unique, required, indexed |
| `password`  | String   | Required, bcrypt hashed   |
| `createdAt` | Date     | Auto-generated            |
| `updatedAt` | Date     | Auto-generated            |

### Task Collection

| Field         | Type     | Constraints                      |
| ------------- | -------- | -------------------------------- |
| `_id`         | ObjectId | Primary key                      |
| `title`       | String   | Required                         |
| `description` | String   | Optional                         |
| `priority`    | String   | Enum: [Low, Medium, High]        |
| `status`      | String   | Enum: [To Do, In Progress, Done] |
| `dueDate`     | Date     | Optional                         |
| `userId`      | ObjectId | Ref: User, required, indexed     |
| `createdAt`   | Date     | Auto-generated                   |
| `updatedAt`   | Date     | Auto-generated                   |

**Indexing Strategy:**

- `email` (unique index) — fast login lookups
- `userId` (index) — efficient task filtering by user
- Compound index on `userId + status` — optimizes dashboard queries

---

## Authentication Flow

```
┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│   Client    │────▶│   Backend    │────▶│  MongoDB    │
│  (React)    │◄────│   (NestJS)   │◄────│  (Mongoose) │
└─────────────┘     └──────────────┘     └─────────────┘
       │                    │
       │ 1. POST /register  │
       │───────────────────▶│
       │                    │ 2. Hash password (bcrypt)
       │                    │ 3. Save user to DB
       │ 4. Return JWT     │
       │◄───────────────────│
       │                    │
       │ 1. POST /login     │
       │───────────────────▶│
       │                    │ 2. Verify password
       │                    │ 3. Generate JWT
       │ 4. Return JWT     │
       │◄───────────────────│
       │                    │
       │ 1. Send JWT in    │
       │    Authorization   │
       │    header          │
       │───────────────────▶│
       │                    │ 2. Verify JWT
       │                    │ 3. Attach user to request
       │ 4. Return data    │
       │◄───────────────────│
```

**JWT Implementation:**

- Tokens are signed with `JWT_SECRET` and expire in 24 hours
- Tokens are stored in `localStorage` on the client
- Every authenticated request includes `Authorization: Bearer <token>` header
- A simple JWT approach (no refresh tokens) was chosen for this assignment scope

---

## Design Decisions & Trade-offs

### 1. NestJS over Express.js

**Why NestJS?**

- Built-in TypeScript support with excellent DX
- Modular architecture with dependency injection
- Built-in validation, pipes, guards, and interceptors
- Better suited for scalable enterprise applications

**Trade-off:** Steeper learning curve and more boilerplate compared to Express.js. For a 72-hour assignment, this added initial setup time but resulted in cleaner, more maintainable code.

### 2. React Context API over Redux/Zustand

**Why Context API?**

- Sufficient for the application's state complexity (auth + tasks)
- No additional dependencies to manage
- Native React solution with zero learning curve for reviewers

**Trade-off:** For larger applications with complex state interactions, Redux or Zustand would provide better performance (prevents unnecessary re-renders) and devtools. Context API is adequate here but may need refactoring if the app scales significantly.

### 3. MongoDB over SQL (PostgreSQL/MySQL)

**Why MongoDB?**

- Flexible schema design — tasks can have optional fields without migration headaches
- Native JSON-like documents align well with JavaScript/TypeScript
- Mongoose ODM provides excellent validation and query building
- Faster development iteration for a time-constrained assignment

**Trade-off:** MongoDB is less ideal for complex relational queries. If the app needed features like team collaboration with roles/permissions, a relational database would be more appropriate.

### 4. Simple JWT (No Refresh Tokens)

**Why no refresh tokens?**

- Reduces complexity for a 72-hour assignment
- Sufficient for a single-user task management app
- Token expiration set to 24 hours balances security and UX

**Trade-off:** Users must re-login after 24 hours. For production, refresh tokens would provide better security (shorter access token lifetime) and UX (seamless session persistence).

### 5. Docker + CI/CD Integration

**Why Docker?**

- One-command local setup (`docker compose up`)
- Consistent environment across local, CI, and production
- E2E tests run in isolated containers with MongoDB

**Trade-off:** Docker adds build time overhead in CI. For faster CI, caching layers and parallel jobs could be optimized further.

### 6. Vercel + Render Deployment

**Why this combination?**

- Vercel: Zero-config React deployment with automatic HTTPS and CDN
- Render: Free tier for Node.js backends with easy environment variable management

**Trade-off:** Separate platforms mean managing CORS configuration. A unified platform (e.g., Railway, Fly.io) would simplify deployment but at a higher cost.

---

## Performance Considerations

- **Database indexes** on `email` and `userId` ensure fast lookups
- **Lazy loading** of task data on the dashboard
- **Responsive images** and optimized Tailwind CSS bundle
- **Docker multi-stage builds** minimize production image size

---

## Future Improvements

- Add refresh tokens for persistent sessions
- Implement WebSockets for real-time collaborative updates
- Add pagination for large task lists
- Implement rate limiting on auth endpoints
- Add comprehensive unit tests for frontend components
