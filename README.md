Inventory Management System
Project Overview

The Inventory Management System is a web-based application designed to help businesses efficiently manage their inventory, track stock levels, and monitor sales. This system simplifies day-to-day operations and provides real-time insights into stock movement.

Features

Add, edit, and delete inventory items (name, category, stock, price, image)

View items in a clean card layout

Search inventory items dynamically

Upload and display item images

User-friendly dashboard with statistics

Role-based access (Admin & Super Admin)

Data management without page reloads using AJAX

Tech Stack

Frontend: HTML, CSS, JavaScript

Backend: PHP

Database: MySQL

Version Control: Git & GitHub

Installation & Setup

Clone the repository:

git clone https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git


Move the project files to your web server (XAMPP, WAMP, or live server).

Create a MySQL database and import the provided .sql file.

Update the config.php file with your database credentials.

Open your browser and navigate to the project URL (e.g., http://localhost/inventory-system)

inventory-management-system/
│
├─ admin/                 # Admin dashboard files
├─ user/                  # User dashboard files
├─ superadmin/            # Super Admin dashboard and login files
├─ assets/                # images
├─ js/                    # JS
├─ php/                   # php
├─ css/                   # css
├─ uploads/               # uploaded images
├─ sql/                   # Database SQL dump
├─ login.html             # Main login page
├─ registration.html      # Main registration page
└─ README.md
