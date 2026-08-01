/* ====================================================
   BAKEDWITHLOVE BY MUSKAN — Main JavaScript
   Features: Cart, Filters, Weight Selector, Admin Toggle,
             SMS Notifier, Feedback, Bulk Orders, Customize
   ==================================================== */
'use strict';

// ====================================================
// CAKE DATA
// ====================================================
const CAKES = [
    { id: 1, name: 'Vanilla Cake', desc: 'Classic vanilla sponge with smooth buttercream frosting — a timeless favourite for every occasion', price: 500, emoji: '🎂', badge: 'Best Seller', color: '#FFF8F0', tags: ['veg', 'birthday', 'eggless'], imgUrl: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=400&h=280&fit=crop' },
    { id: 2, name: 'Pineapple Cake', desc: 'Tropical pineapple mousse with fresh whipped cream between feather-light sponge layers', price: 550, emoji: '🍍', badge: 'Best Seller', color: '#FFF3CD', tags: ['veg', 'birthday', 'eggless'], imgUrl: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=400&h=280&fit=crop' },
    { id: 3, name: 'Black Forest', desc: 'Rich chocolate sponge layered with luscious cherries, velvety cream and chocolate shavings', price: 600, emoji: '🍒', badge: 'Best Seller', color: '#F0E6D9', tags: ['veg', 'birthday', 'wedding'], imgUrl: 'https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?w=400&h=280&fit=crop' },
    { id: 4, name: 'Butterscotch Cake', desc: 'Rich butterscotch cream with irresistible crunchy praline — indulgent and deeply satisfying', price: 580, emoji: '🧁', badge: 'Popular', color: '#FFF3CD', tags: ['veg', 'birthday', 'eggless'], imgUrl: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&h=280&fit=crop' },
    { id: 5, name: 'White Forest', desc: 'Delicate white chocolate sponge with cherries and silky cream — an elegant twist on a classic', price: 620, emoji: '🤍', badge: 'New', color: '#FAE8E6', tags: ['veg', 'wedding', 'eggless'], imgUrl: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400&h=280&fit=crop' },
    { id: 6, name: 'Choco Vanilla', desc: 'The perfect blend of rich chocolate and fragrant vanilla — two classics in one beautiful cake', price: 550, emoji: '🍫', badge: 'Classic', color: '#F0E6D9', tags: ['veg', 'birthday'], imgUrl: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=280&fit=crop' },
    { id: 7, name: 'Double Chocolate', desc: 'Rich chocolate overload for true chocolate lovers — dense, indulgent and deeply satisfying', price: 650, emoji: '🍫', badge: 'Choco Lover', color: '#EDE7F6', tags: ['veg', 'birthday', 'bulk'], imgUrl: 'https://images.unsplash.com/photo-1557925923-cd4648e211a0?w=400&h=280&fit=crop' },
    { id: 8, name: 'Chocolate Rosette', desc: 'Elegant chocolate rosette design — a showstopper wedding and celebration cake crafted with artistry', price: 700, emoji: '🌹', badge: 'Best Seller', color: '#FAE8E6', tags: ['veg', 'wedding', 'bulk'], imgUrl: 'https://images.unsplash.com/photo-1559620192-032c4bc4674e?w=400&h=280&fit=crop' },
    { id: 9, name: 'Strawberry Cake', desc: 'Fresh strawberries with light vanilla cream between soft sponge — fruity, fresh and delightful', price: 650, emoji: '🍓', badge: 'Fresh', color: '#FDECEA', tags: ['veg', 'birthday', 'eggless'], imgUrl: 'https://images.unsplash.com/photo-1587668178277-295251f900ce?w=400&h=280&fit=crop' },
    { id: 10, name: 'Red Velvet Cake', desc: 'Classic red velvet with tangy cream cheese frosting — vibrant, velvety and utterly irresistible', price: 750, emoji: '❤️', badge: 'Best Seller', color: '#FAE8E6', tags: ['veg', 'wedding', 'birthday'], imgUrl: 'https://images.unsplash.com/photo-1586788680434-30d324b2d46f?w=400&h=280&fit=crop' },
    { id: 11, name: 'Rasmalai Cake', desc: 'Indian fusion delight with the rich, creamy flavour of rasmalai infused into every sponge layer', price: 800, emoji: '🍮', badge: "Chef's Pick", color: '#FFF3CD', tags: ['veg', 'fusion', 'wedding', 'eggless'], imgUrl: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&h=280&fit=crop' },
    { id: 12, name: 'Gulabjamun Cake', desc: 'Unique gulabjamun-flavoured cake — a desi twist that surprises and delights at every celebration', price: 850, emoji: '🟤', badge: 'Fusion', color: '#F0E6D9', tags: ['veg', 'fusion', 'wedding', 'eggless'], imgUrl: 'https://images.unsplash.com/photo-1512389142860-9c449e58a543?w=400&h=280&fit=crop' },
    { id: 13, name: 'Honey Almond Cake', desc: 'Delicate honey sponge with roasted almond praline — a nutty, aromatic eggless masterpiece', price: 700, emoji: '🍯', badge: 'Eggless', color: '#FFF8F0', tags: ['veg', 'eggless', 'birthday', 'bulk'], imgUrl: 'https://images.unsplash.com/photo-1515037893149-de7f840978e2?w=400&h=280&fit=crop' },
    { id: 14, name: 'Chocolate Cake', desc: 'Simple yet sensational chocolate cake — moist, rich, and perfect for any birthday celebration', price: 550, emoji: '🎂', badge: 'Classic', color: '#EDE7F6', tags: ['veg', 'birthday', 'bulk'], imgUrl: 'https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?w=400&h=280&fit=crop' },
];

const WEIGHT_MULTIPLIERS = { '0.5kg': 0.6, '1kg': 1, '2kg': 1.9, '3kg': 2.7 };

// ====================================================
// CART STATE (sessionStorage)
// ====================================================
const CART_KEY = 'cremeco_cart';

function getCart() {
    try { return JSON.parse(sessionStorage.getItem(CART_KEY)) || []; }
    catch { return []; }
}
function saveCart(cart) { sessionStorage.setItem(CART_KEY, JSON.stringify(cart)); }

function addToCart(id, weight) {
    weight = weight || '1kg';
    const cake = CAKES.find(c => c.id === id);
    if (!cake) return;
    const cart = getCart();
    const mult = WEIGHT_MULTIPLIERS[weight] || 1;
    const unitPrice = Math.round(cake.price * mult);
    const cartKey = `${id}-${weight}`;
    const existing = cart.find(item => (item.cartKey || String(item.id)) === cartKey);
    if (existing) { existing.qty += 1; }
    else { cart.push({ id: cake.id, cartKey, name: cake.name, price: unitPrice, basePrice: cake.price, emoji: cake.emoji, weight, qty: 1 }); }
    saveCart(cart);
    updateCartBadge();
    return cart;
}

function removeFromCart(cartKey) {
    const cart = getCart().filter(item => (item.cartKey || String(item.id)) !== String(cartKey));
    saveCart(cart);
    updateCartBadge();
}

function updateQty(cartKey, delta) {
    const cart = getCart();
    const item = cart.find(i => (i.cartKey || String(i.id)) === String(cartKey));
    if (!item) return;
    item.qty = Math.max(1, item.qty + delta);
    saveCart(cart);
    updateCartBadge();
}

function getCartCount() { return getCart().reduce((s, i) => s + i.qty, 0); }
function getCartTotal() { return getCart().reduce((s, i) => s + i.price * i.qty, 0); }

function updateCartBadge() {
    const count = getCartCount();
    document.querySelectorAll('.cart-count').forEach(b => {
        b.textContent = count;
        b.classList.toggle('visible', count > 0);
    });
}

// ====================================================
// PAGE LOADER
// ====================================================
function initLoader() {
    const loader = document.getElementById('loader');
    if (!loader) return;
    setTimeout(() => { loader.classList.add('hidden'); }, 700);
}

// ====================================================
// NAVBAR
// ====================================================
function initNavbar() {
    const navbar = document.querySelector('.navbar');
    const hamburger = document.querySelector('.hamburger');
    const mobileNav = document.querySelector('.mobile-nav');
    if (navbar) window.addEventListener('scroll', () => navbar.classList.toggle('scrolled', window.scrollY > 10), { passive: true });
    if (hamburger && mobileNav) {
        hamburger.addEventListener('click', () => {
            const open = hamburger.classList.toggle('open');
            mobileNav.classList.toggle('open', open);
            document.body.style.overflow = open ? 'hidden' : '';
        });
        mobileNav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
            hamburger.classList.remove('open');
            mobileNav.classList.remove('open');
            document.body.style.overflow = '';
        }));
    }
    const currentPage = location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-links a, .mobile-nav a').forEach(a => {
        const href = a.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'index.html')) a.classList.add('active');
    });
}

