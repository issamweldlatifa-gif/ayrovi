/**
 * QATAFO Cart & Checkout Client Controller
 */

class QatafoCartApp {
  constructor() {
    this.sessionId = this.getOrInitSessionId();
    this.items = [];

    this.initDom();
    this.loadCart();
  }

  getOrInitSessionId() {
    try {
      let stored = localStorage.getItem('qatafo_user_session_id');
      if (!stored) {
        stored = 'qtf_' + Math.random().toString(36).substring(2, 12);
        localStorage.setItem('qatafo_user_session_id', stored);
      }
      return stored;
    } catch {
      return 'qtf_default_user';
    }
  }

  initDom() {
    this.cartTotalCount = document.getElementById('cart-total-count');
    this.summaryQtyCount = document.getElementById('summary-qty-count');
    this.summaryTotalTND = document.getElementById('summary-total-tnd');
    this.cartLoadingBox = document.getElementById('cart-loading-box');
    this.cartEmptyBox = document.getElementById('cart-empty-box');
    this.cartItemsContainer = document.getElementById('cart-items-container');
    this.btnSubmitOrder = document.getElementById('btn-submit-order');

    this.orderSuccessModal = document.getElementById('order-success-modal');
    this.orderTrackingNumber = document.getElementById('order-tracking-number');
  }

  async loadCart() {
    if (this.cartLoadingBox) this.cartLoadingBox.style.display = 'block';

    try {
      const res = await fetch('/api/cart/items', {
        headers: { 'x-session-id': this.sessionId }
      });

      const data = await res.json();
      this.items = data.items || [];
      this.render();
    } catch (err) {
      console.error('Error loading cart:', err);
    } finally {
      if (this.cartLoadingBox) this.cartLoadingBox.style.display = 'none';
    }
  }

  render() {
    const totalQty = this.items.reduce((sum, it) => sum + (it.quantity || 1), 0);
    const totalTND = this.items.reduce((sum, it) => sum + (it.priceTND * (it.quantity || 1)), 0);

    if (this.cartTotalCount) this.cartTotalCount.textContent = totalQty;
    if (this.summaryQtyCount) this.summaryQtyCount.textContent = totalQty;
    if (this.summaryTotalTND) this.summaryTotalTND.textContent = `${totalTND.toFixed(2).replace('.', ',')} DT`;

    if (this.items.length === 0) {
      if (this.cartEmptyBox) this.cartEmptyBox.style.display = 'block';
      if (this.cartItemsContainer) this.cartItemsContainer.innerHTML = '';
      if (this.btnSubmitOrder) this.btnSubmitOrder.disabled = true;
      return;
    }

    if (this.cartEmptyBox) this.cartEmptyBox.style.display = 'none';
    if (this.btnSubmitOrder) this.btnSubmitOrder.disabled = false;

    this.cartItemsContainer.innerHTML = this.items.map(item => {
      const subtotal = item.priceTND * (item.quantity || 1);
      const currSymbol = item.sourceCurrency === 'JPY' ? '¥' : (item.sourceCurrency === 'USD' ? '$' : '€');

      return `
        <article class="cart-item-card" id="cart-item-${item.id}">
          <div class="cart-thumb-box">
            <img src="${item.imageUrl}" alt="${item.title}">
          </div>

          <div class="cart-item-details">
            <div class="cart-store-tag">${item.store.toUpperCase()}</div>
            <h3 class="cart-item-title">${item.title}</h3>
            ${item.variant ? `<div class="cart-variant-text">الخيارات: ${item.variant}</div>` : ''}
            <div style="font-size: 11.5px; color: #64748b;">
              السعر الأصلي: ${currSymbol}${item.sourcePrice} ${item.sourceCurrency}
            </div>
          </div>

          <div class="cart-item-price-col">
            <div class="cart-price-tnd">${subtotal.toFixed(2).replace('.', ',')} DT</div>

            <div class="qty-counter" style="background: #1e293b;">
              <button class="qty-btn" onclick="window.cartApp.updateQty('${item.id}', ${item.quantity - 1})">-</button>
              <span class="qty-number">${item.quantity}</span>
              <button class="qty-btn" onclick="window.cartApp.updateQty('${item.id}', ${item.quantity + 1})">+</button>
            </div>

            <button class="btn-cart-delete" onclick="window.cartApp.deleteItem('${item.id}')">
              ✕ حذف
            </button>
          </div>
        </article>
      `;
    }).join('');
  }

  async updateQty(id, newQty) {
    if (newQty < 1) {
      if (confirm('هل تريد حذف هذه السلعة من السلة؟')) {
        this.deleteItem(id);
      }
      return;
    }

    try {
      await fetch(`/api/cart/items/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity: newQty })
      });
      await this.loadCart();
    } catch (err) {
      console.error(err);
    }
  }

  async deleteItem(id) {
    try {
      await fetch(`/api/cart/items/${id}`, {
        method: 'DELETE'
      });
      await this.loadCart();
    } catch (err) {
      console.error(err);
    }
  }

  async submitOrder() {
    const name = document.getElementById('cust-name').value.trim();
    const phone = document.getElementById('cust-phone').value.trim();
    const city = document.getElementById('cust-city').value;
    const address = document.getElementById('cust-address').value.trim();
    const paymentMethod = document.getElementById('cust-payment').value;

    if (!name || !phone) {
      alert('الرجاء إدخال اسمك ورقم هاتفك لتأكيد الطلب.');
      return;
    }

    this.btnSubmitOrder.disabled = true;
    this.btnSubmitOrder.textContent = '⏳ جاري تسجيل الطلب...';

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-session-id': this.sessionId
        },
        body: JSON.stringify({ name, phone, city, address, paymentMethod })
      });

      const data = await res.json();

      if (data.success) {
        this.orderTrackingNumber.textContent = data.orderNumber;
        this.orderSuccessModal.style.display = 'flex';
        this.items = [];
        this.render();
      } else {
        alert('خطأ: ' + (data.error || 'تعذر إتمام الطلب.'));
        this.btnSubmitOrder.disabled = false;
        this.btnSubmitOrder.textContent = '✓ تأكيد الطلب والشراء عبر QATAFO';
      }
    } catch (err) {
      alert('خطأ في الاتصال بالخادم.');
      this.btnSubmitOrder.disabled = false;
      this.btnSubmitOrder.textContent = '✓ تأكيد الطلب والشراء عبر QATAFO';
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.cartApp = new QatafoCartApp();
});
