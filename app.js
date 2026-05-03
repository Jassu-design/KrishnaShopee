/* ===========================
   KRISHNA SHOPEE – app.js
   =========================== */

// ── CONFIG (overridden by admin settings if present) ────
const PHONE_DEFAULT            = '9828230461';
const FREE_DELIVERY_DEFAULT    = 299;
const DELIVERY_CHARGE_DEFAULT  = 30;

// ── LOAD ADMIN SETTINGS ──────────────────────────────────
// Admin panel saves settings to localStorage under 'ks_settings'.
// If present, use those; else fall back to defaults above.
let _settings = {};
try { _settings = JSON.parse(localStorage.getItem('ks_settings') || '{}'); } catch(e) {}

const PHONE              = _settings.phone          || PHONE_DEFAULT;
const FREE_DELIVERY_ABOVE = +(_settings.freeDelivery  || FREE_DELIVERY_DEFAULT);
const DELIVERY_CHARGE    = +(_settings.deliveryCharge || DELIVERY_CHARGE_DEFAULT);

// Apply dynamic settings to UI
(function applySettings() {
  if (_settings.storeName)  { const el = document.getElementById('storeName');  if(el) el.textContent = _settings.storeName; }
  if (_settings.hours)      { const el = document.getElementById('storeHours'); if(el) el.textContent = _settings.hours; }
  if (_settings.phone)      { const el = document.getElementById('storePhone'); if(el) el.textContent = '+91 ' + _settings.phone; }
  if (_settings.phone)      { const el = document.getElementById('waBtnText');  if(el) el.textContent = 'Order on WhatsApp · +91 ' + _settings.phone; }
  if (_settings.promo1)     { const el = document.getElementById('promo1');     if(el) el.textContent = _settings.promo1; }
  if (_settings.promo2)     { const el = document.getElementById('promo2');     if(el) el.textContent = _settings.promo2; }
  if (_settings.promo3)     { const el = document.getElementById('promo3');     if(el) el.textContent = _settings.promo3; }
})();

// ── PRODUCT DATA ─────────────────────────────────────────
// Products are loaded from admin panel localStorage (ks_products) if available.
// Each product: { id, name, emoji, image (base64|null), cat, price, mrp, unit }
const defaultProducts = [
  // GRAINS
  { id: 1,  name: 'Basmati Rice Premium',  emoji: '🍚', image: null, cat: 'Grains',     price: 89,  mrp: 99,  unit: '1 kg'    },
  { id: 2,  name: 'Sharbati Atta',         emoji: '🌾', image: null, cat: 'Grains',     price: 62,  mrp: 70,  unit: '1 kg'    },
  // PULSES
  { id: 3,  name: 'Toor Dal',              emoji: '🫘', image: null, cat: 'Pulses',     price: 110, mrp: 125, unit: '500 g'   },
  { id: 4,  name: 'Moong Dal',             emoji: '🟡', image: null, cat: 'Pulses',     price: 95,  mrp: 110, unit: '500 g'   },
  { id: 5,  name: 'Chana Dal',             emoji: '🟠', image: null, cat: 'Pulses',     price: 85,  mrp: 95,  unit: '500 g'   },
  // OILS
  { id: 6,  name: 'Patanjali Mustard Oil', emoji: '🫙', image: null, cat: 'Oils',       price: 175, mrp: 199, unit: '1 L'     },
  { id: 7,  name: 'Fortune Sunflower Oil', emoji: '🌻', image: null, cat: 'Oils',       price: 145, mrp: 165, unit: '1 L'     },
  // DAIRY
  { id: 8,  name: 'Fresh Cow Milk',        emoji: '🥛', image: null, cat: 'Dairy',      price: 58,  mrp: 60,  unit: '1 L'     },
  { id: 9,  name: 'Fresh Paneer',          emoji: '🧀', image: null, cat: 'Dairy',      price: 88,  mrp: 100, unit: '200 g'   },
  { id: 10, name: 'Amul Butter',           emoji: '🧈', image: null, cat: 'Dairy',      price: 55,  mrp: 60,  unit: '100 g'   },
  // VEGETABLES
  { id: 11, name: 'Fresh Tomatoes',        emoji: '🍅', image: null, cat: 'Vegetables', price: 38,  mrp: 50,  unit: '500 g'   },
  { id: 12, name: 'Onions',                emoji: '🧅', image: null, cat: 'Vegetables', price: 32,  mrp: 40,  unit: '1 kg'    },
  { id: 13, name: 'Potatoes',              emoji: '🥔', image: null, cat: 'Vegetables', price: 28,  mrp: 35,  unit: '1 kg'    },
  { id: 14, name: 'Green Chillies',        emoji: '🌶️', image: null, cat: 'Vegetables', price: 18,  mrp: 25,  unit: '100 g'   },
  { id: 15, name: 'Coriander Leaves',      emoji: '🌿', image: null, cat: 'Vegetables', price: 10,  mrp: 15,  unit: '1 bunch' },
  // FRUITS
  { id: 16, name: 'Bananas',               emoji: '🍌', image: null, cat: 'Fruits',     price: 48,  mrp: 60,  unit: '1 dozen' },
  { id: 17, name: 'Apples Shimla',         emoji: '🍎', image: null, cat: 'Fruits',     price: 115, mrp: 140, unit: '1 kg'    },
  // SPICES
  { id: 18, name: 'MDH Turmeric',          emoji: '🟡', image: null, cat: 'Spices',     price: 42,  mrp: 50,  unit: '100 g'   },
  { id: 19, name: 'Everest Red Chilli',    emoji: '🔴', image: null, cat: 'Spices',     price: 48,  mrp: 55,  unit: '100 g'   },
  { id: 20, name: 'MDH Garam Masala',      emoji: '🟤', image: null, cat: 'Spices',     price: 58,  mrp: 70,  unit: '50 g'    },
  // HOUSEHOLD
  { id: 21, name: 'Surf Excel Easy Wash',  emoji: '🫧', image: null, cat: 'Household',  price: 82,  mrp: 95,  unit: '500 g'   },
  // SNACKS
  { id: 22, name: 'Parle-G Biscuits',      emoji: '🍪', image: null, cat: 'Snacks',     price: 10,  mrp: 10,  unit: '100 g'   },
  { id: 23, name: 'Haldiram Namkeen',      emoji: '🥜', image: null, cat: 'Snacks',     price: 38,  mrp: 40,  unit: '200 g'   },
  { id: 24, name: 'Maggi Noodles',         emoji: '🍜', image: null, cat: 'Snacks',     price: 14,  mrp: 14,  unit: '70 g'    },
];