// ====================================================
// SCROLL REVEAL
// ====================================================
function initScrollReveal() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); } });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    document.querySelectorAll('.reveal, .reveal-stagger').forEach(el => observer.observe(el));
}

// ====================================================
// HOMEPAGE — Render Cake Grid (with filters + weight)
// ====================================================
function renderCakes(activeFilters, maxPrice) {
    activeFilters = activeFilters || ['all'];
    maxPrice = maxPrice || 9999;
    const grid = document.getElementById('cakesGrid');
    if (!grid) return;
    let cakes = CAKES;
    if (!activeFilters.includes('all')) {
        cakes = cakes.filter(c => activeFilters.some(f => c.tags && c.tags.includes(f)));
    }
    cakes = cakes.filter(c => c.price <= maxPrice);
    if (cakes.length === 0) {
        grid.innerHTML = '<p class="no-cakes-msg">No cakes match your filters. <button class="btn-reset-filter" onclick="resetFilters()">Clear Filters</button></p>';
        return;
    }
    grid.innerHTML = cakes.map(cake => `
    <article class="cake-card reveal" data-id="${cake.id}" role="listitem">
      <div class="cake-card-img" style="background:linear-gradient(135deg,${cake.color},#F0E6D9);">
        <img src="${cake.imgUrl}" alt="${cake.name}" loading="lazy" class="cake-real-img"
          onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">
        <div class="cake-emoji-display cake-float-anim" style="display:none;">${cake.emoji}</div>
        <div class="cake-badge">${cake.badge}</div>
      </div>
      <div class="cake-card-body">
        <h3 class="cake-card-name">${cake.name}</h3>
        <p class="cake-card-desc">${cake.desc}</p>
        <div class="weight-select-wrap">
          <label class="weight-label">⚖️ Weight</label>
          <select class="weight-select" data-base-price="${cake.price}" onchange="updateCakePrice(this,${cake.id})">
            <option value="0.5kg">0.5 kg — ₹${Math.round(cake.price * 0.6).toLocaleString('en-IN')}</option>
            <option value="1kg" selected>1 kg — ₹${cake.price.toLocaleString('en-IN')}</option>
            <option value="2kg">2 kg — ₹${Math.round(cake.price * 1.9).toLocaleString('en-IN')}</option>
            <option value="3kg">3 kg — ₹${Math.round(cake.price * 2.7).toLocaleString('en-IN')}</option>
          </select>
        </div>
        <div class="cake-card-footer">
          <div class="cake-price" id="pdp-${cake.id}"><sup>₹</sup>${cake.price.toLocaleString('en-IN')}</div>
          <button class="btn-add" onclick="handleAddToCart(${cake.id},this)" aria-label="Add ${cake.name} to cart">Add to Cart</button>
        </div>
      </div>
    </article>`).join('');
    initScrollReveal();
}

function updateCakePrice(select, cakeId) {
    const bp = parseInt(select.dataset.basePrice, 10);
    const np = Math.round(bp * (WEIGHT_MULTIPLIERS[select.value] || 1));
    const el = document.getElementById(`pdp-${cakeId}`);
    if (el) el.innerHTML = `<sup>₹</sup>${np.toLocaleString('en-IN')}`;
}

function handleAddToCart(id, btn) {
    if (sessionStorage.getItem('bwl_admin_open') === 'false') { alert('Orders are temporarily paused. Please check back soon! 🙏'); return; }
    const card = btn.closest('.cake-card');
    const weight = card ? (card.querySelector('.weight-select') || {}).value || '1kg' : '1kg';
    addToCart(id, weight);
    const orig = btn.textContent.trim();
    btn.classList.add('added'); btn.textContent = '✓ Added!'; btn.disabled = true;
    document.querySelectorAll('.cart-btn').forEach(cb => cb.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.25)' }, { transform: 'scale(1)' }], { duration: 350, easing: 'cubic-bezier(0.22,1,0.36,1)' }));
    SmsNotifier.send('ORDER_ITEM_ADDED', { cakeId: id, weight });
    setTimeout(() => { btn.classList.remove('added'); btn.textContent = orig; btn.disabled = false; }, 1600);
}

// ====================================================
// FILTERS
// ====================================================
function initFilters() {
    const filterBar = document.getElementById('filterBar');
    if (!filterBar) return;
    let activeFilters = ['all'];
    let maxPrice = 9999;
    filterBar.querySelectorAll('.filter-pill').forEach(pill => {
        pill.addEventListener('click', () => {
            const f = pill.dataset.filter;
            if (f === 'all') {
                activeFilters = ['all'];
                filterBar.querySelectorAll('.filter-pill').forEach(p => p.classList.remove('active'));
                pill.classList.add('active');
            } else {
                filterBar.querySelector('[data-filter="all"]').classList.remove('active');
                pill.classList.toggle('active');
                const sel = Array.from(filterBar.querySelectorAll('.filter-pill.active')).map(p => p.dataset.filter).filter(v => v !== 'all');
                if (sel.length === 0) { activeFilters = ['all']; filterBar.querySelector('[data-filter="all"]').classList.add('active'); }
                else activeFilters = sel;
            }
            renderCakes(activeFilters, maxPrice);
        });
    });
    const slider = document.getElementById('priceRange');
    const sliderVal = document.getElementById('priceRangeVal');
    if (slider) slider.addEventListener('input', () => {
        maxPrice = parseInt(slider.value, 10);
        if (sliderVal) sliderVal.textContent = `₹${maxPrice}`;
        renderCakes(activeFilters, maxPrice);
    });
}

