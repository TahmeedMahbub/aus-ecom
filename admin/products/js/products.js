/**
 * ADMIN PRODUCTS LIST CONTROLLER — Bongo Curated Admin Panel
 * Manages Product Table, Filters, Search, Pagination, View/Edit/Delete Routing
 */

(function($) {
  'use strict';

  const state = {
    search: '',
    category: 'all',
    brand: 'all',
    status: 'all',
    availability: 'all',
    sort: 'newest',
    page: 1,
    pageSize: 8,
    deletingId: null,
  };

  const CATEGORY_LABEL_MAP = {
    fashion: 'Fashion',
    'home-decor': 'Home & Living',
    jute: 'Jute',
    handicrafts: 'Handcrafted',
    lifestyle: 'Gifts',
    preorder: 'Pre-order',
  };

  $(document).ready(function() {
    if (!window.BongoProducts) {
      console.error('BongoProducts data store missing!');
      return;
    }

    populateFilterDropdowns();
    initEventListeners();
    renderModule();
  });

  function populateFilterDropdowns() {
    const categories = window.BongoCategories ? window.BongoCategories.getAll().filter(c => !c.isDisabled) : [];
    const brands = window.BongoBrands ? window.BongoBrands.getAll().filter(b => !b.isDisabled) : [];

    const $catSelect = $('#product-category-filter');
    $catSelect.find('option:gt(0)').remove();
    categories.forEach(c => $catSelect.append(`<option value="${c.slug}">${c.name}</option>`));

    const $brandSelect = $('#product-brand-filter');
    $brandSelect.find('option:gt(0)').remove();
    brands.forEach(b => $brandSelect.append(`<option value="${b.name}">${b.name}</option>`));
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

    $('#product-brand-filter').on('change', function() {
      state.brand = $(this).val();
      state.page = 1;
      renderModule();
    });

    $('#product-status-filter').on('change', function() {
      state.status = $(this).val();
      state.page = 1;
      renderModule();
    });

    $('#product-availability-filter').on('change', function() {
      state.availability = $(this).val();
      state.page = 1;
      renderModule();
    });

    $('#product-sort-select').on('change', function() {
      state.sort = $(this).val();
      state.page = 1;
      renderModule();
    });

    $('#reset-filters-btn').on('click', function() {
      resetFilters();
    });

    // Confirm Delete Action
    $('#confirm-delete-btn').on('click', function() {
      if (state.deletingId) {
        const prod = window.BongoProducts.getById(state.deletingId);
        window.BongoProducts.delete(state.deletingId);
        Admin.modal.hide('delete-confirm-modal');
        Admin.toast({
          title: 'Product Deleted',
          message: prod ? `"${prod.name}" removed from catalog.` : 'Product deleted successfully.',
          type: 'danger'
        });
        state.deletingId = null;
        renderModule();
      }
    });
  }

  function resetFilters() {
    state.search = '';
    state.category = 'all';
    state.brand = 'all';
    state.status = 'all';
    state.availability = 'all';
    state.sort = 'newest';
    state.page = 1;

    $('#product-search-input').val('');
    $('#product-category-filter').val('all');
    $('#product-brand-filter').val('all');
    $('#product-status-filter').val('all');
    $('#product-availability-filter').val('all');
    $('#product-sort-select').val('newest');

    renderModule();
  }

  function renderModule() {
    const allProducts = window.BongoProducts.getAll();

    renderMetrics(allProducts);

    const filtered = filterProducts(allProducts);

    renderTable(filtered);
    renderPagination(filtered.length);
  }

  function renderMetrics(allProducts) {
    const total = allProducts.length;
    const active = allProducts.filter(p => !p.isDisabled).length;
    const inStock = allProducts.filter(p => !p.isDisabled && p.availability === 'instock').length;
    const disabledOrOut = allProducts.filter(p => p.isDisabled || p.availability === 'outofstock').length;

    $('#stat-total-products').text(total);
    $('#stat-active-products').text(active);
    $('#stat-instock-products').text(inStock);
    $('#stat-disabled-products').text(disabledOrOut);
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

    if (state.brand !== 'all') {
      list = list.filter(p => p.brand === state.brand);
    }

    if (state.status !== 'all') {
      list = list.filter(p => state.status === 'active' ? !p.isDisabled : p.isDisabled);
    }

    if (state.availability !== 'all') {
      list = list.filter(p => p.availability === state.availability);
    }

    if (state.sort === 'newest') {
      list.sort((a, b) => b.id - a.id);
    } else if (state.sort === 'price-low') {
      list.sort((a, b) => a.price - b.price);
    } else if (state.sort === 'price-high') {
      list.sort((a, b) => b.price - a.price);
    } else if (state.sort === 'name-az') {
      list.sort((a, b) => a.name.localeCompare(b.name));
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
      const catName = CATEGORY_LABEL_MAP[p.category] || p.category;
      const formattedPrice = `A$${parseFloat(p.price).toFixed(2)}`;
      const formattedOrigPrice = p.originalPrice ? `A$${parseFloat(p.originalPrice).toFixed(2)}` : null;
      
      const imgPath = p.image ? (p.image.startsWith('http') || p.image.startsWith('assets/') ? `../../${p.image}` : p.image) : '../../assets/images/products/shirt-white.png';

      let availabilityBadge = '';
      if (p.availability === 'instock') {
        availabilityBadge = '<span class="badge badge-success"><span class="badge-dot"></span> In Stock</span>';
      } else if (p.availability === 'lowstock') {
        availabilityBadge = '<span class="badge badge-warning"><span class="badge-dot"></span> Low Stock</span>';
      } else if (p.availability === 'preorder') {
        availabilityBadge = '<span class="badge badge-purple"><span class="badge-dot"></span> Pre-order</span>';
      } else {
        availabilityBadge = '<span class="badge badge-danger"><span class="badge-dot"></span> Out of Stock</span>';
      }

      const rowHtml = `
        <tr data-id="${p.id}" class="${p.isDisabled ? 'table-row-disabled' : ''}">
          <td><input type="checkbox" class="form-checkbox"></td>
          <td>
            <div class="table-media-item">
              <img src="${imgPath}" alt="${p.name}" class="table-thumb" onerror="this.src='../../assets/images/products/shirt-white.png';">
              <div class="table-media-info">
                <a href="view.html?id=${p.id}" class="product-title-link">${p.name}</a>
                <span class="media-subtitle">SKU: <code>${p.sku || '#' + p.id}</code></span>
              </div>
            </div>
          </td>
          <td><span class="badge badge-neutral">${catName}</span></td>
          <td><strong>${p.brand || 'Bongo Curated'}</strong></td>
          <td>
            <div style="display:flex; flex-direction:column;">
              <span style="font-weight:700; color:var(--admin-text-main);">${formattedPrice}</span>
              ${formattedOrigPrice ? `<span style="font-size:0.75rem; text-decoration:line-through; color:var(--admin-text-muted);">${formattedOrigPrice}</span>` : ''}
            </div>
          </td>
          <td><strong>${p.stockQty !== undefined ? p.stockQty : 25}</strong></td>
          <td>${availabilityBadge}</td>
          <td>
            <label class="form-switch" title="Toggle active status">
              <input type="checkbox" class="status-toggle-switch" data-id="${p.id}" ${!p.isDisabled ? 'checked' : ''}>
              <span class="switch-slider"></span>
            </label>
          </td>
          <td>
            <div class="action-buttons-group">
              <a href="view.html?id=${p.id}" class="btn btn-sm btn-secondary" title="View details">
                View
              </a>
              <a href="edit.html?id=${p.id}" class="btn btn-sm btn-secondary" title="Edit product">
                Edit
              </a>
              <button type="button" class="btn btn-sm btn-ghost delete-product-btn" data-id="${p.id}" title="Delete" style="color:var(--color-danger);">
                &times;
              </button>
            </div>
          </td>
        </tr>
      `;
      $tbody.append(rowHtml);
    });

    // Row Action Handlers
    $('.status-toggle-switch').on('change', function() {
      const id = $(this).data('id');
      const updated = window.BongoProducts.toggleStatus(id);
      if (updated) {
        Admin.toast({
          title: updated.isDisabled ? 'Product Disabled' : 'Product Activated',
          message: `"${updated.name}" status updated.`,
          type: updated.isDisabled ? 'warning' : 'success'
        });
        renderModule();
      }
    });

    $('.delete-product-btn').on('click', function() {
      const id = $(this).data('id');
      state.deletingId = id;
      const prod = window.BongoProducts.getById(id);
      if (!prod) return;

      $('#delete-product-name-target').text(prod.name);
      Admin.modal.show('delete-confirm-modal');
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

})(jQuery);