// Load from admin localStorage if available
let products;
try {
  const stored = localStorage.getItem('ks_products');
  products = stored ? JSON.parse(stored) : defaultProducts;
} catch(e) {
  products = defaultProducts;
}

// ── STATE ─────────────────────────────────────────────────
let cart = {};
let activeCat = 'All';
const cats = ['All', ...new Set(products.map(p => p.cat))];

// ── UTILITY ───────────────────────────────────────────────
function getDiscount(product) {
  if (product.mrp <= product.price) return 0;
  return Math.round((product.mrp - product.price) / product.mrp * 100);
}
function cartCount() {
  return Object.keys(cart).reduce((sum, id) => sum + cart[id], 0);
}
function cartItemTotal() {
  return Object.keys(cart).reduce((sum, id) => {
    const product = products.find(p => p.id == id);
    return sum + product.price * cart[id];
  }, 0);
}
function getDeliveryCharge(itemTotal) {
  return itemTotal >= FREE_DELIVERY_ABOVE ? 0 : DELIVERY_CHARGE;
}

// ── PRODUCT VISUAL ────────────────────────────────────────
// Returns either an <img> tag (if product has image) or emoji span
function productVisual(p, forCard = true) {
  if (p.image) {
    return `<img src="${p.image}" alt="${p.name}" ${forCard ? '' : 'class="cart-item-img"'} />`;
  }
  return forCard ? p.emoji : `<div class="cart-item-emoji">${p.emoji}</div>`;
}

// ── CATEGORY BAR ─────────────────────────────────────────
function buildCategoryBar() {
  const bar = document.getElementById('catsBar');
  bar.innerHTML = cats
    .map(c => `<div class="cat-tab ${c === activeCat ? 'active' : ''}" onclick="setCat('${c}')">${c}</div>`)
    .join('');
}
function setCat(category) {
  activeCat = category;
  buildCategoryBar();
  renderProducts();
}
function filterAll() { renderProducts(); }

// ── PRODUCT GRID ─────────────────────────────────────────
function renderProducts() {
  const query = document.getElementById('searchInput').value.toLowerCase().trim();
  let list = activeCat === 'All' ? products : products.filter(p => p.cat === activeCat);
  if (query) list = list.filter(p => p.name.toLowerCase().includes(query) || p.cat.toLowerCase().includes(query));

  document.getElementById('sectionTitle').textContent = activeCat === 'All' ? 'All Products' : activeCat;
  document.getElementById('productCount').textContent = list.length + ' items';

  const grid = document.getElementById('productGrid');
  if (!list.length) {
    grid.innerHTML = `<div class="no-results">😕 No results for "${query}"</div>`;
    return;
  }
  grid.innerHTML = list.map(p => buildProductCard(p)).join('');
  updateCartBar();
}

