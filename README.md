# Store Rating Platform

A full-stack web application where users can discover registered stores and submit ratings from 1 to 5. The application uses role-based access control to provide different features for System Administrators, Normal Users, and Store Owners.

## Live Demo

🔗 **Live Demo:** [Store Rating Platform](https://store-rate-vts1.onrender.com/)

### Demo Login Credentials

You can use the following accounts to test different user roles.

#### System Administrator

Email: rohit@gmail.com
Password: rohit123

### Store Owner

Email: virat@gmail.com
Password: virat123

### Normal User

Email: dhoni@gmail.com
Password: dhoni123

## Tech Stack

### Frontend
- React.js
- Vite
- Tailwind CSS
- React Router
- Context API
- Axios

### Backend
- Node.js
- Express.js
- Javascript
- JWT Authentication
- bcrypt

### Database
- PostgreSQL
- redis -> token blacklisting

## User Roles

### System Administrator
- View dashboard statistics
- Create users, admins, and store owners
- Create stores
- View and manage users
- View stores and ratings
- Search, filter, sort, and paginate listings
- View user details
- Logout

### Normal User
- Register and login
- View all stores
- Search stores by name and address
- Submit ratings from 1 to 5
- Modify submitted ratings
- Change password
- Logout

### Store Owner
- Login
- View their store's average rating
- View users who rated their store
- Change password
- Logout

## Features

- Role-based authentication and authorization
- Secure password hashing
- JWT authentication using HTTP-only cookies
- Store rating system
- One rating per user per store
- Search and filtering
- Sorting
- Pagination
- Form validation
- Responsive UI
- PostgreSQL relational database

# Database

The application uses PostgreSQL with the following main entities:

Users
Stores
Ratings

# Authentication

The application uses a single login system for all roles.

Login
  ↓
Authenticate User
  ↓
Check Role
  ↓
Admin / User / Store Owner
  ↓
Redirect to Role Dashboard

# Validation Rules

Name: 20–60 characters
Address: Maximum 400 characters
Password: 8–16 characters
Password must contain at least one uppercase letter
Password must contain at least one special character
Email must be valid
Rating must be an integer between 1 and 5

Validation is performed on both the frontend and backend.

# Project Goal

This project was developed as a Full-Stack Intern Coding Challenge with a focus on:

Clean and maintainable architecture
Secure authentication
Role-based access control
Proper relational database design
RESTful API development
Responsive React UI
Backend and frontend validation
Production-oriented development practices
