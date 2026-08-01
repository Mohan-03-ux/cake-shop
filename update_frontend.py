import re
import codecs

# --- UPDATE SCRIPT.JS ---
with codecs.open('static/script.js', 'r', 'utf-8') as f:
    js = f.read()

new_om = '''// ====================================================
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

    async placeOrder(cart, total, customerInfo) {
        const orderId = this.generateOrderId();
        const itemsStr = cart.map(i => `${i.qty}x ${i.name} (${i.weight || '1kg'})`).join(', ');
        
        const payload = {
            customer_name: customerInfo.name || 'Unknown',
            phone: customerInfo.phone || 'Unknown',
            cake_name: itemsStr,
            quantity: cart.reduce((sum, i) => sum + i.qty, 0),
            total_price: total
        };

        try {
            const res = await fetch('/place-order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const data = await res.json();
            if(!data.success) throw new Error(data.message);
            
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
        ).join('\\n');
        const c = order.customerInfo || {};
        let msg = 'Hello BakedWithLove by Muskan! 🎂\\n\\n';
        msg += 'New Order — Payment Confirmation\\n';
        msg += '─'.repeat(28) + '\\n\\n';
        if (c.name) msg += `Customer: ${c.name}\\n`;
        if (c.phone) msg += `Phone: ${c.phone}\\n`;
        if (c.address) msg += `Address: ${c.address}\\n`;
        if (c.occasion) msg += `Occasion: ${c.occasion}\\n`;
        if (c.forRecipient && c.recipientName) {
            msg += `\\nRecipient: ${c.recipientName}`;
            if (c.recipientPhone) msg += ` (${c.recipientPhone})`;
            msg += '\\n';
            if (c.giftMessage) msg += `Gift Note: "${c.giftMessage}"\\n`;
        }
        msg += `\\nOrder ID: ${order.orderId}\\n`;
        msg += `Items:\\n${itemsList}\\n`;
        msg += `\\nTotal: ₹${order.total.toLocaleString('en-IN')}\\n`;
        msg += '\\nPayment: ✅ Completed\\n';
        msg += '\\nPlease verify and confirm. Thank you! 🙏';
        return msg;
    },

    redirectToWhatsApp(order) {
        const msg = this.buildVerifyMessage(order);
        const url = `https://wa.me/${this.WA_NUMBER}?text=${encodeURIComponent(msg)}`;
        const w = window.open(url, '_blank');
        if (!w) { window.location.href = url; }
    },

    showOrderConfirmation(order) {
        const cartSection = document.querySelector('.cart-section');
        if (!cartSection) return;

        sessionStorage.removeItem(CART_KEY);
        updateCartBadge();
        cartSection.style.display = 'none';

        const panel = document.createElement('div');
        panel.id = 'orderConfirmPanel';
        panel.className = 'order-confirm-panel';
        const itemsHtml = order.items.map(i =>
            `<div class="oc-item"><span>${i.name} (${i.weight}) ×${i.qty}</span><span>₹${(i.price * i.qty).toLocaleString('en-IN')}</span></div>`
        ).join('');
        
        panel.innerHTML = `
          <div class="oc-icon">🎂</div>
          <h2 class="oc-title">Order Placed Successfully!</h2>
          <p class="oc-sub">Your order has been received. Please verify it via WhatsApp to confirm.</p>
          <div class="oc-card">
            <div class="oc-order-id">Order ID: <strong>${order.orderId}</strong></div>
            <div class="oc-items">${itemsHtml}</div>
            <div class="oc-total">Total: <strong>₹${order.total.toLocaleString('en-IN')}</strong></div>
          </div>
          <button class="btn-wa-verify" onclick="OrderManager.redirectToWhatsApp(${JSON.stringify(JSON.stringify(order)).replace(/"/g, '&quot;')})">
            Verify Payment on WhatsApp
          </button>
          <a href="/" class="oc-continue">← Continue Shopping</a>
        `;
        cartSection.parentNode.insertBefore(panel, cartSection.nextSibling);
    },

    initCartPage() { }
};

async function showPaymentSuccess() {
    const cart = getCart();
    const sub = getCartTotal(), del = sub >= 1000 ? 0 : 80, total = sub + del;
    
    const btns = document.querySelectorAll('.upi-tab-btn, #btnDone');
    btns.forEach(b => { if(b) b.disabled = true; });

    document.getElementById('upiAmountDisplay').textContent = "Processing...";

    const order = await OrderManager.placeOrder(cart, total, window.bwlCustomerInfo || {});
    if(!order) {
        btns.forEach(b => { if(b) b.disabled = false; });
        document.getElementById('upiAmountDisplay').textContent = total.toLocaleString('en-IN');
        return;
    }

    document.querySelector('.upi-tabs') && (document.querySelector('.upi-tabs').style.display = 'none');
    document.querySelectorAll('.upi-panel').forEach(p => p.style.display = 'none');
    
    const lines = cart.map(i => `• ${i.name} (${i.weight || '1kg'}) × ${i.qty} = ₹${(i.price * i.qty).toLocaleString('en-IN')}`).join('<br>');
    const orderEl = document.getElementById('upiSuccessOrder');
    if (orderEl) orderEl.innerHTML = `${lines}<br>${del === 0 ? 'Delivery: <strong>FREE 🎉</strong>' : 'Delivery: <strong>₹' + del + '</strong>'}<br><strong>Total: ₹${total.toLocaleString('en-IN')}</strong><br><em style="font-size:0.85rem;color:#9B7B6E;">Order ID: ${order.orderId}</em>`;

    const doneBtn = document.getElementById('btnDone');
    if (doneBtn) {
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
'''
js = re.sub(r'// ====================================================\n// ORDER MANAGER — WhatsApp Payment Confirmation Flow(.*?)// THEME TOGGLE', new_om + '\n// ====================================================\n// THEME TOGGLE', js, flags=re.DOTALL)