function buildProductCard(p) {
  const qty = cart[p.id] || 0;
  const discount = getDiscount(p);

  const discountBadge = discount > 0 ? `<div class="discount-badge">${discount}% OFF</div>` : '';

  const visual = p.image
    ? `<img src="${p.image}" alt="${p.name}" style="width:100%;height:100%;object-fit:cover;" />`
    : p.emoji;

  const actionBtn = qty === 0
    ? `<button class="add-btn" onclick="addToCart(${p.id})">ADD</button>`
    : `<div class="qty-ctrl">
         <button class="qty-btn" onclick="removeFromCart(${p.id})">−</button>
         <span class="qty-num">${qty}</span>
         <button class="qty-btn" onclick="addToCart(${p.id})">+</button>
       </div>`;

  const oldPrice = p.mrp > p.price ? `<span class="price-old">₹${p.mrp}</span>` : '';

  return `
    <div class="pcard">
      <div class="pcard-img">
        ${discountBadge}
        ${visual}
      </div>
      <div class="pcard-body">
        <div class="pcard-name">${p.name}</div>
        <div class="pcard-unit">${p.unit}</div>
        <div class="pcard-bottom">
          <div class="price-row">
            <span class="price-now">₹${p.price}</span>
            ${oldPrice}
          </div>
          ${actionBtn}
        </div>
      </div>
    </div>`;
}

// ── CART ACTIONS ─────────────────────────────────────────
function addToCart(id) { cart[id] = (cart[id] || 0) + 1; renderProducts(); }
function removeFromCart(id) {
  cart[id] = (cart[id] || 0) - 1;
  if (cart[id] <= 0) delete cart[id];
  renderProducts();
}

// ── CART BAR ──────────────────────────────────────────────
function updateCartBar() {
  const area = document.getElementById('cartBarArea');
  const count = cartCount();
  const total = cartItemTotal();
  if (count === 0) {
    area.innerHTML = `<div class="cart-empty-bar"><span>🛒 Add items to start your order</span></div>`;
  } else {
    area.innerHTML = `
      <div class="cart-summary" onclick="openModal()">
        <div class="cart-left">
          <div class="cart-count-box">${count} item${count > 1 ? 's' : ''}</div>
          <div class="cart-title">View Cart</div>
        </div>
        <div class="cart-total-lbl">₹${total}</div>
      </div>`;
  }
}

// ── CART MODAL ────────────────────────────────────────────
function openModal() {
  const keys = Object.keys(cart);
  const el = document.getElementById('cartContent');
  if (!keys.length) {
    el.innerHTML = '<div class="empty-cart-modal"><p>Your cart is empty.</p></div>';
  } else {
    const itemTotal = cartItemTotal();
    const delivery = getDeliveryCharge(itemTotal);
    const grandTotal = itemTotal + delivery;

    const itemRows = keys.map(id => {
      const p = products.find(x => x.id == id);
      const thumb = p.image
        ? `<img src="${p.image}" alt="${p.name}" class="cart-item-img" />`
        : `<div class="cart-item-emoji">${p.emoji}</div>`;
      return `
        <div class="cart-item-row">
          ${thumb}
          <div style="flex:1">
            <div class="cart-item-name">${p.name}</div>
            <div class="cart-item-sub">${p.unit} × ${cart[id]}</div>
          </div>
          <div class="cart-item-amt">₹${p.price * cart[id]}</div>
        </div>`;
    }).join('');

    const deliveryLabel = delivery === 0 ? '<span class="bill-free">FREE</span>' : `₹${delivery}`;

    el.innerHTML = `
      ${itemRows}
      <div class="bill-section">
        <div class="bill-row"><span>Item Total</span><span>₹${itemTotal}</span></div>
        <div class="bill-row"><span>Delivery charges</span><span>${deliveryLabel}</span></div>
        <div class="bill-total"><span>Grand Total</span><span>₹${grandTotal}</span></div>
      </div>
      <button class="place-order-btn" onclick="orderWA()">Place Order via WhatsApp</button>`;
  }
  document.getElementById('cartModal').classList.add('open');
}

function closeModal() { document.getElementById('cartModal').classList.remove('open'); }
function closeModalOutside(event) {
  if (event.target === document.getElementById('cartModal')) closeModal();
}

// ── WHATSAPP ORDER ────────────────────────────────────────
function orderWA() {
  closeModal();
  const keys = Object.keys(cart);
  const storeName = (_settings.storeName || 'Krishna Shopee');
  const location  = (_settings.location  || 'Pratap Nagar, Jodhpur');

  let message = `🛍️ *Order — ${storeName}*\n`;
  message += `📍 ${location}\n\n`;

  if (!keys.length) {
    message += 'Hi! I would like to place an order. Please share your available stock. 🙏';
  } else {
    const itemTotal = cartItemTotal();
    const delivery = getDeliveryCharge(itemTotal);
    const grandTotal = itemTotal + delivery;
    keys.forEach(id => {
      const p = products.find(x => x.id == id);
      message += `• ${p.name} (${p.unit}) × ${cart[id]} = ₹${p.price * cart[id]}\n`;
    });
    message += `\n💰 Item Total: ₹${itemTotal}`;
    message += `\n🚚 Delivery: ${delivery === 0 ? 'FREE' : '₹' + delivery}`;
    message += `\n✅ Grand Total: ₹${grandTotal}`;
    message += '\n\nPlease confirm my order. Thank you! 🙏';
  }

  const url = `https://wa.me/${PHONE}?text=${encodeURIComponent(message)}`;
  window.open(url, '_blank');
}

// ── INIT ──────────────────────────────────────────────────
buildCategoryBar();
renderProducts();
