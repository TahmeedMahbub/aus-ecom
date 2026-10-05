/**
 * ADMIN PRODUCTS MODULE CONTROLLER — Bongo Curated Admin Panel
 * Full Featured CRUD, Category/Subcategory/Brand Sync, Variants Builder, Pre-order Settings, Specs & Storefront Sync
 */

(function($) {
  'use strict';

  const state = {
    search: '',
    category: 'all',
    subcategory: 'all',
    brand: 'all',
    availability: 'all',
    sort: 'newest',
    page: 1,
    pageSize: 8,
    editingProductId: null,
    deletingProductId: null,
    variants: [],
  };

  $(document).ready(function() {
    if (!window.BongoProducts) {
      console.error('BongoProducts store missing!');
      return;
    }

    populateDropdownStores();
    initEventListeners();
    renderModule();
  });

  // Populate dynamic category, subcategory, and brand choices across filters & forms
  function populateDropdownStores() {
    const categories = window.BongoCategories ? window.BongoCategories.getAll().filter(c => !c.isDisabled) : [];
    const subcategories = window.BongoSubcategories ? window.BongoSubcategories.getAll().filter(s => !s.isDisabled) : [];
    const brands = window.BongoBrands ? window.BongoBrands.getAll().filter(b => !b.isDisabled) : [];

    // Filter Dropdowns
    const $catFilter = $('#product-category-filter');
    $catFilter.find('option:gt(0)').remove();
    categories.forEach(c => $catFilter.append(`<option value="${c.slug}">${c.name}</option>`));

    const $subFilter = $('#product-subcategory-filter');
    $subFilter.find('option:gt(0)').remove();
    subcategories.forEach(s => $subFilter.append(`<option value="${s.slug}">${s.name}</option>`));

    const $brandFilter = $('#product-brand-filter');
    $brandFilter.find('option:gt(0)').remove();
    brands.forEach(b => $brandFilter.append(`<option value="${b.name}">${b.name}</option>`));

    // Form Dropdowns
    const $formCat = $('#form-product-category');
    $formCat.empty();
    categories.forEach(c => $formCat.append(`<option value="${c.slug}">${c.name}</option>`));

    const $formBrand = $('#form-product-brand');
    $formBrand.empty();
    $formBrand.append('<option value="Bongo Curated">Bongo Curated (In-house)</option>');
    brands.forEach(b => {
      if (b.name !== 'Bongo Curated') {
        $formBrand.append(`<option value="${b.name}">${b.name}</option>`);
      }
    });

    updateFormSubcategories();
  }

  function updateFormSubcategories() {
    const selectedCatSlug = $('#form-product-category').val();
    const subcategories = window.BongoSubcategories ? window.BongoSubcategories.getAll().filter(s => !s.isDisabled) : [];
    const filteredSubs = subcategories.filter(s => s.categorySlug === selectedCatSlug);

    const $formSub = $('#form-product-subcategory');
    $formSub.empty();
    $formSub.append('<option value="">None (General Category Item)</option>');
    filteredSubs.forEach(s => $formSub.append(`<option value="${s.slug}">${s.name}</option>`));
  }

  function initEventListeners() {
    $('#product-search-input').on('input', function() {
      state.search = $(this).val().trim().toLowerCase();
      state.page = 1;
      renderModule();
    });

    $('#product-category-filter').on('change', function() {
      state.category = $(this).val();
      state.page = 1;
      renderModule();
    });

    $('#product-subcategory-filter').on('change', function() {
      state.subcategory = $(this).val();
      state.page = 1;
      renderModule();
    });

    $('#product-availability-filter').on('change', function() {
      state.availability = $(this).val();
      state.page = 1;
      renderModule();
    });

    $('#product-brand-filter').on('change', function() {
      state.brand = $(this).val();
      state.page = 1;
      renderModule();
    });

    $('#product-sort-select').on('change', function() {
      state.sort = $(this).val();
      state.page = 1;
      renderModule();
    });

    $('#reset-filters-btn').on('click', function(e) {
      e.preventDefault();
      resetFilters();
    });

    $('#reset-seed-data-btn').on('click', function(e) {
      e.preventDefault();
      if (confirm('Reset all catalog data (Products, Categories, Subcategories, Brands) back to original store launch seed?')) {
        if (window.BongoProducts) window.BongoProducts.resetToDefault();
        if (window.BongoCategories) window.BongoCategories.resetToDefault();
        if (window.BongoSubcategories) window.BongoSubcategories.resetToDefault();
        if (window.BongoBrands) window.BongoBrands.resetToDefault();
        populateDropdownStores();
        resetFilters();
        Admin.toast({ title: 'Data Reset', message: 'Restored original store catalog seed.', type: 'info' });
      }
    });

    $('#open-add-product-btn').on('click', function() {
      openProductModal();
    });

    $('#form-product-category').on('change', function() {
      updateFormSubcategories();
    });

    // Auto-generate slug from name
    $('#form-product-name').on('input', function() {
      if (!state.editingProductId) {
        const slug = $(this).val().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        $('#form-product-slug').val(slug);
      }
    });

    // Toggle Pre-order settings panel visibility
    $('#form-product-availability').on('change', function() {
      const isPreorder = $(this).val() === 'preorder';
      $('#preorder-settings-panel').toggle(isPreorder);
    });

    // Toggle Variants Builder visibility
    $('#form-product-has-variants').on('change', function() {
      const hasVar = $(this).is(':checked');
      $('#variants-builder-panel').toggle(hasVar);
    });

    // Add Variant Row Button
    $('#add-variant-row-btn').on('click', function() {
      addVariantRow();
    });

    // Image URL Live Preview
    $('#product-image-input').on('input', function() {
      const url = $(this).val().trim();
      $('#product-img-preview').attr('src', url || '../assets/images/products/shirt-white.png');
    });

    // Submit Product Form
    $('#product-form').on('submit', function(e) {
      e.preventDefault();
      handleFormSubmit();
    });

    // Confirm Delete Action
    $('#confirm-delete-btn').on('click', function() {
      if (state.deletingProductId) {
        const prod = window.BongoProducts.getById(state.deletingProductId);
        window.BongoProducts.delete(state.deletingProductId);
        Admin.modal.hide('delete-confirm-modal');
        Admin.toast({
          title: 'Product Deleted',
          message: prod ? `"${prod.name}" removed from store catalog.` : 'Product deleted successfully.',
          type: 'danger'
        });
        state.deletingProductId = null;
        renderModule();
      }
    });
  }

  function resetFilters() {
    state.search = '';
    state.category = 'all';
    state.subcategory = 'all';
    state.availability = 'all';
    state.brand = 'all';
    state.sort = 'newest';
    state.page = 1;

    $('#product-search-input').val('');
    $('#product-category-filter').val('all');
    $('#product-subcategory-filter').val('all');
    $('#product-availability-filter').val('all');
    $('#product-brand-filter').val('all');
    $('#product-sort-select').val('newest');

    renderModule();
  }

  function renderModule() {
    const allProducts = window.BongoProducts.getAll();

    renderMetrics(allProducts);

    let filtered = filterProducts(allProducts);

    renderTable(filtered);
    renderPagination(filtered.length);
  }

  function renderMetrics(allProducts) {
    const total = allProducts.length;
    const activeInStock = allProducts.filter(p => !p.isDisabled && p.availability === 'instock').length;
    const lowOrPre = allProducts.filter(p => p.availability === 'lowstock' || p.availability === 'preorder').length;
    const outOrDisabled = allProducts.filter(p => p.isDisabled || p.availability === 'outofstock').length;

    $('#stat-total-products').text(total);
    $('#stat-instock-products').text(activeInStock);
    $('#stat-lowstock-products').text(lowOrPre);
    $('#stat-disabled-products').text(outOrDisabled);
  }

  function filterProducts(products) {
    let list = [...products];

    if (state.search) {
      list = list.filter(p =>
        (p.name && p.name.toLowerCase().includes(state.search)) ||
        (p.sku && p.sku.toLowerCase().includes(state.search)) ||
        (p.brand && p.brand.toLowerCase().includes(state.search)) ||
        (p.category && p.category.toLowerCase().includes(state.search))
      );
    }

    if (state.category !== 'all') {
      list = list.filter(p => p.category === state.category);
    }

    if (state.subcategory !== 'all') {
      list = list.filter(p => p.subcategory === state.subcategory);
    }

    if (state.availability !== 'all') {
      if (state.availability === 'disabled') {
        list = list.filter(p => p.isDisabled);
      } else {
        list = list.filter(p => !p.isDisabled && p.availability === state.availability);
      }
    }

    if (state.brand !== 'all') {
      list = list.filter(p => p.brand === state.brand);
    }

    if (state.sort === 'newest') {
      list.sort((a, b) => b.id - a.id);
    } else if (state.sort === 'price-low') {
      list.sort((a, b) => a.price - b.price);
    } else if (state.sort === 'price-high') {
      list.sort((a, b) => b.price - a.price);
    } else if (state.sort === 'name-az') {
      list.sort((a, b) => a.name.localeCompare(b.name));
    } else if (state.sort === 'stock-low') {
      list.sort((a, b) => (a.stockQty || 0) - (b.stockQty || 0));
    }

    return list;
  }

  function renderTable(filteredProducts) {
    const $tbody = $('#products-table-body');
    const $emptyState = $('#products-empty-state');
    const $tableContainer = $('#products-table-container');

    $tbody.empty();

    if (filteredProducts.length === 0) {
      $tableContainer.hide();
      $emptyState.show();
      return;
    }

    $emptyState.hide();
    $tableContainer.show();

    const startIdx = (state.page - 1) * state.pageSize;
    const endIdx = startIdx + state.pageSize;
    const pageItems = filteredProducts.slice(startIdx, endIdx);

    pageItems.forEach(p => {
      const catObj = window.BongoCategories ? window.BongoCategories.getBySlug(p.category) : null;
      const catLabel = catObj ? catObj.name : (p.category ? p.category.toUpperCase() : 'General');
      
      const subObj = window.BongoSubcategories ? window.BongoSubcategories.getAll().find(s => s.slug === p.subcategory) : null;
      const subLabel = subObj ? subObj.name : p.subcategory;

      const formattedPrice = `A$${parseFloat(p.price).toFixed(2)}`;
      const formattedOrigPrice = p.originalPrice ? `A$${parseFloat(p.originalPrice).toFixed(2)}` : null;
      
      const imgPath = p.image ? (p.image.startsWith('http') || p.image.startsWith('assets/') ? `../${p.image}` : p.image) : '../assets/images/products/shirt-white.png';

      let badgeHtml = '';
      if (p.badge) {
        const badgeMap = {
          new: '<span class="badge badge-brand" style="font-size:0.65rem;">NEW</span>',
          launch: '<span class="badge badge-success" style="font-size:0.65rem;">LAUNCH OFFER</span>',
          lowstock: '<span class="badge badge-warning" style="font-size:0.65rem;">LOW STOCK</span>',
          preorder: '<span class="badge badge-purple" style="font-size:0.65rem;">PRE-ORDER</span>'
        };
        badgeHtml = badgeMap[p.badge] || `<span class="badge badge-neutral" style="font-size:0.65rem;">${p.badge.toUpperCase()}</span>`;
      }

      if (p.isFeatured) {
        badgeHtml += ' <span class="badge badge-warning" style="font-size:0.65rem;">★ FEATURED</span>';
      }

      let stockBadgeHtml = '';
      if (p.isDisabled) {
        stockBadgeHtml = '<span class="badge badge-neutral"><span class="badge-dot"></span> Disabled</span>';
      } else if (p.availability === 'instock') {
        stockBadgeHtml = `<span class="badge badge-success"><span class="badge-dot"></span> In Stock (${p.stockQty || 25})</span>`;
      } else if (p.availability === 'lowstock') {
        stockBadgeHtml = `<span class="badge badge-warning"><span class="badge-dot"></span> Low Stock (${p.stockQty || 3})</span>`;
      } else if (p.availability === 'preorder') {
        stockBadgeHtml = '<span class="badge badge-purple"><span class="badge-dot"></span> Pre-order</span>';
      } else {
        stockBadgeHtml = '<span class="badge badge-danger"><span class="badge-dot"></span> Out of Stock</span>';
      }

      const rowHtml = `
        <tr data-id="${p.id}" class="${p.isDisabled ? 'table-row-disabled' : ''}">
          <td><input type="checkbox" class="form-checkbox"></td>
          <td>
            <div class="table-media-item">
              <img src="${imgPath}" alt="${p.name}" class="table-thumb" onerror="this.src='../assets/images/products/shirt-white.png';">
              <div class="table-media-info">
                <div style="display:flex; align-items:center; gap:0.35rem; flex-wrap:wrap;">
                  <span class="media-title">${p.name}</span>
                  ${badgeHtml}
                </div>
                <span class="media-subtitle">${p.desc || 'No description'} · SKU: <code>${p.sku || '#' + p.id}</code></span>
              </div>
            </div>
          </td>
          <td>
            <div style="display:flex; flex-direction:column;">
              <span class="badge badge-neutral" style="align-self:flex-start;">${catLabel}</span>
              ${subLabel ? `<span style="font-size:0.75rem; color:var(--admin-text-muted); margin-top:2px;">↳ ${subLabel}</span>` : ''}
            </div>
          </td>
          <td><strong>${p.brand || 'Bongo Curated'}</strong></td>
          <td>
            <div style="display:flex; flex-direction:column;">
              <span style="font-weight:700; color:var(--admin-text-main);">${formattedPrice}</span>
              ${formattedOrigPrice ? `<span style="font-size:0.75rem; text-decoration:line-through; color:var(--admin-text-muted);">${formattedOrigPrice} ${p.discountPercentage ? `(-${p.discountPercentage}%)` : ''}</span>` : ''}
            </div>
          </td>
          <td>${stockBadgeHtml}</td>
          <td>
            <label class="form-switch" title="Toggle active storefront visibility">
              <input type="checkbox" class="status-toggle-switch" data-id="${p.id}" ${!p.isDisabled ? 'checked' : ''}>
              <span class="switch-slider"></span>
            </label>
          </td>
          <td>
            <div style="display:flex; gap:0.35rem;">
              <button type="button" class="btn btn-sm btn-secondary edit-product-btn" data-id="${p.id}">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                Edit
              </button>
              <button type="button" class="btn btn-sm btn-ghost delete-product-btn" data-id="${p.id}" style="color:var(--color-danger);">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
              </button>
            </div>
          </td>
        </tr>
      `;
      $tbody.append(rowHtml);
    });

    $('.status-toggle-switch').on('change', function() {
      const id = $(this).data('id');
      const updated = window.BongoProducts.toggleStatus(id);
      if (updated) {
        Admin.toast({
          title: updated.isDisabled ? 'Product Disabled' : 'Product Activated',
          message: `"${updated.name}" is now ${updated.isDisabled ? 'hidden from storefront' : 'visible on storefront'}.`,
          type: updated.isDisabled ? 'warning' : 'success'
        });
        renderModule();
      }
    });

    $('.edit-product-btn').on('click', function() {
      openProductModal($(this).data('id'));
    });

    $('.delete-product-btn').on('click', function() {
      openDeleteModal($(this).data('id'));
    });
  }

  function renderPagination(totalItems) {
    const $info = $('#products-pagination-info');
    const $controls = $('#products-pagination-controls');

    $controls.empty();
    if (totalItems === 0) {
      $info.text('Showing 0 of 0 products');
      return;
    }

    const totalPages = Math.ceil(totalItems / state.pageSize);
    const startItem = (state.page - 1) * state.pageSize + 1;
    const endItem = Math.min(state.page * state.pageSize, totalItems);

    $info.text(`Showing ${startItem}–${endItem} of ${totalItems} products`);

    const prevDisabled = state.page === 1 ? 'disabled' : '';
    $controls.append(`<button class="page-link" ${prevDisabled} id="pg-prev">&laquo;</button>`);

    for (let i = 1; i <= totalPages; i++) {
      const activeClass = i === state.page ? 'active' : '';
      $controls.append(`<button class="page-link ${activeClass}" data-page="${i}">${i}</button>`);
    }

    const nextDisabled = state.page === totalPages ? 'disabled' : '';
    $controls.append(`<button class="page-link" ${nextDisabled} id="pg-next">&raquo;</button>`);

    $controls.find('.page-link[data-page]').on('click', function() {
      state.page = parseInt($(this).data('page'));
      renderModule();
    });

    $('#pg-prev').on('click', function() {
      if (state.page > 1) { state.page--; renderModule(); }
    });

    $('#pg-next').on('click', function() {
      if (state.page < totalPages) { state.page++; renderModule(); }
    });
  }

  // ── Variant Builder Helpers ──
  function addVariantRow(variantData = {}) {
    const $container = $('#variant-rows-container');
    const rowId = Date.now() + Math.random().toString(36).substr(2, 4);

    const rowHtml = `
      <tr class="variant-row" id="var-row-${rowId}">
        <td><input type="text" class="form-control form-control-sm var-color" placeholder="e.g. Olive Green" value="${variantData.color || ''}"></td>
        <td><input type="text" class="form-control form-control-sm var-size" placeholder="e.g. XL" value="${variantData.size || ''}"></td>
        <td><input type="text" class="form-control form-control-sm var-sku" placeholder="SKU-VAR-01" value="${variantData.sku || ''}"></td>
        <td><input type="number" step="0.01" class="form-control form-control-sm var-price" placeholder="39.00" value="${variantData.price || ''}"></td>
        <td><input type="number" class="form-control form-control-sm var-stock" placeholder="10" value="${variantData.stock !== undefined ? variantData.stock : 10}"></td>
        <td>
          <button type="button" class="btn btn-sm btn-ghost remove-variant-btn" onclick="$(this).closest('tr').remove();" style="color:var(--color-danger);">
            &times;
          </button>
        </td>
      </tr>
    `;

    $container.append(rowHtml);
  }

  function collectVariantsFromUI() {
    const variants = [];
    $('.variant-row').each(function() {
      const color = $(this).find('.var-color').val().trim();
      const size = $(this).find('.var-size').val().trim();
      const sku = $(this).find('.var-sku').val().trim();
      const price = parseFloat($(this).find('.var-price').val()) || 0;
      const stock = parseInt($(this).find('.var-stock').val()) || 0;

      if (color || size || price > 0) {
        variants.push({ color, size, sku, price, stock });
      }
    });
    return variants;
  }

  // ── Product Form Modal ──
  function openProductModal(productId = null) {
    state.editingProductId = productId;
    populateDropdownStores();

    const $title = $('#product-modal-title');
    const $submitBtn = $('#product-modal-submit-btn');
    $('#variant-rows-container').empty();

    if (productId) {
      const prod = window.BongoProducts.getById(productId);
      if (!prod) return;

      $title.text(`Edit Product: ${prod.name}`);
      $submitBtn.text('Update Product');

      $('#form-product-name').val(prod.name || '');
      $('#form-product-slug').val(prod.slug || '');
      $('#form-product-sku').val(prod.sku || `SKU-BG-${prod.id}`);
      $('#form-product-category').val(prod.category || 'fashion');
      updateFormSubcategories();
      $('#form-product-subcategory').val(prod.subcategory || '');
      $('#form-product-brand').val(prod.brand || 'Bongo Curated');
      
      $('#form-product-price').val(prod.price || '');
      $('#form-product-orig-price').val(prod.originalPrice || '');
      $('#form-product-stock-qty').val(prod.stockQty !== undefined ? prod.stockQty : 25);
      $('#form-product-track-stock').prop('checked', prod.trackStock !== false);
      
      $('#form-product-availability').val(prod.availability || 'instock');
      $('#form-product-badge').val(prod.badge || '');
      $('#form-product-featured').prop('checked', Boolean(prod.isFeatured));
      $('#form-product-active').prop('checked', !prod.isDisabled);
      
      $('#form-product-image').val(prod.image || '');
      $('#form-product-desc').val(prod.desc || '');
      $('#form-product-full-desc').val(prod.fullDesc || prod.desc || '');
      
      $('#form-product-colors').val(Array.isArray(prod.colors) ? prod.colors.join(', ') : '');
      $('#form-product-sizes').val(Array.isArray(prod.sizes) ? prod.sizes.join(', ') : '');

      // Pre-order Settings
      const isPreorder = prod.availability === 'preorder' || Boolean(prod.isPreorder);
      $('#preorder-settings-panel').toggle(isPreorder);
      $('#form-preorder-release-date').val(prod.preorderSettings ? prod.preorderSettings.releaseDate : '');
      $('#form-preorder-note').val(prod.preorderSettings ? prod.preorderSettings.note : '');

      // Variants
      const hasVar = Boolean(prod.hasVariants);
      $('#form-product-has-variants').prop('checked', hasVar);
      $('#form-product-variant-type').val(prod.variantType || 'none');
      $('#variants-builder-panel').toggle(hasVar);

      if (hasVar && Array.isArray(prod.variants) && prod.variants.length > 0) {
        prod.variants.forEach(v => addVariantRow(v));
      } else {
        addVariantRow();
      }

      // Specs
      const specs = prod.specs || {};
      $('#form-spec-material').val(specs.material || '');
      $('#form-spec-fabric').val(specs.fabric || '');
      $('#form-spec-dimensions').val(specs.dimensions || '');
      $('#form-spec-fit').val(specs.fit || '');
      $('#form-spec-pattern').val(specs.pattern || '');
      $('#form-spec-finish').val(specs.finish || '');
      $('#form-spec-weight').val(specs.weight || '');
      $('#form-spec-care').val(specs.care || '');

      const previewImg = prod.image ? (prod.image.startsWith('http') || prod.image.startsWith('assets/') ? `../${prod.image}` : prod.image) : '../assets/images/products/shirt-white.png';
      $('#product-img-preview').attr('src', previewImg);
    } else {
      $title.text('Create New Product');
      $submitBtn.text('Save & Publish Product');

      $('#product-form')[0].reset();
      $('#form-product-image').val('assets/images/products/shirt-white.png');
      $('#form-product-category').val('fashion');
      updateFormSubcategories();
      $('#form-product-brand').val('Bongo Curated');
      $('#form-product-availability').val('instock');
      $('#form-product-stock-qty').val(25);
      $('#form-product-track-stock').prop('checked', true);
      $('#form-product-active').prop('checked', true);
      $('#preorder-settings-panel').hide();
      $('#variants-builder-panel').hide();
      $('#product-img-preview').attr('src', '../assets/images/products/shirt-white.png');
      addVariantRow();
    }

    Admin.modal.show('product-form-modal');
  }

  function handleFormSubmit() {
    const name = $('#form-product-name').val().trim();
    let slug = $('#form-product-slug').val().trim();
    if (!name) {
      alert('Please enter a product name.');
      $('#form-product-name').focus();
      return;
    }
    if (!slug) {
      slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    }

    const sku = $('#form-product-sku').val().trim() || `SKU-BG-${Date.now().toString().substr(-5)}`;
    const category = $('#form-product-category').val() || 'fashion';
    const subcategory = $('#form-product-subcategory').val() || '';
    const brand = $('#form-product-brand').val() || 'Bongo Curated';
    
    const priceVal = $('#form-product-price').val();
    const price = priceVal !== '' ? parseFloat(priceVal) : 0;
    const origPriceVal = $('#form-product-orig-price').val();
    const originalPrice = origPriceVal !== '' ? parseFloat(origPriceVal) : null;
    const stockQty = parseInt($('#form-product-stock-qty').val()) || 25;
    const trackStock = $('#form-product-track-stock').is(':checked');

    const availability = $('#form-product-availability').val() || 'instock';
    const badge = $('#form-product-badge').val() || '';
    const isFeatured = $('#form-product-featured').is(':checked');
    const isActive = $('#form-product-active').is(':checked');

    const image = $('#form-product-image').val().trim() || 'assets/images/products/shirt-white.png';
    const desc = $('#form-product-desc').val().trim();
    const fullDesc = $('#form-product-full-desc').val().trim();

    const colors = $('#form-product-colors').val().trim();
    const sizes = $('#form-product-sizes').val().trim();

    // Pre-order Settings
    const isPreorder = availability === 'preorder';
    const preorderSettings = {
      releaseDate: $('#form-preorder-release-date').val(),
      note: $('#form-preorder-note').val().trim()
    };

    // Variants
    const hasVariants = $('#form-product-has-variants').is(':checked');
    const variantType = $('#form-product-variant-type').val();
    const variants = hasVariants ? collectVariantsFromUI() : [];

    // Specs
    const specs = {
      material: $('#form-spec-material').val().trim(),
      fabric: $('#form-spec-fabric').val().trim(),
      dimensions: $('#form-spec-dimensions').val().trim(),
      fit: $('#form-spec-fit').val().trim(),
      pattern: $('#form-spec-pattern').val().trim(),
      finish: $('#form-spec-finish').val().trim(),
      weight: $('#form-spec-weight').val().trim(),
      care: $('#form-spec-care').val().trim()
    };

    const payload = {
      name,
      slug,
      sku,
      category,
      subcategory,
      brand,
      price,
      originalPrice,
      stockQty,
      trackStock,
      availability,
      badge,
      isFeatured,
      isDisabled: !isActive,
      image,
      desc,
      fullDesc,
      colors,
      sizes,
      isPreorder,
      preorderSettings,
      hasVariants,
      variantType,
      variants,
      specs
    };

    if (state.editingProductId) {
      window.BongoProducts.update(state.editingProductId, payload);
      Admin.toast({
        title: 'Product Updated',
        message: `"${name}" updated successfully.`,
        type: 'success'
      });
    } else {
      window.BongoProducts.create(payload);
      Admin.toast({
        title: 'Product Created',
        message: `"${name}" published to store catalog.`,
        type: 'success'
      });
    }

    Admin.modal.hide('product-form-modal');
    renderModule();
  }

  function openDeleteModal(id) {
    state.deletingProductId = id;
    const prod = window.BongoProducts.getById(id);
    if (!prod) return;

    $('#delete-product-name-target').text(prod.name);
    Admin.modal.show('delete-confirm-modal');
  }

})(jQuery);
