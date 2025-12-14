/* script.js
   Main JS file used by all pages.
   - Contains product data (array)
   - Renders product listings, details
   - Search, filter
   - LocalStorage cart management
*/

/* ------------------------------
   Product data (edit to add products)
   Each product: id, name, price, category, rating, description, images[], sizes[], colors[], createdAt
   ------------------------------ */
const PRODUCTS = [
  {
    id: 'p001',
    name: 'Blush Red Bridal Lehenga',
    price: 24999,
    category: 'Bridal',
    rating: 4.8,
    description: 'Luxurious blush red bridal lehenga with intricate hand embroidery.',
    images: ['lehenga red 1.png'
    ],
    sizes: ['S','M','L','XL'],
    colors: ['Red'],
    createdAt: '2025-10-01'
  },
  {
    id: 'p002',
    name: 'Royal Dark Blue Velvet Lehenga',
    price: 31999,
    category: 'Bridal',
    rating: 4.9,
    description: 'Rich velvet lehenga with gold zari and heavy sequin work.',
    images: [
      'lehenga blue 45r.png'
    ],
    sizes: ['S','M','L'],
    colors: ['Dark Blus'],
    createdAt: '2025-11-01'
  },
  {
    id: 'p003',
    name: 'Mint Wine Party Lehenga',
    price: 10999,
    category: 'Party Wear',
    rating: 4.6,
    description: 'Lightweight mint lehenga ideal for receptions and sangeet.',
    images: ['lehenga new design.png'],
    sizes: ['XS','S','M','L'],
    colors: ['Mint Wine'],
    createdAt: '2025-09-15'
  },
  {
    id: 'p004',
    name: 'Royal Blue Velvet Lehenga Choli',
    price: 15999,
    category: 'Contemporary',
    rating: 4.5,
    description: 'Royal Blue Velvet Lehenga Choli | Pink Zari Thread Work | Indian Wedding Attire.',
    images: ['royal blue.png'],
    sizes: ['S','M','L'],
    colors: ['Royal Blue'],
    createdAt: '2025-11-08'
  },
  {
     id: 'p005',
    name: 'Traditional Red Bridal Lehenga Choli',
    price: 8999,
    category: 'Casual',
    rating: 4.3,
    description: 'Traditional Red Bridal Lehenga Choli with Heavy Zari Embroidery.',
    images: ['lehenga pink.png'],
    sizes: ['S','M','L','XL'],
    colors: ['Red'],
    createdAt: '2025-08-22'
  },
  {
     id: 'p006',
    name: 'Traditional Dark Green Bridal Lehenga Choli',
    price: 8999,
    category: 'Casual',
    rating: 4.3,
    description: 'Traditional Dark Green Bridal Lehenga Choli with Heavy Zari Embroidery.',
    images: ['new dark green.png'],
    sizes: ['S','M','L','XL'],
    colors: ['Dark Green'],
    createdAt: '2025-11-27'
  },{
     id: 'p007',
    name: 'Traditional Light Pink Bridal Lehenga Choli',
    price: 8999,
    category: 'Casual',
    rating: 4.3,
    description: 'Traditional Light Pink Bridal Lehenga Choli with Heavy Zari Embroidery.',
    images: ['Light pink.png'],
    sizes: ['S','M','L','XL'],
    colors: ['Light Pink'],
    createdAt: '2025-11-27'
  },
  {
     id: 'p008',
    name: 'Traditional Yellow Light Bridal Lehenga Choli',
    price: 8999,
    category: 'Casual',
    rating: 4.3,
    description: 'Traditional Yellow Light Bridal Lehenga Choli with Heavy Zari Embroidery.',
    images: ['yellow light.png'],
    sizes: ['S','M','L','XL'],
    colors: ['Yellow Light'],
    createdAt: '2025-11-27'
  }
];

/* ------------------------------
   Utility & Cart helpers
   ------------------------------ */
