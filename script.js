/* ====================================================
   CRÈME & CO. — Premium Cake Shop
   Main JavaScript — Cart, Animations, WhatsApp Checkout
   ==================================================== */

'use strict';

// ====================================================
// CAKE DATA — BakedWithLove by Muskan
// ====================================================
const CAKES = [
    {
        id: 1,
        name: 'Vanilla Cake',
        desc: 'Classic vanilla sponge with smooth buttercream frosting — a timeless favourite for every occasion',
        price: 500,
        emoji: '🎂',
        badge: 'Best Seller',
        color: '#FFF8F0',
    },
    {
        id: 2,
        name: 'Pineapple Cake',
        desc: 'Tropical pineapple mousse with fresh whipped cream between feather-light sponge layers',
        price: 550,
        emoji: '🍍',
        badge: 'Best Seller',
        color: '#FFF3CD',
    },
    {
        id: 3,
        name: 'Black Forest',
        desc: 'Rich chocolate sponge layered with luscious cherries, velvety cream and chocolate shavings',
        price: 600,
        emoji: '🍒',
        badge: 'Best Seller',
        color: '#F0E6D9',
    },
    {
        id: 4,
        name: 'Butterscotch Cake',
        desc: 'Rich butterscotch cream with irresistible crunchy praline — indulgent and deeply satisfying',
        price: 580,
        emoji: '🧁',
        badge: 'Popular',
        color: '#FFF3CD',
    },
    {
        id: 5,
        name: 'White Forest',
        desc: 'Delicate white chocolate sponge with cherries and silky cream — an elegant twist on a classic',
        price: 620,
        emoji: '🤍',
        badge: 'New',
        color: '#FAE8E6',
    },
    {
        id: 6,
        name: 'Choco Vanilla Cake',
        desc: 'The perfect blend of rich chocolate and fragrant vanilla — two classics in one beautiful cake',
        price: 550,
        emoji: '🍫',
        badge: 'Classic',
        color: '#F0E6D9',
    },
    {
        id: 7,
        name: 'Double Chocolate',
        desc: 'Rich chocolate overload for true chocolate lovers — dense, indulgent and deeply satisfying',
        price: 650,
        emoji: '🍫',
        badge: "Choco Lover",
        color: '#EDE7F6',
    },
    {
        id: 8,
        name: 'Chocolate Rosette',
        desc: 'Elegant chocolate rosette design — a showstopper wedding and celebration cake crafted with artistry',
        price: 700,
        emoji: '🌹',
        badge: 'Best Seller',
        color: '#FAE8E6',
    },
    {
        id: 9,
        name: 'Strawberry Cake',
        desc: 'Fresh strawberries with light vanilla cream between soft sponge — fruity, fresh and delightful',
        price: 650,
        emoji: '🍓',
        badge: 'Fresh',
        color: '#FDECEA',
    },
    {
        id: 10,
        name: 'Red Velvet Cake',
        desc: 'Classic red velvet with tangy cream cheese frosting — vibrant, velvety and utterly irresistible',
        price: 750,
        emoji: '❤️',
        badge: 'Best Seller',
        color: '#FAE8E6',
    },
    {
        id: 11,
        name: 'Rasmalai Cake',
        desc: 'Indian fusion delight with the rich, creamy flavour of rasmalai infused into every sponge layer',
        price: 800,
        emoji: '🍮',
        badge: "Chef's Pick",
        color: '#FFF3CD',
    },
    {
        id: 12,
        name: 'Gulabjamun Cake',
        desc: 'Unique gulabjamun-flavoured cake — a desi twist that surprises and delights at every celebration',
        price: 850,
        emoji: '🟤',
        badge: 'Fusion',
        color: '#F0E6D9',
    },
    {
        id: 13,
        name: 'Honey Almond Cake',
        desc: 'Delicate honey sponge with roasted almond praline — a nutty, aromatic eggless masterpiece',
        price: 700,
        emoji: '🍯',
        badge: 'Eggless',
        color: '#FFF8F0',
    },
    {
        id: 14,
        name: 'Chocolate Cake',
        desc: 'Simple yet sensational chocolate cake — moist, rich, and perfect for any birthday celebration',
        price: 550,
        emoji: '🎂',
        badge: 'Classic',
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

    return `Hello BakedWithLove by Muskan! 🎂

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
        // BakedWithLove by Muskan WhatsApp number
        const whatsappNumber = '91XXXXXXXXXX'; // TODO: Replace with real number
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
    initCheckout();         // WhatsApp checkout button
    initUpiPayment();       // UPI payment modal
    initContactForm();      // contact form
    animateCounters();      // hero stats counter
});

/* ====================================================
   UPI PAYMENT GATEWAY
   ==================================================== */

// ─── CONFIG ──────────────────────────────────────────
// Replace these with your actual UPI details
const UPI_ID = 'bakedwithlove@upi';  // Your UPI VPA / ID
const UPI_NAME = 'BakedWithLove';       // Merchant name — plain ASCII
// ─────────────────────────────────────────────────────

let _qrInstance = null;

/** Build a minimal UPI payment URI — keep it short so QR fits */
function buildUpiUri(amount) {
    const amtFixed = amount.toFixed(2);
    // Keep URI minimal and ASCII-safe so qrcodejs can encode it
    return 'upi://pay?pa=' + UPI_ID + '&pn=' + UPI_NAME + '&am=' + amtFixed + '&cu=INR';
}

/** Generate QR on the div container element using qrcodejs */
function generateQr(uri) {
    const container = document.getElementById('upiQrContainer');
    if (!container) return;
    // Clear previous QR
    container.innerHTML = '';
    _qrInstance = null;

    if (typeof QRCode === 'undefined') {
        // Fallback: show text if library not loaded
        container.style.display = 'flex';
        container.style.alignItems = 'center';
        container.style.justifyContent = 'center';
        container.style.flexDirection = 'column';
        container.style.fontSize = '13px';
        container.style.color = '#6B3A2A';
        container.style.gap = '6px';
        container.innerHTML = '<div>QR unavailable</div><div>Use UPI ID tab →</div>';
        return;
    }
    try {
        _qrInstance = new QRCode(container, {
            text: uri,
            width: 200,
            height: 200,
            colorDark: '#2D1B14',
            colorLight: '#FFFFFF',
            correctLevel: QRCode.CorrectLevel.L,
        });
    } catch (e) {
        console.warn('QR generation failed:', e);
    }
}

/** Open UPI deep-link for a specific app */
function openUpiApp(scheme, uri) {
    // Try to open native UPI intent; falls back to upi:// universal link
    const prefixedUri = scheme ? uri.replace('upi://', scheme) : uri;
    window.location.href = prefixedUri;
}

/** Show the UPI payment modal */
function openUpiModal() {
    const cart = getCart();
    if (!cart.length) {
        alert('Your cart is empty! Add some cakes first. 🎂');
        return;
    }

    const subtotal = getCartTotal();
    const delivery = subtotal >= 1000 ? 0 : 80;
    const total = subtotal + delivery;

    // Update amount display
    const amtEl = document.getElementById('upiAmountDisplay');
    if (amtEl) amtEl.textContent = total.toLocaleString('en-IN');

    // Update UPI ID display
    const idEl = document.getElementById('upiIdDisplay');
    if (idEl) idEl.textContent = UPI_ID;

    // Generate QR
    const uri = buildUpiUri(total);
    generateQr(uri);

    // Wire up app buttons with the URI
    const appMap = {
        appGpay: 'gpay://upi/',
        appPhonepe: 'phonepe://pay',
        appPaytm: 'paytmmp://pay',
        appBhim: 'upi://',
        appAmazon: 'amzn://pay',
        appAny: 'upi://',
    };
    Object.entries(appMap).forEach(([id, scheme]) => {
        const btn = document.getElementById(id);
        if (btn) {
            btn.onclick = () => {
                const appUri = id === 'appGpay' ? `tez://upi/pay?pa=${encodeURIComponent(UPI_ID)}&pn=${UPI_NAME}&am=${total.toFixed(2)}&cu=INR`
                    : id === 'appPhonepe' ? `phonepe://pay?pa=${encodeURIComponent(UPI_ID)}&pn=${UPI_NAME}&am=${total.toFixed(2)}&cu=INR`
                        : id === 'appPaytm' ? `paytmmp://pay?pa=${encodeURIComponent(UPI_ID)}&pn=${UPI_NAME}&am=${total.toFixed(2)}&cu=INR`
                            : uri;
                window.location.href = appUri;
            };
        }
    });

    // Reset to QR tab
    switchUpiTab('qr');

    // Show overlay
    const overlay = document.getElementById('upiOverlay');
    if (overlay) {
        overlay.classList.add('open');
        document.body.style.overflow = 'hidden';
    }
}

