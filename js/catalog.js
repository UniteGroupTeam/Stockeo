
let catalogProducts = [];
let wholesaleCart = JSON.parse(localStorage.getItem('stockeoCart') || '[]');

document.addEventListener('DOMContentLoaded', async () => {
  await loadWholesaleCatalog();
  updateCartBadge();
  setupCategoryEvents();
  setupSearchEvent();
  
  // Conectar enlaces del menú
  document.querySelectorAll('a').forEach(a => {
    const txt = a.innerText.trim();
    if (txt === 'Catálogo Mayoreo' || txt === 'Ver Catálogo Mayoreo') {
      a.href = '#catalogo';
    } else if (txt === 'Panel Mayorista') {
      a.href = 'panel.html';
    } else if (txt === 'WhatsApp Ventas') {
      a.href = 'https://wa.me/525574123521';
      a.target = '_blank';
    } else if (txt === 'Envíos') {
      a.href = 'envios.html';
    } else if (txt === 'Garantías') {
      a.href = 'garantias.html';
    }
  });
});

async function loadWholesaleCatalog() {
  try {
    const res = await fetch('data/products.json');
    catalogProducts = await res.json();
    renderCategories(catalogProducts);
    renderWholesaleProducts(catalogProducts);
  } catch (e) {
    console.error('Error cargando catálogo:', e);
  }
}

function renderCategories(products) {
  const cats = ['all', ...new Set(products.map(p => p.category))];
  const wrap = document.getElementById('category-pills');
  if (!wrap) return;
  wrap.innerHTML = cats.map(c => `
    <button class="cat-pill ${c === 'all' ? 'active' : ''}" data-cat="${c}" style="background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.12); color: #AAA; padding: 7px 16px; border-radius: 20px; font-size: 12px; font-weight: 600; cursor: pointer; white-space: nowrap; transition: all 0.2s;">
      ${c === 'all' ? 'Todos (' + products.length + ')' : c}
    </button>
  `).join('');
}

function setupCategoryEvents() {
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('cat-pill')) {
      document.querySelectorAll('.cat-pill').forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      const cat = e.target.getAttribute('data-cat');
      filterProducts(cat, document.getElementById('catalog-search').value);
    }
  });
}

function setupSearchEvent() {
  const input = document.getElementById('catalog-search');
  if (!input) return;
  input.addEventListener('input', (e) => {
    const activeCat = document.querySelector('.cat-pill.active')?.getAttribute('data-cat') || 'all';
    filterProducts(activeCat, e.target.value);
  });
}

function filterProducts(cat, term) {
  const q = (term || '').toLowerCase().trim();
  const filtered = catalogProducts.filter(p => {
    const matchCat = (cat === 'all' || p.category === cat);
    const matchQ = (!q || p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));
    return matchCat && matchQ;
  });
  renderWholesaleProducts(filtered);
}

function renderWholesaleProducts(prods) {
  const grid = document.getElementById('dynamic-wholesale-grid');
  const empty = document.getElementById('catalog-empty-msg');
  if (!grid) return;

  if (prods.length === 0) {
    grid.innerHTML = '';
    if (empty) empty.style.display = 'block';
    return;
  }
  if (empty) empty.style.display = 'none';

  grid.innerHTML = prods.map(p => `
    <div class="wholesale-card">
      <div style="position: relative;">
        <img src="${p.img}" alt="${p.name}" class="wholesale-card-img" loading="lazy">
        ${p.badge ? `<span style="position: absolute; top: 12px; right: 12px; font-size: 10px; font-weight: 800; text-transform: uppercase; background: rgba(37,211,102,0.2); color: #25D366; border: 1px solid rgba(37,211,102,0.4); padding: 3px 8px; border-radius: 6px;">${p.badge}</span>` : ''}
      </div>
      <div style="padding: 16px; display: flex; flex-direction: column; flex: 1;">
        <span style="font-size: 10px; color: #888; text-transform: uppercase; letter-spacing: 0.05em; font-weight: 600;">${p.category}</span>
        <h4 style="font-size: 14px; font-weight: 700; color: #FFF; margin: 4px 0 12px 0; line-height: 1.3; min-height: 36px;">${p.name}</h4>
        
        <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); border-radius: 8px; padding: 10px; margin-bottom: 14px;">
          <div style="display: flex; justify-content: space-between; align-items: baseline;">
            <span style="font-size: 11px; color: #888;">Precio Mayoreo:</span>
            <span style="font-size: 16px; font-weight: 800; color: #FFF;">$${p.priceMayoreo} <span style="font-size: 10px; color: #888;">MXN</span></span>
          </div>
          <div style="display: flex; justify-content: space-between; font-size: 11px; color: #666; margin-top: 4px;">
            <span>Sugerido Menudeo: $${p.priceSugeridoMenudeo}</span>
            <span style="color: #25D366; font-weight: 700;">Margen: +${p.profitPercent}%</span>
          </div>
        </div>

        <button onclick="addToWholesaleCart('${p.id}')" style="margin-top: auto; background: rgba(255,255,255,0.08); hover:background: #FFF; color: #FFF; border: 1px solid rgba(255,255,255,0.15); font-size: 12px; font-weight: 700; padding: 10px; border-radius: 8px; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 6px; transition: all 0.2s;">
          <span class="material-symbols-rounded" style="font-size: 16px;">add_shopping_cart</span> Agregar al Pedido
        </button>
      </div>
    </div>
  `).join('');
}