function resetFilters() {
    const filterBar = document.getElementById('filterBar');
    if (!filterBar) return;
    filterBar.querySelectorAll('.filter-pill').forEach(p => p.classList.remove('active'));
    const allPill = filterBar.querySelector('[data-filter="all"]');
    if (allPill) allPill.classList.add('active');
    const slider = document.getElementById('priceRange');
    if (slider) { slider.value = slider.max; const v = document.getElementById('priceRangeVal'); if (v) v.textContent = `₹${slider.max}`; }
    renderCakes(['all'], 9999);
}

// ====================================================
// CART PAGE
// ====================================================
function renderCartPage() {
    const cartWrap = document.getElementById('cartItems');
    const emptyEl = document.getElementById('cartEmpty');
    const checkoutBtn = document.getElementById('checkoutBtn');
    if (!cartWrap) return;
    const cart = getCart();
    if (cart.length === 0) {
        cartWrap.innerHTML = '';
        if (emptyEl) emptyEl.classList.add('show');
        ['summarySubtotal', 'summaryTotal'].forEach(id => { const el = document.getElementById(id); if (el) el.textContent = '₹0'; });
        if (checkoutBtn) checkoutBtn.style.opacity = '0.5';
        return;
    }
    if (emptyEl) emptyEl.classList.remove('show');
    if (checkoutBtn) checkoutBtn.style.opacity = '1';
    cartWrap.innerHTML = cart.map(item => {
        const key = item.cartKey || String(item.id);
        return `<div class="cart-item" id="cart-item-${key}">
      <div class="cart-item-img">${item.emoji}</div>
      <div class="cart-item-info">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-weight">⚖️ ${item.weight || '1kg'}</div>
        <div class="cart-item-price">₹${item.price.toLocaleString('en-IN')} each</div>
        <div class="qty-ctrl">
          <button class="qty-btn" onclick="changeQty('${key}',-1)" aria-label="Decrease">−</button>
          <span class="qty-val" id="qty-${key}">${item.qty}</span>
          <button class="qty-btn" onclick="changeQty('${key}',1)" aria-label="Increase">+</button>
        </div>
      </div>
      <div class="cart-item-right">
        <div class="cart-item-total" id="total-${key}">₹${(item.price * item.qty).toLocaleString('en-IN')}</div>
        <button class="btn-remove" onclick="handleRemove('${key}')">Remove</button>
      </div>
    </div>`;
    }).join('');
    updateSummary();
}

function changeQty(cartKey, delta) {
    updateQty(cartKey, delta);
    const item = getCart().find(i => (i.cartKey || String(i.id)) === String(cartKey));
    if (item) {
        const q = document.getElementById(`qty-${cartKey}`); if (q) q.textContent = item.qty;
        const t = document.getElementById(`total-${cartKey}`); if (t) t.textContent = `₹${(item.price * item.qty).toLocaleString('en-IN')}`;
    }
    updateSummary();
}

function handleRemove(cartKey) {
    const el = document.getElementById(`cart-item-${cartKey}`);
    if (el) { el.style.transition = 'opacity 0.3s,transform 0.3s'; el.style.opacity = '0'; el.style.transform = 'translateX(20px)'; setTimeout(() => { removeFromCart(cartKey); renderCartPage(); }, 320); }
    else { removeFromCart(cartKey); renderCartPage(); }
}

function updateSummary() {
    const total = getCartTotal();
    const delivery = total >= 1000 ? 0 : 80;
    const s = document.getElementById('summarySubtotal'); if (s) s.textContent = `₹${total.toLocaleString('en-IN')}`;
    const d = document.getElementById('summaryDelivery'); if (d) d.textContent = delivery === 0 ? 'FREE 🎉' : `₹${delivery}`;
    const t = document.getElementById('summaryTotal'); if (t) t.textContent = `₹${(total + delivery).toLocaleString('en-IN')}`;
}

// ====================================================
// WHATSAPP CHECKOUT
// ====================================================
function buildWhatsAppMessage() {
    const cart = getCart();
    if (!cart.length) return null;
    const lines = cart.map(i => `• ${i.name} (${i.weight || '1kg'}) × ${i.qty} = ₹${(i.price * i.qty).toLocaleString('en-IN')}`).join('\n');
    const sub = getCartTotal(), del = sub >= 1000 ? 0 : 80;
    return `Hello BakedWithLove by Muskan! 🎂\n\nI would like to place an order:\n\n${lines}\n\n${del === 0 ? 'Delivery: FREE 🎉' : 'Delivery: ₹' + del}\n*Total: ₹${(sub + del).toLocaleString('en-IN')}*\n\nPlease confirm availability and delivery time.\nThank you! 😊`;
}

function initCheckout() {
    const btn = document.getElementById('checkoutBtn');
    if (!btn) return;
    btn.addEventListener('click', e => {
        e.preventDefault();
        if (sessionStorage.getItem('bwl_admin_open') === 'false') { alert('Orders are temporarily paused! 🙏'); return; }
        const cart = getCart();
        if (!cart.length) { alert('Your cart is empty! Add some cakes first. 🎂'); return; }
        const msg = buildWhatsAppMessage();
        // ✅ Fixed: correct WA number 919861496150
        window.open(`https://wa.me/919861496150?text=${encodeURIComponent(msg)}`, '_blank');
        SmsNotifier.send('ORDER_PLACED', { total: getCartTotal() });
    });
}

// ====================================================
// CONTACT FORM
// ====================================================
function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;
    form.addEventListener('submit', e => {
        e.preventDefault();
        const btn = form.querySelector('.btn-submit');
        const success = document.getElementById('formSuccess');
        btn.classList.add('sending'); btn.textContent = 'Sending…';
        setTimeout(() => {
            btn.classList.remove('sending'); btn.textContent = 'Send Message'; form.reset();
            if (success) { success.style.display = 'block'; setTimeout(() => { success.style.display = 'none'; }, 5000); }
        }, 1400);
    });
}

// ====================================================
// SMOOTH SCROLL
// ====================================================
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(a => a.addEventListener('click', e => {
        const target = document.querySelector(a.getAttribute('href'));
        if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
    }));
}

// ====================================================
// COUNTER ANIMATION
// ====================================================
function animateCounters() {
    document.querySelectorAll('[data-count]').forEach(el => {
        const target = parseInt(el.dataset.count, 10), suffix = el.dataset.suffix || '';
        let cur = 0; const step = Math.ceil(target / 60);
        const timer = setInterval(() => { cur = Math.min(cur + step, target); el.textContent = cur + suffix; if (cur >= target) clearInterval(timer); }, 20);
    });
}

// ====================================================
// HERO PARALLAX
// ====================================================
function initParallax() {
    const hero = document.querySelector('.hero');
    if (!hero) return;
    window.addEventListener('scroll', () => {
        const cakeFloat = hero.querySelector('.cake-float');
        if (cakeFloat) cakeFloat.style.transform = `translateY(calc(-50% + ${window.scrollY * 0.12}px))`;
    }, { passive: true });
}