/** Close the UPI payment modal */
function closeUpiModal() {
    const overlay = document.getElementById('upiOverlay');
    if (overlay) {
        overlay.classList.remove('open');
        document.body.style.overflow = '';
    }
    // Reset success screen
    const success = document.getElementById('upiSuccess');
    if (success) success.classList.remove('show');
}

/** Switch tab in the modal */
function switchUpiTab(panelId) {
    document.querySelectorAll('.upi-tab').forEach(t => {
        const active = t.dataset.panel === panelId;
        t.classList.toggle('active', active);
        t.setAttribute('aria-selected', active ? 'true' : 'false');
    });
    document.querySelectorAll('.upi-panel').forEach(p => {
        p.classList.toggle('active', p.id === 'panel' + panelId.charAt(0).toUpperCase() + panelId.slice(1));
    });
}

/** Show the payment success screen */
function showPaymentSuccess() {
    // Hide tabs + panels
    document.querySelector('.upi-tabs').style.display = 'none';
    document.querySelectorAll('.upi-panel').forEach(p => p.style.display = 'none');

    // Build order summary text
    const cart = getCart();
    const subtotal = getCartTotal();
    const delivery = subtotal >= 1000 ? 0 : 80;
    const total = subtotal + delivery;
    const lines = cart.map(item => `• ${item.name} × ${item.qty} = ₹${(item.price * item.qty).toLocaleString('en-IN')}`).join('<br>');
    const deliveryLine = delivery === 0 ? 'Delivery: <strong>FREE 🎉</strong>' : `Delivery: <strong>₹${delivery}</strong>`;

    const orderEl = document.getElementById('upiSuccessOrder');
    if (orderEl) {
        orderEl.innerHTML = `${lines}<br>${deliveryLine}<br><strong style="font-size:1rem;">Total: ₹${total.toLocaleString('en-IN')}</strong>`;
    }

    // Clear cart
    localStorage.removeItem(CART_KEY);
    updateCartBadge();

    // Show success
    const success = document.getElementById('upiSuccess');
    success.classList.add('show');
}

