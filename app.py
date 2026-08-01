import os
import json
import sqlite3
from datetime import datetime
from flask import Flask, render_template, request, jsonify, session, g
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)

# Secret key for session management
app.secret_key = 'mca_cake_shop_super_secret_key'

# Session cookie settings (fix for modern browsers)
app.config['SESSION_COOKIE_SAMESITE'] = 'Lax'
app.config['SESSION_COOKIE_HTTPONLY'] = True

# Disable static file caching so changes are always picked up
app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0

# Inject cache-busting version into all templates
import time
_CACHE_BUST = str(int(time.time()))

@app.context_processor
def inject_version():
    return dict(v=_CACHE_BUST)

DATABASE = 'database.db'
SHOP_STATUS_FILE = 'shop_status.json'

# --- DATABASE SETUP ---

def get_db():
    """Get database connection for the current request context."""
    db = getattr(g, '_database', None)
    if db is None:
        db = g._database = sqlite3.connect(DATABASE)
        db.row_factory = sqlite3.Row
    return db

@app.teardown_appcontext
def close_connection(exception):
    """Close database connection after request ends."""
    db = getattr(g, '_database', None)
    if db is not None:
        db.close()

def init_db():
    """Initialize SQLite database schema and default admin."""
    with app.app_context():
        db = get_db()
        cursor = db.cursor()

        # 1. Admin Table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS admin (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT UNIQUE NOT NULL,
                password TEXT NOT NULL
            )
        ''')

        # 2. Orders Table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS orders (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                customer_name TEXT NOT NULL,
                phone TEXT NOT NULL,
                cake_name TEXT NOT NULL,
                quantity INTEGER NOT NULL,
                total_price REAL NOT NULL,
                payment_status TEXT DEFAULT 'pending',
                order_status TEXT DEFAULT 'new',
                address TEXT DEFAULT 'N/A',
                transaction_id TEXT,
                payment_method TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')

        # 3. Create Default Admin Profile
        cursor.execute("SELECT * FROM admin WHERE username='admin@bakedwithlove.com'")
        if not cursor.fetchone():
            hashed_pw = generate_password_hash('BWL@admin2024')
            cursor.execute(
                "INSERT INTO admin (username, password) VALUES (?, ?)",
                ('admin@bakedwithlove.com', hashed_pw)
            )

        # 4. Schema Migration
        try:
            cursor.execute("ALTER TABLE orders ADD COLUMN transaction_id TEXT")
        except Exception:
            pass
        try:
            cursor.execute("ALTER TABLE orders ADD COLUMN payment_method TEXT")
        except Exception:
            pass

        db.commit()


# --- SHOP STATUS HELPERS ---

def get_shop_status():
    if not os.path.exists(SHOP_STATUS_FILE):
        return True
    try:
        with open(SHOP_STATUS_FILE, 'r') as f:
            data = json.load(f)
            return data.get('open', True)
    except Exception:
        return True

def set_shop_status(is_open):
    with open(SHOP_STATUS_FILE, 'w') as f:
        json.dump({'open': is_open}, f)


# --- FRONTEND TEMPLATE ROUTES ---

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/about")
def about():
    return render_template("about.html")

@app.route("/contact")
def contact():
    return render_template("contact.html")

@app.route("/cart")
def cart():
    return render_template("cart.html")

@app.route("/customize")
def customize():
    return render_template("customize.html")

@app.route("/admin")
def admin_page():
    return render_template("admin.html")


# --- REST API ---

@app.route('/place-order', methods=['POST'])
def place_order():
    """API to place a new cake order."""
    data = request.get_json()
    required_fields = ['customer_name', 'phone', 'cake_name', 'quantity', 'total_price']

    if not data or not all(k in data for k in required_fields):
        return jsonify({"success": False, "message": "Missing required fields"}), 400

    address = data.get('address', 'N/A')
    transaction_id = data.get('transaction_id')
    payment_method = data.get('payment_method')

    db = get_db()
    cursor = db.cursor()
    try:
        cursor.execute('''
            INSERT INTO orders (customer_name, phone, cake_name, quantity, total_price, address, transaction_id, payment_method)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            data['customer_name'],
            data['phone'],
            data['cake_name'],
            int(data['quantity']),
            float(data['total_price']),
            address,
            transaction_id,
            payment_method
        ))
        db.commit()
        order_id = cursor.lastrowid
        return jsonify({"success": True, "message": "Order placed successfully!", "order_id": order_id}), 201
    except Exception as e:
        db.rollback()
        return jsonify({"success": False, "message": str(e)}), 500