// ====================================================
// ADMIN AVAILABILITY TOGGLE
// ====================================================
const AdminToggle = {
    _open: true,
    isOpen() { return this._open; },
    async fetchState() {
        try {
            const res = await fetch('/shop-status');
            const data = await res.json();
            if (data.success) {
                this._open = data.open;
                this.applyState();
            }
        } catch (e) { }
    },
    async setOpen(open) {
        try {
            const res = await fetch('/shop-status', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ open })
            });
            const data = await res.json();
            if (data.success) {
                this._open = data.open;
                this.applyState();
            }
        } catch (e) { }
    },
    applyState() {
        const open = this.isOpen();
        let banner = document.getElementById('adminBanner');
        if (!banner) {
            banner = document.createElement('div');
            banner.id = 'adminBanner';
            banner.className = 'admin-banner';
            banner.innerHTML = "⚠️ <strong>Orders Temporarily Paused</strong> — We'll be back very soon!";
            if (document.body) document.body.insertBefore(banner, document.body.firstChild);
        }
        if (banner) banner.style.display = open ? 'none' : 'block';
        const disableVisually = els => els.forEach(el => {
            if (!el) return;
            el.style.opacity = open ? '1' : '0.5';
            // Do not disable pointer events so the alert() can still trigger
        });
        disableVisually([document.getElementById('checkoutBtn'), document.getElementById('payUpiBtn')]);
        disableVisually(Array.from(document.querySelectorAll('.btn-add')));
    }
};

function initAdminToggle() {
    AdminToggle.fetchState();
    setInterval(() => AdminToggle.fetchState(), 30000);

    if (location.search.includes('admin=1')) {
        const btn = document.createElement('button');
        btn.className = 'admin-toggle-btn';
        const upd = () => btn.textContent = AdminToggle.isOpen() ? '🟢 Shop OPEN — Click to PAUSE' : '🔴 PAUSED — Click to OPEN';
        upd();
        btn.addEventListener('click', () => { AdminToggle.setOpen(!AdminToggle.isOpen()); setTimeout(upd, 500); });
        document.body.appendChild(btn);
    }
}

// ====================================================
// SMS NOTIFICATION SIMULATOR (Twilio-ready)
// ====================================================
const SmsNotifier = {
    LOG_KEY: 'bwl_sms_log',
    TEMPLATES: {
        ORDER_ITEM_ADDED: () => `BakedWithLove: Item added to your cart! Complete your order now. 🎂`,
        ORDER_PLACED: d => `BakedWithLove: Your order is placed! Total: ₹${d.total || 0}. We'll confirm via WhatsApp shortly.`,
        PAYMENT_SUCCESS: () => `BakedWithLove: Payment received ✅ Your cake is being prepared with love!`,
        ORDER_SHIPPED: () => `BakedWithLove: 🚀 Your order is on the way! Expected in 2-4 hrs.`,
        ORDER_DELIVERED: () => `BakedWithLove: 🎉 Order delivered! Enjoy your cake. We'd love your feedback!`,
        SHOP_OPENED: () => `BakedWithLove: We're back open! 🎂 Place your order now.`,
        SHOP_CLOSED: () => `BakedWithLove: Orders temporarily paused. We'll be back soon!`,
        BULK_ORDER: () => `BakedWithLove: Bulk order request received! We'll contact you within 24 hrs. 🏢`,
    },
    send(event, data) {
        const tmpl = this.TEMPLATES[event]; if (!tmpl) return;
        const entry = {
            event, message: tmpl(data || {}), data, timestamp: new Date().toISOString(), status: 'SIMULATED'
            /* Twilio integration point:
               twilio.messages.create({ body: entry.message, from: '+1XXXXXXXXXX', to: customerPhone }); */ };
        console.info('%c[SMS Notifier]', 'color:#6B3A2A;font-weight:bold', entry);
        try { const log = JSON.parse(sessionStorage.getItem(this.LOG_KEY) || '[]'); log.push(entry); if (log.length > 50) log.shift(); sessionStorage.setItem(this.LOG_KEY, JSON.stringify(log)); } catch (e) { }
    },
    getLog() { try { return JSON.parse(sessionStorage.getItem(this.LOG_KEY) || '[]'); } catch { return []; } }
};

// ====================================================
// BULK / CORPORATE ORDER MODAL
// ====================================================
function openBulkModal() {
    const m = document.getElementById('bulkModal'); if (m) { m.classList.add('open'); document.body.style.overflow = 'hidden'; }
}
function closeBulkModal() {
    const m = document.getElementById('bulkModal'); if (m) { m.classList.remove('open'); document.body.style.overflow = ''; }
}
function initBulkOrderModal() {
    const modal = document.getElementById('bulkModal'); if (!modal) return;
    modal.addEventListener('click', e => { if (e.target === modal) closeBulkModal(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && modal.classList.contains('open')) closeBulkModal(); });
    const form = document.getElementById('bulkOrderForm');
    if (form) form.addEventListener('submit', e => {
        e.preventDefault();
        const d = Object.fromEntries(new FormData(form));
        const msg = `Hello BakedWithLove by Muskan! 🏢\n\nBulk/Corporate Order Request:\n• Event: ${d.eventName || 'N/A'}\n• Qty: ${d.quantity} cakes\n• Date: ${d.eventDate}\n• Contact: ${d.contactName} — ${d.contactPhone}\n• Notes: ${d.notes || 'None'}\n\nPlease confirm availability. Thank you!`;
        window.open(`https://wa.me/919861496150?text=${encodeURIComponent(msg)}`, '_blank');
        SmsNotifier.send('BULK_ORDER', d); closeBulkModal(); form.reset();
    });
}

// ====================================================
// CUSTOMER FEEDBACK
// ====================================================
const FEEDBACK_KEY = 'bwl_reviews';

function renderFeedback() {
    const container = document.getElementById('userReviewsList'); if (!container) return;
    let reviews = [];
    try { reviews = JSON.parse(sessionStorage.getItem(FEEDBACK_KEY) || '[]'); } catch (e) { }
    if (reviews.length === 0) { container.innerHTML = '<p style="color:var(--text-soft);font-size:0.9rem;text-align:center;">Be the first to leave a review! 🌟</p>'; return; }
    container.innerHTML = reviews.slice(0, 6).map(r => `
    <div class="testi-card">
      <div class="testi-stars">${'★'.repeat(r.rating || 5)}${'☆'.repeat(5 - (r.rating || 5))}</div>
      <p class="testi-text">"${r.text}"</p>
      <div class="testi-author">
        <div class="testi-avatar">👤</div>
        <div class="testi-info"><strong>${r.name}</strong><span>${r.date || ''}</span></div>
      </div>
    </div>`).join('');
}

