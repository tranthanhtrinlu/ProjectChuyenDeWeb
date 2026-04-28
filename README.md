# 💼 Job Hunter Website - Full-stack Recruitment Platform

A full-stack job recruitment website that allows users to search for jobs, apply with resumes, manage personal profiles, and supports administrators in managing users, companies, jobs, resumes, roles, permissions, and email notifications.

This project was developed as a Web Specialization course project at Nong Lam University - Faculty of Information Technology.

---

## 📌 Project Overview

**Job Hunter Website** is an online recruitment platform designed to connect job seekers with companies.  
The system provides core features such as account registration, login, job search, resume submission, company management, job management, user management, role-based access control, and email notification.

The project applies practical web development knowledge, including:

- RESTful API design
- User authentication and authorization
- JWT security
- Role-based permission management
- Database design with JPA
- Frontend routing and state management
- File upload for resumes
- Email notification
- Admin dashboard management

---

## 🎯 Main Objectives

The main goal of this project is to build a recruitment website where:

- Job seekers can search for suitable jobs.
- Users can register, log in, and manage their account.
- Users can apply for jobs by submitting resumes.
- Admin can manage users, companies, jobs, skills, roles, permissions, and resumes.
- The system can send job-related email notifications.
- Access to features is controlled by user roles and permissions.

---

## 🧩 System Architecture

