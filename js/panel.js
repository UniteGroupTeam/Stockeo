import { auth, db, provider, isFirebaseConfigured, ADMIN_EMAIL } from './firebase-config.js';
import { signInWithPopup, signOut, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js';
import { collection, getDocs, query, where } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js';

let currentUser = null;
let allProducts = [];

document.addEventListener('DOMContentLoaded', async () => {
  setupTabs();
  setupReferralShare();
  await loadLocalCatalog();
  renderPendingOrders();

  if (isFirebaseConfigured() && auth) {
    document.getElementById('firebase-status-banner')?.classList.add('hidden');
    initAuthListeners();
  } else {
    const localRef = 'STOCKEO-' + Math.random().toString(36).substring(2, 7).toUpperCase();
    const refInput = document.getElementById('referral-link-input');
    if (refInput) refInput.value = window.location.origin + '/index.html?ref=' + localRef;
  }
});

function setupTabs() {
  const tabs = document.querySelectorAll('.tab-btn, .nav-tab-btn');
  tabs.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.getAttribute('data-tab');
      if (!target) return;
      document.querySelectorAll('.tab-content').forEach(s => s.classList.add('hidden'));
      document.getElementById(target)?.classList.remove('hidden');

      document.querySelectorAll('.tab-btn').forEach(b => {
        if (b.getAttribute('data-tab') === target) {
          b.classList.remove('border-transparent', 'text-accentSub');
          b.classList.add('border-white', 'text-white');
        } else {
          b.classList.add('border-transparent', 'text-accentSub');
          b.classList.remove('border-white', 'text-white');
        }
      });

      document.querySelectorAll('.nav-tab-btn').forEach(b => {
        if (b.getAttribute('data-tab') === target) {
          b.classList.remove('text-accentSub');
          b.classList.add('text-white');
        } else {
          b.classList.add('text-accentSub');
          b.classList.remove('text-white');
        }
      });
    });
  });
}

async function loadLocalCatalog() {
  try {
    const res = await fetch('data/products.json');
    allProducts = await res.json();
    renderProductsTable(allProducts);

    const filterInput = document.getElementById('filter-prods-panel');
    if (filterInput) {
      filterInput.addEventListener('input', (e) => {
        const q = e.target.value.toLowerCase();
        const filtered = allProducts.filter(p => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));
        renderProductsTable(filtered);
      });
    }
  } catch (err) {
    console.error('Error cargando catalogo:', err);
  }
}

function renderProductsTable(prods) {
  const tbody = document.getElementById('panel-products-table-body');
  if (!tbody) return;
  tbody.innerHTML = '';
  prods.forEach(p => {
    const tr = document.createElement('tr');
    tr.className = 'hover:bg-white/5 transition';
    tr.innerHTML = `
      <td class="p-3">
        <div class="flex items-center gap-2.5">
          <img src="${p.img}" alt="${p.name}" class="w-8 h-8 rounded-lg object-contain bg-cardDark border border-borderDark shrink-0">
          <div>
            <div class="font-semibold text-white line-clamp-1">${p.name}</div>
            <div class="text-[10px] text-accentSub uppercase">${p.category}</div>
          </div>
        </div>
      </td>
      <td class="p-3 text-center font-semibold text-white">$${p.priceMayoreo}</td>
      <td class="p-3 text-center text-accentSub">$${p.priceDistribuidor}</td>
      <td class="p-3 text-center text-accentSub">$${p.priceSugeridoMenudeo}</td>
      <td class="p-3 text-right font-bold text-brandGreen">+${p.profitPercent}%</td>
    `;
    tbody.appendChild(tr);
  });
}

function renderPendingOrders() {
  const container = document.getElementById('orders-list-container');
  const countBadge = document.getElementById('badge-pending-count');
  if (!container) return;
  const orders = JSON.parse(localStorage.getItem('stockeoOrders') || '[]');
  if (countBadge) countBadge.innerText = orders.length;

  if (orders.length === 0) {
    container.innerHTML = `
      <div class="glass-card p-6 rounded-2xl text-center text-accentSub space-y-2">
        <span class="material-symbols-rounded text-3xl text-neutral-600">inventory</span>
        <p class="text-sm">No tienes pedidos pendientes registrados en este dispositivo.</p>
        <a href="index.html#products" class="inline-block mt-2 text-xs text-white underline font-semibold">Ir al catálogo de mayoreo y cotizar</a>
      </div>
    `;
    return;
  }
  container.innerHTML = '';
  orders.forEach((ord, idx) => {
    const card = document.createElement('div');
    card.className = 'glass-card p-4 rounded-xl space-y-3';
    const itemsList = (ord.items || []).map(it => `
      <div class="flex justify-between text-neutral-300">
        <span>${it.quantity}x ${it.name}</span>
        <span class="font-medium text-white">$${it.quantity * it.priceMayoreo}</span>
      </div>
    `).join('');
    card.innerHTML = `
      <div class="flex items-center justify-between border-b border-borderDark pb-2.5">
        <div>
          <span class="text-[10px] font-mono text-accentSub">Folio: #${ord.id || (idx + 101)}</span>
          <div class="text-xs text-accentSub">${new Date(ord.date || Date.now()).toLocaleDateString()}</div>
        </div>
        <span class="text-xs font-semibold px-2 py-0.5 rounded-full ${ord.status === 'completado' ? 'bg-green-950 text-green-400 border border-green-800' : 'bg-amber-950 text-amber-300 border border-amber-800'}">
          ${ord.status || 'Pendiente'}
        </span>
      </div>
      <div class="text-xs space-y-1">${itemsList}</div>
      <div class="flex items-center justify-between pt-2 border-t border-borderDark text-xs">
        <span class="text-accentSub font-medium">Total Mayoreo:</span>
        <span class="text-sm font-bold font-display text-white">$${ord.total || 0} MXN</span>
      </div>
      <div class="flex gap-2 pt-1">
        <a href="https://wa.me/525574123521?text=${encodeURIComponent('Hola Stockeo, deseo consultar mi pedido mayorista #' + (ord.id || idx))}" target="_blank" class="flex-1 bg-white/10 hover:bg-white/20 text-white text-[11px] font-semibold py-2 rounded-lg text-center transition flex items-center justify-center gap-1">
          <span class="material-symbols-rounded text-sm">chat</span> Consultar WhatsApp
        </a>
      </div>
    `;
    container.appendChild(card);
  });
}

