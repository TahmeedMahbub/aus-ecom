/* ============================================================
   APP.JS — Bongo Curated Main Application
   Bangladesh-Made Lifestyle & Fashion Curated for Australia
   ============================================================ */

(function () {
  'use strict';

  /* ── State ── */
  const state = {
    cart: [],
    wishlist: [],
    currentSlide: 0,
    heroInterval: null,
    selectedModalProduct: null,
    selectedSize: null,
    currentCategoryFilter: 'all',
  };

  /* ══════════════════════════════════════════════════════════
     ICON HELPER — inline SVG icons
     ══════════════════════════════════════════════════════════ */
  const ICONS = {
    search: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"/></svg>`,
    user: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"/></svg>`,
    heart: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"/></svg>`,
    heartFill: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z"/></svg>`,
    bag: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"/></svg>`,
    chevronDown: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="chevron-down"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5"/></svg>`,
    arrowRight: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5"/></svg>`,
    home: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"/></svg>`,
    grid: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z"/></svg>`,
    check: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5"/></svg>`,
    facebook: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>`,
    instagram: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>`,
    tiktok: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>`,
  };

  const BADGE_MAP = {
    new: '<span class="badge badge-new">New</span>',
    launch: '<span class="badge badge-sale">Launch Offer</span>',
    preorder: '<span class="badge badge-preorder">Pre-order</span>',
    lowstock: '<span class="badge badge-limited">Low Stock</span>',
  };

  const CATEGORY_NAME_MAP = {
    fashion: 'Fashion',
    'home-decor': 'Home & Living',
    jute: 'Jute',
    handicrafts: 'Handcrafted',
    lifestyle: 'Gifts',
  };

  /* ══════════════════════════════════════════════════════════
     1. HERO SLIDER
     ══════════════════════════════════════════════════════════ */
  function renderHero() {
    const heroEl = document.getElementById('hero');
    if (!heroEl) return;

    let slidesHTML = HERO_SLIDES.map((slide, i) => `
      <div class="hero-slide ${i === 0 ? 'active' : ''}" data-slide="${i}">
        <div class="hero-slide-bg" style="background-image: url('${slide.image}')"></div>
        <div class="hero-slide-overlay"></div>
        <div class="hero-content container">
          <div class="hero-text">
            <div class="hero-label">${slide.label}</div>
            <h1 class="hero-headline">${slide.headline}</h1>
            <p class="hero-subtext">${slide.subtext}</p>
            <div style="display:flex; gap:1rem; flex-wrap:wrap;">
              <a href="${slide.ctaLink}" class="btn btn-white">${slide.cta}</a>
              <a href="${slide.secondaryCtaLink}" class="btn btn-outline-white">${slide.secondaryCta}</a>
            </div>
          </div>
        </div>
      </div>
    `).join('');

    heroEl.innerHTML = slidesHTML;
  }

  /* ══════════════════════════════════════════════════════════
     2. RENDER CATEGORIES
     ══════════════════════════════════════════════════════════ */
  function renderCategories() {
    const grid = document.getElementById('category-grid');
    if (!grid) return;

    grid.innerHTML = CATEGORIES.map(cat => `
      <a href="#products-section" class="category-card fade-up visible" data-filter-trigger="${cat.slug}">
        <div class="category-card-bg" style="background-image: url('${cat.image}'); background-color: ${cat.gradient.split(',')[0].replace('linear-gradient(135deg', '').trim()}"></div>
        <div class="category-card-overlay"></div>
        <div class="category-card-content">
          <h3 class="category-card-title">${cat.name}</h3>
          <p class="category-card-desc">${cat.desc}</p>
          <span class="category-card-link">Explore ${cat.name} ${ICONS.arrowRight}</span>
        </div>
      </a>
    `).join('');

    grid.querySelectorAll('[data-filter-trigger]').forEach(card => {
      card.addEventListener('click', () => {
        filterProducts(card.dataset.filterTrigger);
      });
    });
  }

  /* ══════════════════════════════════════════════════════════
     3. RENDER PRODUCT CARDS & FILTER TABS
     ══════════════════════════════════════════════════════════ */
  function createProductCardHTML(product) {
    const originalPriceHTML = product.originalPrice
      ? `<span class="original">${SITE.currency}${product.originalPrice.toFixed(2)}</span>`
      : `<span class="original">&nbsp;</span>`;

    return `
      <div class="product-card fade-up visible" data-product-id="${product.id}">
        <div class="product-card-image">
          <img src="${product.image}" alt="${product.name}" loading="lazy">
          <div class="product-card-badge">${BADGE_MAP[product.badge] || ''}</div>
          <button class="product-card-wishlist ${state.wishlist.includes(product.id) ? 'active' : ''}" data-wishlist-id="${product.id}" aria-label="Add to wishlist">
            ${state.wishlist.includes(product.id) ? ICONS.heartFill : ICONS.heart}
          </button>
        </div>
        <div class="product-card-info">
          <div class="product-card-category">${CATEGORY_NAME_MAP[product.category] || product.category}</div>
          <div class="product-card-name">${product.name}</div>
          <div class="product-card-desc">${product.desc}</div>
          <div class="product-card-footer">
            <div class="product-card-price">
              ${originalPriceHTML}
              <span class="current">${SITE.currency}${product.price.toFixed(2)}</span>
            </div>
            <button class="product-card-btn" data-view-details-id="${product.id}" aria-label="View details for ${product.name}">
              <span class="btn-text-desktop">View Details</span>
              <span class="btn-text-mobile">View</span>
            </button>
          </div>
        </div>
      </div>
    `;
  }

  function bindProductCardEvents(container) {
    container.querySelectorAll('.product-card-wishlist').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleWishlist(parseInt(btn.dataset.wishlistId));
      });
    });

    container.querySelectorAll('[data-view-details-id]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        openQuickView(parseInt(btn.dataset.viewDetailsId));
      });
    });

    container.querySelectorAll('.product-card').forEach(card => {
      card.addEventListener('click', () => {
        openQuickView(parseInt(card.dataset.productId));
      });
    });
  }

  window.createProductCardHTML = createProductCardHTML;
  window.bindProductCardEvents = bindProductCardEvents;

  function renderProducts(filter = 'all') {
    const grid = document.getElementById('product-grid');
    if (!grid) return;

    let filtered = PRODUCTS;
    if (filter === 'preorder') {
      filtered = PRODUCTS.filter(p => p.badge === 'preorder');
    } else if (filter !== 'all') {
      filtered = PRODUCTS.filter(p => p.category === filter);
    }

    if (filtered.length === 0) {
      grid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: var(--space-2xl); color: var(--color-grey-500);">No products found in this category.</div>`;
      return;
    }

    grid.innerHTML = filtered.map(p => createProductCardHTML(p)).join('');
    bindProductCardEvents(grid);
  }

  function filterProducts(filterCategory) {
    state.currentCategoryFilter = filterCategory;
    
    document.querySelectorAll('#product-filter-tabs .filter-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.filter === filterCategory);
    });

    renderProducts(filterCategory);
  }

  function initFilterTabs() {
    const tabsContainer = document.getElementById('product-filter-tabs');
    if (!tabsContainer) return;

    tabsContainer.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        filterProducts(btn.dataset.filter);
      });
    });

    document.addEventListener('click', (e) => {
      const trigger = e.target.closest('[data-filter-trigger]');
      if (trigger) {
        filterProducts(trigger.dataset.filterTrigger);
      }
      const filterLink = e.target.closest('[data-filter]');
      if (filterLink) {
        filterProducts(filterLink.dataset.filter);
      }
    });
  }

  /* ══════════════════════════════════════════════════════════
     4. RENDER HOME & LIVING SHOWCASE
     ══════════════════════════════════════════════════════════ */
  function renderHomeLivingShowcase() {
    const grid = document.getElementById('home-showcase-grid');
    if (!grid) return;

    const homeProducts = PRODUCTS.filter(p => p.category === 'home-decor' || p.id === 8 || p.id === 9).slice(0, 4);
    grid.innerHTML = homeProducts.map(p => createProductCardHTML(p)).join('');
    bindProductCardEvents(grid);
  }

  /* ══════════════════════════════════════════════════════════
     5. RENDER PREORDER CARDS
     ══════════════════════════════════════════════════════════ */
  function renderPreorderPreview() {
    const previewGrid = document.getElementById('preorder-products-preview');
    if (!previewGrid) return;

    const preorderProducts = PRODUCTS.filter(p => p.badge === 'preorder').slice(0, 4);
    if (preorderProducts.length === 0) {
      previewGrid.innerHTML = PRODUCTS.slice(0, 3).map(p => createProductCardHTML({...p, badge: 'preorder'})).join('');
    } else {
      previewGrid.innerHTML = preorderProducts.map(p => createProductCardHTML(p)).join('');
    }
    bindProductCardEvents(previewGrid);
  }

  /* ══════════════════════════════════════════════════════════
     NAVBAR
     ══════════════════════════════════════════════════════════ */
  function renderNavbar() {
    const navItems = document.getElementById('nav-items');
    const mobileNavItems = document.getElementById('mobile-nav-items');
    if (!navItems) return;

    navItems.innerHTML = NAV_CATEGORIES.map(cat => {
      let megaHTML = '';
      if (cat.megaMenu) {
        megaHTML = `
          <div class="mega-menu">
            ${cat.megaMenu.map(col => `
              <div class="mega-menu-col">
                <h4>${col.heading}</h4>
                <ul>${col.links.map(l => `<li><a href="products.html?category=${l.slug}">${l.label}</a></li>`).join('')}</ul>
              </div>
            `).join('')}
          </div>
        `;
      }
      const targetHref = `products.html?category=${cat.filterCategory}`;
      return `
        <li class="nav-item">
          <a href="${targetHref}" class="nav-link">${cat.name}${cat.megaMenu ? ICONS.chevronDown : ''}</a>
          ${megaHTML}
        </li>
      `;
    }).join('') + `
      <li class="nav-item">
        <a href="index.html#request-section" class="btn btn-outline" style="padding: 0.4rem 0.85rem; font-size: 0.75rem; margin-left: 0.5rem">Request From Bangladesh</a>
      </li>
    `;

    if (mobileNavItems) {
      mobileNavItems.innerHTML = NAV_CATEGORIES.map(cat => {
        let subHTML = '';
        if (cat.megaMenu) {
          const allLinks = cat.megaMenu.flatMap(col => col.links);
          subHTML = `
            <div class="mobile-submenu">
              ${allLinks.map(l => `<a href="products.html?category=${l.slug}">${l.label}</a>`).join('')}
            </div>
          `;
        }
        const targetHref = `products.html?category=${cat.filterCategory}`;
        return `
          <div class="mobile-nav-item ${cat.megaMenu ? 'has-submenu' : ''}">
            <a href="${targetHref}" class="mobile-nav-link">
              ${cat.name}
              ${cat.megaMenu ? ICONS.chevronDown : ''}
            </a>
            ${subHTML}
          </div>
        `;
      }).join('') + `
        <div class="mobile-nav-item" style="padding: 1rem 0">
          <a href="index.html#request-section" class="btn btn-primary" style="width:100%" onclick="document.getElementById('mobile-nav-close').click()">Request From Bangladesh</a>
        </div>
      `;

      mobileNavItems.querySelectorAll('.mobile-nav-item.has-submenu .mobile-nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
          if (link.parentElement.classList.contains('has-submenu')) {
            e.preventDefault();
            const item = link.closest('.mobile-nav-item');
            const sub = item.querySelector('.mobile-submenu');
            item.classList.toggle('expanded');
            sub.classList.toggle('open');
          }
        });
      });
    }
  }

  function renderNavbarIcons() {
    const el = document.getElementById('navbar-actions');
    if (!el) return;

    el.innerHTML = `
      <button class="navbar-action-btn" id="search-toggle" aria-label="Search">${ICONS.search}</button>
      <button class="navbar-action-btn" id="wishlist-toggle" aria-label="Wishlist">
        ${ICONS.heart}
      </button>
      <button class="navbar-action-btn" id="cart-toggle" aria-label="Cart">
        ${ICONS.bag}
        <span class="cart-count" id="cart-count" style="display:${state.cart.length ? 'flex' : 'none'}">${state.cart.length}</span>
      </button>
    `;

    document.getElementById('search-toggle').addEventListener('click', toggleSearch);
    document.getElementById('cart-toggle').addEventListener('click', toggleCart);
    document.getElementById('wishlist-toggle').addEventListener('click', () => {
      showToast(`You have ${state.wishlist.length} item(s) in your wishlist`);
    });
  }

  function renderBottomNav() {
    const el = document.getElementById('bottom-nav-inner');
    if (!el) return;

    el.innerHTML = `
      <a href="#" class="bottom-nav-item active">${ICONS.home}<span>Home</span></a>
      <a href="#categories-section" class="bottom-nav-item">${ICONS.grid}<span>Shop</span></a>
      <a href="#request-section" class="bottom-nav-item">${ICONS.heart}<span>Request</span></a>
      <a href="#" class="bottom-nav-item" id="bottom-cart-toggle">${ICONS.bag}<span>Bag</span></a>
    `;

    document.getElementById('bottom-cart-toggle').addEventListener('click', (e) => {
      e.preventDefault();
      toggleCart();
    });
  }

  /* ══════════════════════════════════════════════════════════
     FOOTER
     ══════════════════════════════════════════════════════════ */
  function renderFooter() {
    const footerGrid = document.getElementById('footer-grid');
    if (!footerGrid) return;

    footerGrid.innerHTML = `
      <div class="footer-brand">
        <div class="brand-name">${SITE.brandName}</div>
        <p>An Australian ecommerce store offering thoughtfully curated products made in Bangladesh — from fashion and handcrafted decor to natural jute and gifts.</p>
        <div class="footer-social">
          <a href="#" aria-label="Facebook">${ICONS.facebook}</a>
          <a href="#" aria-label="Instagram">${ICONS.instagram}</a>
          <a href="#" aria-label="TikTok">${ICONS.tiktok}</a>
        </div>
      </div>
      <div class="footer-col">
        <h4>Shop</h4>
        <ul>${FOOTER_LINKS.shop.map(l => `<li><a href="${l.href}">${l.label}</a></li>`).join('')}</ul>
      </div>
      <div class="footer-col">
        <h4>Customer Care</h4>
        <ul>${FOOTER_LINKS.help.map(l => `<li><a href="${l.href}">${l.label}</a></li>`).join('')}</ul>
      </div>
      <div class="footer-col">
        <h4>About</h4>
        <ul>${FOOTER_LINKS.about.map(l => `<li><a href="${l.href}">${l.label}</a></li>`).join('')}</ul>
      </div>
    `;
  }

  /* ══════════════════════════════════════════════════════════
     WISHLIST & CART
     ══════════════════════════════════════════════════════════ */
  function toggleWishlist(productId) {
    const idx = state.wishlist.indexOf(productId);
    if (idx > -1) {
      state.wishlist.splice(idx, 1);
      showToast('Removed from wishlist');
    } else {
      state.wishlist.push(productId);
      showToast('Saved to wishlist ♡');
    }
    renderProducts(state.currentCategoryFilter);
  }

  function addToCart(productId, size) {
    const product = PRODUCTS.find(p => p.id === productId);
    if (!product) return;

    state.cart.push({
      productId,
      name: product.name,
      price: product.price,
      size: size || (product.sizes.length ? product.sizes[0] : 'Standard'),
      image: product.image,
      desc: product.desc,
    });

    updateCartCount();
    showToast(`${product.name} added to bag`);
    closeQuickView();
    openCart();
  }

  function removeFromCart(index) {
    state.cart.splice(index, 1);
    updateCartCount();
    renderCartDrawer();
  }

  function updateCartCount() {
    const countEl = document.getElementById('cart-count');
    if (countEl) {
      countEl.textContent = state.cart.length;
      countEl.style.display = state.cart.length ? 'flex' : 'none';
    }
  }

  function renderCartDrawer() {
    const body = document.getElementById('cart-drawer-body');
    const footer = document.getElementById('cart-drawer-footer');
    if (!body) return;

    const subtotal = state.cart.reduce((sum, item) => sum + item.price, 0);

    if (state.cart.length === 0) {
      body.innerHTML = `
        <div class="cart-drawer-empty">
          ${ICONS.bag}
          <p>Your shopping bag is empty.</p>
          <a href="#products-section" class="btn btn-outline" style="margin-top: 1rem" onclick="document.getElementById('cart-drawer-close').click()">Start Shopping</a>
        </div>
      `;
      footer.innerHTML = '';
      return;
    }

    body.innerHTML = state.cart.map((item, i) => `
      <div class="cart-item">
        <div class="cart-item-image"><img src="${item.image}" alt="${item.name}"></div>
        <div class="cart-item-info">
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-item-meta">Option: ${item.size}</div>
          <div class="cart-item-price">${SITE.currency}${item.price.toFixed(2)}</div>
          <button class="cart-item-remove" data-cart-index="${i}">Remove</button>
        </div>
      </div>
    `).join('');

    footer.innerHTML = `
      <div class="cart-drawer-total">
        <span>Subtotal</span>
        <span>${SITE.currency}${subtotal.toFixed(2)}</span>
      </div>
      <button class="btn btn-primary btn-lg" style="width:100%" id="checkout-btn">Checkout</button>
    `;

    body.querySelectorAll('.cart-item-remove').forEach(btn => {
      btn.addEventListener('click', () => removeFromCart(parseInt(btn.dataset.cartIndex)));
    });

    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
      checkoutBtn.addEventListener('click', () => {
        showToast('Proceeding to checkout...');
      });
    }
  }

  function toggleCart() {
    const drawer = document.getElementById('cart-drawer');
    const isOpen = drawer.classList.contains('open');
    if (isOpen) {
      closeCart();
    } else {
      openCart();
    }
  }

  function openCart() {
    const drawer = document.getElementById('cart-drawer');
    const overlay = document.getElementById('cart-drawer-overlay');
    drawer.classList.add('open');
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    renderCartDrawer();
  }

  function closeCart() {
    const drawer = document.getElementById('cart-drawer');
    const overlay = document.getElementById('cart-drawer-overlay');
    drawer.classList.remove('open');
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  /* ══════════════════════════════════════════════════════════
     QUICK VIEW MODAL
     ══════════════════════════════════════════════════════════ */
  function openQuickView(productId) {
    const product = PRODUCTS.find(p => p.id === productId);
    if (!product) return;

    state.selectedModalProduct = product;
    state.selectedSize = product.sizes.length > 0 ? product.sizes[0] : null;

    const modal = document.getElementById('quick-view-modal');
    const overlay = document.getElementById('modal-overlay');

    document.getElementById('modal-product-img').src = product.image;
    document.getElementById('modal-product-img').alt = product.name;
    document.getElementById('modal-category-tag').textContent = CATEGORY_NAME_MAP[product.category] || product.category;
    modal.querySelector('.modal-title').textContent = product.name;
    modal.querySelector('.modal-subtitle').textContent = product.desc;

    const priceEl = modal.querySelector('.modal-price');
    priceEl.innerHTML = `
      <span class="current">${SITE.currency}${product.price.toFixed(2)}</span>
      ${product.originalPrice ? `<span class="original" style="margin-left: 0.5rem;">${SITE.currency}${product.originalPrice.toFixed(2)}</span>` : ''}
    `;

    const sizesEl = modal.querySelector('.modal-sizes');
    sizesEl.innerHTML = product.sizes.map((s, idx) => `
      <button class="modal-size-btn ${idx === 0 ? 'selected' : ''} ${product.outOfStockSizes.includes(s) ? 'out' : ''}" data-size="${s}" ${product.outOfStockSizes.includes(s) ? 'disabled' : ''}>${s}</button>
    `).join('');

    sizesEl.querySelectorAll('.modal-size-btn:not([disabled])').forEach(btn => {
      btn.addEventListener('click', () => {
        sizesEl.querySelectorAll('.modal-size-btn').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        state.selectedSize = btn.dataset.size;
      });
    });

    const colorsEl = modal.querySelector('.modal-colors');
    colorsEl.innerHTML = product.colors.map((c, i) => `
      <span class="modal-color-swatch ${i === 0 ? 'selected' : ''}" style="background:${c}"></span>
    `).join('');

    const addBtn = document.getElementById('modal-add-to-cart');
    addBtn.textContent = 'Add to Cart';

    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeQuickView() {
    const overlay = document.getElementById('modal-overlay');
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  /* ══════════════════════════════════════════════════════════
     SEARCH & NEWSLETTER
     ══════════════════════════════════════════════════════════ */
  /* ══════════════════════════════════════════════════════════
     SEARCH ENGINE (ECOMMERCE STANDARD)
     ══════════════════════════════════════════════════════════ */
  const SEARCH_MIN_CHARACTERS = 3;
  const RECENT_SEARCHES_KEY = 'bongo_recent_searches';

  function getRecentSearches() {
    try {
      const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      /* ignore */
    }
    return ['Linen Shirt', 'Nakshi Kantha', 'Jute Bag', 'Brass Vessel'];
  }

  function saveRecentSearches(searches) {
    try {
      localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(searches.slice(0, 6)));
    } catch (e) {
      /* ignore */
    }
  }

  function addRecentSearch(query) {
    if (!query || query.length < SEARCH_MIN_CHARACTERS) return;
    let searches = getRecentSearches();
    searches = searches.filter(s => s.toLowerCase() !== query.toLowerCase());
    searches.unshift(query);
    saveRecentSearches(searches);
  }

  function removeRecentSearch(query) {
    let searches = getRecentSearches();
    searches = searches.filter(s => s.toLowerCase() !== query.toLowerCase());
    saveRecentSearches(searches);
    renderRecentSearches();
  }

  function clearAllRecentSearches() {
    saveRecentSearches([]);
    renderRecentSearches();
  }

  function toggleSearch() {
    const overlay = document.getElementById('search-overlay');
    if (!overlay) return;

    overlay.classList.toggle('open');
    if (overlay.classList.contains('open')) {
      const input = document.getElementById('search-input');
      if (input) {
        input.value = '';
        toggleClearInputBtn('');
        input.focus();
      }
      renderRecentSearches();
      renderSuggestedProducts();
      handleSearchQuery('');
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }

  function toggleClearInputBtn(val) {
    const clearBtn = document.getElementById('search-clear-btn');
    if (!clearBtn) return;
    clearBtn.style.display = val && val.length > 0 ? 'flex' : 'none';
  }

  function renderRecentSearches() {
    const container = document.getElementById('recent-searches-list');
    const section = document.getElementById('recent-searches-section');
    if (!container) return;

    const searches = getRecentSearches();
    if (searches.length === 0) {
      if (section) section.style.display = 'none';
      return;
    }

    if (section) section.style.display = 'flex';
    container.innerHTML = searches.map(q => `
      <span class="search-recent-tag" data-query="${q}">
        <span>${q}</span>
        <button class="remove-recent-btn" data-remove-query="${q}" aria-label="Remove search ${q}">&times;</button>
      </span>
    `).join('');

    container.querySelectorAll('.search-recent-tag').forEach(tag => {
      tag.addEventListener('click', (e) => {
        if (e.target.classList.contains('remove-recent-btn')) return;
        const q = tag.dataset.query;
        const input = document.getElementById('search-input');
        if (input) {
          input.value = q;
          toggleClearInputBtn(q);
          handleSearchQuery(q);
        }
      });
    });

    container.querySelectorAll('.remove-recent-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        removeRecentSearch(btn.dataset.removeQuery);
      });
    });
  }

  function renderSuggestedProducts() {
    const container = document.getElementById('search-suggested-list');
    if (!container) return;

    const suggested = PRODUCTS.slice(0, 4);
    container.innerHTML = suggested.map(p => `
      <div class="search-result-item" data-search-product-id="${p.id}">
        <img src="${p.image}" alt="${p.name}" class="search-result-thumb" loading="lazy">
        <div class="search-result-info">
          <div class="search-result-name">${p.name}</div>
          <div class="search-result-meta">${CATEGORY_NAME_MAP[p.category] || p.category} · ${p.brand || 'Bongo Curated'}</div>
        </div>
        <div class="search-result-price">
          <span class="current">${SITE.currency}${p.price.toFixed(2)}</span>
          ${p.originalPrice ? `<span class="original">${SITE.currency}${p.originalPrice.toFixed(2)}</span>` : ''}
        </div>
      </div>
    `).join('');

    bindSearchResultClickEvents(container);
  }

  function bindSearchResultClickEvents(container) {
    container.querySelectorAll('[data-search-product-id]').forEach(item => {
      item.addEventListener('click', () => {
        const id = parseInt(item.dataset.searchProductId);
        const input = document.getElementById('search-input');
        if (input && input.value.trim().length >= SEARCH_MIN_CHARACTERS) {
          addRecentSearch(input.value.trim());
        }
        toggleSearch();
        openQuickView(id);
      });
    });
  }

  function handleSearchQuery(rawQuery) {
    const q = rawQuery.trim().toLowerCase();
    const defaultState = document.getElementById('search-default-state');
    const resultsState = document.getElementById('search-results-state');
    const noResultsState = document.getElementById('search-no-results-state');
    const countEl = document.getElementById('search-results-count');
    const listEl = document.getElementById('search-results-list');
    const noResultsText = document.getElementById('no-results-text');

    if (q.length < SEARCH_MIN_CHARACTERS) {
      if (defaultState) defaultState.style.display = 'flex';
      if (resultsState) resultsState.style.display = 'none';
      if (noResultsState) noResultsState.style.display = 'none';
      return;
    }

    if (defaultState) defaultState.style.display = 'none';

    const matches = PRODUCTS.filter(p => {
      const catName = (CATEGORY_NAME_MAP[p.category] || '').toLowerCase();
      const brandName = (p.brand || '').toLowerCase();
      return (
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        catName.includes(q) ||
        brandName.includes(q) ||
        p.desc.toLowerCase().includes(q)
      );
    });

    if (matches.length > 0) {
      if (noResultsState) noResultsState.style.display = 'none';
      if (resultsState) resultsState.style.display = 'block';

      if (countEl) {
        countEl.textContent = `${matches.length} result${matches.length === 1 ? '' : 's'} for "${rawQuery.trim()}"`;
      }

      if (listEl) {
        listEl.innerHTML = matches.map(p => `
          <div class="search-result-item" data-search-product-id="${p.id}">
            <img src="${p.image}" alt="${p.name}" class="search-result-thumb" loading="lazy">
            <div class="search-result-info">
              <div class="search-result-name">${p.name}</div>
              <div class="search-result-meta">${CATEGORY_NAME_MAP[p.category] || p.category} · ${p.brand || 'Bongo Curated'}</div>
            </div>
            <div class="search-result-price">
              <span class="current">${SITE.currency}${p.price.toFixed(2)}</span>
              ${p.originalPrice ? `<span class="original">${SITE.currency}${p.originalPrice.toFixed(2)}</span>` : ''}
            </div>
          </div>
        `).join('');

        bindSearchResultClickEvents(listEl);
      }
    } else {
      if (resultsState) resultsState.style.display = 'none';
      if (noResultsState) noResultsState.style.display = 'block';
      if (noResultsText) {
        noResultsText.textContent = `We couldn't find any items matching "${rawQuery.trim()}".`;
      }
    }
  }

  function initSearchSuggestions() {
    const input = document.getElementById('search-input');
    const clearBtn = document.getElementById('search-clear-btn');
    const closeBtn = document.getElementById('search-modal-close');
    const clearRecentBtn = document.getElementById('clear-recent-searches-btn');
    const browseAllBtn = document.getElementById('search-browse-all-btn');

    if (!input) return;

    input.addEventListener('input', (e) => {
      const val = e.target.value;
      toggleClearInputBtn(val);
      handleSearchQuery(val);
    });

    input.addEventListener('keyup', (e) => {
      if (e.key === 'Enter') {
        const q = input.value.trim();
        if (q.length >= SEARCH_MIN_CHARACTERS) {
          addRecentSearch(q);
          if (window.location.pathname.includes('products.html')) {
            toggleSearch();
            window.location.search = `?search=${encodeURIComponent(q)}`;
          }
        }
      }
    });

    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        input.value = '';
        toggleClearInputBtn('');
        input.focus();
        handleSearchQuery('');
      });
    }

    if (closeBtn) {
      closeBtn.addEventListener('click', toggleSearch);
    }

    if (clearRecentBtn) {
      clearRecentBtn.addEventListener('click', clearAllRecentSearches);
    }

    if (browseAllBtn) {
      browseAllBtn.addEventListener('click', () => {
        toggleSearch();
      });
    }
  }

  function toggleMobileNav() {
    const nav = document.getElementById('mobile-nav');
    const hamburger = document.getElementById('hamburger');
    nav.classList.toggle('open');
    hamburger.classList.toggle('active');
    document.body.style.overflow = nav.classList.contains('open') ? 'hidden' : '';
  }

  function showToast(message) {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
      <span class="toast-icon">${ICONS.check}</span>
      <span>${message}</span>
      <span class="toast-close">&times;</span>
    `;
    container.appendChild(toast);

    requestAnimationFrame(() => toast.classList.add('show'));
    const timeout = setTimeout(() => dismissToast(toast), 3500);

    toast.querySelector('.toast-close').addEventListener('click', () => {
      clearTimeout(timeout);
      dismissToast(toast);
    });
  }

  function dismissToast(toast) {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 400);
  }

  function renderLaunchOfferCountdown() {
    const el = document.getElementById('launch-offer-timer');
    if (!el) return;

    // Launch offer end date (October 15, 2026)
    const offerEndDate = new Date('2026-10-15T23:59:59+10:00').getTime();

    function update() {
      const now = new Date().getTime();
      const diff = offerEndDate - now;

      if (diff <= 0) {
        el.innerHTML = '<span style="font-size:0.75rem; color:var(--color-grey-600)">Offer Ended</span>';
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const mins = Math.floor((diff / (1000 * 60)) % 60);
      const secs = Math.floor((diff / 1000) % 60);

      el.innerHTML = `
        <div class="timer-unit-box"><div class="timer-unit-num">${String(days).padStart(2, '0')}</div><div class="timer-unit-label">Days</div></div>
        <span class="timer-unit-sep">:</span>
        <div class="timer-unit-box"><div class="timer-unit-num">${String(hours).padStart(2, '0')}</div><div class="timer-unit-label">Hrs</div></div>
        <span class="timer-unit-sep">:</span>
        <div class="timer-unit-box"><div class="timer-unit-num">${String(mins).padStart(2, '0')}</div><div class="timer-unit-label">Min</div></div>
        <span class="timer-unit-sep">:</span>
        <div class="timer-unit-box"><div class="timer-unit-num">${String(secs).padStart(2, '0')}</div><div class="timer-unit-label">Sec</div></div>
      `;
    }

    update();
    setInterval(update, 1000);
  }

  function initNewsletter() {
    const form = document.getElementById('newsletter-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = form.querySelector('.newsletter-input');
      const email = input.value.trim();

      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showToast('Please enter a valid email address');
        return;
      }

      showToast('Thank you for subscribing to our updates!');
      input.value = '';
    });
  }

  function initStickyNav() {
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 20);
    }, { passive: true });
  }

  function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });

    document.querySelectorAll('.fade-up:not(.visible)').forEach(el => observer.observe(el));
  }

  /* ══════════════════════════════════════════════════════════
     INIT ALL SECTIONS
     ══════════════════════════════════════════════════════════ */
  function init() {
    renderNavbar();
    renderNavbarIcons();
    renderBottomNav();
    renderHero();
    renderCategories();
    renderProducts('all');
    initFilterTabs();
    renderPreorderPreview();
    renderHomeLivingShowcase();
    renderFooter();

    renderLaunchOfferCountdown();
    initStickyNav();
    initNewsletter();
    initSearchSuggestions();

    // Event bindings
    document.getElementById('hamburger').addEventListener('click', toggleMobileNav);
    document.getElementById('mobile-nav-close').addEventListener('click', toggleMobileNav);
    document.getElementById('modal-close').addEventListener('click', closeQuickView);
    document.getElementById('modal-overlay').addEventListener('click', (e) => {
      if (e.target === e.currentTarget) closeQuickView();
    });
    
    document.getElementById('modal-add-to-cart').addEventListener('click', () => {
      if (state.selectedModalProduct) {
        addToCart(state.selectedModalProduct.id, state.selectedSize);
      }
    });

    document.getElementById('search-overlay').addEventListener('click', (e) => {
      if (e.target === e.currentTarget) toggleSearch();
    });

    document.getElementById('cart-drawer-close').addEventListener('click', closeCart);
    document.getElementById('cart-drawer-overlay').addEventListener('click', closeCart);

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeQuickView();
        closeCart();
        const searchOverlay = document.getElementById('search-overlay');
        if (searchOverlay.classList.contains('open')) toggleSearch();
        const mobileNav = document.getElementById('mobile-nav');
        if (mobileNav.classList.contains('open')) toggleMobileNav();
      }
    });

    requestAnimationFrame(() => {
      setTimeout(initScrollAnimations, 100);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