function getCart(){
  try {
    const raw = localStorage.getItem('ll_cart');
    return raw ? JSON.parse(raw) : [];
  } catch(e){
    console.error('cart parse error', e);
    return [];
  }
}
function saveCart(cart){
  localStorage.setItem('ll_cart', JSON.stringify(cart));
  updateCartCountUI();
}
function addToCart(productId, qty = 1){
  const cart = getCart();
  const existing = cart.find(i => i.id === productId);
  if(existing){
    existing.qty += qty;
  } else {
    cart.push({id: productId, qty});
  }
  saveCart(cart);
  showToast('Added to cart');
}
function setQty(productId, qty){
  const cart = getCart();
  const item = cart.find(i => i.id === productId);
  if(!item) return;
  item.qty = Math.max(1, qty);
  saveCart(cart);
}
function removeFromCart(productId){
  let cart = getCart();
  cart = cart.filter(i => i.id !== productId);
  saveCart(cart);
}
function clearCart(){
  localStorage.removeItem('ll_cart');
  updateCartCountUI();
}

/* ------------------------------
   Cart count UI
   ------------------------------ */
function initCartCount(){
  updateCartCountUI();
}
function updateCartCountUI(){
  const count = getCart().reduce((s,i)=>s+i.qty,0);
  const el = document.getElementById('cart-count');
  const el2 = document.getElementById('cart-count-mobile');
  if(el) el.textContent = count;
  if(el2) el2.textContent = count;
}

/* alias used by inline calls */
function initCartCount(){ updateCartCountUI(); }

/* ------------------------------
   Rendering functions used across pages
   ------------------------------ */
function formatPrice(n){
  // Indian-style currency formatting
  return '₹' + n.toLocaleString('en-IN');
}
function productCardHTML(product){
  return `
    <div class="product-card" data-id="${product.id}">
      <img src="${product.images[0]}" alt="${escapeHtml(product.name)}" />
      <div class="product-info">
        <div>
          <div class="product-title">${escapeHtml(product.name)}</div>
          <div class="product-price">${formatPrice(product.price)}</div>
          <div class="product-meta"><span>★ ${product.rating}</span><span>${product.category}</span></div>
        </div>
        <div style="margin-top:10px">
          <a class="btn" href="product-details.html?id=${product.id}">View</a>
          <button class="btn primary" onclick="handleAddToCart('${product.id}')">Add to Cart</button>
          <button class="btn" onclick="handleBuyNow('${product.id}')">Buy Now</button>
        </div>
      </div>
    </div>
  `;
}

