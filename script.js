/* ====================================================
   CRÈME & CO. — Premium Cake Shop
   Main JavaScript — Cart, Animations, WhatsApp Checkout
   ==================================================== */

'use strict';

// ====================================================
// CAKE DATA
// ====================================================
const CAKES = [
    {
        id: 1,
        name: 'Rose Velvet Dream',
        desc: 'Delicate rose-scented red velvet layers with silky cream cheese frosting',
        price: 899,
        emoji: '🎂',
        badge: 'Bestseller',
        color: '#FAE8E6',
    },
    {
        id: 2,
        name: 'Chocolate Truffle Luxe',
        desc: 'Rich Belgian chocolate ganache with velvety truffle cream and gold flakes',
        price: 1199,
        emoji: '🍫',
        badge: 'Premium',
        color: '#F0E6D9',
    },
    {
        id: 3,
        name: 'Mango Blossom',
        desc: 'Fresh Alphonso mango mousse nestled between feather-light sponge layers',
        price: 749,
        emoji: '🥭',
        badge: 'Seasonal',
        color: '#FFF3CD',
    },
    {
        id: 4,
        name: 'Strawberry Garden',
        desc: 'Whipped mascarpone cream with handpicked strawberries and basil compote',
        price: 849,
        emoji: '🍓',
        badge: 'Fresh',
        color: '#FDECEA',
    },
    {
        id: 5,
        name: 'Pistachio Pearl',
        desc: 'Salted pistachio frangipane with rose water glaze and crushed nut praline',
        price: 1099,
        emoji: '🫐',
        badge: "Chef's Pick",
        color: '#E8F5E9',
    },
    {
        id: 6,
        name: 'Vanilla Cloud',
        desc: 'Ethereal chiffon layers with whipped Tahitian vanilla bean cream',
        price: 649,
        emoji: '☁️',
        badge: 'Classic',
        color: '#FFF8F0',
    },
    {
        id: 7,
        name: 'Caramel Noir',
        desc: 'Salted dark caramel buttercream with espresso-soaked sponge and toffee shards',
        price: 999,
        emoji: '🍮',
        badge: 'New',
        color: '#FFF3CD',
    },
    {
        id: 8,
        name: 'Blueberry Lavender',
        desc: 'Blueberry compote with Provençal lavender cream and lemon zest crumble',
        price: 879,
        emoji: '💜',
        badge: 'Artisanal',
        color: '#EDE7F6',
    },
];

// ====================================================
// CART STATE (localStorage)
// ====================================================
const CART_KEY = 'cremeco_cart';

function getCart() {
    try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; }
    catch { return []; }
}

function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function addToCart(id) {
    const cake = CAKES.find(c => c.id === id);
    if (!cake) return;
    const cart = getCart();
    const existing = cart.find(item => item.id === id);
    if (existing) {
        existing.qty += 1;
    } else {
        cart.push({ id: cake.id, name: cake.name, price: cake.price, emoji: cake.emoji, qty: 1 });
    }
    saveCart(cart);
    updateCartBadge();
    return cart;
}

function removeFromCart(id) {
    const cart = getCart().filter(item => item.id !== id);
    saveCart(cart);
    updateCartBadge();
}

function updateQty(id, delta) {
    const cart = getCart();
    const item = cart.find(i => i.id === id);
    if (!item) return;
    item.qty = Math.max(1, item.qty + delta);
    saveCart(cart);
    updateCartBadge();
}

function getCartCount() {
    return getCart().reduce((sum, item) => sum + item.qty, 0);
}

function getCartTotal() {
    return getCart().reduce((sum, item) => sum + item.price * item.qty, 0);
}

function updateCartBadge() {
    const badges = document.querySelectorAll('.cart-count');
    const count = getCartCount();
    badges.forEach(badge => {
        badge.textContent = count;
        badge.classList.toggle('visible', count > 0);
    });
}

