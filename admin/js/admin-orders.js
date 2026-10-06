/**
 * ADMIN ORDERS MODULE CONTROLLER — Bongo Curated Admin Panel
 * Handles Order Listing, Filters (Search, Status, Payment, Date), Sorting, Pagination,
 * and Quick Actions (Status Change, Cancel, Refund Modals).
 */

(function($) {
  'use strict';

  const state = {
    search: '',
    orderStatus: 'all',
    paymentStatus: 'all',
    dateFilter: 'all',
    sortBy: 'date-desc',
    page: 1,
    pageSize: 8,
    activeOrderId: null
  };

  $(document).ready(function() {
    if (!window.BongoOrders) {
      console.error('BongoOrders store missing!');
      return;
    }

    initEventListeners();
    renderModule();
  });

  function initEventListeners() {
    // Search input
    $('#order-search-input').on('input', function() {
      state.search = $(this).val().trim().toLowerCase();
      state.page = 1;
      renderModule();
    });

    // Filters
    $('#order-status-filter').on('change', function() {
      state.orderStatus = $(this).val();
      state.page = 1;
      renderModule();
    });

    $('#payment-status-filter').on('change', function() {
      state.paymentStatus = $(this).val();
      state.page = 1;
      renderModule();
    });

    $('#date-filter').on('change', function() {
      state.dateFilter = $(this).val();
      state.page = 1;
      renderModule();
    });

    $('#order-sort-by').on('change', function() {
      state.sortBy = $(this).val();
      renderModule();
    });

    $('#reset-order-filters-btn').on('click', function() {
      state.search = '';
      state.orderStatus = 'all';
      state.paymentStatus = 'all';
      state.dateFilter = 'all';
      state.sortBy = 'date-desc';
      state.page = 1;

      $('#order-search-input').val('');
      $('#order-status-filter').val('all');
      $('#payment-status-filter').val('all');
      $('#date-filter').val('all');
      $('#order-sort-by').val('date-desc');
      renderModule();
    });

    // Quick Status Update Modal Submit
    $('#change-status-form').on('submit', function(e) {
      e.preventDefault();
      const newStatus = $('#update-order-status-select').val();
      const note = $('#update-order-status-note').val().trim();

      if (!state.activeOrderId) return;
      const updated = window.BongoOrders.updateStatus(state.activeOrderId, newStatus, note, 'Tahmeed M.');
      if (updated) {
        Admin.modal.hide('change-status-modal');
        Admin.toast({
          title: 'Order Status Updated',
          message: `${updated.orderNumber} status changed to ${newStatus}.`,
          type: 'success'
        });
        renderModule();
      }
    });

    // Cancel Order Modal Submit
    $('#cancel-order-form').on('submit', function(e) {
      e.preventDefault();
      const reason = $('#cancel-order-reason').val().trim();
      if (!state.activeOrderId) return;

      const updated = window.BongoOrders.cancelOrder(state.activeOrderId, reason, 'Tahmeed M.');
      if (updated) {
        Admin.modal.hide('cancel-order-modal');
        Admin.toast({
          title: 'Order Cancelled',
          message: `${updated.orderNumber} has been cancelled.`,
          type: 'warning'
        });
        renderModule();
      }
    });

    // Refund Order Modal Submit
    $('#refund-order-form').on('submit', function(e) {
      e.preventDefault();
      const refundAmount = $('#refund-order-amount').val();
      const reason = $('#refund-order-reason').val().trim();
      if (!state.activeOrderId) return;

      const updated = window.BongoOrders.refundOrder(state.activeOrderId, refundAmount, reason, 'Tahmeed M.');
      if (updated) {
        Admin.modal.hide('refund-order-modal');
        Admin.toast({
          title: 'Refund Processed',
          message: `Refund of A$${parseFloat(refundAmount).toFixed(2)} processed for ${updated.orderNumber}.`,
          type: 'info'
        });
        renderModule();
      }
    });
  }

  function renderModule() {
    const allOrders = window.BongoOrders.getAll();

    // Stats calculations
    const totalOrders = allOrders.length;
    const totalRevenue = allOrders.reduce((sum, o) => (o.paymentStatus === 'Paid' ? sum + o.total : sum), 0);
    const pendingFulfillment = allOrders.filter(o => ['Pending', 'Confirmed', 'Processing'].includes(o.orderStatus)).length;
    const deliveredCount = allOrders.filter(o => o.orderStatus === 'Delivered').length;

    $('#stat-total-orders').text(totalOrders);
    $('#stat-total-revenue').text(`A$${totalRevenue.toFixed(2)}`);
    $('#stat-pending-fulfillment').text(pendingFulfillment);
    $('#stat-delivered-orders').text(deliveredCount);

    // Filtering
    const now = new Date();
    let filtered = allOrders.filter(o => {
      // Search
      const matchesSearch = !state.search ||
        o.orderNumber.toLowerCase().includes(state.search) ||
        o.customerName.toLowerCase().includes(state.search) ||
        o.customerEmail.toLowerCase().includes(state.search);

      // Order Status
      const matchesOrderStatus = state.orderStatus === 'all' || o.orderStatus.toLowerCase() === state.orderStatus.toLowerCase();

      // Payment Status
      const matchesPaymentStatus = state.paymentStatus === 'all' || o.paymentStatus.toLowerCase() === state.paymentStatus.toLowerCase();

      // Date Filter
      let matchesDate = true;
      const orderDate = new Date(o.createdAt);
      if (state.dateFilter === 'today') {
        matchesDate = orderDate.toDateString() === now.toDateString();
      } else if (state.dateFilter === '7days') {
        const diffDays = (now - orderDate) / (1000 * 3600 * 24);
        matchesDate = diffDays <= 7;
      } else if (state.dateFilter === '30days') {
        const diffDays = (now - orderDate) / (1000 * 3600 * 24);
        matchesDate = diffDays <= 30;
      }

      return matchesSearch && matchesOrderStatus && matchesPaymentStatus && matchesDate;
    });

    // Sorting
    filtered.sort((a, b) => {
      if (state.sortBy === 'date-desc') return new Date(b.createdAt) - new Date(a.createdAt);
      if (state.sortBy === 'date-asc') return new Date(a.createdAt) - new Date(b.createdAt);
      if (state.sortBy === 'total-desc') return b.total - a.total;
      if (state.sortBy === 'total-asc') return a.total - b.total;
      return 0;
    });

    // Pagination
    const totalFiltered = filtered.length;
    const totalPages = Math.ceil(totalFiltered / state.pageSize) || 1;
    if (state.page > totalPages) state.page = totalPages;
    const startIdx = (state.page - 1) * state.pageSize;
    const pagedOrders = filtered.slice(startIdx, startIdx + state.pageSize);

    renderTable(pagedOrders, totalFiltered);
    renderPagination(totalFiltered, totalPages);
  }

  function renderTable(orders, totalCount) {
    const $tbody = $('#orders-table-body');
    const $emptyState = $('#orders-empty-state');
    const $tableContainer = $('#orders-table-container');

    $tbody.empty();

    if (orders.length === 0) {
      $tableContainer.hide();
      $emptyState.show();
      return;
    }

    $emptyState.hide();
    $tableContainer.show();

    orders.forEach(o => {
      const orderDate = new Date(o.createdAt).toLocaleDateString('en-AU', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });

      // Status badges
      const statusBadgeMap = {
        'Pending': 'badge-pending',
        'Confirmed': 'badge-confirmed',
        'Processing': 'badge-processing',
        'Shipped': 'badge-shipped',
        'Delivered': 'badge-delivered',
        'Cancelled': 'badge-cancelled',
        'Refunded': 'badge-refunded'
      };

      const paymentBadgeMap = {
        'Paid': 'badge-paid',
        'Pending': 'badge-pending',
        'Failed': 'badge-failed',
        'Refunded': 'badge-refunded'
      };

      const orderBadge = statusBadgeMap[o.orderStatus] || 'badge-neutral';
      const paymentBadge = paymentBadgeMap[o.paymentStatus] || 'badge-neutral';

      // Item preview thumbnails
      const itemPreviews = (o.items || []).slice(0, 2).map(i => `
        <img src="../${i.image}" alt="${i.productName}" class="table-thumb-sm" title="${i.productName} (${i.variantColor}, ${i.variantSize}) x${i.quantity}" onerror="this.src='../assets/images/products/shirt-white.png';">
      `).join('');
      const moreCount = (o.items || []).length > 2 ? `<span style="font-size:0.75rem; color:var(--admin-text-muted); align-self:center;">+${o.items.length - 2} more</span>` : '';

      const rowHtml = `
        <tr data-id="${o.id}">
          <td><input type="checkbox" class="form-checkbox"></td>
          <td>
            <a href="order-details.html?id=${o.id}" class="media-title" style="font-weight: 700; color: var(--admin-brand); text-decoration: none;">
              ${o.orderNumber}
            </a>
          </td>
          <td><span style="font-size: 0.8125rem; white-space: nowrap;">${orderDate}</span></td>
          <td>
            <div style="display: flex; flex-direction: column;">
              <a href="customer-details.html?id=${o.customerId}" style="font-weight: 600; color: var(--admin-text-main); text-decoration: none;" class="hover-link">
                ${o.customerName}
              </a>
              <span style="font-size: 0.75rem; color: var(--admin-text-muted);">${o.customerEmail}</span>
            </div>
          </td>
          <td>
            <div style="display: flex; gap: 0.35rem; align-items: center;">
              ${itemPreviews}
              ${moreCount}
              <span class="badge badge-neutral" style="margin-left: 0.25rem;">${o.itemCount} ${o.itemCount === 1 ? 'item' : 'items'}</span>
            </div>
          </td>
          <td><strong style="font-size: 0.9375rem;">A$${o.total.toFixed(2)}</strong></td>
          <td><span class="badge ${paymentBadge}"><span class="badge-dot"></span>${o.paymentStatus}</span></td>
          <td><span class="badge ${orderBadge}"><span class="badge-dot"></span>${o.orderStatus}</span></td>
          <td>
            <div style="display:flex; gap:0.35rem; align-items:center;">
              <a href="order-details.html?id=${o.id}" class="btn btn-sm btn-secondary" title="View Full Order Details">
                View
              </a>
              <button type="button" class="btn btn-sm btn-ghost update-status-btn" data-id="${o.id}" title="Change Order Status">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
              </button>
            </div>
          </td>
        </tr>
      `;
      $tbody.append(rowHtml);
    });

    // Row Action Event Handlers
    $('.update-status-btn').on('click', function() {
      const id = $(this).data('id');
      openStatusModal(id);
    });
  }

  function renderPagination(totalItems, totalPages) {
    const $container = $('#orders-pagination');
    $container.empty();

    if (totalItems === 0) return;

    const startItem = (state.page - 1) * state.pageSize + 1;
    const endItem = Math.min(state.page * state.pageSize, totalItems);

    let buttonsHtml = `
      <div class="pagination-info">
        Showing <strong>${startItem}</strong> to <strong>${endItem}</strong> of <strong>${totalItems}</strong> orders
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

  function openStatusModal(id) {
    state.activeOrderId = id;
    const order = window.BongoOrders.getById(id);
    if (!order) return;

    $('#change-status-modal-order-id').text(order.orderNumber);
    $('#update-order-status-select').val(order.orderStatus);
    $('#update-order-status-note').val('');
    Admin.modal.show('change-status-modal');
  }

})(jQuery);
