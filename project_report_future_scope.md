## (xi) Future Scope and Further Enhancement of the Project

While the current system successfully handles essential cake shop operations, several enhancements can be implemented in future iterations to scale the application and improve the user experience:

1.  **Online Payment Gateway Integration:** Currently, the system relies on WhatsApp for manual payment verification. Integrating a direct payment gateway (such as Razorpay, Stripe, or PayPal) would fully automate the checkout and payment verification process.
2.  **Customer Accounts & Order History:** Implementing a secure customer registration and login system. This would allow users to view their past orders, save multiple delivery addresses, and reorder favourite cakes with a single click.
3.  **Real-Time Inventory & Stock Management:** Expanding the database to track the exact stock levels of specific cake flavors, sizes, and raw ingredients. This would allow the system to automatically mark items as "Out of Stock" on the frontend when inventory is depleted.
4.  **Automated Email/SMS Notifications:** Integrating third-party communication APIs (like SendGrid for emails or Twilio for SMS) to send automated order confirmations, payment receipts, and dispatch updates directly to customers.
5.  **Delivery Tracking System:** Implementing a localized tracking feature where the admin can update the order status to "Out for Delivery," which then reflects on a live tracking page for the customer.
6.  **Advanced Admin Analytics Dashboard:** Enhancing the backend to generate visual data representations (using libraries like Chart.js) in the admin portal, providing graphs for daily sales trends, peak ordering times, and top-selling products.

---

## (xii) Bibliography

1.  **Grinberg, M. (2018).** *Flask Web Development: Developing Web Applications with Python (2nd ed.)*. O'Reilly Media. (Used as a primary reference for Flask routing, Jinja templating, and application structure).
2.  **MDN Web Docs (Mozilla). (n.d.).** *HTML & CSS, JavaScript references*. Retrieved from https://developer.mozilla.org/ (Used for modern CSS properties, Flexbox/Grid layouts, and Vanilla JavaScript DOM manipulation).
3.  **Python Software Foundation. (n.d.).** *Python 3 Official Documentation*. Retrieved from https://docs.python.org/3/ (Referenced for backend logic and standard library usage).
4.  **SQLite Consortium. (n.d.).** *SQLite Documentation*. Retrieved from https://www.sqlite.org/docs.html (Used for database schema design and parameterized query structures).
5.  **Pallets Projects. (n.d.).** *Werkzeug Documentation (Security Helpers)*. Retrieved from https://werkzeug.palletsprojects.com/ (Referenced for `generate_password_hash` and `check_password_hash` implementation).
6.  **JavaScript.info. (n.d.).** *The Modern JavaScript Tutorial*. Retrieved from https://javascript.info/ (Used for understanding SessionStorage, LocalStorage, and async/await Fetch API requests).
