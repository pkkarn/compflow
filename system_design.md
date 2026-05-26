# System Design: CompFlow

## 1. Overview
CompFlow is an enterprise-grade salary management and analytics tool designed to handle 10,000+ employee records seamlessly. 

## 2. Architecture Diagram (Conceptual)
```
[Client: React + Vite + Tailwind] 
            │
      (HTTP REST API)
            ▼
[Server: Node.js + Express + TypeScript]
            │
       (Prisma ORM)
            ▼
[Database: SQLite (compflow.db)]
```

## 3. Core Requirements & Solutions
### 3.1 Managing Employees (CRUD)
* **API Endpoints:**
  * `GET /api/employees` - View/List employees (with server-side pagination & search for performance)
  * `POST /api/employees` - Add new employee
  * `PUT /api/employees/:id` - Update employee details
  * `DELETE /api/employees/:id` - Remove employee
* **Performance Consideration:** Since the database contains 10,000 employees, fetching all of them at once will crash the client. We will implement **cursor-based or offset-based pagination** in our database queries and API endpoints.

### 3.2 Salary Insights
* **API Endpoints:**
  * `GET /api/insights/country/:country` - Returns min, max, and avg salary for the country.
  * `GET /api/insights/job-title/:jobTitle/country/:country` - Returns avg salary for the job title in that country.
* **Performance Consideration:** We will write highly efficient SQL aggregation queries using Prisma's `groupBy` and `aggregate` features to process the 10,000 records database-side in milliseconds.

### 3.3 High-Performance Seeding Script
* Combining `first_names.txt` and `last_names.txt` to generate 10,000 unique records.
* **Performance Consideration:** Instead of executing 10,000 individual `INSERT` queries (which would take minutes), we will use Prisma's `createMany` bulk-insertion feature to write all 10,000 records in a single database transaction, completing in less than a second.
