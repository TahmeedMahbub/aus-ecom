/**
 * ADMIN CUSTOMER DETAILS CONTROLLER — Bongo Curated Admin Panel
 * Full-page profile for an individual customer (admin/customer-details.html?id=1).
 * Displays contact info, shipping/billing addresses, total orders history,
 * wishlist summary, abandoned cart alerts, and admin notes.
 */

(function($) {
  'use strict';

  let currentCustomer = null;

  $(document).ready(function() {
    if (!window.BongoCustomers) {
      console.error('BongoCustomers store missing!');
      return;
    }

    const urlParams = new URLSearchParams(window.location.search);
    const customerIdParam = urlParams.get('id') || '1'; // Default fallback to Customer 1

    currentCustomer = window.BongoCustomers.getById(customerIdParam);
    if (!currentCustomer) {
      const all = window.BongoCustomers.getAll();
      if (all.length > 0) currentCustomer = all[0];
    }

    if (!currentCustomer) {
      alert('Customer profile not found!');
      window.location.href = 'customers.html';
      return;
    }

    initEventListeners();
    renderCustomerDetails();
  });

  function initEventListeners() {
    $('#edit-customer-btn').on('click', function() {
      openEditModal();
    });

    $('#toggle-account-btn').on('click', function() {
      const updated = window.BongoCustomers.toggleStatus(currentCustomer.id);
      if (updated) {
        currentCustomer = updated;
        Admin.toast({
          title: updated.isDisabled ? 'Account Disabled' : 'Account Activated',
          message: `${updated.name}'s account status updated.`,
          type: updated.isDisabled ? 'warning' : 'success'
        });
        renderCustomerDetails();
      }
    });

    $('#edit-customer-form').on('submit', function(e) {
      e.preventDefault();
      handleEditSubmit();
    });

    $('#save-customer-notes-btn').on('click', function() {
      const notes = $('#customer-notes-textarea').val().trim();
      currentCustomer = window.BongoCustomers.update(currentCustomer.id, { notes });
      Admin.toast({ title: 'Notes Saved', message: 'Customer notes updated successfully.', type: 'success' });
    });
  }

  function renderCustomerDetails() {
    const c = currentCustomer;
    const allOrders = window.BongoOrders ? window.BongoOrders.getByCustomerId(c.id) : [];
    const allProducts = window.BongoProducts ? window.BongoProducts.getAll() : [];
    const customerCart = window.BongoAbandonedCarts ? window.BongoAbandonedCarts.getByCustomerId(c.id) : null;

    // Header Profile
    $('#customer-header-name').text(c.name);
    $('#customer-header-avatar').text(c.avatar || 'CU');
    $('#customer-header-email').text(c.email).attr('href', `mailto:${c.email}`);
    $('#customer-header-phone').text(c.phone || 'No phone recorded');
    $('#customer-header-joined').text(`Joined ${new Date(c.joinedDate).toLocaleDateString('en-AU', { month: 'long', day: 'numeric', year: 'numeric' })}`);

    if (c.isDisabled) {
      $('#customer-status-badge').attr('class', 'badge badge-danger').html('<span class="badge-dot"></span>Disabled');
      $('#toggle-account-btn').text('Enable Account').attr('class', 'btn btn-success');
    } else {
      $('#customer-status-badge').attr('class', 'badge badge-success').html('<span class="badge-dot"></span>Active');
      $('#toggle-account-btn').text('Disable Account').attr('class', 'btn btn-secondary');
    }

    // Stats calculations
    const totalOrdersCount = allOrders.length;
    const totalSpent = allOrders.reduce((sum, o) => (o.paymentStatus === 'Paid' ? sum + o.total : sum), 0);
    const avgOrderValue = totalOrdersCount > 0 ? totalSpent / totalOrdersCount : 0;
    const lastOrder = allOrders.length > 0 ? [...allOrders].sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt))[0] : null;

    $('#stat-cust-orders-count').text(totalOrdersCount);
    $('#stat-cust-total-spent').text(`A$${totalSpent.toFixed(2)}`);
    $('#stat-cust-avg-order').text(`A$${avgOrderValue.toFixed(2)}`);
    $('#stat-cust-last-activity').text(lastOrder ? new Date(lastOrder.createdAt).toLocaleDateString('en-AU') : 'No orders');

    // Contact & Address Details
    $('#customer-email-detail').text(c.email);
    $('#customer-phone-detail').text(c.phone || 'N/A');
    
    const ship = c.shippingAddress || {};
    $('#customer-shipping-address').html(`
      <strong>${ship.recipientName || c.name}</strong><br>
      ${ship.street || 'No street address'}${ship.address2 ? ', ' + ship.address2 : ''}<br>
      ${ship.city || ''}, ${ship.state || ''} ${ship.postcode || ''}<br>
      ${ship.country || 'Australia'}
    `);

    const bill = c.billingAddress || ship;
    $('#customer-billing-address').html(`
      <strong>${bill.recipientName || c.name}</strong><br>
      ${bill.street || 'No billing address'}${bill.address2 ? ', ' + bill.address2 : ''}<br>
      ${bill.city || ''}, ${bill.state || ''} ${bill.postcode || ''}<br>
      ${bill.country || 'Australia'}
    `);

    // Customer Notes
    $('#customer-notes-textarea').val(c.notes || '');

    // Render Order History Table
    renderOrderHistory(allOrders);

    // Render Wishlist Summary
    renderWishlist(c.wishlist || [], allProducts);

    // Render Abandoned Cart Box
    renderAbandonedCartAlert(customerCart);
  }

  function renderOrderHistory(orders) {
    const $tbody = $('#customer-orders-tbody');
    const $emptyState = $('#customer-orders-empty');
    $tbody.empty();

    if (orders.length === 0) {
      $('#customer-orders-table-wrapper').hide();
      $emptyState.show();
      return;
    }

    $emptyState.hide();
    $('#customer-orders-table-wrapper').show();

    // Sort newest orders first
    const sorted = [...orders].sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));

    sorted.forEach(o => {
      const orderDate = new Date(o.createdAt).toLocaleDateString('en-AU', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });

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

      const rowHtml = `
        <tr>
          <td>
            <a href="order-details.html?id=${o.id}" style="font-weight:700; color:var(--admin-brand); text-decoration:none;" class="hover-link">
              ${o.orderNumber}
            </a>
          </td>
          <td>${orderDate}</td>
          <td>${o.itemCount} ${o.itemCount === 1 ? 'item' : 'items'}</td>
          <td><strong>A$${o.total.toFixed(2)}</strong></td>
          <td><span class="badge ${paymentBadgeMap[o.paymentStatus] || 'badge-neutral'}"><span class="badge-dot"></span>${o.paymentStatus}</span></td>
          <td><span class="badge ${statusBadgeMap[o.orderStatus] || 'badge-neutral'}"><span class="badge-dot"></span>${o.orderStatus}</span></td>
          <td style="text-align:right;">
            <a href="order-details.html?id=${o.id}" class="btn btn-sm btn-secondary">
              View Order
            </a>
          </td>
        </tr>
      `;
      $tbody.append(rowHtml);
    });
  }

  function renderWishlist(wishlistIds, products) {
    const $container = $('#wishlist-items-container');
    $container.empty();

    if (!wishlistIds || wishlistIds.length === 0) {
      $container.html('<div style="font-size:0.8125rem; color:var(--admin-text-muted);">No products in wishlist.</div>');
      return;
    }

    const wishlistProds = products.filter(p => wishlistIds.includes(p.id));

    wishlistProds.forEach(p => {
      const prodHtml = `
        <div style="display:flex; align-items:center; gap:0.75rem; padding:0.625rem 0; border-bottom:1px solid var(--admin-card-border);">
          <img src="../${p.image}" alt="${p.name}" style="width:40px; height:40px; border-radius:var(--radius-md); object-fit:cover; border:1px solid var(--admin-card-border);" onerror="this.src='../assets/images/products/shirt-white.png';">
          <div style="flex:1;">
            <a href="products/view.html?id=${p.id}" target="_blank" style="font-size:0.875rem; font-weight:600; color:var(--admin-text-main); text-decoration:none;" class="hover-link">
              ${p.name}
            </a>
            <div style="font-size:0.75rem; color:var(--admin-text-muted);">A$${p.price.toFixed(2)}</div>
          </div>
          <span class="badge badge-in-stock">In Stock</span>
        </div>
      `;
      $container.append(prodHtml);
    });
  }

  function renderAbandonedCartAlert(cart) {
    const $container = $('#abandoned-cart-alert-container');
    $container.empty();

    if (!cart || cart.cartStatus === 'Recovered') {
      $container.html('<div style="font-size:0.8125rem; color:var(--admin-text-muted);">No active abandoned cart for this customer.</div>');
      return;
    }

    const cartHtml = `
      <div style="background-color: var(--color-warning-bg); border: 1px solid var(--color-warning-text); border-radius: var(--radius-md); padding: 1rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
        <div>
          <div style="font-weight: 700; color: var(--color-warning-text); font-size: 0.875rem; margin-bottom: 0.2rem;">
            ⚠️ Active Abandoned Cart Found (${cart.cartRef})
          </div>
          <div style="font-size: 0.8125rem; color: var(--admin-text-main);">
            Value: <strong>A$${cart.totalValue.toFixed(2)}</strong> (${cart.itemCount} items) | Abandoned on ${cart.abandonedStep} (${new Date(cart.lastActivity).toLocaleDateString('en-AU')})
          </div>
        </div>
        <a href="abandoned-cart-details.html?id=${cart.id}" class="btn btn-sm btn-primary">
          View Cart Details
        </a>
      </div>
    `;
    $container.html(cartHtml);
  }

  function openEditModal() {
    const c = currentCustomer;
    $('#edit-name-input').val(c.name || '');
    $('#edit-email-input').val(c.email || '');
    $('#edit-phone-input').val(c.phone || '');
    
    const ship = c.shippingAddress || {};
    $('#edit-street-input').val(ship.street || '');
    $('#edit-city-input').val(ship.city || '');
    $('#edit-state-input').val(ship.state || 'NSW');
    $('#edit-postcode-input').val(ship.postcode || '');
    
    Admin.modal.show('edit-customer-modal');
  }

  function handleEditSubmit() {
    const name = $('#edit-name-input').val().trim();
    const email = $('#edit-email-input').val().trim();
    const phone = $('#edit-phone-input').val().trim();
    const street = $('#edit-street-input').val().trim();
    const city = $('#edit-city-input').val().trim();
    const stateVal = $('#edit-state-input').val();
    const postcode = $('#edit-postcode-input').val().trim();

    if (!name || !email) {
      alert('Name and email are required.');
      return;
    }

    const updated = window.BongoCustomers.update(currentCustomer.id, {
      name,
      email,
      phone,
      shippingAddress: { recipientName: name, street, address2: '', city, state: stateVal, postcode, country: 'Australia', phone },
      billingAddress: { recipientName: name, street, address2: '', city, state: stateVal, postcode, country: 'Australia', phone }
    });

    if (updated) {
      currentCustomer = updated;
      Admin.modal.hide('edit-customer-modal');
      Admin.toast({ title: 'Profile Updated', message: 'Customer information updated successfully.', type: 'success' });
      renderCustomerDetails();
    }
  }

})(jQuery);
