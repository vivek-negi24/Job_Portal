# Job Portal (MERN + Next.js)

A full-stack Job Portal where **Job Seekers** can find and apply for jobs, **Employers** can post and manage openings, and an **Admin** oversees platform activity via a dashboard.  
Built with **MongoDB, Express, React (Next.js), Node.js**, styled using **Tailwind CSS**.

---

## 🚀 Overview

This project is a modern job marketplace with three primary roles:

- **Job Seeker (User):** Browse/search jobs, create profile & resume, apply, and track applications.
- **Employer (Business):** Register company, post/manage job listings, and review applicants.
- **Admin:** Monitor platform metrics (total users, jobs, applications, employers) and manage platform activity.

---

## ✨ Key Features

### 👤 Job Seekers
- Sign up / Sign in (JWT-based authentication)
- Profile with skills, experience, resume/CV upload
- Search & filter jobs (title, location, type, salary, tags)
- Apply for jobs & track application history

### 🏢 Employers
- Company registration & profile management
- Create, edit, publish, and close job posts
- View applicants and update application status

### 📊 Admin Dashboard
- KPIs: total users, employers, jobs, applications
- Manage (verify/ban) users & employers
- Review/approve job posts (optional)
- Basic analytics & trends

### ⚙️ General Features
- Role-Based Access Control (RBAC)
- Responsive UI with Tailwind CSS
- RESTful API backend with validation & error handling

---

## 🧱 Tech Stack

- **Frontend:** Next.js (React), Tailwind CSS, Axios/Fetch
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (Mongoose)
- **Authentication:** JWT + HTTP-only cookies
- **State Management (optional):** Zustand / Context API
- **Storage (optional):** Multer / Cloud storage for resumes
- **Dev Tools:** ESLint, Prettier, Nodemon, dotenv

---

## 🗂️ Project Structure

frontend/ # Next.js app (pages, components, hooks, Tailwind)
backend/ # Express API
└── src/
├── models/ # User, Employer, Job, Application
├── routes/ # API endpoints
├── controllers/ # Route logic
├── middlewares/ # auth, role guard, error handling
├── services/ # reusable service functions
└── utils/ # helper functions


---

## 🔐 Roles & Permissions (RBAC)

- **User (Job Seeker):** View/apply for jobs, manage profile.
- **Employer:** Manage company profile & job posts, view applicants.
- **Admin:** Full access to users, employers, jobs, and platform statistics.

---

## 🧪 Core Data Models (Simplified)

- **User:** name, email, passwordHash, role, profile (skills, resume), applications[]
- **Employer:** companyName, owner (User), description, jobs[]
- **Job:** title, description, location, type, salaryRange, tags[], employer, status
- **Application:** job, applicant (User), resumeUrl, status (applied/reviewed/accepted/rejected)

---

## ▶️ Getting Started (Local Development)

### Prerequisites
- Node.js (LTS)
- npm or yarn
- MongoDB (local or Atlas)

### Environment Variables

**backend/.env**
PORT=5000
MONGO_URI=mongodb://localhost:27017/job-portal
JWT_SECRET=your_strong_secret
CLIENT_URL=http://localhost:3000


**frontend/.env.local**


NEXT_PUBLIC_API_URL=http://localhost:5000/api


### Installation & Running

**Backend**
```bash
cd backend
npm install
npm run dev


*** Frontend ***

cd frontend
npm install
npm run dev


📌 Future Enhancements

Saved jobs & job alerts

Email notifications for application updates

Advanced analytics for Admin

Resume parsing & skill extraction

Social login (Google/GitHub)
