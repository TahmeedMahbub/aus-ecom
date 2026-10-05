/**
 * ADMIN SUBCATEGORIES MODULE CONTROLLER — Bongo Curated Admin Panel
 * Full CRUD, Parent Category Selection, Image Preview, Active Toggle & Storefront Sync
 */

(function($) {
  'use strict';

  const state = {
    search: '',
    parentFilter: 'all',
    status: 'all',
    editingId: null,
    deletingId: null,
  };

  $(document).ready(function() {
    if (!window.BongoSubcategories || !window.BongoCategories) {
      console.error('BongoSubcategories or BongoCategories store missing!');
      return;
    }

    populateParentCategoryDropdowns();
    initEventListeners();
    renderModule();
  });

  function populateParentCategoryDropdowns() {
    const categories = window.BongoCategories.getAll().filter(c => !c.isDisabled);
    
    // Filter dropdown
    const $filterSelect = $('#subcategory-parent-filter');
    $filterSelect.find('option:gt(0)').remove();
    categories.forEach(c => {
      $filterSelect.append(`<option value="${c.id}">${c.name}</option>`);
    });

    // Form select
    const $formSelect = $('#form-subcategory-parent');
    $formSelect.empty();
    categories.forEach(c => {
      $formSelect.append(`<option value="${c.id}">${c.name}</option>`);
    });
  }

  function initEventListeners() {
    $('#subcategory-search-input').on('input', function() {
      state.search = $(this).val().trim().toLowerCase();
      renderModule();
    });

    $('#subcategory-parent-filter').on('change', function() {
      state.parentFilter = $(this).val();
      renderModule();
    });

    $('#subcategory-status-filter').on('change', function() {
      state.status = $(this).val();
      renderModule();
    });

    $('#reset-subcategory-filters-btn').on('click', function() {
      state.search = '';
      state.parentFilter = 'all';
      state.status = 'all';
      $('#subcategory-search-input').val('');
      $('#subcategory-parent-filter').val('all');
      $('#subcategory-status-filter').val('all');
      renderModule();
    });

    $('#open-add-subcategory-btn').on('click', function() {
      openSubcategoryModal();
    });

    $('#subcategory-form').on('submit', function(e) {
      e.preventDefault();
      handleFormSubmit();
    });

    $('#subcategory-image-input').on('input', function() {
      const url = $(this).val().trim();
      $('#subcategory-img-preview').attr('src', url || '../assets/images/products/shirt-white.png');
    });

    $('#form-subcategory-name').on('input', function() {
      if (!state.editingId) {
        const slug = $(this).val().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        $('#form-subcategory-slug').val(slug);
      }
    });

    $('#confirm-delete-subcategory-btn').on('click', function() {
      if (state.deletingId) {
        const item = window.BongoSubcategories.getById(state.deletingId);
        window.BongoSubcategories.delete(state.deletingId);
        Admin.modal.hide('delete-subcategory-modal');
        Admin.toast({
          title: 'Subcategory Deleted',
          message: item ? `"${item.name}" removed.` : 'Subcategory deleted.',
          type: 'danger'
        });
        state.deletingId = null;
        renderModule();
      }
    });
  }

  function renderModule() {
    const allSubs = window.BongoSubcategories.getAll();

    // Stats
    const total = allSubs.length;
    const active = allSubs.filter(s => !s.isDisabled).length;
    const disabled = allSubs.filter(s => s.isDisabled).length;

    $('#stat-total-subcategories').text(total);
    $('#stat-active-subcategories').text(active);
    $('#stat-disabled-subcategories').text(disabled);

    // Filter
    let filtered = allSubs.filter(s => {
      const matchesSearch = !state.search || s.name.toLowerCase().includes(state.search) || s.slug.toLowerCase().includes(state.search) || (s.desc && s.desc.toLowerCase().includes(state.search));
      const matchesParent = state.parentFilter === 'all' || s.categoryId === parseInt(state.parentFilter);
      const matchesStatus = state.status === 'all' || (state.status === 'active' && !s.isDisabled) || (state.status === 'disabled' && s.isDisabled);
      return matchesSearch && matchesParent && matchesStatus;
    });

    renderTable(filtered);
  }

  function renderTable(subcategories) {
    const $tbody = $('#subcategories-table-body');
    const $emptyState = $('#subcategories-empty-state');
    const $tableContainer = $('#subcategories-table-container');

    $tbody.empty();

    if (subcategories.length === 0) {
      $tableContainer.hide();
      $emptyState.show();
      return;
    }

    $emptyState.hide();
    $tableContainer.show();

    subcategories.forEach(s => {
      const imgPath = s.image ? (s.image.startsWith('http') || s.image.startsWith('assets/') ? `../${s.image}` : s.image) : '../assets/images/products/shirt-white.png';
      
      // Parent category name resolution
      const parentCat = window.BongoCategories ? window.BongoCategories.getById(s.categoryId) : null;
      const parentName = parentCat ? parentCat.name : (s.categoryName || 'Fashion');

      const rowHtml = `
        <tr data-id="${s.id}" class="${s.isDisabled ? 'table-row-disabled' : ''}">
          <td><input type="checkbox" class="form-checkbox"></td>
          <td>
            <div class="table-media-item">
              <img src="${imgPath}" alt="${s.name}" class="table-thumb" onerror="this.src='../assets/images/products/shirt-white.png';">
              <div class="table-media-info">
                <span class="media-title">${s.name}</span>
                <span class="media-subtitle">ID: #${s.id}</span>
              </div>
            </div>
          </td>
          <td><span class="badge badge-brand" style="font-weight:600;">${parentName}</span></td>
          <td><code>${s.slug}</code></td>
          <td style="max-width: 260px; font-size:0.8125rem; color:var(--admin-text-muted);">${s.desc || 'No description'}</td>
          <td>
            <label class="form-switch" title="Toggle active status">
              <input type="checkbox" class="subcategory-toggle-switch" data-id="${s.id}" ${!s.isDisabled ? 'checked' : ''}>
              <span class="switch-slider"></span>
            </label>
          </td>
          <td>
            <div style="display:flex; gap:0.35rem;">
              <button type="button" class="btn btn-sm btn-secondary edit-subcategory-btn" data-id="${s.id}">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                Edit
              </button>
              <button type="button" class="btn btn-sm btn-ghost delete-subcategory-btn" data-id="${s.id}" style="color:var(--color-danger);">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
              </button>
            </div>
          </td>
        </tr>
      `;
      $tbody.append(rowHtml);
    });

    // Row Action Listeners
    $('.subcategory-toggle-switch').on('change', function() {
      const id = $(this).data('id');
      const updated = window.BongoSubcategories.toggleStatus(id);
      if (updated) {
        Admin.toast({
          title: updated.isDisabled ? 'Subcategory Disabled' : 'Subcategory Activated',
          message: `"${updated.name}" is now ${updated.isDisabled ? 'inactive' : 'active'}.`,
          type: updated.isDisabled ? 'warning' : 'success'
        });
        renderModule();
      }
    });

    $('.edit-subcategory-btn').on('click', function() {
      openSubcategoryModal($(this).data('id'));
    });

    $('.delete-subcategory-btn').on('click', function() {
      openDeleteModal($(this).data('id'));
    });
  }

  function openSubcategoryModal(id = null) {
    state.editingId = id;
    populateParentCategoryDropdowns();

    const $title = $('#subcategory-modal-title');
    const $submit = $('#subcategory-modal-submit-btn');

    if (id) {
      const item = window.BongoSubcategories.getById(id);
      if (!item) return;

      $title.text(`Edit Subcategory: ${item.name}`);
      $submit.text('Update Subcategory');

      $('#form-subcategory-name').val(item.name || '');
      $('#form-subcategory-slug').val(item.slug || '');
      $('#form-subcategory-parent').val(item.categoryId || 1);
      $('#subcategory-image-input').val(item.image || '');
      $('#form-subcategory-desc').val(item.desc || '');
      $('#form-subcategory-active').prop('checked', !item.isDisabled);

      const preview = item.image ? (item.image.startsWith('http') || item.image.startsWith('assets/') ? `../${item.image}` : item.image) : '../assets/images/products/shirt-white.png';
      $('#subcategory-img-preview').attr('src', preview);
    } else {
      $title.text('Create New Subcategory');
      $submit.text('Save Subcategory');

      $('#subcategory-form')[0].reset();
      $('#form-subcategory-active').prop('checked', true);
      $('#subcategory-img-preview').attr('src', '../assets/images/products/shirt-white.png');
    }

    Admin.modal.show('subcategory-form-modal');
  }

  function handleFormSubmit() {
    const name = $('#form-subcategory-name').val().trim();
    const slug = $('#form-subcategory-slug').val().trim();
    const categoryId = parseInt($('#form-subcategory-parent').val());
    const image = $('#subcategory-image-input').val().trim() || 'assets/images/products/shirt-white.png';
    const desc = $('#form-subcategory-desc').val().trim();
    const isActive = $('#form-subcategory-active').is(':checked');

    if (!name) {
      alert('Please enter a subcategory name.');
      $('#form-subcategory-name').focus();
      return;
    }

    const payload = {
      name,
      slug,
      categoryId,
      image,
      desc,
      isDisabled: !isActive
    };

    if (state.editingId) {
      window.BongoSubcategories.update(state.editingId, payload);
      Admin.toast({ title: 'Subcategory Updated', message: `"${name}" updated successfully.`, type: 'success' });
    } else {
      window.BongoSubcategories.create(payload);
      Admin.toast({ title: 'Subcategory Created', message: `"${name}" added successfully.`, type: 'success' });
    }

    Admin.modal.hide('subcategory-form-modal');
    renderModule();
  }

  function openDeleteModal(id) {
    state.deletingId = id;
    const item = window.BongoSubcategories.getById(id);
    if (!item) return;

    $('#delete-subcategory-name-target').text(item.name);
    Admin.modal.show('delete-subcategory-modal');
  }

})(jQuery);
