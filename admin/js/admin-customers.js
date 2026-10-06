/**
 * ADMIN CUSTOMERS MODULE CONTROLLER — Bongo Curated Admin Panel
 * List view controller for Customers with search, status filters, sorting,
 * account enable/disable toggles, edit modal, and pagination.
 */

(function($) {
  'use strict';

  const state = {
    search: '',
    status: 'all',
    sortBy: 'spent-desc',
    page: 1,
    pageSize: 8,
    editingCustomerId: null
  };

  $(document).ready(function() {
    if (!window.BongoCustomers) {
      console.error('BongoCustomers store missing!');
      return;
    }

    initEventListeners();
    renderModule();
  });

  function initEventListeners() {
    $('#customer-search-input').on('input', function() {
      state.search = $(this).val().trim().toLowerCase();
      state.page = 1;
      renderModule();
    });

    $('#customer-status-filter').on('change', function() {
      state.status = $(this).val();
      state.page = 1;
      renderModule();
    });

    $('#customer-sort-by').on('change', function() {
      state.sortBy = $(this).val();
      renderModule();
    });

    $('#reset-customer-filters-btn').on('click', function() {
      state.search = '';
      state.status = 'all';
      state.sortBy = 'spent-desc';
      state.page = 1;

      $('#customer-search-input').val('');
      $('#customer-status-filter').val('all');
      $('#customer-sort-by').val('spent-desc');
      renderModule();
    });

    $('#open-create-customer-btn').on('click', function() {
      openCustomerModal(null);
    });

    $('#customer-form').on('submit', function(e) {
      e.preventDefault();
      handleCustomerSubmit();
    });
  }

  function renderModule() {
    const customers = window.BongoCustomers.getAll();
    const orders = window.BongoOrders ? window.BongoOrders.getAll() : [];

    // Map stats & metadata to each customer
    const enriched = customers.map(c => {
      const custOrders = orders.filter(o => o.customerId === c.id);
      const totalSpent = custOrders.reduce((sum, o) => (o.paymentStatus === 'Paid' ? sum + o.total : sum), 0);
      const lastOrder = custOrders.length > 0 ? [...custOrders].sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt))[0] : null;

      return {
        ...c,
        orderCount: custOrders.length,
        totalSpent: totalSpent,
        lastOrder: lastOrder
      };
    });

    // Top Stats Overview
    const totalCustomers = enriched.length;
    const activeCustomers = enriched.filter(c => !c.isDisabled).length;
    const grandTotalSpent = enriched.reduce((sum, c) => sum + c.totalSpent, 0);
    const avgSpent = totalCustomers > 0 ? grandTotalSpent / totalCustomers : 0;

    $('#stat-total-customers').text(totalCustomers);
    $('#stat-active-customers').text(activeCustomers);
    $('#stat-avg-spend').text(`A$${avgSpent.toFixed(2)}`);
    $('#stat-total-customer-revenue').text(`A$${grandTotalSpent.toFixed(2)}`);

    // Filtering
    let filtered = enriched.filter(c => {
      const matchesSearch = !state.search ||
        c.name.toLowerCase().includes(state.search) ||
        c.email.toLowerCase().includes(state.search) ||
        c.phone.toLowerCase().includes(state.search);

      const matchesStatus = state.status === 'all' ||
        (state.status === 'active' && !c.isDisabled) ||
        (state.status === 'disabled' && c.isDisabled);

      return matchesSearch && matchesStatus;
    });

    // Sorting
    filtered.sort((a, b) => {
      if (state.sortBy === 'spent-desc') return b.totalSpent - a.totalSpent;
      if (state.sortBy === 'spent-asc') return a.totalSpent - b.totalSpent;
      if (state.sortBy === 'orders-desc') return b.orderCount - a.orderCount;
      if (state.sortBy === 'joined-desc') return new Date(b.joinedDate) - new Date(a.joinedDate);
      if (state.sortBy === 'name-asc') return a.name.localeCompare(b.name);
      return 0;
    });

    // Pagination
    const totalFiltered = filtered.length;
    const totalPages = Math.ceil(totalFiltered / state.pageSize) || 1;
    if (state.page > totalPages) state.page = totalPages;
    const startIdx = (state.page - 1) * state.pageSize;
    const pagedCustomers = filtered.slice(startIdx, startIdx + state.pageSize);

    renderTable(pagedCustomers);
    renderPagination(totalFiltered, totalPages);
  }

  function renderTable(customers) {
    const $tbody = $('#customers-table-body');
    const $emptyState = $('#customers-empty-state');
    const $tableContainer = $('#customers-table-container');

    $tbody.empty();

    if (customers.length === 0) {
      $tableContainer.hide();
      $emptyState.show();
      return;
    }

    $emptyState.hide();
    $tableContainer.show();

    customers.forEach(c => {
      const lastOrderInfo = c.lastOrder ? `
        <a href="order-details.html?id=${c.lastOrder.id}" style="font-weight:600; color:var(--admin-brand); text-decoration:none;" class="hover-link">
          ${c.lastOrder.orderNumber}
        </a>
        <div style="font-size:0.75rem; color:var(--admin-text-muted);">${new Date(c.lastOrder.createdAt).toLocaleDateString('en-AU')}</div>
      ` : '<span style="color:var(--admin-text-muted); font-size:0.8125rem;">No orders yet</span>';

      const rowHtml = `
        <tr data-id="${c.id}" class="${c.isDisabled ? 'table-row-disabled' : ''}">
          <td><input type="checkbox" class="form-checkbox"></td>
          <td>
            <div style="display: flex; align-items: center; gap: 0.75rem;">
              <div class="customer-avatar" style="width:40px; height:40px; font-size:0.9375rem;">${c.avatar || 'CU'}</div>
              <div style="display: flex; flex-direction: column;">
                <a href="customer-details.html?id=${c.id}" style="font-weight: 700; color: var(--admin-text-main); text-decoration: none;" class="hover-link">
                  ${c.name}
                </a>
                <span style="font-size: 0.75rem; color: var(--admin-text-muted);">Joined ${new Date(c.joinedDate).toLocaleDateString('en-AU', { month: 'short', year: 'numeric' })}</span>
              </div>
            </div>
          </td>
          <td><a href="mailto:${c.email}" style="color:var(--admin-text-main); text-decoration:none;">${c.email}</a></td>
          <td>${c.phone || '<span class="text-muted">N/A</span>'}</td>
          <td><span class="badge badge-brand">${c.orderCount} ${c.orderCount === 1 ? 'order' : 'orders'}</span></td>
          <td><strong style="font-size: 0.9375rem;">A$${c.totalSpent.toFixed(2)}</strong></td>
          <td>${lastOrderInfo}</td>
          <td>
            <label class="form-switch" title="Toggle Account Status">
              <input type="checkbox" class="customer-toggle-switch" data-id="${c.id}" ${!c.isDisabled ? 'checked' : ''}>
              <span class="switch-slider"></span>
            </label>
          </td>
          <td>
            <div style="display:flex; gap:0.35rem;">
              <a href="customer-details.html?id=${c.id}" class="btn btn-sm btn-secondary">
                Profile
              </a>
              <button type="button" class="btn btn-sm btn-ghost edit-customer-btn" data-id="${c.id}">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
              </button>
            </div>
          </td>
        </tr>
      `;
      $tbody.append(rowHtml);
    });

    // Row Event Handlers
    $('.customer-toggle-switch').on('change', function() {
      const id = $(this).data('id');
      const updated = window.BongoCustomers.toggleStatus(id);
      if (updated) {
        Admin.toast({
          title: updated.isDisabled ? 'Account Disabled' : 'Account Activated',
          message: `${updated.name}'s account is now ${updated.isDisabled ? 'disabled' : 'active'}.`,
          type: updated.isDisabled ? 'warning' : 'success'
        });
        renderModule();
      }
    });

    $('.edit-customer-btn').on('click', function() {
      openCustomerModal($(this).data('id'));
    });
  }

  function renderPagination(totalItems, totalPages) {
    const $container = $('#customers-pagination');
    $container.empty();

    if (totalItems === 0) return;

    const startItem = (state.page - 1) * state.pageSize + 1;
    const endItem = Math.min(state.page * state.pageSize, totalItems);

    let buttonsHtml = `
      <div class="pagination-info">
        Showing <strong>${startItem}</strong> to <strong>${endItem}</strong> of <strong>${totalItems}</strong> customers
      </div>
      <div class="pagination-buttons" style="display: flex; gap: 0.25rem;">
        <button type="button" class="btn btn-sm btn-secondary" id="prev-page-btn" ${state.page === 1 ? 'disabled' : ''}>Previous</button>
    `;

    for (let i = 1; i <= totalPages; i++) {
      buttonsHtml += `
        <button type="button" class="btn btn-sm ${i === state.page ? 'btn-primary' : 'btn-secondary'} page-num-btn" data-page="${i}">${i}</button>
      `;
    }

    buttonsHtml += `
        <button type="button" class="btn btn-sm btn-secondary" id="next-page-btn" ${state.page === totalPages ? 'disabled' : ''}>Next</button>
      </div>
    `;

    $container.html(buttonsHtml);

    $('#prev-page-btn').on('click', function() {
      if (state.page > 1) {
        state.page--;
        renderModule();
      }
    });

    $('#next-page-btn').on('click', function() {
      if (state.page < totalPages) {
        state.page++;
        renderModule();
      }
    });

    $('.page-num-btn').on('click', function() {
      state.page = parseInt($(this).data('page'));
      renderModule();
    });
  }

  function openCustomerModal(id = null) {
    state.editingCustomerId = id;
    const $title = $('#customer-modal-title');

    if (id) {
      const c = window.BongoCustomers.getById(id);
      if (!c) return;

      $title.text(`Edit Customer: ${c.name}`);
      $('#form-customer-name').val(c.name || '');
      $('#form-customer-email').val(c.email || '');
      $('#form-customer-phone').val(c.phone || '');
      $('#form-customer-street').val(c.shippingAddress ? c.shippingAddress.street : '');
      $('#form-customer-city').val(c.shippingAddress ? c.shippingAddress.city : '');
      $('#form-customer-state').val(c.shippingAddress ? c.shippingAddress.state : 'NSW');
      $('#form-customer-postcode').val(c.shippingAddress ? c.shippingAddress.postcode : '');
      $('#form-customer-notes').val(c.notes || '');
      $('#form-customer-active').prop('checked', !c.isDisabled);
    } else {
      $title.text('Create New Customer');
      $('#customer-form')[0].reset();
      $('#form-customer-active').prop('checked', true);
    }

    Admin.modal.show('customer-modal');
  }

  function handleCustomerSubmit() {
    const name = $('#form-customer-name').val().trim();
    const email = $('#form-customer-email').val().trim();
    const phone = $('#form-customer-phone').val().trim();
    const street = $('#form-customer-street').val().trim();
    const city = $('#form-customer-city').val().trim();
    const stateVal = $('#form-customer-state').val();
    const postcode = $('#form-customer-postcode').val().trim();
    const notes = $('#form-customer-notes').val().trim();
    const isActive = $('#form-customer-active').is(':checked');

    if (!name || !email) {
      alert('Name and email are required.');
      return;
    }

    const payload = {
      name,
      email,
      phone,
      isDisabled: !isActive,
      notes,
      shippingAddress: { recipientName: name, street, address2: '', city, state: stateVal, postcode, country: 'Australia', phone },
      billingAddress: { recipientName: name, street, address2: '', city, state: stateVal, postcode, country: 'Australia', phone }
    };

    if (state.editingCustomerId) {
      window.BongoCustomers.update(state.editingCustomerId, payload);
      Admin.toast({ title: 'Customer Updated', message: `Profile updated for ${name}.`, type: 'success' });
    } else {
      window.BongoCustomers.create(payload);
      Admin.toast({ title: 'Customer Created', message: `Customer ${name} added successfully.`, type: 'success' });
    }

    Admin.modal.hide('customer-modal');
    renderModule();
  }

})(jQuery);