/* safe HTML escape for minimal safety */
function escapeHtml(str = ''){
  return String(str).replace(/[&<>"']/g, s => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[s]));
}

/* render a few featured products */
function renderFeaturedProducts(containerId, limit = 4, newest = false){
  const el = document.getElementById(containerId);
  if(!el) return;
  let list = [...PRODUCTS];
  if(newest){
    list.sort((a,b)=> new Date(b.createdAt) - new Date(a.createdAt));
  }
  list = list.slice(0, limit);
  el.innerHTML = list.map(productCardHTML).join('');
}

/* render categories */
function getCategories(){
  const cats = Array.from(new Set(PRODUCTS.map(p=>p.category)));
  return cats;
}
function renderCategories(containerId){
  const el = document.getElementById(containerId);
  if(!el) return;
  const cats = getCategories();
  el.innerHTML = cats.map(c => `<div class="category" onclick="filterByCategory('${c}')">${c}</div>`).join('');
}
function filterByCategory(cat){
  // go to products page with filter
  if(window.location.pathname.endsWith('products.html') || window.location.pathname.endsWith('/products.html')){
    document.getElementById('category-filter').value = cat;
    handleFilter();
  } else {
    location.href = 'products.html';
    // pass fragment? keeping simple: user can choose on products page
  }
}

/* Populate category select on products page */
function populateCategoryFilter(){
  const sel = document.getElementById('category-filter');
  if(!sel) return;
  const cats = getCategories();
  sel.innerHTML = '<option value="all">All Categories</option>' + cats.map(c => `<option value="${c}">${c}</option>`).join('');
}

/* Render all products for products page */
function renderAllProducts(){
  const grid = document.getElementById('products-grid');
  if(!grid) return;
  grid.innerHTML = PRODUCTS.map(productCardHTML).join('');
}

/* Search & filter handlers */
function handleSearch(){
  const q = (document.getElementById('search-input')?.value || '').trim().toLowerCase();
  const cat = document.getElementById('category-filter')?.value || 'all';
  const filtered = PRODUCTS.filter(p => {
    const matchesQ = p.name.toLowerCase().includes(q);
    const matchesC = (cat === 'all') ? true : p.category === cat;
    return matchesQ && matchesC;
  });
  const grid = document.getElementById('products-grid');
  if(grid) grid.innerHTML = filtered.map(productCardHTML).join('') || '<p>No products found.</p>';
}
function handleFilter(){
  handleSearch(); // search uses the category select too
}

/* event callbacks for buttons */
function handleAddToCart(id){
  addToCart(id, 1);
}
function handleBuyNow(id){
  // add to cart and go to checkout
  addToCart(id, 1);
  // redirect to checkout
  location.href = 'checkout.html';
}

/* ------------------------------
   Product details page flow
   ------------------------------ */
function getQueryParam(name){
  const url = new URL(location.href);
  return url.searchParams.get(name);
}
function findProductById(id){
  return PRODUCTS.find(p => p.id === id);
}
function renderProductDetailsFromQuery(){
  const id = getQueryParam('id');
  const product = findProductById(id);
  const wrap = document.getElementById('product-detail-wrap');
  if(!wrap) return;
  if(!product){
    wrap.innerHTML = '<p>Product not found.</p>';
    return;
  }
  wrap.innerHTML = `
    <div class="product-gallery">
      <img src="${product.images[0]}" alt="${escapeHtml(product.name)}">
      ${product.images.slice(1).map(src => `<img style="margin-top:10px" src="${src}" alt="${escapeHtml(product.name)}">`).join('')}
    </div>
    <div class="product-detail-info">
      <h2>${escapeHtml(product.name)}</h2>
      <div class="product-price">${formatPrice(product.price)}</div>
      <div>Category: <strong>${escapeHtml(product.category)}</strong></div>
      <div style="margin:8px 0">Rating: ★ ${product.rating}</div>
      <p style="color:var(--muted)">${escapeHtml(product.description)}</p>

      <div>
        <div class="option-row">
          <label>Size:
            <select id="selected-size">${product.sizes.map(s => `<option value="${s}">${s}</option>`).join('')}</select>
          </label>
        </div>
        <div class="option-row">
          <label>Color:
            <select id="selected-color">${product.colors.map(c => `<option value="${c}">${c}</option>`).join('')}</select>
          </label>
        </div>
        <div style="margin-top:12px">
          <button class="btn" onclick="handleAddToCart('${product.id}')">Add to Cart</button>
          <button class="btn primary" onclick="handleBuyNow('${product.id}')">Buy Now</button>
        </div>
      </div>
    </div>
  `;
}

/* ------------------------------
   Cart page rendering & actions
   ------------------------------ */
function renderCartPage(){
  const wrap = document.getElementById('cart-wrap');
  if(!wrap) return;
  const cart = getCart();
  if(cart.length === 0){
    wrap.innerHTML = '<p>Your cart is empty. <a href="products.html">Shop now</a></p>';
    updateCartCountUI();
    return;
  }
  // build HTML
  let html = '';
  let subtotal = 0;
  cart.forEach(item => {
    const p = findProductById(item.id);
    if(!p) return;
    const itemTotal = p.price * item.qty;
    subtotal += itemTotal;
    html += `
      <div class="cart-item" data-id="${p.id}">
        <img src="${p.images[0]}" alt="${escapeHtml(p.name)}">
        <div style="flex:1">
          <div style="display:flex;justify-content:space-between;align-items:start">
            <div>
              <div style="font-weight:600">${escapeHtml(p.name)}</div>
              <div style="color:var(--muted);font-size:0.95rem">${escapeHtml(p.category)}</div>
              <div style="color:var(--muted);margin-top:6px">${formatPrice(p.price)} each</div>
            </div>
            <div style="text-align:right">${formatPrice(itemTotal)}</div>
          </div>
          <div style="margin-top:10px;display:flex;gap:0.5rem;align-items:center">
            <div class="qty-controls">
              <button class="btn" onclick="changeQty('${p.id}', -1)">−</button>
              <input type="number" min="1" value="${item.qty}" style="width:60px;padding:6px;border-radius:6px;border:1px solid #eee" onchange="manualQtyChange('${p.id}', this.value)">
              <button class="btn" onclick="changeQty('${p.id}', 1)">+</button>
            </div>
            <button class="btn" onclick="removeFromCartUI('${p.id}')">Remove</button>
          </div>
        </div>
      </div>
    `;
  });

  html += `
    <div class="order-summary">
      <h3>Summary</h3>
      <div style="display:flex;justify-content:space-between">
        <div>Subtotal</div>
        <div>${formatPrice(subtotal)}</div>
      </div>
      <div style="margin-top:8px;color:var(--muted)">Shipping & taxes calculated at checkout.</div>
      <div style="margin-top:12px">
        <a class="btn primary" href="checkout.html">Proceed to Checkout</a>
      </div>
    </div>
  `;
  wrap.innerHTML = html;
  updateCartCountUI();
}

/* qty controls for cart */
function changeQty(productId, delta){
  const cart = getCart();
  const item = cart.find(i => i.id === productId);
  if(!item) return;
  item.qty = Math.max(1, item.qty + delta);
  saveCart(cart);
  renderCartPage(); // refresh
}
function manualQtyChange(productId, value){
  const qty = parseInt(value) || 1;
  setQty(productId, qty);
  renderCartPage();
}
function removeFromCartUI(productId){
  removeFromCart(productId);
  renderCartPage();
  showToast('Removed from cart');
}

/* ------------------------------
   Checkout flow
   ------------------------------ */
function renderOrderSummary(){
  const wrap = document.getElementById('order-summary');
  if(!wrap) return;
  const cart = getCart();
  if(cart.length === 0){
    wrap.innerHTML = '<p>Your cart is empty. <a href="products.html">Shop now</a></p>';
    return;
  }
  let subtotal = 0;
  const lines = cart.map(item => {
    const p = findProductById(item.id);
    const tot = p.price * item.qty;
    subtotal += tot;
    return `<div style="display:flex;justify-content:space-between;margin-bottom:6px"><div>${escapeHtml(p.name)} × ${item.qty}</div><div>${formatPrice(tot)}</div></div>`;
  }).join('');
  const html = `
    <div class="order-summary">
      <h3>Your Order</h3>
      ${lines}
      <hr style="margin:10px 0">
      <div style="display:flex;justify-content:space-between;font-weight:700"><div>Total</div><div>${formatPrice(subtotal)}</div></div>
    </div>
  `;
  wrap.innerHTML = html;
}

/* place order — COD or dummy online */
function placeOrder(method){
  const fullname = document.getElementById('fullname')?.value?.trim();
  const phone = document.getElementById('phone')?.value?.trim();
  const address = document.getElementById('address')?.value?.trim();
  const city = document.getElementById('city')?.value?.trim();
  const pincode = document.getElementById('pincode')?.value?.trim();

  if(!fullname || !phone || !address || !city || !pincode){
    alert('Please fill the shipping form.');
    return;
  }

  const cart = getCart();
  if(cart.length === 0){
    alert('Your cart is empty.');
    return;
  }

  // Dummy payment flow
  if(method === 'ONLINE'){
    // Simulate payment success
    alert('Redirecting to payment (dummy). Payment successful!');
  } else {
    alert('Order placed with Cash on Delivery. Thank you!');
  }

  // Save order summary locally (for demo), then clear cart
  const order = {
    id: 'ORD' + Date.now(),
    fullname, phone, address, city, pincode, method, items: cart, placedAt: new Date().toISOString()
  };
  // store under 'll_orders' (simple)
  const prev = JSON.parse(localStorage.getItem('ll_orders') || '[]');
  prev.push(order);
  localStorage.setItem('ll_orders', JSON.stringify(prev));

  clearCart();
  // redirect to thank you/home
  location.href = 'index.html';
}

/* ------------------------------
   Small utilities: toast, nav toggle
   ------------------------------ */
function showToast(msg){
  // lightweight toast
  const t = document.createElement('div');
  t.textContent = msg;
  t.style.position = 'fixed';
  t.style.bottom = '20px';
  t.style.left = '50%';
  t.style.transform = 'translateX(-50%)';
  t.style.background = '#111';
  t.style.color = '#fff';
  t.style.padding = '10px 14px';
  t.style.borderRadius = '8px';
  t.style.boxShadow = '0 6px 18px rgba(0,0,0,0.2)';
  t.style.zIndex = 9999;
  t.style.opacity = '0';
  t.style.transition = 'opacity 250ms ease';
  document.body.appendChild(t);
  requestAnimationFrame(()=> t.style.opacity = '1');
  setTimeout(()=>{ t.style.opacity = '0'; setTimeout(()=> t.remove(),300); }, 1800);
}

function toggleNav(){
  const el = document.getElementById('mobile-nav');
  if(!el) return;
  el.classList.toggle('hidden');
}

/* ------------------------------
   Small polyfills / init
   ------------------------------ */
(function(){
  // On load actions common to all pages
  updateCartCountUI();
})();