// ====================================================
// PAGE LOADER
// ====================================================
function initLoader() {
    const loader = document.getElementById('loader');
    if (!loader) return;
    // Use a plain timeout — window 'load' can hang on some servers/file paths
    setTimeout(() => { loader.classList.add('hidden'); }, 700);
}

// ====================================================
// NAVBAR — scroll shadow + hamburger
// ====================================================
function initNavbar() {
    const navbar = document.querySelector('.navbar');
    const hamburger = document.querySelector('.hamburger');
    const mobileNav = document.querySelector('.mobile-nav');

    if (navbar) {
        window.addEventListener('scroll', () => {
            navbar.classList.toggle('scrolled', window.scrollY > 10);
        }, { passive: true });
    }

    if (hamburger && mobileNav) {
        hamburger.addEventListener('click', () => {
            const open = hamburger.classList.toggle('open');
            mobileNav.classList.toggle('open', open);
            document.body.style.overflow = open ? 'hidden' : '';
        });
        // Close when link clicked
        mobileNav.querySelectorAll('a').forEach(a => {
            a.addEventListener('click', () => {
                hamburger.classList.remove('open');
                mobileNav.classList.remove('open');
                document.body.style.overflow = '';
            });
        });
    }

    // Highlight active nav link
    const currentPage = location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-links a, .mobile-nav a').forEach(a => {
        const href = a.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            a.classList.add('active');
        }
    });
}

// ====================================================
// SCROLL REVEAL
// ====================================================
function initScrollReveal() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.reveal, .reveal-stagger').forEach(el => {
        observer.observe(el);
    });
}

// ====================================================
// HOMEPAGE — Render Cake Grid
// ====================================================
function renderCakes() {
    const grid = document.getElementById('cakesGrid');
    if (!grid) return;

    grid.innerHTML = CAKES.map(cake => `
    <article class="cake-card reveal" data-id="${cake.id}">
      <div class="cake-card-img" style="background: linear-gradient(135deg, ${cake.color}, #F0E6D9);">
        <div style="display:flex;align-items:center;justify-content:center;height:100%;font-size:4.5rem;filter:drop-shadow(0 8px 16px rgba(107,58,42,0.15));transition:transform 0.4s cubic-bezier(0.22,1,0.36,1);" class="cake-emoji-display">${cake.emoji}</div>
        <div class="cake-badge">${cake.badge}</div>
      </div>
      <div class="cake-card-body">
        <h3 class="cake-card-name">${cake.name}</h3>
        <p class="cake-card-desc">${cake.desc}</p>
        <div class="cake-card-footer">
          <div class="cake-price"><sup>₹</sup>${cake.price.toLocaleString('en-IN')}</div>
          <button class="btn-add" onclick="handleAddToCart(${cake.id}, this)" aria-label="Add ${cake.name} to cart">
            Add to Cart
          </button>
        </div>
      </div>
    </article>
  `).join('');

    // Re-init scroll reveal for new elements
    initScrollReveal();
}