@app.route('/admin-login', methods=['POST'])
def admin_login():
    """API to authenticate admin."""
    data = request.get_json()
    if not data or 'username' not in data or 'password' not in data:
        return jsonify({"success": False, "message": "Missing credentials"}), 400

    db = get_db()
    cursor = db.cursor()
    cursor.execute("SELECT * FROM admin WHERE username=?", (data['username'],))
    admin_user = cursor.fetchone()

    if admin_user and check_password_hash(admin_user['password'], data['password']):
        session['admin_logged_in'] = True
        session['admin_id'] = admin_user['id']
        session['username'] = admin_user['username']
        return jsonify({"success": True, "message": "Login successful"}), 200
    else:
        return jsonify({"success": False, "message": "Invalid username or password"}), 401


@app.route('/admin-logout', methods=['POST'])
def admin_logout():
    """API to destroy admin session."""
    session.clear()
    return jsonify({"success": True, "message": "Logged out successfully"}), 200


@app.route('/check-session', methods=['GET'])
def check_session():
    """Check if admin is logged in."""
    if session.get('admin_logged_in'):
        return jsonify({"success": True, "message": "Authenticated"}), 200
    return jsonify({"success": False, "message": "Not authenticated"}), 401


@app.route('/shop-status', methods=['GET'])
def shop_status_get():
    """Get current shop open/close status."""
    return jsonify({"success": True, "open": get_shop_status()}), 200


@app.route('/shop-status', methods=['POST'])
def shop_status_post():
    """Set shop open/close status (Admin only)."""
    if not session.get('admin_logged_in'):
        return jsonify({"success": False, "message": "Unauthorized"}), 403
    data = request.get_json()
    is_open = data.get('open', True)
    set_shop_status(is_open)
    return jsonify({"success": True, "open": is_open}), 200


@app.route('/get-orders', methods=['GET'])
def get_orders():
    """Fetch all orders (Admin only)."""
    if not session.get('admin_logged_in'):
        return jsonify({"success": False, "message": "Unauthorized"}), 403

    db = get_db()
    cursor = db.cursor()
    cursor.execute("SELECT * FROM orders ORDER BY created_at DESC")
    orders = [dict(row) for row in cursor.fetchall()]
    return jsonify({"success": True, "orders": orders}), 200


@app.route('/sales-report', methods=['GET'])
def sales_report():
    """Fetch aggregated sales data (Admin only)."""
    if not session.get('admin_logged_in'):
        return jsonify({"success": False, "message": "Unauthorized"}), 403

    db = get_db()
    cursor = db.cursor()
    cursor.execute('''
        SELECT cake_name, SUM(quantity) as total_quantity, SUM(total_price) as total_revenue
        FROM orders
        WHERE payment_status = 'Verified'
        GROUP BY cake_name
    ''')
    report = [dict(row) for row in cursor.fetchall()]
    return jsonify({"success": True, "report": report}), 200


@app.route('/verify-payment/<int:order_id>', methods=['PUT'])
def verify_payment(order_id):
    """Verify payment for an order (Admin only)."""
    if not session.get('admin_logged_in'):
        return jsonify({"success": False, "message": "Unauthorized"}), 403

    db = get_db()
    cursor = db.cursor()
    cursor.execute(
        "UPDATE orders SET payment_status='Verified', order_status='Processing' WHERE id=?",
        (order_id,)
    )
    db.commit()

    if cursor.rowcount == 0:
        return jsonify({"success": False, "message": "Order not found"}), 404

    return jsonify({"success": True, "message": "Payment verified, order is now processing."}), 200


@app.route('/delete-order/<int:order_id>', methods=['DELETE'])
def delete_order(order_id):
    """Delete an order (Admin only)."""
    if not session.get('admin_logged_in'):
        return jsonify({"success": False, "message": "Unauthorized"}), 403

    db = get_db()
    cursor = db.cursor()
    cursor.execute("DELETE FROM orders WHERE id=?", (order_id,))
    db.commit()

    if cursor.rowcount == 0:
        return jsonify({"success": False, "message": "Order not found"}), 404

    return jsonify({"success": True, "message": "Order deleted permanently."}), 200


# Initialize DB and run app
if __name__ == "__main__":
    init_db()
    app.run(debug=False, host='0.0.0.0', port=8080)