function initFeedback() {
    renderFeedback();
    const form = document.getElementById('feedbackForm'); if (!form) return;
    const stars = form.querySelectorAll('.star-input');
    stars.forEach((s, i) => s.addEventListener('click', () => { stars.forEach((x, j) => x.classList.toggle('selected', j <= i)); form.dataset.rating = i + 1; }));
    const toggleBtn = document.getElementById('toggleFeedbackBtn');
    const formWrap = document.getElementById('feedbackFormWrap');
    if (toggleBtn && formWrap) toggleBtn.addEventListener('click', () => {
        const open = formWrap.classList.toggle('open');
        toggleBtn.textContent = open ? '✕ Cancel' : '✍️ Write a Review';
    });
    form.addEventListener('submit', e => {
        e.preventDefault();
        const name = form.querySelector('#reviewName').value.trim();
        const text = form.querySelector('#reviewText').value.trim();
        if (!name || !text) { alert('Please fill in your name and review.'); return; }
        const rating = parseInt(form.dataset.rating || 5, 10);
        const review = { name, text, rating, date: new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' }) };
        try { const r = JSON.parse(sessionStorage.getItem(FEEDBACK_KEY) || '[]'); r.unshift(review); sessionStorage.setItem(FEEDBACK_KEY, JSON.stringify(r)); } catch (e) { }
        renderFeedback(); form.reset(); form.dataset.rating = '';
        stars.forEach(s => s.classList.remove('selected'));
        if (formWrap) formWrap.classList.remove('open');
        if (toggleBtn) toggleBtn.textContent = '✍️ Write a Review';
    });
}

// ====================================================
// UPI PAYMENT GATEWAY
// ====================================================
const UPI_ID = 'slnmohan78-1@oksbi';
const UPI_NAME = 'BakedWithLove';
let _qrInstance = null;

function buildUpiUri(amount) { return `upi://pay?pa=${UPI_ID}&pn=${UPI_NAME}&am=${amount.toFixed(2)}&cu=INR`; }

function generateQr(uri) {
    const container = document.getElementById('upiQrContainer'); if (!container) return;
    container.innerHTML = ''; _qrInstance = null;
    if (typeof QRCode === 'undefined') { container.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;flex-direction:column;font-size:13px;color:#6B3A2A;gap:6px;height:100%"><div>QR unavailable</div><div>Use UPI ID tab →</div></div>'; return; }
    try { _qrInstance = new QRCode(container, { text: uri, width: 200, height: 200, colorDark: '#2D1B14', colorLight: '#FFFFFF', correctLevel: QRCode.CorrectLevel.L }); } catch (e) { }
}

function openUpiApp(scheme, uri) { window.location.href = scheme ? uri.replace('upi://', scheme) : uri; }

function openUpiModal() {
    const cart = getCart(); if (!cart.length) { alert('Your cart is empty! Add some cakes first. 🎂'); return; }
    if (sessionStorage.getItem('bwl_admin_open') === 'false') { alert('Orders are temporarily paused! 🙏'); return; }
    const sub = getCartTotal(), del = sub >= 1000 ? 0 : 80, total = sub + del;
    const amtEl = document.getElementById('upiAmountDisplay'); if (amtEl) amtEl.textContent = total.toLocaleString('en-IN');
    const idEl = document.getElementById('upiIdDisplay'); if (idEl) idEl.textContent = UPI_ID;
    const cardAmt = document.getElementById('cardPayAmount'); if (cardAmt) cardAmt.textContent = total.toLocaleString('en-IN');
    const uri = buildUpiUri(total); generateQr(uri);
    const appMap = { appGpay: `tez://upi/pay?pa=${UPI_ID}&pn=${UPI_NAME}&am=${total.toFixed(2)}&cu=INR`, appPhonepe: `phonepe://pay?pa=${UPI_ID}&pn=${UPI_NAME}&am=${total.toFixed(2)}&cu=INR`, appPaytm: `paytmmp://pay?pa=${UPI_ID}&pn=${UPI_NAME}&am=${total.toFixed(2)}&cu=INR`, appBhim: uri, appAmazon: uri, appAny: uri };
    Object.entries(appMap).forEach(([id, u]) => { const btn = document.getElementById(id); if (btn) btn.onclick = () => window.location.href = u; });
    switchUpiTab('qr');
    const overlay = document.getElementById('upiOverlay'); if (overlay) { overlay.style.display = 'flex'; overlay.classList.add('open'); document.body.style.overflow = 'hidden'; }
}

function closeUpiModal() {
    const overlay = document.getElementById('upiOverlay'); if (overlay) { overlay.classList.remove('open'); overlay.style.display = 'none'; document.body.style.overflow = ''; }
    const s = document.getElementById('upiSuccess'); if (s) s.classList.remove('show');
}

function switchUpiTab(panelId) {
    document.querySelectorAll('.upi-tab').forEach(t => {
        const a = t.dataset.panel === panelId;
        t.classList.toggle('active', a);
        t.setAttribute('aria-selected', a ? 'true' : 'false');
    });
    // Handle QR/UPI-ID/Apps panels via .upi-panel classList
    document.querySelectorAll('.upi-panel').forEach(p => {
        const target = 'panel' + panelId.charAt(0).toUpperCase() + panelId.slice(1);
        p.classList.toggle('active', p.id === target);
    });
    // Flip card back to front when leaving card tab
    if (panelId !== 'card') {
        const c = document.getElementById('card3d');
        if (c) c.classList.remove('flipped');
    }
}

// ====================================================
// CARD PAYMENT MODULE
// Luhn validation, network detection, 3D card flip,
// processing animation, transaction ID generation.
// ====================================================
const CardPayment = {
    _paymentMethod: 'Card',
    _txnId: null,
    _last4: null,

    // Luhn algorithm — industry-standard card number checksum
    luhn(num) {
        const digits = num.replace(/\D/g, '');
        let sum = 0, alt = false;
        for (let i = digits.length - 1; i >= 0; i--) {
            let n = parseInt(digits[i], 10);
            if (alt) { n *= 2; if (n > 9) n -= 9; }
            sum += n; alt = !alt;
        }
        return sum % 10 === 0;
    },

    // Detect card network from first digits
    detectNetwork(num) {
        const d = num.replace(/\D/g, '');
        if (/^4/.test(d)) return { name: 'Visa', id: 'netVisa', icon: '💳 VISA' };
        if (/^5[1-5]/.test(d) || /^2[2-7]/.test(d)) return { name: 'Mastercard', id: 'netMC', icon: '🔴⚫ MC' };
        if (/^(6070|6521|6522)/.test(d)) return { name: 'RuPay', id: 'netRuPay', icon: '🇮🇳 RuPay' };
        if (/^3[47]/.test(d)) return { name: 'Amex', id: 'netAmex', icon: '💠 Amex' };
        return null;
    },

    // Format card number with spaces every 4 digits
    formatCardNum(raw) {
        return raw.replace(/\D/g, '').slice(0, 16).replace(/(\d{4})/g, '$1 ').trim();
    },

    // Generate a fake transaction ID
    generateTxnId(method) {
        const d = new Date();
        const stamp = `${d.getFullYear()}${String(d.getMonth()+1).padStart(2,'0')}${String(d.getDate()).padStart(2,'0')}`;
        const rand = Math.random().toString(36).substring(2, 8).toUpperCase();
        return `TXN${stamp}${method.toUpperCase().slice(0,3)}${rand}`;
    },

    // Show/hide the processing overlay with staged messages
    showProcessing() {
        return new Promise(resolve => {
            const overlay = document.getElementById('payProcessingOverlay');
            const title = document.getElementById('payProcTitle');
            const bar = document.getElementById('payProcBar');
            if (!overlay) { resolve(); return; }
            overlay.style.display = 'flex';
            document.body.style.overflow = 'hidden';

            const stages = [
                { text: 'Connecting to bank...', pct: 30, delay: 0 },
                { text: 'Verifying payment details...', pct: 65, delay: 900 },
                { text: 'Confirming your order...', pct: 90, delay: 1800 },
                { text: 'Payment successful! ✅', pct: 100, delay: 2500 },
            ];
            stages.forEach(s => {
                setTimeout(() => {
                    if (title) title.textContent = s.text;
                    if (bar) bar.style.width = s.pct + '%';
                }, s.delay);
            });
            setTimeout(() => {
                overlay.style.display = 'none';
                document.body.style.overflow = '';
                resolve();
            }, 3200);
        });
    },

    // Validate all card fields; return true if valid
    validate() {
        let ok = true;
        const numRaw = (document.getElementById('cardNumber')?.value || '').replace(/\D/g, '');
        const name = (document.getElementById('cardHolder')?.value || '').trim();
        const expiry = (document.getElementById('cardExpiry')?.value || '').trim();
        const cvv = (document.getElementById('cardCvv')?.value || '').trim();

        // Card number
        const errNum = document.getElementById('errCardNum');
        const numInput = document.getElementById('cardNumber');
        if (numRaw.length < 13 || !this.luhn(numRaw)) {
            if (errNum) errNum.classList.add('show');
            if (numInput) numInput.classList.add('input-error');
            ok = false;
        } else {
            if (errNum) errNum.classList.remove('show');
            if (numInput) numInput.classList.remove('input-error');
        }

        // Name
        const errName = document.getElementById('errCardName');
        const nameInput = document.getElementById('cardHolder');
        if (!name) {
            if (errName) errName.classList.add('show');
            if (nameInput) nameInput.classList.add('input-error');
            ok = false;
        } else {
            if (errName) errName.classList.remove('show');
            if (nameInput) nameInput.classList.remove('input-error');
        }

        // Expiry
        const errExp = document.getElementById('errCardExp');
        const expInput = document.getElementById('cardExpiry');
        const expMatch = expiry.match(/^(0[1-9]|1[0-2])\/?(\d{2})$/);
        let expValid = false;
        if (expMatch) {
            const now = new Date();
            const expDate = new Date(2000 + parseInt(expMatch[2], 10), parseInt(expMatch[1], 10) - 1);
            expValid = expDate > now;
        }
        if (!expValid) {
            if (errExp) errExp.classList.add('show');
            if (expInput) expInput.classList.add('input-error');
            ok = false;
        } else {
            if (errExp) errExp.classList.remove('show');
            if (expInput) expInput.classList.remove('input-error');
        }

        // CVV
        const errCvv = document.getElementById('errCardCvv');
        const cvvInput = document.getElementById('cardCvv');
        if (!/^\d{3,4}$/.test(cvv)) {
            if (errCvv) errCvv.classList.add('show');
            if (cvvInput) cvvInput.classList.add('input-error');
            ok = false;
        } else {
            if (errCvv) errCvv.classList.remove('show');
            if (cvvInput) cvvInput.classList.remove('input-error');
        }

        return ok;
    },

    async submit() {
        if (!this.validate()) return;
        const numRaw = (document.getElementById('cardNumber')?.value || '').replace(/\D/g, '');
        this._last4 = numRaw.slice(-4);
        const net = this.detectNetwork(numRaw);
        this._paymentMethod = net ? `Card (${net.name} ****${this._last4})` : `Card (****${this._last4})`;
        this._txnId = this.generateTxnId('CARD');

        // Close UPI modal while processing
        const upiOverlay = document.getElementById('upiOverlay');
        if (upiOverlay) { upiOverlay.style.display = 'none'; }

        await this.showProcessing();
        await showPaymentSuccess('CARD', this._txnId, this._paymentMethod);
    },

    init() {
        const btn = document.getElementById('btnPayCard');
        if (btn) btn.addEventListener('click', () => CardPayment.submit());

        // Live card number formatting + network detection
        const numInput = document.getElementById('cardNumber');
        if (numInput) {
            numInput.addEventListener('input', () => {
                const formatted = CardPayment.formatCardNum(numInput.value);
                numInput.value = formatted;
                // Update card display
                const display = document.getElementById('cardNumDisplay');
                const digits = formatted.replace(/\D/g, '');
                const masked = (formatted + '•••• •••• •••• ••••').slice(0, 19);
                if (display) display.textContent = digits.length ? formatted.padEnd(19, '•').replace(/(.{4})/g,'$1 ').trim().replace(/[0-9]/g, (ch, i) => digits[Math.floor(i*4/5)] || ch) : '•••• •••• •••• ••••';
                // Simpler: just show what's typed + bullets
                let shown = '';
                for (let i = 0; i < 19; i++) {
                    if (i && i % 5 === 4) { shown += ' '; continue; }
                    const charIdx = i - Math.floor(i / 5);
                    shown += formatted[i] || '•';
                }
                if (display) display.textContent = formatted || '•••• •••• •••• ••••';

                // Network detection
                const net = CardPayment.detectNetwork(formatted);
                document.querySelectorAll('.net-badge').forEach(b => b.classList.remove('active-net'));
                const logo = document.getElementById('cardNetworkLogo');
                if (net) {
                    const badge = document.getElementById(net.id);
                    if (badge) badge.classList.add('active-net');
                    if (logo) logo.textContent = net.id === 'netVisa' ? 'VISA' : net.id === 'netMC' ? '🔴' : net.id === 'netRuPay' ? '🇮🇳' : '💠';
                } else {
                    if (logo) logo.textContent = '💳';
                }
            });
        }

        // Cardholder name live update
        const nameInput = document.getElementById('cardHolder');
        if (nameInput) {
            nameInput.addEventListener('input', () => {
                const display = document.getElementById('cardHolderDisplay');
                if (display) display.textContent = nameInput.value.toUpperCase() || 'FULL NAME';
            });
        }

        // Expiry live update + auto-slash
        const expInput = document.getElementById('cardExpiry');
        if (expInput) {
            expInput.addEventListener('input', () => {
                let v = expInput.value.replace(/\D/g, '');
                if (v.length >= 3) v = v.slice(0,2) + '/' + v.slice(2,4);
                expInput.value = v;
                const display = document.getElementById('cardExpiryDisplay');
                if (display) display.textContent = expInput.value || 'MM/YY';
            });
        }

        // CVV focus → flip card; blur → flip back
        const cvvInput = document.getElementById('cardCvv');
        if (cvvInput) {
            cvvInput.addEventListener('focus', () => {
                const c = document.getElementById('card3d'); if (c) c.classList.add('flipped');
            });
            cvvInput.addEventListener('blur', () => {
                const c = document.getElementById('card3d'); if (c) c.classList.remove('flipped');
            });
            cvvInput.addEventListener('input', () => {
                const display = document.getElementById('cardCvvDisplay');
                if (display) display.textContent = cvvInput.value || '•••';
            });
        }
    },
};


// showPaymentSuccess is defined later in the file (below OrderManager)
// with customerInfo support. Do NOT define it here.


function initUpiPayment() {
    // NOTE: payUpiBtn is handled by onclick="CustomerForm.open()" in HTML.
    // Do NOT add an event listener here — it would open QR before customer details form.
    const closeBtn = document.getElementById('upiCloseBtn'); if (closeBtn) closeBtn.addEventListener('click', closeUpiModal);
    const overlay = document.getElementById('upiOverlay');
    if (overlay) { overlay.addEventListener('click', e => { if (e.target === overlay) closeUpiModal(); }); }
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && overlay && overlay.classList.contains('open')) closeUpiModal(); });
    document.querySelectorAll('.upi-tab').forEach(tab => tab.addEventListener('click', () => switchUpiTab(tab.dataset.panel)));
    const copyBtn = document.getElementById('btnCopyUpiId');
    if (copyBtn) copyBtn.addEventListener('click', async () => {
        try { await navigator.clipboard.writeText(UPI_ID); } catch { const tmp = document.createElement('input'); tmp.value = UPI_ID; document.body.appendChild(tmp); tmp.select(); document.execCommand('copy'); document.body.removeChild(tmp); }
        copyBtn.textContent = '✅ Copied!'; copyBtn.classList.add('copied');
        setTimeout(() => { copyBtn.textContent = '📋 Copy'; copyBtn.classList.remove('copied'); }, 2200);
    });
    CardPayment.init();
    // btnDone onclick fires showPaymentSuccess → then OrderManager.redirectToWhatsApp.
    // Do NOT add a listener here that overrides it.
    ['btnPaidQr', 'btnPaidId', 'btnPaidApp'].forEach(id => { const btn = document.getElementById(id); if (btn) btn.addEventListener('click', showPaymentSuccess); });
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
    initAdminToggle();

    renderCakes();
    initFilters();
    renderCartPage();
    initCheckout();
    initUpiPayment();
    initContactForm();
    animateCounters();
    initBulkOrderModal();
    initFeedback();
    ThemeToggle.init();

    // Show mobile cart btn
    const mobileBtn = document.getElementById('mobileCartBtn');
    if (mobileBtn) mobileBtn.style.display = 'flex';

    // Init order flow (shows pending order banner if returning to cart)
    OrderManager.initCartPage();
});