function handleAddToCart(id, btn) {
    addToCart(id);

    // Micro-interaction
    const original = btn.textContent;
    btn.classList.add('added');
    btn.textContent = '✓ Added!';
    btn.disabled = true;

    // Animate cart icon
    const cartBtns = document.querySelectorAll('.cart-btn');
    cartBtns.forEach(cb => {
        cb.animate([
            { transform: 'scale(1)' },
            { transform: 'scale(1.25)' },
            { transform: 'scale(1)' }
        ], { duration: 350, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' });
    });

    setTimeout(() => {
        btn.classList.remove('added');
        btn.textContent = original;
        btn.disabled = false;
    }, 1600);
}

// ====================================================
// CART PAGE — Render & Logic
// ====================================================
function renderCartPage() {
    const cartWrap = document.getElementById('cartItems');
    const emptyEl = document.getElementById('cartEmpty');
    const subtotalEl = document.getElementById('summarySubtotal');
    const totalEl = document.getElementById('summaryTotal');
    const checkoutBtn = document.getElementById('checkoutBtn');
    if (!cartWrap) return;

    const cart = getCart();

    if (cart.length === 0) {
        cartWrap.innerHTML = '';
        if (emptyEl) emptyEl.classList.add('show');
        if (subtotalEl) subtotalEl.textContent = '₹0';
        if (totalEl) totalEl.textContent = '₹0';
        if (checkoutBtn) checkoutBtn.style.opacity = '0.5';
        return;
    }

    if (emptyEl) emptyEl.classList.remove('show');
    if (checkoutBtn) checkoutBtn.style.opacity = '1';

    cartWrap.innerHTML = cart.map(item => `
    <div class="cart-item" id="cart-item-${item.id}">
      <div class="cart-item-img">${item.emoji}</div>
      <div class="cart-item-info">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-price">₹${item.price.toLocaleString('en-IN')} each</div>
        <div class="qty-ctrl">
          <button class="qty-btn" onclick="changeQty(${item.id}, -1)" aria-label="Decrease quantity">−</button>
          <span class="qty-val" id="qty-${item.id}">${item.qty}</span>
          <button class="qty-btn" onclick="changeQty(${item.id}, 1)" aria-label="Increase quantity">+</button>
        </div>
      </div>
      <div class="cart-item-right">
        <div class="cart-item-total" id="total-${item.id}">₹${(item.price * item.qty).toLocaleString('en-IN')}</div>
        <button class="btn-remove" onclick="handleRemove(${item.id})">Remove</button>
      </div>
    </div>
  `).join('');

    updateSummary();
}

function changeQty(id, delta) {
    updateQty(id, delta);
    const cart = getCart();
    const item = cart.find(i => i.id === id);
    if (item) {
        const qtyEl = document.getElementById(`qty-${id}`);
        const totalEl = document.getElementById(`total-${id}`);
        if (qtyEl) qtyEl.textContent = item.qty;
        if (totalEl) totalEl.textContent = `₹${(item.price * item.qty).toLocaleString('en-IN')}`;
    }
    updateSummary();
}

function handleRemove(id) {
    const el = document.getElementById(`cart-item-${id}`);
    if (el) {
        el.style.transition = 'opacity 0.3s, transform 0.3s';
        el.style.opacity = '0';
        el.style.transform = 'translateX(20px)';
        setTimeout(() => {
            removeFromCart(id);
            renderCartPage();
        }, 320);
    } else {
        removeFromCart(id);
        renderCartPage();
    }
}

function updateSummary() {
    const total = getCartTotal();
    const delivery = total >= 1000 ? 0 : 80;
    const grand = total + delivery;

    const subtotalEl = document.getElementById('summarySubtotal');
    const deliveryEl = document.getElementById('summaryDelivery');
    const totalEl = document.getElementById('summaryTotal');
    if (subtotalEl) subtotalEl.textContent = `₹${total.toLocaleString('en-IN')}`;
    if (deliveryEl) deliveryEl.textContent = delivery === 0 ? 'FREE 🎉' : `₹${delivery}`;
    if (totalEl) totalEl.textContent = `₹${grand.toLocaleString('en-IN')}`;
}

// ====================================================
// WHATSAPP CHECKOUT
// ====================================================
function buildWhatsAppMessage() {
    const cart = getCart();
    if (!cart.length) return null;

    const lines = cart.map(item =>
        `• ${item.name} × ${item.qty} = ₹${(item.price * item.qty).toLocaleString('en-IN')}`
    ).join('\n');

    const subtotal = getCartTotal();
    const delivery = subtotal >= 1000 ? 0 : 80;
    const total = subtotal + delivery;
    const deliveryLine = delivery === 0 ? 'Delivery: FREE 🎉' : `Delivery: ₹${delivery}`;

    return `Hello Crème & Co.! 🎂

I would like to place an order:

${lines}

${deliveryLine}
*Total: ₹${total.toLocaleString('en-IN')}*

Please confirm availability and delivery time.
Thank you! 😊`;
}

function initCheckout() {
    const checkoutBtn = document.getElementById('checkoutBtn');
    if (!checkoutBtn) return;

    checkoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const cart = getCart();
        if (!cart.length) {
            alert('Your cart is empty! Add some cakes first. 🎂');
            return;
        }
        const message = buildWhatsAppMessage();
        const encodedMsg = encodeURIComponent(message);
        // Replace XXXXXXXXXX with your actual WhatsApp number
        const whatsappNumber = '91XXXXXXXXXX';
        const url = `https://wa.me/${whatsappNumber}?text=${encodedMsg}`;
        window.open(url, '_blank');
    });
}

