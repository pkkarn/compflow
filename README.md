# CompFlow 🚀

CompFlow is a high-performance, modern salary management and compensation intelligence platform designed for organizations with up to 10,000+ employees. Built with an elite developer workflow focusing on Test-Driven Development (TDD) and clean software craftsmanship principles.

---

## 1. Architecture & Tech Stack

CompFlow is designed as a clean full-stack monorepo:
* **`/server`**: An Express.js backend powered by TypeScript, SQLite, and Prisma ORM, utilizing Jest for strict unit and integration testing.
* **`/client`**: A high-fidelity React.js frontend powered by Vite and styled with Tailwind CSS, delivering a premium, real-time analytics dashboard for HR Managers.

---

## 2. Getting Started (Quick Setup Guide)

Follow these simple steps to set up and run the backend server locally:

### 2.1 Clone and Install Dependencies
```bash
# Navigate to the server folder
cd server

# Install the dependencies
npm install
```

### 2.2 Run Database Seeding
This creates your local SQLite development database (`dev.db`) and seeds it with **exactly 10,000 unique employee records** using optimized bulk inserts in under 200 milliseconds:
```bash
npm run seed
```

### 2.3 Run Automated Tests (TDD)
Runs our comprehensive TDD integration test suite. This dynamically builds and tests against an isolated **`test.db`** file in memory, ensuring your development database (`dev.db`) remains completely untouched:
```bash
npm test
```

### 2.4 Start the Server
Launches the live Express server in development reloading mode:
```bash
npm run dev
```

---

## 3. Interactive API Testing (Swagger UI) 📖

CompFlow ships with full interactive API documentation. Once your server is started, open your browser and navigate to the link below to manually execute, test, and verify all CRUD and health-check endpoints:

👉 **Swagger URL:** [http://localhost:3000/api-docs](http://localhost:3000/api-docs)

---
Designed and developed with software craftsmanship by **Prashant Kumar**.