// ====================================================
// CUSTOMER DETAILS FORM MODULE
// Controls the pre-checkout customer info modal.
// ====================================================
const CustomerForm = {
    open() {
        const cart = getCart();
        if (!cart.length) { alert('Your cart is empty! Add some cakes first. 🎂'); return; }
        if (sessionStorage.getItem('bwl_admin_open') === 'false') { alert('Orders are temporarily paused. Please check back soon! 🙏'); return; }
        const overlay = document.getElementById('custOverlay');
        if (overlay) { overlay.style.display = 'flex'; document.body.style.overflow = 'hidden'; }
    },

    close() {
        const overlay = document.getElementById('custOverlay');
        if (overlay) { overlay.style.display = 'none'; document.body.style.overflow = ''; }
    },

    toggleRecipient(show) {
        const f = document.getElementById('recipientFields');
        if (f) f.style.display = show ? 'block' : 'none';
        // Make recipient name required when visible
        const rName = document.getElementById('custRecipientName');
        if (rName) rName.required = show;
    },

    submit(e) {
        e.preventDefault();
        const name = document.getElementById('custName')?.value.trim();
        const phone = document.getElementById('custPhone')?.value.trim();
        const address = document.getElementById('custAddress')?.value.trim();
        const occasion = document.getElementById('custOccasion')?.value;
        const forRecipient = document.getElementById('custForRecipient')?.checked;
        const recipientName = document.getElementById('custRecipientName')?.value.trim();
        const recipientPhone = document.getElementById('custRecipientPhone')?.value.trim();
        const giftMessage = document.getElementById('custGiftMsg')?.value.trim();

        // Basic validation
        if (!name) { alert('Please enter your name.'); document.getElementById('custName')?.focus(); return; }
        if (!phone || phone.replace(/\D/g, '').length < 10) { alert('Please enter a valid 10-digit phone number.'); document.getElementById('custPhone')?.focus(); return; }
        if (!address) { alert('Please enter your delivery address.'); document.getElementById('custAddress')?.focus(); return; }
        if (forRecipient && !recipientName) { alert("Please enter the recipient's name."); document.getElementById('custRecipientName')?.focus(); return; }

        // Save globally for showPaymentSuccess to pick up
        window.bwlCustomerInfo = { name, phone, address, occasion, forRecipient, recipientName, recipientPhone, giftMessage };

        // Close customer form
        this.close();

        // Open UPI modal
        openUpiModal();
    },
};