function setupReferralShare() {
  const btnCopy = document.getElementById('btn-copy-referral');
  const btnShare = document.getElementById('btn-share-referral');
  const input = document.getElementById('referral-link-input');
  if (btnCopy && input) {
    btnCopy.addEventListener('click', () => {
      navigator.clipboard.writeText(input.value)
        .then(() => alert('¡Enlace de referido mayorista copiado!'))
        .catch(() => alert('Enlace: ' + input.value));
    });
  }
  if (btnShare && input) {
    btnShare.addEventListener('click', () => {
      const shareData = { title: 'Stockeo Mayoreo Tech', text: '¡Únete a la red de mayoristas en Stockeo! Accede a precios de fábrica:', url: input.value };
      if (navigator.share) {
        navigator.share(shareData).catch(() => {});
      } else {
        window.open('https://wa.me/?text=' + encodeURIComponent(shareData.text + ' ' + shareData.url), '_blank');
      }
    });
  }
}

function initAuthListeners() {
  const btnLogin = document.getElementById('btn-login');
  const btnLogout = document.getElementById('btn-logout');
  btnLogin?.addEventListener('click', async () => {
    try { await signInWithPopup(auth, provider); } catch(e) { alert('Error con Google Auth: ' + e.message); }
  });
  btnLogout?.addEventListener('click', async () => { await signOut(auth); });
  onAuthStateChanged(auth, async (user) => {
    currentUser = user;
    updateAuthUI(user);
    if (user) {
      const refCode = user.uid.substring(0, 8).toUpperCase();
      const refInput = document.getElementById('referral-link-input');
      if (refInput) refInput.value = window.location.origin + '/index.html?ref=' + refCode;
      if (user.email === ADMIN_EMAIL) {
        document.getElementById('tab-admin-btn')?.classList.remove('hidden');
        document.getElementById('user-role-label').innerText = 'Administrador General';
        loadAdminFirestoreOrders();
      }
    }
  });
}

function updateAuthUI(user) {
  const btnLogin = document.getElementById('btn-login');
  const avatarWrap = document.getElementById('user-avatar-wrap');
  const avatarImg = document.getElementById('user-avatar');
  const greeting = document.getElementById('profile-greeting');
  if (user) {
    btnLogin?.classList.add('hidden');
    avatarWrap?.classList.remove('hidden');
    avatarWrap?.classList.add('flex');
    if (avatarImg) avatarImg.src = user.photoURL || 'https://i.imgur.com/vu6ESWi.jpeg';
    if (greeting) greeting.innerText = 'Hola, ' + (user.displayName || 'Distribuidor');
  } else {
    btnLogin?.classList.remove('hidden');
    avatarWrap?.classList.add('hidden');
    avatarWrap?.classList.remove('flex');
    if (greeting) greeting.innerText = 'Hola, Distribuidor Stockeo';
    document.getElementById('tab-admin-btn')?.classList.add('hidden');
  }
}

async function loadAdminFirestoreOrders() {
  if (!db) return;
  const container = document.getElementById('admin-pending-orders');
  if (!container) return;
  try {
    const q = query(collection(db, 'orders'), where('status', '==', 'pendiente'));
    const snap = await getDocs(q);
    if (snap.empty) {
      container.innerHTML = '<div class="p-4 bg-black/40 border border-borderDark rounded-xl text-center text-xs text-accentSub">No hay órdenes pendientes en Firestore.</div>';
      return;
    }
    container.innerHTML = '';
    snap.forEach(docSnap => {
      const o = docSnap.data();
      const div = document.createElement('div');
      div.className = 'p-3 bg-black/60 border border-borderDark rounded-xl text-xs space-y-1.5';
      div.innerHTML = `
        <div class="flex justify-between font-semibold text-white">
          <span>${o.customerName || o.userEmail || 'Cliente'}</span>
          <span class="text-amber-400">$${o.total || 0} MXN</span>
        </div>
        <div class="text-[11px] text-accentSub">${o.customerPhone || 'Sin teléfono'} | ${new Date(o.createdAt?.toDate?.() || Date.now()).toLocaleString()}</div>
      `;
      container.appendChild(div);
    });
  } catch(err) {
    console.error('Error cargando órdenes admin:', err);
  }
}