/** Initialise all UPI modal interactions */
function initUpiPayment() {
    // Pay Online button
    const payBtn = document.getElementById('payUpiBtn');
    if (payBtn) payBtn.addEventListener('click', openUpiModal);

    // Close button
    const closeBtn = document.getElementById('upiCloseBtn');
    if (closeBtn) closeBtn.addEventListener('click', closeUpiModal);

    // Close on overlay click (outside modal)
    const overlay = document.getElementById('upiOverlay');
    if (overlay) {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) closeUpiModal();
        });
    }

    // Keyboard: Esc to close
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && overlay && overlay.classList.contains('open')) {
            closeUpiModal();
        }
    });

    // Tab switcher
    document.querySelectorAll('.upi-tab').forEach(tab => {
        tab.addEventListener('click', () => switchUpiTab(tab.dataset.panel));
    });

    // Copy UPI ID
    const copyBtn = document.getElementById('btnCopyUpiId');
    if (copyBtn) {
        copyBtn.addEventListener('click', async () => {
            try {
                await navigator.clipboard.writeText(UPI_ID);
                copyBtn.textContent = '✅ Copied!';
                copyBtn.classList.add('copied');
                setTimeout(() => {
                    copyBtn.textContent = '📋 Copy';
                    copyBtn.classList.remove('copied');
                }, 2200);
            } catch {
                // Fallback
                const tmp = document.createElement('input');
                tmp.value = UPI_ID;
                document.body.appendChild(tmp);
                tmp.select();
                document.execCommand('copy');
                document.body.removeChild(tmp);
                copyBtn.textContent = '✅ Copied!';
                copyBtn.classList.add('copied');
                setTimeout(() => { copyBtn.textContent = '📋 Copy'; copyBtn.classList.remove('copied'); }, 2200);
            }
        });
    }

    // "I've Paid" buttons (all three panels)
    ['btnPaidQr', 'btnPaidId', 'btnPaidApp'].forEach(id => {
        const btn = document.getElementById(id);
        if (btn) btn.addEventListener('click', showPaymentSuccess);
    });

    // "Done" button → navigate home
    const doneBtn = document.getElementById('btnDone');
    if (doneBtn) {
        doneBtn.addEventListener('click', () => {
            closeUpiModal();
            window.location.href = 'index.html';
        });
    }
}