// ====================================================
// ORDER MANAGER (REST API Connected)
// ====================================================
const OrderManager = {
    WA_NUMBER: '919861496150',

    generateOrderId() {
        const d = new Date();
        const date = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`;
        const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
        return `BWL-${date}-${rand}`;
    },

    async placeOrder(cart, total, customerInfo, txnId, paymentMethod) {
        const orderId = this.generateOrderId();
        const itemsStr = cart.map(i => `${i.qty}x ${i.name} (${i.weight || '1kg'})`).join(', ');

        const payload = {
            customer_name: customerInfo.name || 'Unknown',
            phone: customerInfo.phone || 'Unknown',
            cake_name: itemsStr,
            quantity: cart.reduce((sum, i) => sum + i.qty, 0),
            total_price: total,
            address: customerInfo.address || 'N/A',
            transaction_id: txnId || null,
            payment_method: paymentMethod || 'WhatsApp'
        };

        try {
            const res = await fetch('/place-order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const data = await res.json();
            if (!data.success) throw new Error(data.message);

            const dbOrderId = data.order_id;

            const order = {
                orderId: dbOrderId,
                displayId: orderId,
                items: cart.map(i => ({ id: i.id, name: i.name, weight: i.weight || '1kg', qty: i.qty, price: i.price })),
                total,
                customerInfo: customerInfo || {},
                status: 'Pending Payment Verification',
                createdAt: new Date().toISOString(),
            };
            SmsNotifier.send('ORDER_PLACED', { total, orderId: dbOrderId });
            return order;
        } catch (e) {
            alert('Failed to place order: ' + e.message);
            return null;
        }
    },

    buildVerifyMessage(order) {
        const itemsList = order.items.map(i =>
            `• ${i.name} (${i.weight}) ×${i.qty} = ₹${(i.price * i.qty).toLocaleString('en-IN')}`
        ).join('\n');
        const c = order.customerInfo || {};
        let msg = 'Hello BakedWithLove by Muskan! 🎂\n\n';
        msg += 'New Order — Payment Confirmation\n';
        msg += '─'.repeat(28) + '\n\n';
        if (c.name) msg += `Customer: ${c.name}\n`;
        if (c.phone) msg += `Phone: ${c.phone}\n`;
        if (c.address) msg += `Address: ${c.address}\n`;
        if (c.occasion) msg += `Occasion: ${c.occasion}\n`;
        if (c.forRecipient && c.recipientName) {
            msg += `\nRecipient: ${c.recipientName}`;
            if (c.recipientPhone) msg += ` (${c.recipientPhone})`;
            msg += '\n';
            if (c.giftMessage) msg += `Gift Note: "${c.giftMessage}"\n`;
        }
        msg += `\nOrder ID: ${order.orderId}\n`;
        msg += `Items:\n${itemsList}\n`;
        msg += `\nTotal: ₹${order.total.toLocaleString('en-IN')}\n`;
        msg += '\nPayment: ✅ Completed\n';
        msg += '\nPlease verify and confirm. Thank you! 🙏';
        return msg;
    },

    redirectToWhatsApp(order) {
        try {
            const msg = this.buildVerifyMessage(order);
            const url = `https://wa.me/${this.WA_NUMBER}?text=${encodeURIComponent(msg)}`;
            // Safe redirect for mobile devices
            window.location.href = url;
        } catch (e) {
            console.error(e);
            alert("Could not redirect. Please message us on WhatsApp with your Order ID!");
        }
    },

    initCartPage() { }
};