function addToWholesaleCart(prodId) {
  const p = catalogProducts.find(x => x.id === prodId);
  if (!p) return;
  const existing = wholesaleCart.find(x => x.id === prodId);
  if (existing) {
    existing.quantity += 1;
  } else {
    wholesaleCart.push({ ...p, quantity: 3 });
  }
  saveWholesaleCart();
  updateCartBadge();
  toggleCartModal(true);
}

function saveWholesaleCart() {
  localStorage.setItem('stockeoCart', JSON.stringify(wholesaleCart));
}

function updateCartBadge() {
  const totalCount = wholesaleCart.reduce((sum, item) => sum + item.quantity, 0);
  const badge = document.getElementById('cart-badge-count');
  if (badge) badge.innerText = totalCount;
}

function toggleCartModal(open) {
  const overlay = document.getElementById('cart-drawer-overlay');
  if (!overlay) return;
  overlay.style.display = open ? 'flex' : 'none';
  if (open) renderCartItems();
}

function renderCartItems() {
  const wrap = document.getElementById('cart-items-wrap');
  const totalDisplay = document.getElementById('cart-total-display');
  if (!wrap) return;

  if (wholesaleCart.length === 0) {
    wrap.innerHTML = '<div style="text-align: center; color: #666; margin: auto; padding: 40px 0;"><span class="material-symbols-rounded" style="font-size: 40px;">shopping_cart</span><p style="font-size: 13px; margin-top: 8px;">Tu pedido de mayoreo está vacío.</p></div>';
    if (totalDisplay) totalDisplay.innerText = '$0 MXN';
    return;
  }

  let total = 0;
  wrap.innerHTML = wholesaleCart.map((item, idx) => {
    const sub = item.quantity * item.priceMayoreo;
    total += sub;
    return `
      <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); border-radius: 10px; padding: 12px; display: flex; gap: 10px; align-items: center;">
        <img src="${item.img}" style="width: 44px; height: 44px; object-fit: contain; background: #000; border-radius: 6px;">
        <div style="flex: 1;">
          <h5 style="font-size: 12px; font-weight: 700; color: #FFF; margin: 0;">${item.name}</h5>
          <span style="font-size: 11px; color: #25D366; font-weight: 600;">$${item.priceMayoreo} c/u</span>
        </div>
        <div style="display: flex; align-items: center; gap: 6px;">
          <button onclick="changeCartQty(${idx}, -1)" style="width: 26px; height: 26px; background: rgba(255,255,255,0.1); border: none; color: #FFF; border-radius: 6px; cursor: pointer; font-size: 14px;">-</button>
          <span style="font-size: 12px; font-weight: 700; color: #FFF; min-width: 18px; text-align: center;">${item.quantity}</span>
          <button onclick="changeCartQty(${idx}, 1)" style="width: 26px; height: 26px; background: rgba(255,255,255,0.1); border: none; color: #FFF; border-radius: 6px; cursor: pointer; font-size: 14px;">+</button>
        </div>
      </div>
    `;
  }).join('');

  if (totalDisplay) totalDisplay.innerText = '$' + total.toLocaleString() + ' MXN';
}

function changeCartQty(index, delta) {
  if (!wholesaleCart[index]) return;
  wholesaleCart[index].quantity += delta;
  if (wholesaleCart[index].quantity <= 0) {
    wholesaleCart.splice(index, 1);
  }
  saveWholesaleCart();
  updateCartBadge();
  renderCartItems();
}

function enviarCotizacionWhatsApp() {
  if (wholesaleCart.length === 0) {
    alert('Tu pedido de mayoreo está vacío.');
    return;
  }
  const total = wholesaleCart.reduce((s, i) => s + (i.quantity * i.priceMayoreo), 0);
  const itemsText = wholesaleCart.map(i => `• ${i.quantity}x ${i.name} — $${i.quantity * i.priceMayoreo} MXN`).join('\n');
  const msg = `¡Hola Stockeo! Deseo cotizar/levantar este pedido de mayoreo:\n\n${itemsText}\n\nTotal Estimado: $${total} MXN\n\n¿Tienen disponibilidad para envío?`;

  const currentOrders = JSON.parse(localStorage.getItem('stockeoOrders') || '[]');
  currentOrders.unshift({
    id: Math.floor(1000 + Math.random() * 9000),
    date: new Date().toISOString(),
    items: [...wholesaleCart],
    total: total,
    status: 'pendiente'
  });
  localStorage.setItem('stockeoOrders', JSON.stringify(currentOrders));

  window.open('https://wa.me/525574123521?text=' + encodeURIComponent(msg), '_blank');
}
