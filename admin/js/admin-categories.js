/**
 * ADMIN CATEGORIES MODULE CONTROLLER — Bongo Curated Admin Panel
 * Full CRUD, Active Toggle, Image Preview, Product Count & Storefront Sync
 */

(function($) {
  'use strict';

  const state = {
    search: '',
    status: 'all',
    page: 1,
    pageSize: 8,
    editingId: null,
    deletingId: null,
  };

  $(document).ready(function() {
    if (!window.BongoCategories) {
      console.error('BongoCategories store missing!');
      return;
    }

    initEventListeners();
    renderModule();
  });

  function initEventListeners() {
    $('#category-search-input').on('input', function() {
      state.search = $(this).val().trim().toLowerCase();
      state.page = 1;
      renderModule();
    });

    $('#category-status-filter').on('change', function() {
      state.status = $(this).val();
      state.page = 1;
      renderModule();
    });

    $('#reset-category-filters-btn').on('click', function() {
      state.search = '';
      state.status = 'all';
      state.page = 1;
      $('#category-search-input').val('');
      $('#category-status-filter').val('all');
      renderModule();
    });

    $('#open-add-category-btn').on('click', function() {
      openCategoryModal();
    });

    $('#category-form').on('submit', function(e) {
      e.preventDefault();
      handleFormSubmit();
    });

    $('#category-image-input').on('input', function() {
      const url = $(this).val().trim();
      $('#category-img-preview').attr('src', url || '../assets/images/products/shirt-white.png');
    });

    // Slug auto-generation on name change if slug empty
    $('#form-category-name').on('input', function() {
      if (!state.editingId) {
        const slug = $(this).val().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        $('#form-category-slug').val(slug);
      }
    });

    $('#confirm-delete-category-btn').on('click', function() {
      if (state.deletingId) {
        const item = window.BongoCategories.getById(state.deletingId);
        window.BongoCategories.delete(state.deletingId);
        Admin.modal.hide('delete-category-modal');
        Admin.toast({
          title: 'Category Deleted',
          message: item ? `"${item.name}" category removed.` : 'Category deleted successfully.',
          type: 'danger'
        });
        state.deletingId = null;
        renderModule();
      }
    });
  }

  function renderModule() {
    const allCategories = window.BongoCategories.getAll();
    const allProducts = window.BongoProducts ? window.BongoProducts.getAll() : [];

    // Render Stats
    const total = allCategories.length;
    const active = allCategories.filter(c => !c.isDisabled).length;
    const disabled = allCategories.filter(c => c.isDisabled).length;

    $('#stat-total-categories').text(total);
    $('#stat-active-categories').text(active);
    $('#stat-disabled-categories').text(disabled);
    $('#stat-categorized-products').text(allProducts.length);

    // Filter Items
    let filtered = allCategories.filter(c => {
      const matchesSearch = !state.search || c.name.toLowerCase().includes(state.search) || c.slug.toLowerCase().includes(state.search) || (c.desc && c.desc.toLowerCase().includes(state.search));
      const matchesStatus = state.status === 'all' || (state.status === 'active' && !c.isDisabled) || (state.status === 'disabled' && c.isDisabled);
      return matchesSearch && matchesStatus;
    });

    renderTable(filtered, allProducts);
  }

  function renderTable(categories, products) {
    const $tbody = $('#categories-table-body');
    const $emptyState = $('#categories-empty-state');
    const $tableContainer = $('#categories-table-container');

    $tbody.empty();

    if (categories.length === 0) {
      $tableContainer.hide();
      $emptyState.show();
      return;
    }

    $emptyState.hide();
    $tableContainer.show();

    categories.forEach(c => {
      // Calculate product count dynamically
      const prodCount = products.filter(p => p.category === c.slug || p.categoryId === c.id).length;
      const imgPath = c.image ? (c.image.startsWith('http') || c.image.startsWith('assets/') ? `../${c.image}` : c.image) : '../assets/images/products/shirt-white.png';

      const rowHtml = `
        <tr data-id="${c.id}" class="${c.isDisabled ? 'table-row-disabled' : ''}">
          <td><input type="checkbox" class="form-checkbox"></td>
          <td>
            <div class="table-media-item">
              <img src="${imgPath}" alt="${c.name}" class="table-thumb" onerror="this.src='../assets/images/products/shirt-white.png';">
              <div class="table-media-info">
                <span class="media-title">${c.name}</span>
                <span class="media-subtitle">ID: #${c.id}</span>
              </div>
            </div>
          </td>
          <td><code>${c.slug}</code></td>
          <td style="max-width: 280px; font-size:0.8125rem; color:var(--admin-text-muted);">${c.desc || 'No description'}</td>
          <td><span class="badge badge-brand">${prodCount} Products</span></td>
          <td>
            <label class="form-switch" title="Toggle active status">
              <input type="checkbox" class="category-toggle-switch" data-id="${c.id}" ${!c.isDisabled ? 'checked' : ''}>
              <span class="switch-slider"></span>
            </label>
          </td>
          <td>
            <div style="display:flex; gap:0.35rem;">
              <button type="button" class="btn btn-sm btn-secondary edit-category-btn" data-id="${c.id}">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                Edit
              </button>
              <button type="button" class="btn btn-sm btn-ghost delete-category-btn" data-id="${c.id}" style="color:var(--color-danger);">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
              </button>
            </div>
          </td>
        </tr>
      `;
      $tbody.append(rowHtml);
    });

    // Event Listeners for Row Actions
    $('.category-toggle-switch').on('change', function() {
      const id = $(this).data('id');
      const updated = window.BongoCategories.toggleStatus(id);
      if (updated) {
        Admin.toast({
          title: updated.isDisabled ? 'Category Disabled' : 'Category Activated',
          message: `"${updated.name}" is now ${updated.isDisabled ? 'inactive' : 'active'}.`,
          type: updated.isDisabled ? 'warning' : 'success'
        });
        renderModule();
      }
    });

    $('.edit-category-btn').on('click', function() {
      openCategoryModal($(this).data('id'));
    });

    $('.delete-category-btn').on('click', function() {
      openDeleteModal($(this).data('id'));
    });
  }

  function openCategoryModal(id = null) {
    state.editingId = id;
    const $title = $('#category-modal-title');
    const $submit = $('#category-modal-submit-btn');

    if (id) {
      const item = window.BongoCategories.getById(id);
      if (!item) return;

      $title.text(`Edit Category: ${item.name}`);
      $submit.text('Update Category');

      $('#form-category-name').val(item.name || '');
      $('#form-category-slug').val(item.slug || '');
      $('#category-image-input').val(item.image || '');
      $('#form-category-desc').val(item.desc || '');
      $('#form-category-active').prop('checked', !item.isDisabled);

      const preview = item.image ? (item.image.startsWith('http') || item.image.startsWith('assets/') ? `../${item.image}` : item.image) : '../assets/images/products/shirt-white.png';
      $('#category-img-preview').attr('src', preview);
    } else {
      $title.text('Create New Category');
      $submit.text('Save Category');

      $('#category-form')[0].reset();
      $('#form-category-active').prop('checked', true);
      $('#category-img-preview').attr('src', '../assets/images/products/shirt-white.png');
    }

    Admin.modal.show('category-form-modal');
  }

  function handleFormSubmit() {
    const name = $('#form-category-name').val().trim();
    const slug = $('#form-category-slug').val().trim();
    const image = $('#category-image-input').val().trim() || 'assets/images/products/shirt-white.png';
    const desc = $('#form-category-desc').val().trim();
    const isActive = $('#form-category-active').is(':checked');

    if (!name) {
      alert('Please enter a category name.');
      $('#form-category-name').focus();
      return;
    }

    const payload = {
      name,
      slug,
      image,
      desc,
      isDisabled: !isActive
    };

    if (state.editingId) {
      window.BongoCategories.update(state.editingId, payload);
      Admin.toast({ title: 'Category Updated', message: `"${name}" updated successfully.`, type: 'success' });
    } else {
      window.BongoCategories.create(payload);
      Admin.toast({ title: 'Category Created', message: `"${name}" added to categories store.`, type: 'success' });
    }

    Admin.modal.hide('category-form-modal');
    renderModule();
  }

  function openDeleteModal(id) {
    state.deletingId = id;
    const item = window.BongoCategories.getById(id);
    if (!item) return;

    $('#delete-category-name-target').text(item.name);
    Admin.modal.show('delete-category-modal');
  }

})(jQuery);