// ── Hook into checkout: after UPI payment success show the order flow ──
const _origShowPaymentSuccess = typeof showPaymentSuccess !== 'undefined' ? showPaymentSuccess : null;

async function showPaymentSuccess(method, txnId, paymentMethod) {
    method = method || 'UPI';
    const cart = getCart();
    const sub = getCartTotal(), del = sub >= 1000 ? 0 : 80, total = sub + del;

    const btns = document.querySelectorAll('.upi-tab-btn, #btnDone');
    btns.forEach(b => { if (b) b.disabled = true; });

    const amtEl = document.getElementById('upiAmountDisplay');
    if (amtEl) amtEl.textContent = 'Processing...';

    const order = await OrderManager.placeOrder(cart, total, window.bwlCustomerInfo || {}, txnId, paymentMethod);
    if (!order) {
        btns.forEach(b => { if (b) b.disabled = false; });
        if (amtEl) amtEl.textContent = total.toLocaleString('en-IN');
        return;
    }

    // Show the UPI modal success panel (works for both UPI & Card)
    const upiOverlay = document.getElementById('upiOverlay');
    if (upiOverlay) { upiOverlay.style.display = 'flex'; upiOverlay.classList.add('open'); document.body.style.overflow = 'hidden'; }

    document.querySelector('.upi-tabs') && (document.querySelector('.upi-tabs').style.display = 'none');
    document.querySelectorAll('.upi-panel').forEach(p => p.style.display = 'none');
    const upiSuccess = document.getElementById('upiSuccess');
    if (upiSuccess) {
        upiSuccess.style.display = 'block';
        upiSuccess.classList.add('show');
    }

    const lines = cart.map(i => `• ${i.name} (${i.weight || '1kg'}) × ${i.qty} = ₹${(i.price * i.qty).toLocaleString('en-IN')}`).join('<br>');
    const txnLine = txnId ? `<br><span style="font-family:monospace;font-size:0.8rem;background:#f0fdf4;border:1px solid #bbf7d0;padding:4px 10px;border-radius:6px;color:#166534;display:inline-block;margin-top:6px;">Txn ID: ${txnId}</span>` : '';
    const methodLine = paymentMethod ? `<br><em style="font-size:0.82rem;color:#9B7B6E;">Payment via: ${paymentMethod}</em>` : '';
    const orderEl = document.getElementById('upiSuccessOrder');
    if (orderEl) orderEl.innerHTML = `${lines}<br>${del === 0 ? 'Delivery: <strong>FREE 🎉</strong>' : 'Delivery: <strong>₹' + del + '</strong>'}<br><strong>Total: ₹${total.toLocaleString('en-IN')}</strong>${txnLine}${methodLine}<br><em style="font-size:0.85rem;color:#9B7B6E;">Order ID: ${order.orderId}</em>`;

    const doneBtn = document.getElementById('btnDone');
    if (doneBtn) {
        doneBtn.disabled = false;
        doneBtn.onclick = () => {
            const overlay = document.getElementById('upiOverlay');
            if (overlay) { overlay.classList.remove('open'); overlay.style.display = 'none'; }
            document.body.style.overflow = '';
            OrderManager.redirectToWhatsApp(order);
        };
    }

    sessionStorage.removeItem(CART_KEY);
    updateCartBadge();
    SmsNotifier.send('PAYMENT_SUCCESS', { orderId: order.orderId });

    const s = document.getElementById('upiSuccess');
    if (s) s.classList.add('show');
}


// ====================================================
// THEME TOGGLE — Light / Dark Mode
// Stores preference in sessionStorage.
// Defaults to system preference (prefers-color-scheme).
// Applies via [data-theme="dark"] on <html>.
// Smooth transition via CSS variables.
// ====================================================
const ThemeToggle = {
    STORAGE_KEY: 'bwl_theme',

    init() {
        // Determine initial theme
        const saved = sessionStorage.getItem(this.STORAGE_KEY);
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const isDark = saved ? saved === 'dark' : prefersDark;
        this.apply(isDark);
        this.injectToggle(isDark);
        this.listenSystemChange();
    },

    apply(isDark) {
        document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
        sessionStorage.setItem(this.STORAGE_KEY, isDark ? 'dark' : 'light');
    },

    toggle() {
        const current = document.documentElement.getAttribute('data-theme');
        this.apply(current !== 'dark');
        // Sync any extra toggle buttons
        document.querySelectorAll('.theme-toggle-wrap').forEach(wrap => {
            const input = wrap.querySelector('input[type="checkbox"]');
            if (input) input.checked = (current !== 'dark');
        });
    },

    injectToggle(isDark) {
        const html = `
        <div class="theme-toggle-wrap" title="Toggle dark / light mode" aria-label="Toggle dark mode">
          <label class="theme-switch">
            <input type="checkbox" id="themeToggleInput" ${isDark ? 'checked' : ''} aria-label="Dark mode toggle">
            <span class="theme-slider">
              <span class="theme-icon theme-icon-light">☀️</span>
              <span class="theme-icon theme-icon-dark">🌙</span>
            </span>
          </label>
        </div>`;

        // Inject before hamburger in every navbar on the page
        document.querySelectorAll('.navbar > div').forEach(container => {
            if (container.querySelector('.theme-toggle-wrap')) return;
            container.insertAdjacentHTML('afterbegin', html);
        });

        // Wire up all toggle inputs
        document.querySelectorAll('#themeToggleInput').forEach(input => {
            input.addEventListener('change', () => ThemeToggle.toggle());
        });
    },

    listenSystemChange() {
        // If no saved preference, follow OS changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
            if (!sessionStorage.getItem(this.STORAGE_KEY)) {
                this.apply(e.matches);
            }
        });
    },
};