```text
[User / Admin]
      |
      v
[React + Vite Frontend]
      |
      | Axios HTTP Requests
      v
[Spring Boot REST API]
      |
      | Spring Security + JWT
      v
[Service Layer]
      |
      v
[Repository Layer - Spring Data JPA]
      |
      v
[Database]
🛠️ Tech Stack
Frontend
React
TypeScript
Vite
Axios
React Router
Redux Toolkit
SCSS
Protected Route
Component-based UI
Backend
Java
Spring Boot
Spring Security
JWT Authentication
Spring Data JPA
RESTful API
Gradle Kotlin DSL
Email Service
File Upload Service
Database
Relational Database
JPA Entity Mapping
Repository Pattern

📂 Project Structure
ProjectChuyenDeWeb/
│
├── java-spring-restApi-findJob/        # Backend - Spring Boot REST API
│   │
│   ├── src/main/java/vn/trjava/springrest/
│   │   │
│   │   ├── config/                     # Security, CORS, OpenAPI, JWT, permission config
│   │   │   ├── CorsConfig.java
│   │   │   ├── SecurityConfiguration.java
│   │   │   ├── PermissionInterceptor.java
│   │   │   ├── OpenAPIConfig.java
│   │   │   └── DatabaseInitializer.java
│   │   │
│   │   ├── controller/                 # REST API controllers
│   │   │   ├── AuthController.java
│   │   │   ├── UserController.java
│   │   │   ├── CompanyController.java
│   │   │   ├── JobController.java
│   │   │   ├── ResumeController.java
│   │   │   ├── RoleController.java
│   │   │   ├── PermissionController.java
│   │   │   ├── SkillController.java
│   │   │   ├── FileController.java
│   │   │   ├── EmailController.java
│   │   │   └── SubscriberController.java
│   │   │
│   │   ├── domain/                     # Entities and DTOs
│   │   │   ├── User.java
│   │   │   ├── Company.java
│   │   │   ├── Job.java
│   │   │   ├── Resume.java
│   │   │   ├── Role.java
│   │   │   ├── Permission.java
│   │   │   ├── Skill.java
│   │   │   └── Subscriber.java
│   │   │
│   │   ├── repository/                 # Spring Data JPA repositories
│   │   │   ├── UserRepository.java
│   │   │   ├── CompanyRepository.java
│   │   │   ├── JobRepository.java
│   │   │   ├── ResumeRepository.java
│   │   │   ├── RoleRepository.java
│   │   │   ├── PermissionRepository.java
│   │   │   ├── SkillRepository.java
│   │   │   └── SubscriberRepository.java
│   │   │
│   │   ├── service/                    # Business logic layer
│   │   │   ├── UserService.java
│   │   │   ├── CompanyService.java
│   │   │   ├── JobService.java
│   │   │   ├── ResumeService.java
│   │   │   ├── RoleService.java
│   │   │   ├── PermissionService.java
│   │   │   ├── SkillService.java
│   │   │   ├── FileService.java
│   │   │   └── EmailService.java
│   │   │
│   │   ├── util/                       # Utilities, annotations, enums, exceptions
│   │   │   ├── annotation/
│   │   │   ├── constant/
│   │   │   └── error/
│   │   │
│   │   └── JobhunterApplication.java
│   │
│   ├── src/main/resources/
│   │   ├── application.properties
│   │   ├── static/
│   │   └── templates/
│   │
│   └── build.gradle.kts
│
│
└── react-vite-jobhunter-chuyendeweb/   # Frontend - React + Vite
    │
    ├── src/
    │   │
    │   ├── components/
    │   │   ├── admin/                  # Admin components
    │   │   │   ├── company/
    │   │   │   ├── job/
    │   │   │   ├── permission/
    │   │   │   ├── resume/
    │   │   │   ├── role/
    │   │   │   ├── skill/
    │   │   │   └── user/
    │   │   │
    │   │   ├── client/                 # Client UI components
    │   │   │   ├── card/
    │   │   │   ├── data-table/
    │   │   │   └── modal/
    │   │   │
    │   │   └── share/                  # Shared layout and protected route
    │   │
    │   ├── config/                     # Axios, API config, permissions
    │   │   ├── api.ts
    │   │   ├── axios-customize.ts
    │   │   ├── permissions.ts
    │   │   └── utils.ts
    │   │
    │   ├── pages/
    │   │   ├── admin/                  # Admin pages
    │   │   ├── auth/                   # Login, register, forgot password
    │   │   ├── company/                # Company pages
    │   │   ├── home/                   # Homepage
    │   │   └── job/                    # Job pages
    │   │
    │   ├── redux/
    │   │   └── slice/                  # Redux state management
    │   │
    │   ├── styles/                     # SCSS modules
    │   ├── App.tsx
    │   └── main.tsx
    │
    ├── .env.development
    ├── .env.production
    ├── package.json
    └── README.md

🚀 Main Features
1. User Registration

Users can create an account before using important features such as applying for jobs or managing resumes.

Registration includes:

Required input validation
Password validation
Error message when required fields are missing
Redirect to login page after successful registration

Password rule:
Password must contain at least 8 characters, including letters, numbers, and special characters.
2. User Login

Registered users can log in to the system.

Login flow:
User enters credentials
        |
        v
Frontend sends login request
        |
        v
Backend validates user
        |
        v
JWT token is returned
        |
        v
Frontend stores token and redirects user
3. Forgot Password

The system supports a forgot password feature.

Users can request password recovery when they forget their password.

4. Homepage

After successful login, users are redirected to the homepage.

The homepage allows users to:

View job listings
Search for jobs
View featured companies
Navigate to job details
Access account-related features
5. Job Search

Users can search for jobs using the search bar.

Possible search criteria include:

Job title
Company
Skill
Location

This helps job seekers quickly find suitable positions.

6. Job Detail Page

Users can open a job detail page to view job information such as:

Job title
Company
Skills required
Salary
Location
Job description
Job level
Application information
7. Apply Job / Submit Resume

Users can apply for jobs by submitting their resume.

The resume module supports:

Uploading CV files
Creating resume application records
Managing submitted resumes
Tracking resume status
8. Company Management

Admin can manage company information.

Main actions:

Create company
View company list
Update company information
Delete company
View company detail
9. Job Management

Admin can manage job postings.

Main actions:

Create new job
Update job information
Delete job
View job list
Search jobs
Assign skills to jobs
10. Resume Management

Admin can manage user resumes and job applications.

Main actions:

View submitted resumes
Update resume status
Manage candidate applications
Review CV information
11. User Management

Admin can manage system users.

Main actions:

View user list
Create user
Update user information
Delete user
Assign role to user
12. Role Management

The system supports role-based access control.

Admin can:

Create roles
Assign permissions to roles
Update roles
Delete roles

Example roles:
ADMIN
USER
HR
13. Permission Management

The project includes permission-based API access control.

Permissions are used to protect backend resources.

Example permission idea:
GET /api/v1/users
POST /api/v1/jobs
PUT /api/v1/companies/{id}
DELETE /api/v1/resumes/{id}
This allows the system to control exactly which role can access which API.
14. Skill Management

Admin can manage skills used in job postings.

Examples:

Java
Spring Boot
React
SQL
Docker
AWS
15. Email Notification

The system includes an email service.

Main use cases:

Send job-related emails
Notify users about job information
Support password reset flow
16. Top Companies Page

Users can view a list of top companies.

This helps job seekers explore companies before applying.

🔐 Authentication & Authorization

The project uses JWT-based authentication.

Authentication Flow

1. User logs in
2. Backend verifies username and password
3. Backend generates JWT token
4. Frontend stores token
5. Every protected request sends token in Authorization header
6. Backend validates token before allowing access
Example header:
Authorization: Bearer <access_token>
🛡️ Security Features

The backend includes several security-related components:
SecurityConfiguration.java
CustomAuthenticationEntryPoint.java
CustomUserDetailsService.java
UserDetailsCustom.java
SecurityUtil.java
PermissionInterceptor.java
PermissionInterceptorConfiguration.java
These components are responsible for:

User authentication
JWT validation
Custom unauthorized response
Loading user details
Checking role and permission
Protecting API endpoints
📡 API Modules

The backend is organized into multiple REST controllers:
| Controller           | Responsibility                  |
| -------------------- | ------------------------------- |
| AuthController       | Login, register, authentication |
| UserController       | Manage users                    |
| CompanyController    | Manage companies                |
| JobController        | Manage jobs                     |
| ResumeController     | Manage resumes                  |
| RoleController       | Manage roles                    |
| PermissionController | Manage permissions              |
| SkillController      | Manage skills                   |
| FileController       | Upload and serve files          |
| EmailController      | Send emails                     |
| SubscriberController | Manage job subscribers          |

🗃️ Database Entities

Main domain entities:
| Entity     | Description                         |
| ---------- | ----------------------------------- |
| User       | Stores user account information     |
| Company    | Stores company information          |
| Job        | Stores job posting data             |
| Resume     | Stores user application / CV data   |
| Role       | Stores user roles                   |
| Permission | Stores API permissions              |
| Skill      | Stores job skills                   |
| Subscriber | Stores job subscription information |


🧠 Backend Layered Architecture

The backend follows a layered architecture:
Controller Layer
      |
      v
Service Layer
      |
      v
Repository Layer
      |
      v
Database
Controller Layer

Handles HTTP requests and responses.

Example:
JobController.java
CompanyController.java
UserController.java
Service Layer

Contains business logic.

Example:
JobService.java
CompanyService.java
UserService.java
Repository Layer

Interacts with database through Spring Data JPA.

Example:
JobRepository.java
CompanyRepository.java
UserRepository.java
Domain Layer

Contains entities and DTOs.

Example:
Job.java
User.java
Resume.java
ResCreateJobDTO.java
ResUpdateResumeDTO.java
🎨 Frontend Architecture

The frontend is built with React, TypeScript, Redux, and Vite.

Main frontend parts:
components/     Reusable UI components
pages/          Page-level components
redux/          Global state management
config/         API and Axios configuration
styles/         SCSS styling
🔄 Frontend Request Flow
React Page
   |
   v
Component
   |
   v
Axios Custom Instance
   |
   v
Spring Boot REST API
   |
   v
Database
🧭 Routing

The project uses React Router to manage navigation.

Main route groups:
/auth/login
/auth/register
/auth/forgot-password

/
 /jobs
 /jobs/:id
 /companies
 /companies/:id

/admin
/admin/user
/admin/company
/admin/job
/admin/resume
/admin/role
/admin/permission
/admin/skill
🔒 Protected Route

The frontend contains protected route logic.

Purpose:

Prevent unauthenticated users from accessing private pages
Prevent users without permission from accessing admin pages
Redirect unauthorized users to not-permitted page

Related files:
protected-route.ts
access.tsx
not-permitted.tsx
📦 Key Frontend Components
Admin Components
modal.company.tsx
upsert.job.tsx
modal.permission.tsx
view.permission.tsx
view.resume.tsx
modal.role.tsx
module.api.tsx
modal.skill.tsx
modal.user.tsx
view.user.tsx
Client Components

company.card.tsx
job.card.tsx
apply.modal.tsx
manage.account.tsx
header.client.tsx
footer.client.tsx
search.client.tsx
⚙️ Environment Variables

Frontend environment files:
.env.development
.env.production
Example:
VITE_BACKEND_URL=http://localhost:8080
Backend configuration file:
application.properties
Example:
server.port=8080
spring.datasource.url=jdbc:mysql://localhost:3306/jobhunter
spring.datasource.username=root
spring.datasource.password=your_password
▶️ How to Run Locally
1. Clone Repository
git clone https://github.com/tranthanhtrinlu/ProjectChuyenDeWeb.git
cd ProjectChuyenDeWeb
Run Backend
2. Go to Backend Folder
cd java-spring-restApi-findJob
3. Configure Database

Open:
src/main/resources/application.properties
Update database connection:
spring.datasource.url=jdbc:mysql://localhost:3306/jobhunter
spring.datasource.username=root
spring.datasource.password=your_password
4. Run Backend

For Windows:
gradlew.bat bootRun
For Linux / macOS:
./gradlew bootRun
Backend will run at:
http://localhost:8080
Run Frontend
5. Go to Frontend Folder
cd react-vite-jobhunter-chuyendeweb
6. Install Dependencies
npm install
7. Run Frontend
npm run dev
Frontend will run at:
http://localhost:5173
🧪 Testing

Backend test folder:
src/test/java/vn/hoidanit/springrest/JobhunterApplicationTests.java
Run tests:
./gradlew test
📌 Main Pages
Client Pages
| Page            | Description                      |
| --------------- | -------------------------------- |
| Home            | Display job and company overview |
| Job List        | Show available jobs              |
| Job Detail      | Show job detail information      |
| Company List    | Show companies                   |
| Company Detail  | Show company information         |
| Login           | User authentication              |
| Register        | User registration                |
| Forgot Password | Password recovery                |
| Manage Account  | User account management          |
Admin Pages
| Page                  | Description         |
| --------------------- | ------------------- |
| Dashboard             | Admin overview      |
| User Management       | Manage users        |
| Company Management    | Manage companies    |
| Job Management        | Manage job postings |
| Resume Management     | Manage resumes      |
| Role Management       | Manage roles        |
| Permission Management | Manage permissions  |
| Skill Management      | Manage skills       |

💡 Business Workflow
Job Seeker Flow

Register account
      |
Login
      |
Browse jobs
      |
View job detail
      |
Upload resume
      |
Apply job
      |
Track application
Admin Flow
Login as admin
      |
Manage companies
      |
Create job posts
      |
Manage users
      |
Review resumes
      |
Manage roles and permissions

📧 Email Feature

The project includes email functionality.

Possible use cases:

Send job notification emails
Send password reset email
Notify users about job updates

Related files:
EmailController.java
EmailService.java
ResEmailJob.java
reset-password.html
job.html
📁 File Upload Feature

The project supports file upload, mainly for resume submission.

Related files:
FileController.java
FileService.java
ResUploadFileDTO.java
StorageException.java

Possible use cases:

Upload CV
Store resume file
Return uploaded file information
Handle upload errors
🧱 Error Handling

The backend includes custom exception handling.

Related files:
GlobalException.java
IdInvalidException.java
PermissionException.java
StorageException.java
RestResponse.java
FormatRestResponse.java
This helps return consistent API responses when errors occur.
📚 What I Learned

Through this project, I practiced:

Building RESTful APIs using Spring Boot
Implementing JWT authentication
Designing role and permission-based authorization
Building a React + TypeScript frontend
Using Axios to connect frontend with backend
Managing global state with Redux
Designing database entities with JPA
Handling file upload for resumes
Sending emails from backend
Building admin management pages
Structuring a real-world full-stack web application
🚀 Future Improvements

Possible future enhancements:

Deploy frontend and backend to cloud
Add Docker Compose for easier setup
Add CI/CD pipeline
Improve UI/UX design
Add job recommendation feature
Add company verification
Add resume parsing
Add search filter by salary, level, location, and skills
Add pagination and sorting optimization
Add unit tests and integration tests
Add Swagger API documentation screenshots
Add refresh token mechanism

Related Links
GitHub Repository: https://github.com/tranthanhtrinlu/ProjectChuyenDeWeb.git
Demo Video: Add your demo video link here: https://drive.google.com/file/d/1dWybYo_Yfw2jUi7C6giO-S1WZw5B7xtL/view?usp=sharing

🧑‍💻 Author

Trần Thanh Trí
Information Technology Student
Nong Lam University - Ho Chi Minh City
Aspiring Java Backend Developer / Full-stack Developer

⭐ Project Highlights for Recruiters

This project demonstrates practical full-stack development skills:

Built a full-stack recruitment web application with React and Spring Boot
Designed REST APIs for users, companies, jobs, resumes, roles, permissions, and skills
Implemented JWT authentication and role-based authorization
Developed admin dashboard for managing recruitment data
Integrated file upload for resume submission
Implemented email notification feature
Applied layered backend architecture: Controller, Service, Repository, Domain
Used React, TypeScript, Axios, Redux, and React Router for frontend development
Practiced real-world project structure and teamwork

📝 License

This project was developed for educational purposes.