with codecs.open('static/script.js', 'w', 'utf-8') as f:
    f.write(js)

# --- UPDATE ADMIN.HTML ---
with codecs.open('templates/admin.html', 'r', 'utf-8') as f:
    admin_html = f.read()

new_admin_js = """<script>
        'use strict';

        const WA_NUMBER = '919861496150';
        let currentFilter = 'all';

        function showToast(msg, duration = 4000) {
            const t = document.getElementById('confirmToast');
            t.textContent = msg; t.classList.add('show');
            setTimeout(() => t.classList.remove('show'), duration);
        }

        async function checkSession() {
            try {
                const res = await fetch('/check-session');
                if (res.ok) {
                    document.getElementById('adminLogin').style.display = 'none';
                    document.getElementById('adminDashboard').style.display = 'block';
                    document.getElementById('adminEmailDisplay').textContent = 'Admin';
                    renderDashboard();
                } else {
                    document.getElementById('adminLogin').style.display = 'flex';
                }
            } catch (e) {
                document.getElementById('adminLogin').style.display = 'flex';
            }
        }
        
        document.addEventListener('DOMContentLoaded', checkSession);

        document.getElementById('loginForm').addEventListener('submit', async function (e) {
            e.preventDefault();
            const username = document.getElementById('adminEmail').value;
            const password = document.getElementById('adminPassword').value;
            const errEl = document.getElementById('loginError');
            
            try {
                const res = await fetch('/admin-login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, password })
                });
                const data = await res.json();
                if (data.success) {
                    errEl.classList.remove('show');
                    document.getElementById('adminLogin').style.display = 'none';
                    document.getElementById('adminDashboard').style.display = 'block';
                    document.getElementById('adminEmailDisplay').textContent = username;
                    renderDashboard();
                } else {
                    errEl.classList.add('show');
                    document.getElementById('adminPassword').value = '';
                }
            } catch(e) { errEl.classList.add('show'); }
        });

        async function logout() {
            await fetch('/admin-logout', { method: 'POST' });
            document.getElementById('adminDashboard').style.display = 'none';
            document.getElementById('adminLogin').style.display = 'flex';
            document.getElementById('ordersBody').innerHTML = '';
        }

        document.getElementById('logoutBtn').addEventListener('click', logout);

        document.getElementById('adminFilterTabs').addEventListener('click', e => {
            const btn = e.target.closest('.filter-tab'); if (!btn) return;
            document.querySelectorAll('.filter-tab').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.dataset.status;
            renderOrders();
        });

        function statusBadge(status) {
            const map = {
                'Pending Payment Verification': 'status-pending',
                'Payment Confirmed': 'status-confirmed',
                'Preparing': 'status-preparing',
            };
            const cls = map[status] || 'status-pending';
            const icons = { 'Pending Payment Verification': '⏳', 'Payment Confirmed': '✅', 'Preparing': '🍰' };
            return `<span class="status-badge ${cls}">${icons[status] || ''} ${status}</span>`;
        }

        async function fetchOrders() {
            try {
                const res = await fetch('/get-orders');
                const data = await res.json();
                if(data.success) return data.orders;
            } catch(e) { }
            return [];
        }

        async function verifyPayment(orderId) {
            try {
                await fetch(`/verify-payment/${orderId}`, { method: 'PUT' });
                showToast(`✅ Payment verified for id ${orderId}!`);
                renderDashboard();
            } catch(e) { alert("Failed to verify"); }
        }

        async function deleteOrder(orderId) {
            if (!confirm(`Are you sure you want to completely DELETE order ${orderId}?`)) return;
            await fetch(`/delete-order/${orderId}`, { method: 'DELETE' });
            showToast(`🗑️ Order ${orderId} has been deleted.`);
            renderDashboard();
        }

        function renderStats(orders) {
            document.getElementById('statTotal').textContent = orders.length;
            const pending = orders.filter(o => o.payment_status.toLowerCase() === 'pending').length;
            const confirmed = orders.filter(o => o.payment_status.toLowerCase() !== 'pending').length;
            const revenue = orders.filter(o => o.payment_status.toLowerCase() !== 'pending').reduce((s, o) => s + (o.total_price || 0), 0);
            document.getElementById('statPending').textContent = pending;
            document.getElementById('statConfirmed').textContent = confirmed;
            document.getElementById('statRevenue').textContent = `₹${revenue.toLocaleString('en-IN')}`;
        }

        async function renderOrders() {
            const orders = await fetchOrders();
            renderStats(orders);
            
            const filtered = currentFilter === 'all' ? orders : orders.filter(o => {
                const p = o.payment_status.toLowerCase();
                if(currentFilter === 'Pending Payment Verification' && p === 'pending') return true;
                if(currentFilter === 'Payment Confirmed' && p !== 'pending') return true;
                return false; 
            });
            const tbody = document.getElementById('ordersBody');
            const noOrders = document.getElementById('noOrders');

            if (filtered.length === 0) {
                tbody.innerHTML = '';
                noOrders.style.display = 'block';
                return;
            }
            noOrders.style.display = 'none';

            const date = d => d ? new Date(d).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—';

            tbody.innerHTML = filtered.map(o => {
                const waVerifyUrl = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(`Hello,\\nOrder ID: ${o.id}\\nI have completed the payment. Please verify.\\nTotal: ₹${o.total_price}`)}`;
                const actions = [];
                const isPending = o.payment_status.toLowerCase() === 'pending';
                
                if (isPending) actions.push(`<button class="btn-verify" onclick="verifyPayment(${o.id})">✅ Verify Payment</button>`);
                
                actions.push(`<button class="btn-update-status" onclick="viewOrderDetails(${o.id}, '${o.customer_name}', '${o.phone}', '${o.cake_name}')">👁️ View Details</button>`);
                actions.push(`<button class="btn-update-status" style="color:#c0392b; border-color:rgba(192,57,43,0.3)" onclick="deleteOrder(${o.id})">🗑️ Delete</button>`);

                let displayStatus = isPending ? 'Pending Payment Verification' : 'Payment Confirmed';
                if(o.order_status === 'Processing') displayStatus = 'Preparing';

                return `<tr>
          <td class="order-id-cell">${o.id}</td>
          <td style="font-size:0.8rem;color:var(--text-soft);">${date(o.created_at)}</td>
          <td>${o.quantity}x items</td>
          <td style="font-weight:700;color:var(--choco);">₹${(o.total_price || 0).toLocaleString('en-IN')}</td>
          <td>${statusBadge(displayStatus)}</td>
          <td><a href="${waVerifyUrl}" target="_blank" class="wa-link">📱 View</a></td>
          <td style="display:flex;gap:8px;flex-wrap:wrap;">${actions.join('')}</td>
        </tr>`;
            }).join('');
        }

        function viewOrderDetails(id, name, phone, items) {
            const html = `
                <div style="margin-bottom:8px;"><strong>Order ID:</strong> ${id}</div>
                <div style="margin-bottom:8px;"><strong>Name:</strong> ${name || 'N/A'}</div>
                <div style="margin-bottom:8px;"><strong>Phone:</strong> ${phone || 'N/A'}</div>
                <div style="margin-bottom:8px;"><strong>Items:</strong> ${items || 'None'}</div>
            `;
            document.getElementById('orderDetailsBody').innerHTML = html;
            document.getElementById('orderDetailsOverlay').style.display = 'flex';
        }

        async function renderDashboard() { await renderOrders(); }
        setInterval(() => { checkSession(); }, 30000);
    </script>"""

admin_html = re.sub(r'<script>\s*\'use strict\';\s*// ══════════════════════════════════\s*// CREDENTIALS(.*?)</script>', new_admin_js, admin_html, flags=re.DOTALL)

with codecs.open('templates/admin.html', 'w', 'utf-8') as f:
    f.write(admin_html)

print("Replacement successful.")
