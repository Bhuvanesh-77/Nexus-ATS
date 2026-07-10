# 🚀 Nexus ATS – AI Resume Analyzer & Applicant Tracking System

## 📌 Project Overview

Nexus ATS is a full-stack Applicant Tracking System (ATS) designed to simplify and streamline the recruitment process for recruiters and job seekers. The platform provides separate dashboards for recruiters, candidates, and administrators, enabling secure job posting, application management, resume uploads, and candidate tracking through an intuitive web interface.

---

## 🎯 Key Features

### 👨‍💼 Recruiter Module

- Secure Recruiter Registration & Login
- Create, Update, and Delete Job Posts
- View Applicants
- Manage Job Listings
- Candidate Tracking Dashboard
- Recruitment Statistics
- Talent Pool Management

### 👨‍🎓 Candidate Module

- Candidate Registration & Login
- Browse Available Jobs
- View Job Details
- Apply for Jobs
- Upload Resume (PDF)
- Track Application Status
- View Application History

### 👨‍💻 Admin Module

- Manage Users
- Manage Recruiters
- Monitor Applications
- Dashboard Analytics
- System Management

---

## 🛠️ Technology Stack

### Frontend

- React.js
- React Router DOM
- Axios
- HTML5
- CSS3
- Tailwind CSS

### Backend

- Node.js
- Express.js
- REST APIs

### Database

- MongoDB
- Mongoose

### Authentication & Security

- JWT Authentication
- HTTP Cookies
- bcrypt.js
- Role-Based Authorization

### Additional Libraries

- Multer (Resume Upload)
- PDF-Parse (Resume Parsing)
- Nodemailer (Email Notifications)
- Cookie Parser
- CORS

---

## 📂 Project Architecture

```
Client (React)

        │

        ▼

REST APIs (Axios)

        │

        ▼

Node.js + Express.js

        │

        ▼

JWT Authentication

        │

        ▼

MongoDB Database
```

---

## 📁 Project Structure

```
ats-system/

│

├── client/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── server/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── config/
│   ├── uploads/
│   └── package.json
│
└── README.md
```

---

## 🔐 Authentication Workflow

```
User Login

      │

      ▼

Validate Credentials

      │

      ▼

Generate JWT Token

      │

      ▼

Store Token in Cookie

      │

      ▼

Access Protected Routes
```

---

## 📄 Resume Upload Workflow

```
Candidate Uploads Resume

            │

            ▼

Multer Upload Middleware

            │

            ▼

PDF Parsing

            │

            ▼

Store Resume Information

            │

            ▼

Recruiter Can View Applications
```

---

## ⚙️ Installation

### Clone Repository

```bash
git clone https://github.com/Bhuvanesh-77/Nexus-ATS.git
```

---

### Frontend Setup

```bash
cd client

npm install

npm run dev
```

---

### Backend Setup

```bash
cd server

npm install

npm start
```

---

## Environment Variables

Create a `.env` file inside the **server** folder.

Example:

```env
PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_secret_key

EMAIL=your_email

EMAIL_PASSWORD=your_password
```

---

## Features Implemented

- Role-Based Authentication
- Secure Login & Registration
- JWT Authorization
- Recruiter Dashboard
- Candidate Dashboard
- Admin Dashboard
- Job Management
- Resume Upload
- Application Tracking
- Candidate Management
- Email Notifications
- Responsive User Interface

---

## REST APIs

### Authentication

```
POST /api/auth/register

POST /api/auth/login

GET /api/auth/me
```

### Jobs

```
GET /api/jobs

POST /api/jobs

PUT /api/jobs/:id

DELETE /api/jobs/:id
```

### Applications

```
POST /api/applications

GET /api/applications

GET /api/applications/:id
```
Example:

```
Home Page

Login Page

Recruiter Dashboard

Candidate Dashboard

Job Details

Application Form
```

---

## Future Enhancements

- AI Resume Scoring
- Resume Skill Matching
- Interview Scheduling
- Company Profiles
- Search & Advanced Filters
- Analytics Dashboard
- AI Chatbot Support
- Job Recommendation System

---

## Learning Outcomes

This project helped me gain practical experience in:

- Full Stack Web Development
- React.js
- Node.js
- Express.js
- MongoDB
- REST API Development
- JWT Authentication
- Role-Based Access Control
- Resume File Upload
- Database Design

---

## Author

**Gatla Bhuvanesh**

---

## ⭐ If you found this project useful, consider giving it a Star!
