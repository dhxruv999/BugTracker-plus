# 🐞 BugTracker+

![BugTracker+ Banner](./assets/banner.png)

<p align="center">
  <strong>Dockerized Three-Tier Bug Tracking Platform with Role-Based Access Control, Analytics, and Automated Cloud Deployment.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white">
  <img src="https://img.shields.io/badge/Node.js-Express-339933?logo=node.js&logoColor=white">
  <img src="https://img.shields.io/badge/MySQL-8-4479A1?logo=mysql&logoColor=white">
  <img src="https://img.shields.io/badge/Docker-2496ED?logo=docker&logoColor=white">
  <img src="https://img.shields.io/badge/GitHub Actions-CI/CD-2088FF?logo=githubactions&logoColor=white">
  <img src="https://img.shields.io/badge/AWS-EC2-FF9900?logo=amazonaws&logoColor=white">
  <img src="https://img.shields.io/badge/Nginx-Reverse Proxy-009639?logo=nginx&logoColor=white">
</p>

---

## 🚀 Overview

BugTracker+ is a production-ready bug tracking platform built to streamline software defect management across development teams.

The application enables users to create, assign, track, resolve, verify, and report bugs through a structured workflow backed by secure authentication, role-based access control, dashboard analytics, and cloud-native deployment practices.

The platform follows a **Dockerized Three-Tier Architecture** and is deployed on **AWS EC2** through an automated **GitHub Actions CI/CD Pipeline**.

---

## ✨ Highlights

- 🏛️ Dockerized Three-Tier Architecture
- 🔐 JWT Authentication & Role-Based Access Control (RBAC)
- 🐛 Complete Bug Lifecycle Management
- 📊 Dashboard Analytics & Reporting
- 👥 User Approval Workflow
- 📈 CSV Export & Audit Reporting
- 🚀 GitHub Actions CI/CD Pipeline
- ☁️ AWS EC2 Deployment
- 🐳 Docker & Docker Compose Orchestration
- 🔒 Secure API Architecture

---

# 📸 Application Preview

## Landing Page

The public-facing landing page introduces the platform and highlights key features.

![Landing Page](./screenshots/landing-page.png)

---

## Dashboard Analytics

Track bug resolution progress through real-time metrics, status distribution charts, and priority analysis.

![Dashboard Overview](./screenshots/dashboard-overview.png)

---

## Bug Management

Create, assign, filter, track, and manage bugs through a centralized workflow dashboard.

![Bug Management](./screenshots/bug-management.png)

---

## Reports & CSV Export

Generate audit-ready CSV reports with role-based access controls.

![Reports Export](./screenshots/reports-export.png)

---

## User Management & RBAC

Manage user approvals, role assignments, password reset requests, and organization-level access controls.

![User Management](./screenshots/user-management.png)

---

# 🏛️ Three-Tier Architecture

BugTracker+ follows a modern Three-Tier Architecture to ensure scalability, maintainability, and separation of concerns.

### Presentation Tier

- React 18
- Vite
- Nginx

Responsible for rendering the user interface and communicating with backend APIs.

### Application Tier

- Node.js
- Express.js

Handles:

- Authentication
- Authorization
- Bug Management
- Business Logic
- Reporting
- API Services

### Data Tier

- MySQL 8

Responsible for persistent storage of:

- Users
- Bugs
- Comments
- Assignments
- Reports

---

## Architecture

```text
                    Internet
                        │
                        ▼
        ┌────────────────────────────┐
        │ Frontend Container         │
        │ React + Vite + Nginx       │
        └─────────────┬──────────────┘
                      │
                      ▼
        ┌────────────────────────────┐
        │ Backend Container          │
        │ Node.js + Express API      │
        └─────────────┬──────────────┘
                      │
                      ▼
        ┌────────────────────────────┐
        │ Database Container         │
        │ MySQL 8                    │
        └────────────────────────────┘
```

All services are containerized using Docker and orchestrated with Docker Compose on AWS EC2.

---

# 🔄 Bug Lifecycle Workflow

```text
Open
 │
 ▼
In Progress
 │
 ▼
Resolved
 │
 ├──────► Closed
 │
 ▼
Reopened
 │
 ▼
In Progress
```

---

# 👥 Role-Based Access Control

| Role | Responsibilities |
|--------|----------------|
| Org Admin | Full system administration |
| Project Admin | User management and bug assignment |
| Developer | Resolve assigned bugs |
| Tester | Create and verify bugs |

---

# 🛠️ Technology Stack

## Frontend

- React 18
- Vite
- React Router DOM
- Axios
- Chart.js
- CSS

## Backend

- Node.js
- Express.js
- JWT Authentication
- bcrypt
- express-validator
- mysql2

## Database

- MySQL 8

## DevOps & Cloud

- Docker
- Docker Compose
- GitHub Actions
- AWS EC2
- Nginx

---

# 📂 Project Structure

```bash
BugTracker-plus/
│
├── assets/
│   └── banner.png
│
├── screenshots/
│   ├── landing-page.png
│   ├── dashboard-overview.png
│   ├── bug-management.png
│   ├── reports-export.png
│   └── user-management.png
│
├── client/
├── server/
├── docker-compose.yml
├── package.json
└── README.md
```

---

# 🚀 Running Locally

### Clone Repository

```bash
git clone https://github.com/dhxruv999/BugTracker-plus.git

cd BugTracker-plus
```

### Start Application

```bash
docker-compose up -d --build
```

### Access Application

```text
Frontend : http://localhost:8000

Backend  : http://localhost:4000
```

---

# 🚀 CI/CD Pipeline

```text
Developer Push
      │
      ▼
GitHub Repository
      │
      ▼
GitHub Actions
      │
      ▼
Build Docker Images
      │
      ▼
Push Images to Docker Hub
      │
      ▼
Deploy to AWS EC2
      │
      ▼
Docker Compose Update
      │
      ▼
Health Check Validation
```

---

# 🔒 Security Features

- JWT Authentication
- bcrypt Password Hashing
- Role-Based Authorization
- Request Validation
- Rate Limiting
- Helmet Security Headers
- Protected Routes
- Soft Delete Architecture

---

# 📚 Key Learning Outcomes

- Full Stack Development
- Three-Tier Architecture
- REST API Design
- Authentication & Authorization
- Database Design
- Docker Containerization
- Docker Compose Orchestration
- GitHub Actions CI/CD
- AWS EC2 Deployment
- Nginx Reverse Proxy Configuration
- Production Security Practices

---

# 👨‍💻 Author

### Dhruv Maheshwari

**B.Tech AWS Student | Full Stack Developer | Cloud & DevOps Enthusiast**

- GitHub: https://github.com/dhxruv999

---

## ⭐ Support

If you found this project useful, consider giving it a star ⭐ on GitHub.
