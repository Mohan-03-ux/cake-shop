# BakedWithLove by Muskan - Tech Stack

Here is a breakdown of the technologies used to build this cake shop application, point by point:

### **Backend & Database**
*   **Python:** The core programming language powering the server logic.
*   **Flask:** The lightweight web framework used to run the server API, handle routing (like `/admin` or `/place-order`), and serve the HTML pages.
*   **SQLite3:** A built-in, file-based SQL database (`database.db`) used to permanently store admin credentials and all customer order information.
*   **JSON (File Storage):** Used as a simple flat-file database (`shop_status.json`) to save the global "Shop Open/Paused" status so it persists even if the server restarts.

### **Frontend & UI**
*   **HTML5:** Used for the semantic structure and layout of all the pages (like the cart, admin dashboard, and checkout modals).
*   **CSS3 (Vanilla):** All the styling, animations, gradients, glassmorphism effects, and responsive mobile designs were written from scratch using pure CSS (no frameworks like Tailwind or Bootstrap).
*   **JavaScript (Vanilla/ES6):** Used to handle all the interactive logic directly in the browser—such as adding items to the cart, calculating totals, handling the WhatsApp redirects, managing the Dark/Light mode toggle, and fetching data from the backend without reloading the page.
*   **Web Storage API:** 
    *   **`localStorage`:** Used to save the user's customized cake draft and theme preferences across visits.
    *   **`sessionStorage`:** Used to store the active shopping cart items so they aren't lost while browsing different pages.
*   **Google Fonts:** Specifically *Playfair Display* (for elegant headings) and *DM Sans* (for clean, readable paragraphs and UI elements). 
