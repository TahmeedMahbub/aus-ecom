/**
 * ADMIN BRANDS MODULE CONTROLLER — Bongo Curated Admin Panel
 * Full CRUD, Logo Preview, Origin, Active Toggle & Storefront Sync
 */

(function($) {
  'use strict';

  const state = {
    search: '',
    status: 'all',
    editingId: null,
    deletingId: null,
  };

  $(document).ready(function() {
    if (!window.BongoBrands) {
      console.error('BongoBrands store missing!');
      return;
    }

    initEventListeners();
    renderModule();
  });

  function initEventListeners() {
    $('#brand-search-input').on('input', function() {
      state.search = $(this).val().trim().toLowerCase();
      renderModule();
    });

    $('#brand-status-filter').on('change', function() {
      state.status = $(this).val();
      renderModule();
    });

    $('#reset-brand-filters-btn').on('click', function() {
      state.search = '';
      state.status = 'all';
      $('#brand-search-input').val('');
      $('#brand-status-filter').val('all');
      renderModule();
    });

    $('#open-add-brand-btn').on('click', function() {
      openBrandModal();
    });

    $('#brand-form').on('submit', function(e) {
      e.preventDefault();
      handleFormSubmit();
    });

    $('#brand-logo-input').on('input', function() {
      const url = $(this).val().trim();
      $('#brand-logo-preview').attr('src', url || '../assets/images/products/shirt-white.png');
    });

    $('#form-brand-name').on('input', function() {
      if (!state.editingId) {
        const slug = $(this).val().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        $('#form-brand-slug').val(slug);
      }
    });

    $('#confirm-delete-brand-btn').on('click', function() {
      if (state.deletingId) {
        const item = window.BongoBrands.getById(state.deletingId);
        window.BongoBrands.delete(state.deletingId);
        Admin.modal.hide('delete-brand-modal');
        Admin.toast({
          title: 'Brand Deleted',
          message: item ? `"${item.name}" brand removed.` : 'Brand deleted.',
          type: 'danger'
        });
        state.deletingId = null;
        renderModule();
      }
    });
  }

  function renderModule() {
    const allBrands = window.BongoBrands.getAll();
    const allProducts = window.BongoProducts ? window.BongoProducts.getAll() : [];

    // Stats
    const total = allBrands.length;
    const active = allBrands.filter(b => !b.isDisabled).length;
    const disabled = allBrands.filter(b => b.isDisabled).length;

    $('#stat-total-brands').text(total);
    $('#stat-active-brands').text(active);
    $('#stat-disabled-brands').text(disabled);
    $('#stat-branded-products').text(allProducts.length);

    // Filter
    let filtered = allBrands.filter(b => {
      const matchesSearch = !state.search || b.name.toLowerCase().includes(state.search) || b.slug.toLowerCase().includes(state.search) || (b.origin && b.origin.toLowerCase().includes(state.search));
      const matchesStatus = state.status === 'all' || (state.status === 'active' && !b.isDisabled) || (state.status === 'disabled' && b.isDisabled);
      return matchesSearch && matchesStatus;
    });

    renderTable(filtered, allProducts);
  }

  function renderTable(brands, products) {
    const $tbody = $('#brands-table-body');
    const $emptyState = $('#brands-empty-state');
    const $tableContainer = $('#brands-table-container');

    $tbody.empty();

    if (brands.length === 0) {
      $tableContainer.hide();
      $emptyState.show();
      return;
    }

    $emptyState.hide();
    $tableContainer.show();

    brands.forEach(b => {
      const logoPath = b.logo ? (b.logo.startsWith('http') || b.logo.startsWith('assets/') ? `../${b.logo}` : b.logo) : '../assets/images/products/shirt-white.png';
      const prodCount = products.filter(p => p.brand === b.name || p.brandId === b.id).length;

      const rowHtml = `
        <tr data-id="${b.id}" class="${b.isDisabled ? 'table-row-disabled' : ''}">
          <td><input type="checkbox" class="form-checkbox"></td>
          <td>
            <div class="table-media-item">
              <img src="${logoPath}" alt="${b.name}" class="table-thumb" onerror="this.src='../assets/images/products/shirt-white.png';">
              <div class="table-media-info">
                <span class="media-title">${b.name}</span>
                <span class="media-subtitle">ID: #${b.id}</span>
              </div>
            </div>
          </td>
          <td><code>${b.slug}</code></td>
          <td><span class="badge badge-neutral">📍 ${b.origin || 'Bangladesh'}</span></td>
          <td><span class="badge badge-brand">${prodCount} Products</span></td>
          <td>
            <label class="form-switch" title="Toggle active status">
              <input type="checkbox" class="brand-toggle-switch" data-id="${b.id}" ${!b.isDisabled ? 'checked' : ''}>
              <span class="switch-slider"></span>
            </label>
          </td>
          <td>
            <div style="display:flex; gap:0.35rem;">
              <button type="button" class="btn btn-sm btn-secondary edit-brand-btn" data-id="${b.id}">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                Edit
              </button>
              <button type="button" class="btn btn-sm btn-ghost delete-brand-btn" data-id="${b.id}" style="color:var(--color-danger);">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
              </button>
            </div>
          </td>
        </tr>
      `;
      $tbody.append(rowHtml);
    });

    $('.brand-toggle-switch').on('change', function() {
      const id = $(this).data('id');
      const updated = window.BongoBrands.toggleStatus(id);
      if (updated) {
        Admin.toast({
          title: updated.isDisabled ? 'Brand Disabled' : 'Brand Activated',
          message: `"${updated.name}" is now ${updated.isDisabled ? 'inactive' : 'active'}.`,
          type: updated.isDisabled ? 'warning' : 'success'
        });
        renderModule();
      }
    });

    $('.edit-brand-btn').on('click', function() {
      openBrandModal($(this).data('id'));
    });

    $('.delete-brand-btn').on('click', function() {
      openDeleteModal($(this).data('id'));
    });
  }

  function openBrandModal(id = null) {
    state.editingId = id;
    const $title = $('#brand-modal-title');
    const $submit = $('#brand-modal-submit-btn');

    if (id) {
      const item = window.BongoBrands.getById(id);
      if (!item) return;

      $title.text(`Edit Brand: ${item.name}`);
      $submit.text('Update Brand');

      $('#form-brand-name').val(item.name || '');
      $('#form-brand-slug').val(item.slug || '');
      $('#brand-logo-input').val(item.logo || '');
      $('#form-brand-origin').val(item.origin || 'Bangladesh');
      $('#form-brand-desc').val(item.desc || '');
      $('#form-brand-active').prop('checked', !item.isDisabled);

      const preview = item.logo ? (item.logo.startsWith('http') || item.logo.startsWith('assets/') ? `../${item.logo}` : item.logo) : '../assets/images/products/shirt-white.png';
      $('#brand-logo-preview').attr('src', preview);
    } else {
      $title.text('Create New Brand');
      $submit.text('Save Brand');

      $('#brand-form')[0].reset();
      $('#form-brand-origin').val('Bangladesh');
      $('#form-brand-active').prop('checked', true);
      $('#brand-logo-preview').attr('src', '../assets/images/products/shirt-white.png');
    }

    Admin.modal.show('brand-form-modal');
  }

  function handleFormSubmit() {
    const name = $('#form-brand-name').val().trim();
    const slug = $('#form-brand-slug').val().trim();
    const logo = $('#brand-logo-input').val().trim() || 'assets/images/products/shirt-white.png';
    const origin = $('#form-brand-origin').val().trim() || 'Bangladesh';
    const desc = $('#form-brand-desc').val().trim();
    const isActive = $('#form-brand-active').is(':checked');

    if (!name) {
      alert('Please enter a brand name.');
      $('#form-brand-name').focus();
      return;
    }

    const payload = {
      name,
      slug,
      logo,
      origin,
      desc,
      isDisabled: !isActive
    };

    if (state.editingId) {
      window.BongoBrands.update(state.editingId, payload);
      Admin.toast({ title: 'Brand Updated', message: `"${name}" updated successfully.`, type: 'success' });
    } else {
      window.BongoBrands.create(payload);
      Admin.toast({ title: 'Brand Created', message: `"${name}" added successfully.`, type: 'success' });
    }

    Admin.modal.hide('brand-form-modal');
    renderModule();
  }

  function openDeleteModal(id) {
    state.deletingId = id;
    const item = window.BongoBrands.getById(id);
    if (!item) return;

    $('#delete-brand-name-target').text(item.name);
    Admin.modal.show('delete-brand-modal');
  }

})(jQuery);
