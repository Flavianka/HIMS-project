# 🚀 HyperNest Inventory & Sales Management System

HyperNest is a web-based Inventory, Sales, and Administration Management System built using PHP, MySQL, JavaScript, HTML, and CSS.

It provides role-based access control with a dedicated Super Admin dashboard for system-wide management.

---

## 📌 Features

### 👑 Super Admin
- Secure login system (hard-coded super admin credentials)
- Dashboard with real-time statistics
- Manage Admins (Create, Edit, Delete)
- Manage Users
- Inventory Management
- Sales Management
- Support Request Management
- Appearance & Security Settings

### 📦 Inventory Management
- Add, Edit, Delete Items
- Image Upload Support
- Category Filtering
- Search Functionality
- Pagination
- Real-time stock updates

### 💰 Sales Management
- View all sales records
- Filter by:
  - Date range
  - User
- Export sales to CSV
- View sales graph
- Sales summary cards:
  - Total Sales
  - Total Revenue
  - Top Product

### 👥 User Management
- View users in card layout
- Search users
- Manage user information

### 🛠 Support Management
- View all support requests
- Filter by:
  - Status
  - Priority
- Update request status
- Pagination

---

## 🏗 System Architecture

Frontend:
- HTML5
- CSS3
- Vanilla JavaScript (Fetch API / AJAX)

Backend:
- PHP (Procedural + Prepared Statements)
- MySQL Database

Server:
- Apache (XAMPP recommended for development)

---

## 🗄 Database Structure

Database Name:hypernest

Main Tables:
- `super_admins`
- `admins`
- `users`
- `inventory`
- `orders`
- `sales`
- `support_requests`

---

## 🔐 Super Admin Login

Currently configured with hard-coded credentials:


Main Tables:
- `super_admins`
- `admins`
- `users`
- `inventory`
- `orders`
- `sales`
- `support_requests`

---

## 🔐 Super Admin Login

Currently configured with hard-coded credentials:

Username: superadmin
Password: Super@2025


> ⚠️ For production use, it is recommended to store credentials securely in the database.

---

## 📂 Project Structure

hypernest/
│
├── assets/
│ ├── icons/
│ ├── images/
│
├── php/
│ ├── db_connection.php
│ ├── register_admin.php
│ ├── get_dashboard_stats.php
│ ├── get_admins.php
│ ├── update_admin.php
│ ├── delete_admin.php
│ ├── get_users.php
│ ├── get_sales.php
│ ├── get_support_requests.php
│
├── superadmin/
│ ├── super-admin-dashboard.html
│ ├── super-admin.js
│
├── uploads/
│
└── README.md


---

## ⚙️ Installation Guide

### 1️⃣ Clone or Download Project
Place the folder inside:
C:\xampp\htdocs


### 2️⃣ Start XAMPP
Start:
- Apache
- MySQL

### 3️⃣ Create Database
Open phpMyAdmin and create:
hypernest

### 4️⃣ Access the System
Open browser:
http://localhost/hypernest


---

## 🔄 AJAX & Dynamic Loading

The system uses:
- `fetch()` API
- JSON responses
- Dynamic section rendering
- No full-page reloads

Dashboard statistics are loaded via:
- get_dashboard_stats.php


---

## 🎨 UI Features

- Clean dashboard layout
- Icon-based section headers
- Card-based summaries
- Theme customization (Light/Dark)
- LocalStorage appearance persistence

---

## 🔒 Security Features

- Prepared Statements (SQL Injection prevention)
- Password Hashing (`password_hash`, `password_verify`)
- Session-based authentication
- Role-based access separation

---

## 🚀 Future Improvements

- Role-based multi-admin permissions
- API token authentication
- Activity logs
- Notification system
- Email verification
- Two-Factor Authentication (2FA)
- Mobile responsive optimization

---

## 👨‍💻 Author

Developed by:
**Flavian Kathurima**

---

## 📜 License

This project is for educational and internal business use.