// ====================================================
// CONTACT FORM
// ====================================================
function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const btn = form.querySelector('.btn-submit');
        const success = document.getElementById('formSuccess');
        btn.classList.add('sending');
        btn.textContent = 'Sending…';

        // Simulate async send
        setTimeout(() => {
            btn.classList.remove('sending');
            btn.textContent = 'Send Message';
            form.reset();
            if (success) {
                success.style.display = 'block';
                setTimeout(() => { success.style.display = 'none'; }, 5000);
            }
        }, 1400);
    });
}

// ====================================================
// SMOOTH SCROLL for anchor links
// ====================================================
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', (e) => {
            const target = document.querySelector(a.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
}

// ====================================================
// COUNTER ANIMATION for hero stats
// ====================================================
function animateCounters() {
    document.querySelectorAll('[data-count]').forEach(el => {
        const target = parseInt(el.dataset.count, 10);
        const suffix = el.dataset.suffix || '';
        let current = 0;
        const step = Math.ceil(target / 60);
        const timer = setInterval(() => {
            current = Math.min(current + step, target);
            el.textContent = current + suffix;
            if (current >= target) clearInterval(timer);
        }, 20);
    });
}

// ====================================================
// HERO PARALLAX (subtle)
// ====================================================
function initParallax() {
    const hero = document.querySelector('.hero');
    if (!hero) return;
    window.addEventListener('scroll', () => {
        const y = window.scrollY;
        const cakeFloat = hero.querySelector('.cake-float');
        if (cakeFloat) cakeFloat.style.transform = `translateY(calc(-50% + ${y * 0.12}px))`;
    }, { passive: true });
}

// ====================================================
// INIT
// ====================================================
document.addEventListener('DOMContentLoaded', () => {
    initLoader();
    initNavbar();
    updateCartBadge();
    initSmoothScroll();
    initScrollReveal();
    initParallax();

    // Page-specific
    renderCakes();          // homepage cake grid
    renderCartPage();       // cart page
    initCheckout();         // checkout button
    initContactForm();      // contact form
    animateCounters();      // hero stats counter
});

/* ====================================================
   PHASE 2 — RAZORPAY INTEGRATION (PLACEHOLDER)
   ====================================================

   // Razorpay integration will be added in Phase 2
   // Example:
   // var options = {
   //   key: 'rzp_live_XXXXXXXXXXXXXX',
   //   amount: totalAmount * 100, // in paisa
   //   currency: 'INR',
   //   name: 'Crème & Co.',
   //   description: 'Cake Order',
   //   image: '/logo.png',
   //   handler: function(response) {
   //     console.log('Payment ID:', response.razorpay_payment_id);
   //     // Call backend to verify and confirm order
   //   },
   //   prefill: {
   //     name: customerName,
   //     email: customerEmail,
   //     contact: customerPhone,
   //   },
   //   theme: { color: '#6B3A2A' },
   // };
   // const rzp = new Razorpay(options);
   // rzp.open();

   ==================================================== */
