================================================================
   BakedWithLove — Cake Shop Management System
   MCA Project | Developed by Muskan
================================================================

TECHNOLOGY STACK
----------------
  Backend  : Python 3.x + Flask
  Database : SQLite (database.db — auto-created on first run)
  Frontend : HTML5, CSS3, Vanilla JavaScript
  Payment  : Simulated UPI + Card Gateway (no real API)

HOW TO RUN (Step by Step)
--------------------------

STEP 1: Install Python
  - Download Python 3.10 or higher from https://python.org
  - During installation, CHECK "Add Python to PATH"

STEP 2: Open Command Prompt
  - Press Win + R, type "cmd", press Enter
  - Navigate to this folder:
      cd "path\to\this\folder"
    Example:
      cd "D:\cakeshop"

STEP 3: Install required libraries
  Run this command:
      pip install flask werkzeug

STEP 4: Start the Application
  Run this command:
      python app.py

STEP 5: Open in Browser
  Open any browser and go to:
      http://127.0.0.1:8080

================================================================
  ADMIN PANEL
================================================================
  URL      : http://127.0.0.1:8080/admin
  Username : admin
  Password : admin123

================================================================
  KEY FEATURES
================================================================
  1. Home Page         — Cake catalog with categories
  2. Cart Page         — Add/remove items, place order
  3. Payment Gateway   — UPI (QR + ID + Apps) + Card (simulated)
  4. Admin Dashboard   — Order management, verify payments
  5. Sales Report      — Daily/Monthly revenue charts
  6. Order History     — Filter by status and date range
  7. WhatsApp notify   — Send order confirmation via WhatsApp
  8. Shop Status       — Admin can open/close shop

================================================================
  PAYMENT SIMULATION (Test Cards)
================================================================
  Visa       : 4111 1111 1111 1111
  Mastercard : 5500 0000 0000 0004
  RuPay      : 6070 0000 0000 0009
  Use any future expiry (e.g., 12/27) and any 3-digit CVV.
  UPI ID     : slnmohan78-1@oksbi

================================================================
  PROJECT FOLDER STRUCTURE
================================================================
  cakeshop/
  ├── app.py              ← Main Flask application (backend)
  ├── database.db         ← SQLite database (auto-created)
  ├── requirements.txt    ← Python dependencies
  ├── shop_status.json    ← Shop open/close status file
  ├── static/
  │   ├── script.js       ← All frontend JavaScript logic
  │   ├── style.css       ← All styling and animations
  │   └── images/         ← Cake images and assets
  └── templates/
      ├── index.html      ← Home page
      ├── cart.html       ← Cart + Payment gateway
      ├── admin.html      ← Admin dashboard
      ├── about.html      ← About page
      ├── contact.html    ← Contact page
      └── customize.html  ← Cake customization page

================================================================
