/**
 * ADMIN ABANDONED CART DETAILS CONTROLLER — Bongo Curated Admin Panel
 * Dedicated full-page view for individual abandoned cart session (admin/abandoned-cart-details.html?id=1).
 * Displays line item breakdown, customer info, recovery timeline, and recovery actions.
 */

(function($) {
  'use strict';

  let currentCart = null;

  $(document).ready(function() {
    if (!window.BongoAbandonedCarts) {
      console.error('BongoAbandonedCarts store missing!');
      return;
    }

    const urlParams = new URLSearchParams(window.location.search);
    const cartIdParam = urlParams.get('id') || '1'; // Default fallback to Cart 1

    currentCart = window.BongoAbandonedCarts.getById(cartIdParam);
    if (!currentCart) {
      const all = window.BongoAbandonedCarts.getAll();
      if (all.length > 0) currentCart = all[0];
    }

    if (!currentCart) {
      alert('Abandoned cart session not found!');
      window.location.href = 'abandoned-carts.html';
      return;
    }

    initEventListeners();
    renderCartDetails();
  });

  function initEventListeners() {
    $('#send-reminder-email-btn').on('click', function() {
      currentCart = window.BongoAbandonedCarts.sendReminder(currentCart.id, 'Tahmeed M.');
      Admin.toast({ title: 'Reminder Email Sent', message: `Recovery email sent to ${currentCart.customerEmail}.`, type: 'success' });
      renderCartDetails();
    });

    $('#mark-recovered-btn').on('click', function() {
      currentCart = window.BongoAbandonedCarts.markAsRecovered(currentCart.id);
      Admin.toast({ title: 'Cart Recovered', message: `Cart ${currentCart.cartRef} marked as recovered.`, type: 'success' });
      renderCartDetails();
    });

    $('#copy-checkout-link-btn').on('click', function() {
      const recoveryUrl = `${window.location.origin}/checkout.html?token=${currentCart.recoveryToken || 'recovery_token'}`;
      navigator.clipboard.writeText(recoveryUrl).then(() => {
        Admin.toast({ title: 'Link Copied', message: 'Cart recovery URL copied to clipboard.', type: 'info' });
      }).catch(() => {
        alert(`Cart Recovery Link: ${recoveryUrl}`);
      });
    });
  }

  function renderCartDetails() {
    const c = currentCart;

    // Header
    $('#cart-ref-title').text(c.cartRef);
    $('#cart-last-activity-text').text(`Last activity on ${new Date(c.lastActivity).toLocaleString('en-AU', { dateStyle: 'medium', timeStyle: 'short' })}`);

    const statusBadgeMap = {
      'Abandoned': 'badge-abandoned',
      'Recovered': 'badge-recovered',
      'Email Sent': 'badge-email-sent',
      'Expired': 'badge-expired'
    };

    $('#cart-status-badge').attr('class', `badge ${statusBadgeMap[c.cartStatus] || 'badge-neutral'}`).html(`<span class="badge-dot"></span>${c.cartStatus}`);

    if (c.cartStatus === 'Recovered') {
      $('#send-reminder-email-btn').hide();
      $('#mark-recovered-btn').hide();
    } else {
      $('#send-reminder-email-btn').show();
      $('#mark-recovered-btn').show();
    }

    // Customer Card
    $('#cart-customer-name').text(c.customerName);
    $('#cart-customer-email').text(c.customerEmail).attr('href', `mailto:${c.customerEmail}`);
    $('#cart-customer-phone').text(c.customerPhone || 'N/A');
    $('#cart-location-text').text(c.location || 'Australia');

    if (c.customerId) {
      $('#view-customer-profile-btn').attr('href', `customer-details.html?id=${c.customerId}`).show();
    } else {
      $('#view-customer-profile-btn').hide();
    }

    // Abandonment Overview
    $('#abandoned-step-text').text(c.abandonedStep);
    $('#created-date-text').text(new Date(c.createdAt).toLocaleString('en-AU', { dateStyle: 'medium', timeStyle: 'short' }));
    $('#last-activity-text').text(new Date(c.lastActivity).toLocaleString('en-AU', { dateStyle: 'medium', timeStyle: 'short' }));
    $('#recovery-token-text').text(c.recoveryToken || 'N/A');

    // Cart Items Table
    const $tbody = $('#cart-items-tbody');
    $tbody.empty();

    (c.items || []).forEach(item => {
      const itemHtml = `
        <tr>
          <td>
            <div class="table-media-item">
              <img src="../${item.image}" alt="${item.productName}" class="table-thumb" onerror="this.src='../assets/images/products/shirt-white.png';">
              <div class="table-media-info">
                <a href="products/view.html?id=${item.productId}" target="_blank" class="media-title hover-link" style="color:var(--admin-text-main); font-weight:600; text-decoration:none;">
                  ${item.productName}
                </a>
                <span class="media-subtitle">SKU: ${item.sku || 'N/A'}</span>
              </div>
            </div>
          </td>
          <td>
            <span style="font-size:0.8125rem; color:var(--admin-text-muted);">
              Color: <strong>${item.variantColor || 'Standard'}</strong> | Size: <strong>${item.variantSize || 'OS'}</strong>
            </span>
          </td>
          <td>A$${parseFloat(item.price).toFixed(2)}</td>
          <td><strong>x${item.quantity}</strong></td>
          <td style="text-align:right;"><strong>A$${parseFloat(item.lineTotal).toFixed(2)}</strong></td>
        </tr>
      `;
      $tbody.append(itemHtml);
    });

    // Financial Breakdown
    $('#summary-cart-subtotal').text(`A$${c.subtotal.toFixed(2)}`);
    $('#summary-cart-shipping').text(c.shippingFee > 0 ? `A$${c.shippingFee.toFixed(2)}` : 'A$0.00');
    $('#summary-cart-tax').text(`A$${c.estimatedTax.toFixed(2)}`);
    $('#summary-cart-total').text(`A$${c.totalValue.toFixed(2)}`);

    // Recovery Logs
    renderRecoveryLogs(c.recoveryLog || []);
  }

  function renderRecoveryLogs(logs) {
    const $container = $('#recovery-logs-container');
    $container.empty();

    if (logs.length === 0) {
      $container.html('<div style="font-size:0.8125rem; color:var(--admin-text-muted);">No activity logs recorded yet.</div>');
      return;
    }

    const sorted = [...logs].reverse();

    sorted.forEach((l, idx) => {
      const timeStr = new Date(l.timestamp).toLocaleString('en-AU', { dateStyle: 'medium', timeStyle: 'short' });
      const logHtml = `
        <div class="timeline-item ${idx === 0 ? 'active' : ''}">
          <div class="timeline-marker">${idx === 0 ? '✓' : '•'}</div>
          <div class="timeline-header">
            <span class="timeline-title">${l.event}</span>
            <span class="timeline-time">${timeStr}</span>
          </div>
        </div>
      `;
      $container.append(logHtml);
    });
  }

})(jQuery);
