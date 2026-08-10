/**
 * QATAFO Smart Link Scraper & Shopping App Client Controller
 */

class QatafoApp {
  constructor() {
    this.sessionId = this.getOrInitSessionId();
    this.currentProduct = null;
    this.selectedSize = null;
    this.selectedColor = null;
    this.quantity = 1;

    this.initDom();
    this.bindEvents();
    this.updateCartBadge();
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
    this.urlInput = document.getElementById('url-input');
    this.btnScrape = document.getElementById('btn-scrape');
    this.btnScrapeSpinner = document.getElementById('btn-scrape-spinner');
    this.btnScrapeText = document.getElementById('btn-scrape-text');

    this.loadingCard = document.getElementById('loading-card');
    this.productCardSection = document.getElementById('product-card-section');

    this.resMainImg = document.getElementById('res-main-img');
    this.resThumbnails = document.getElementById('res-thumbnails');
    this.resStoreBadge = document.getElementById('res-store-badge');
    this.resTitle = document.getElementById('res-title');
    this.resDesc = document.getElementById('res-desc');
    this.resSourcePriceInput = document.getElementById('res-source-price-input');
    this.resSourceCurrency = document.getElementById('res-source-currency');
    this.resTotalTND = document.getElementById('res-total-tnd');
    this.resSizesList = document.getElementById('res-sizes-list');
    this.resColorsGroup = document.getElementById('res-colors-group');
    this.resColorsList = document.getElementById('res-colors-list');
    this.resQtyVal = document.getElementById('res-qty-val');
    this.resExternalLink = document.getElementById('res-external-link');

    this.cartCountBadge = document.getElementById('cart-count-badge');
    this.toastModal = document.getElementById('toast-modal');
    this.toastProductTitle = document.getElementById('toast-product-title');
  }

