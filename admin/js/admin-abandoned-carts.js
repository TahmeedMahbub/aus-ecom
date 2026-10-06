/**
 * ADMIN ABANDONED CARTS MODULE CONTROLLER — Bongo Curated Admin Panel
 * List view controller for Abandoned Carts with filters (search, date, value, customer type),
 * sorting, pagination, and quick recovery actions.
 */

(function($) {
  'use strict';

  const state = {
    search: '',
    dateFilter: 'all',
    valueFilter: 'all',
    customerFilter: 'all',
    sortBy: 'date-desc',
    page: 1,
    pageSize: 8
  };

  $(document).ready(function() {
    if (!window.BongoAbandonedCarts) {
      console.error('BongoAbandonedCarts store missing!');
      return;
    }

    initEventListeners();
    renderModule();
  });

  function initEventListeners() {
    $('#cart-search-input').on('input', function() {
      state.search = $(this).val().trim().toLowerCase();
      state.page = 1;
      renderModule();
    });

    $('#cart-date-filter').on('change', function() {
      state.dateFilter = $(this).val();
      state.page = 1;
      renderModule();
    });

    $('#cart-value-filter').on('change', function() {
      state.valueFilter = $(this).val();
      state.page = 1;
      renderModule();
    });

    $('#cart-customer-filter').on('change', function() {
      state.customerFilter = $(this).val();
      state.page = 1;
      renderModule();
    });

    $('#cart-sort-by').on('change', function() {
      state.sortBy = $(this).val();
      renderModule();
    });

    $('#reset-cart-filters-btn').on('click', function() {
      state.search = '';
      state.dateFilter = 'all';
      state.valueFilter = 'all';
      state.customerFilter = 'all';
      state.sortBy = 'date-desc';
      state.page = 1;

      $('#cart-search-input').val('');
      $('#cart-date-filter').val('all');
      $('#cart-value-filter').val('all');
      $('#cart-customer-filter').val('all');
      $('#cart-sort-by').val('date-desc');
      renderModule();
    });
  }

  function renderModule() {
    const carts = window.BongoAbandonedCarts.getAll();

    // Top Stats Calculation
    const totalCarts = carts.length;
    const totalPotentialValue = carts.reduce((sum, c) => (c.cartStatus !== 'Recovered' ? sum + c.totalValue : sum), 0);
    const recoveredCount = carts.filter(c => c.cartStatus === 'Recovered').length;
    const recoveryRate = totalCarts > 0 ? ((recoveredCount / totalCarts) * 100).toFixed(0) : 0;

    $('#stat-total-abandoned-carts').text(totalCarts);
    $('#stat-potential-revenue').text(`A$${totalPotentialValue.toFixed(2)}`);
    $('#stat-recovered-carts').text(recoveredCount);
    $('#stat-recovery-rate').text(`${recoveryRate}%`);

    // Filter Logic
    const now = new Date();
    let filtered = carts.filter(c => {
      // Search
      const matchesSearch = !state.search ||
        c.cartRef.toLowerCase().includes(state.search) ||
        c.customerName.toLowerCase().includes(state.search) ||
        c.customerEmail.toLowerCase().includes(state.search);

      // Date Filter
      let matchesDate = true;
      const activityDate = new Date(c.lastActivity);
      if (state.dateFilter === 'today') {
        matchesDate = activityDate.toDateString() === now.toDateString();
      } else if (state.dateFilter === '7days') {
        matchesDate = ((now - activityDate) / (1000 * 3600 * 24)) <= 7;
      } else if (state.dateFilter === '30days') {
        matchesDate = ((now - activityDate) / (1000 * 3600 * 24)) <= 30;
      }

      // Value Filter
      let matchesValue = true;
      if (state.valueFilter === 'under50') {
        matchesValue = c.totalValue < 50;
      } else if (state.valueFilter === '50to150') {
        matchesValue = c.totalValue >= 50 && c.totalValue <= 150;
      } else if (state.valueFilter === 'over150') {
        matchesValue = c.totalValue > 150;
      }

      // Customer Filter
      let matchesCustomer = true;
      if (state.customerFilter === 'registered') {
        matchesCustomer = Boolean(c.customerId);
      } else if (state.customerFilter === 'guest') {
        matchesCustomer = !c.customerId;
      }

      return matchesSearch && matchesDate && matchesValue && matchesCustomer;
    });

    // Sorting
    filtered.sort((a, b) => {
      if (state.sortBy === 'date-desc') return new Date(b.lastActivity) - new Date(a.lastActivity);
      if (state.sortBy === 'date-asc') return new Date(a.lastActivity) - new Date(b.lastActivity);
      if (state.sortBy === 'value-desc') return b.totalValue - a.totalValue;
      if (state.sortBy === 'value-asc') return a.totalValue - b.totalValue;
      return 0;
    });

    // Pagination
    const totalFiltered = filtered.length;
    const totalPages = Math.ceil(totalFiltered / state.pageSize) || 1;
    if (state.page > totalPages) state.page = totalPages;
    const startIdx = (state.page - 1) * state.pageSize;
    const pagedCarts = filtered.slice(startIdx, startIdx + state.pageSize);

    renderTable(pagedCarts);
    renderPagination(totalFiltered, totalPages);
  }

  function renderTable(carts) {
    const $tbody = $('#carts-table-body');
    const $emptyState = $('#carts-empty-state');
    const $tableContainer = $('#carts-table-container');

    $tbody.empty();

    if (carts.length === 0) {
      $tableContainer.hide();
      $emptyState.show();
      return;
    }

    $emptyState.hide();
    $tableContainer.show();

    carts.forEach(c => {
      const activityDate = new Date(c.lastActivity).toLocaleDateString('en-AU', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit'
      });

      const statusBadgeMap = {
        'Abandoned': 'badge-abandoned',
        'Recovered': 'badge-recovered',
        'Email Sent': 'badge-email-sent',
        'Expired': 'badge-expired'
      };

      // Items preview thumbnails
      const itemPreviews = (c.items || []).slice(0, 2).map(i => `
        <img src="../${i.image}" alt="${i.productName}" class="table-thumb-sm" title="${i.productName} (${i.variantColor}, ${i.variantSize}) x${i.quantity}" onerror="this.src='../assets/images/products/shirt-white.png';">
      `).join('');
      const moreCount = (c.items || []).length > 2 ? `<span style="font-size:0.75rem; color:var(--admin-text-muted); align-self:center;">+${c.items.length - 2} more</span>` : '';

      const customerLink = c.customerId ? `
        <a href="customer-details.html?id=${c.customerId}" style="font-weight: 600; color: var(--admin-text-main); text-decoration: none;" class="hover-link">
          ${c.customerName}
        </a>
      ` : `<span style="font-weight:600; color:var(--admin-text-main);">${c.customerName}</span>`;

      const rowHtml = `
        <tr data-id="${c.id}">
          <td><input type="checkbox" class="form-checkbox"></td>
          <td>
            <a href="abandoned-cart-details.html?id=${c.id}" style="font-weight: 700; color: var(--admin-brand); text-decoration: none;" class="hover-link">
              ${c.cartRef}
            </a>
          </td>
          <td>
            <div style="display: flex; flex-direction: column;">
              ${customerLink}
              <span style="font-size: 0.75rem; color: var(--admin-text-muted);">${c.customerEmail}</span>
            </div>
          </td>
          <td>
            <div style="display: flex; gap: 0.35rem; align-items: center;">
              ${itemPreviews}
              ${moreCount}
              <span class="badge badge-neutral" style="margin-left: 0.25rem;">${c.itemCount} ${c.itemCount === 1 ? 'item' : 'items'}</span>
            </div>
          </td>
          <td><strong style="font-size: 0.9375rem;">A$${c.totalValue.toFixed(2)}</strong></td>
          <td>
            <div style="display: flex; flex-direction: column;">
              <span style="font-size: 0.8125rem;">${activityDate}</span>
              <span style="font-size: 0.75rem; color: var(--admin-text-muted);">Step: ${c.abandonedStep}</span>
            </div>
          </td>
          <td><span class="badge ${statusBadgeMap[c.cartStatus] || 'badge-neutral'}"><span class="badge-dot"></span>${c.cartStatus}</span></td>
          <td>
            <div style="display:flex; gap:0.35rem; align-items:center;">
              <a href="abandoned-cart-details.html?id=${c.id}" class="btn btn-sm btn-secondary">
                View Details
              </a>
              ${c.cartStatus !== 'Recovered' ? `
                <button type="button" class="btn btn-sm btn-ghost send-reminder-btn" data-id="${c.id}" title="Send Recovery Email Reminder">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                </button>
              ` : ''}
            </div>
          </td>
        </tr>
      `;
      $tbody.append(rowHtml);
    });

    // Row Quick Action Event Handler
    $('.send-reminder-btn').on('click', function() {
      const id = $(this).data('id');
      const updated = window.BongoAbandonedCarts.sendReminder(id, 'Tahmeed M.');
      if (updated) {
        Admin.toast({
          title: 'Recovery Email Sent',
          message: `Reminder email dispatched to ${updated.customerEmail}.`,
          type: 'success'
        });
        renderModule();
      }
    });
  }

  function renderPagination(totalItems, totalPages) {
    const $container = $('#carts-pagination');
    $container.empty();

    if (totalItems === 0) return;

    const startItem = (state.page - 1) * state.pageSize + 1;
    const endItem = Math.min(state.page * state.pageSize, totalItems);

    let buttonsHtml = `
      <div class="pagination-info">
        Showing <strong>${startItem}</strong> to <strong>${endItem}</strong> of <strong>${totalItems}</strong> carts
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

})(jQuery);