  bindEvents() {
    this.urlInput?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') this.handleScrape();
    });
  }

  async handleScrape(overrideUrl) {
    this.initDom();
    const url = overrideUrl || this.urlInput?.value.trim();
    if (!url) {
      alert('الرجاء لصق رابط منتج صحيح.');
      return;
    }

    if (this.urlInput) this.urlInput.value = url;

    // UI Loading State
    if (this.btnScrapeSpinner) this.btnScrapeSpinner.style.display = 'inline-block';
    if (this.btnScrapeText) this.btnScrapeText.textContent = 'جاري الفحص...';
    if (this.btnScrape) this.btnScrape.disabled = true;
    if (this.loadingCard) this.loadingCard.style.display = 'block';
    if (this.productCardSection) this.productCardSection.style.display = 'none';

    try {
      const res = await fetch('/api/scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      });

      const data = await res.json();

      if (data.success && data.product) {
        this.currentProduct = data.product;
        this.renderProductCard(data.product);
        if (this.productCardSection && typeof this.productCardSection.scrollIntoView === 'function') {
          this.productCardSection.scrollIntoView({ behavior: 'smooth' });
        }
      } else {
        alert('عذراً: ' + (data.error || 'تعذر استخراج بيانات المنتج.'));
      }
    } catch (err) {
      alert('حدث خطأ في الاتصال بالخادم.');
    } finally {
      if (this.btnScrapeSpinner) this.btnScrapeSpinner.style.display = 'none';
      if (this.btnScrapeText) this.btnScrapeText.textContent = '⚡ استخراج السلعة';
      if (this.btnScrape) this.btnScrape.disabled = false;
      if (this.loadingCard) this.loadingCard.style.display = 'none';
    }
  }

  loadPreset(key) {
    const presets = {
      shein_dress: 'https://m.shein.com/fr/Slaydiva-Robe-longue-ample-a-col-carre-p-9842.html',
      amz_airpods: 'https://www.amazon.fr/dp/B0CHWRXH8B',
      temu_watch: 'https://www.temu.com/goods-smartwatch-431.html',
      amz_jp_book: 'https://www.amazon.co.jp/dp/B08XYZJP01'
    };

    if (presets[key]) {
      this.handleScrape(presets[key]);
    }
  }

  renderProductCard(p) {
    this.initDom();
    this.quantity = 1;
    if (this.resQtyVal) this.resQtyVal.textContent = '1';

    if (this.resMainImg) this.resMainImg.src = p.mainImage || p.images[0] || '';
    if (this.resStoreBadge) this.resStoreBadge.textContent = p.storeName || p.store.toUpperCase();
    if (this.resTitle) this.resTitle.textContent = p.title;
    if (this.resDesc) this.resDesc.textContent = p.description || 'منتج أصلي مضمون ومفحوص من QATAFO.';

    // Editable Source Price Input
    if (this.resSourcePriceInput) {
      this.resSourcePriceInput.value = Number(p.sourcePrice || 10).toFixed(2);
    }
    if (this.resSourceCurrency) {
      this.resSourceCurrency.textContent = p.sourceCurrency || 'EUR';
    }

    // Total TND Calculation
    this.recalculateTND();

    // External Link
    if (this.resExternalLink) this.resExternalLink.href = p.url;

    // Gallery Thumbnails
    if (this.resThumbnails) {
      if (p.images && p.images.length > 1) {
        this.resThumbnails.style.display = 'flex';
        this.resThumbnails.innerHTML = p.images.map((img, i) => `
          <img src="${img}" class="thumb-mini ${i === 0 ? 'active' : ''}" onclick="window.qatafo.changeMainImg('${img}', this)">
        `).join('');
      } else {
        this.resThumbnails.style.display = 'none';
      }
    }

    // Sizes
    if (this.resSizesList) {
      if (p.variants && p.variants.sizes && p.variants.sizes.length > 0) {
        this.selectedSize = p.variants.sizes[0];
        this.resSizesList.innerHTML = p.variants.sizes.map((s, i) => `
          <button class="swatch-btn ${i === 0 ? 'active' : ''}" onclick="window.qatafo.selectSize('${s}', this)">${s}</button>
        `).join('');
      } else if (p.variants && p.variants.styles && p.variants.styles.length > 0) {
        this.selectedSize = p.variants.styles[0];
        this.resSizesList.innerHTML = p.variants.styles.map((s, i) => `
          <button class="swatch-btn ${i === 0 ? 'active' : ''}" onclick="window.qatafo.selectSize('${s}', this)">${s}</button>
        `).join('');
      } else {
        this.selectedSize = 'Standard';
        this.resSizesList.innerHTML = `<button class="swatch-btn active">خيار قياسي</button>`;
      }
    }

    // Colors
    if (this.resColorsGroup && this.resColorsList) {
      if (p.variants && p.variants.colors && p.variants.colors.length > 0) {
        this.resColorsGroup.style.display = 'flex';
        this.selectedColor = p.variants.colors[0];
        this.resColorsList.innerHTML = p.variants.colors.map((c, i) => `
          <button class="swatch-btn ${i === 0 ? 'active' : ''}" onclick="window.qatafo.selectColor('${c}', this)">${c}</button>
        `).join('');
      } else {
        this.resColorsGroup.style.display = 'none';
        this.selectedColor = null;
      }
    }

    if (this.productCardSection) this.productCardSection.style.display = 'block';
  }

  recalculateTND() {
    if (!this.currentProduct) return;

    const sourcePrice = parseFloat(this.resSourcePriceInput?.value) || this.currentProduct.sourcePrice || 10;
    const currency = this.currentProduct.sourceCurrency || 'EUR';

    let rate = 3.38;
    if (currency === 'USD') rate = 3.12;
    if (currency === 'JPY') rate = 0.021;
    if (currency === 'GBP') rate = 3.95;

    const convertedTND = sourcePrice * rate;
    const serviceFee = Math.max(10, convertedTND * 0.08);
    const shipping = 25.00;
    const totalTND = Math.round((convertedTND + serviceFee + shipping) * 100) / 100;

    this.currentProduct.sourcePrice = sourcePrice;
    this.currentProduct.totalPriceTND = totalTND;

    if (this.resTotalTND) {
      this.resTotalTND.textContent = `${totalTND.toFixed(2).replace('.', ',')} DT`;
    }
  }

  changeMainImg(src, el) {
    if (this.resMainImg) this.resMainImg.src = src;
    document.querySelectorAll('.thumb-mini').forEach(t => t.classList.remove('active'));
    if (el) el.classList.add('active');
  }

  selectSize(size, el) {
    this.selectedSize = size;
    document.querySelectorAll('#res-sizes-list .swatch-btn').forEach(b => b.classList.remove('active'));
    if (el) el.classList.add('active');
  }

  selectColor(color, el) {
    this.selectedColor = color;
    document.querySelectorAll('#res-colors-list .swatch-btn').forEach(b => b.classList.remove('active'));
    if (el) el.classList.add('active');
  }

  changeQty(delta) {
    const next = this.quantity + delta;
    if (next >= 1 && next <= 20) {
      this.quantity = next;
      if (this.resQtyVal) this.resQtyVal.textContent = next;
    }
  }

  async addToCart() {
    if (!this.currentProduct) return;

    this.recalculateTND();

    let variantText = '';
    if (this.selectedSize) variantText += `المقاس: ${this.selectedSize}`;
    if (this.selectedColor) variantText += `${variantText ? ' | ' : ''}اللون: ${this.selectedColor}`;

    const payload = {
      store: this.currentProduct.store,
      externalId: this.currentProduct.externalId,
      url: this.currentProduct.url,
      title: this.currentProduct.title,
      imageUrl: this.currentProduct.mainImage || (this.currentProduct.images ? this.currentProduct.images[0] : ''),
      sourcePrice: this.currentProduct.sourcePrice,
      sourceCurrency: this.currentProduct.sourceCurrency,
      priceTND: this.currentProduct.totalPriceTND,
      variant: variantText || null,
      quantity: this.quantity
    };

    const btn = document.getElementById('btn-add-cart');
    if (btn) {
      btn.innerHTML = '<span>⏳ جاري الإضافة للسلة...</span>';
      btn.disabled = true;
    }

    try {
      const res = await fetch('/api/cart/items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-session-id': this.sessionId
        },
        body: JSON.stringify(payload)
      });

      const json = await res.json();

      if (json.success) {
        if (this.toastProductTitle) this.toastProductTitle.textContent = `${this.currentProduct.title.substring(0, 70)}...`;
        if (this.toastModal) this.toastModal.style.display = 'flex';
        await this.updateCartBadge();
      } else {
        alert('حدث خطأ: ' + (json.error || 'تعذر إضافة المنتج للسلة.'));
      }
    } catch (err) {
      alert('خطأ في الاتصال بالخادم.');
    } finally {
      if (btn) {
        btn.innerHTML = '<span class="icon">🛒</span><span>أضف إلى سلة QATAFO وتأكيد الشراء</span>';
        btn.disabled = false;
      }
    }
  }

  closeToast() {
    if (this.toastModal) this.toastModal.style.display = 'none';
  }

  async updateCartBadge() {
    try {
      const res = await fetch('/api/cart/items', {
        headers: { 'x-session-id': this.sessionId }
      });
      const data = await res.json();
      const count = data.itemCount || 0;
      if (this.cartCountBadge) this.cartCountBadge.textContent = count;
    } catch {
      // Ignore
    }
  }
}

// Unconditional Instant Instantiation
window.qatafo = new QatafoApp();
