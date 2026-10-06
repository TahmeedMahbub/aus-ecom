/**
 * ADMIN ORDER DETAILS CONTROLLER — Bongo Curated Admin Panel
 * Dedicated full-page view for individual orders (admin/order-details.html?id=1008).
 * Renders complete financial summary, item variants, customer links, address info,
 * order timeline history, and contextual action modals (Change Status, Cancel, Refund, Print Invoice).
 */

(function($) {
  'use strict';

  let currentOrder = null;

  $(document).ready(function() {
    if (!window.BongoOrders) {
      console.error('BongoOrders store missing!');
      return;
    }

    const urlParams = new URLSearchParams(window.location.search);
    const orderIdParam = urlParams.get('id') || '1008'; // Default fallback to 1008

    currentOrder = window.BongoOrders.getById(orderIdParam);
    if (!currentOrder) {
      // Fallback to first available order if param not found
      const all = window.BongoOrders.getAll();
      if (all.length > 0) currentOrder = all[0];
    }

    if (!currentOrder) {
      alert('Order not found!');
      window.location.href = 'orders.html';
      return;
    }

    initEventListeners();
    renderOrderDetails();
  });

  function initEventListeners() {
    // Action Buttons
    $('#change-status-btn').on('click', function() {
      $('#update-status-select').val(currentOrder.orderStatus);
      $('#update-status-note').val('');
      Admin.modal.show('status-modal');
    });

    $('#mark-paid-btn').on('click', function() {
      if (confirm(`Mark ${currentOrder.orderNumber} as Paid?`)) {
        currentOrder = window.BongoOrders.updatePaymentStatus(currentOrder.id, 'Paid', 'Marked as Paid manually by Admin.', 'Tahmeed M.');
        Admin.toast({ title: 'Payment Updated', message: 'Order payment status updated to Paid.', type: 'success' });
        renderOrderDetails();
      }
    });

    $('#cancel-order-btn').on('click', function() {
      $('#cancel-reason-input').val('');
      Admin.modal.show('cancel-modal');
    });

    $('#refund-order-btn').on('click', function() {
      $('#refund-amount-input').val(currentOrder.total.toFixed(2));
      $('#refund-reason-input').val('');
      Admin.modal.show('refund-modal');
    });

    $('#print-invoice-btn').on('click', function() {
      triggerInvoicePrint();
    });

    // Forms inside Modals
    $('#status-form').on('submit', function(e) {
      e.preventDefault();
      const newStatus = $('#update-status-select').val();
      const note = $('#update-status-note').val().trim();
      currentOrder = window.BongoOrders.updateStatus(currentOrder.id, newStatus, note, 'Tahmeed M.');
      Admin.modal.hide('status-modal');
      Admin.toast({ title: 'Status Updated', message: `Order status changed to ${newStatus}.`, type: 'success' });
      renderOrderDetails();
    });

    $('#cancel-form').on('submit', function(e) {
      e.preventDefault();
      const reason = $('#cancel-reason-input').val().trim();
      currentOrder = window.BongoOrders.cancelOrder(currentOrder.id, reason, 'Tahmeed M.');
      Admin.modal.hide('cancel-modal');
      Admin.toast({ title: 'Order Cancelled', message: `${currentOrder.orderNumber} has been cancelled.`, type: 'warning' });
      renderOrderDetails();
    });

    $('#refund-form').on('submit', function(e) {
      e.preventDefault();
      const amount = $('#refund-amount-input').val();
      const reason = $('#refund-reason-input').val().trim();
      currentOrder = window.BongoOrders.refundOrder(currentOrder.id, amount, reason, 'Tahmeed M.');
      Admin.modal.hide('refund-modal');
      Admin.toast({ title: 'Refund Completed', message: `Refund of A$${parseFloat(amount).toFixed(2)} processed.`, type: 'info' });
      renderOrderDetails();
    });

    // Add Timeline Note Form
    $('#add-note-form').on('submit', function(e) {
      e.preventDefault();
      const noteText = $('#timeline-note-input').val().trim();
      if (!noteText) return;
      currentOrder = window.BongoOrders.addTimelineNote(currentOrder.id, noteText, 'Tahmeed M.');
      $('#timeline-note-input').val('');
      Admin.toast({ title: 'Note Added', message: 'Internal note saved to order history.', type: 'success' });
      renderOrderDetails();
    });
  }

  function renderOrderDetails() {
    const o = currentOrder;

    // Header Info
    $('#order-number-title').text(o.orderNumber);
    $('#order-date-text').text(`Placed on ${new Date(o.createdAt).toLocaleString('en-AU', { dateStyle: 'medium', timeStyle: 'short' })}`);
    
    // Status Badges
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

    $('#order-status-badge').attr('class', `badge ${statusBadgeMap[o.orderStatus] || 'badge-neutral'}`).html(`<span class="badge-dot"></span>${o.orderStatus}`);
    $('#payment-status-badge').attr('class', `badge ${paymentBadgeMap[o.paymentStatus] || 'badge-neutral'}`).html(`<span class="badge-dot"></span>${o.paymentStatus}`);

    // Contextual Action Button Rules
    const isCancelledOrRefunded = ['Cancelled', 'Refunded'].includes(o.orderStatus);
    if (isCancelledOrRefunded) {
      $('#cancel-order-btn').hide();
      $('#refund-order-btn').hide();
    } else {
      $('#cancel-order-btn').show();
      $('#refund-order-btn').show();
    }

    if (o.paymentStatus === 'Pending' && !isCancelledOrRefunded) {
      $('#mark-paid-btn').show();
    } else {
      $('#mark-paid-btn').hide();
    }

    // Customer Card
    $('#customer-name-link').text(o.customerName).attr('href', `customer-details.html?id=${o.customerId}`);
    $('#customer-email-link').text(o.customerEmail).attr('href', `mailto:${o.customerEmail}`);
    $('#customer-phone-text').text(o.customerPhone);
    $('#customer-avatar-display').text(o.customerName.split(' ').map(n => n[0]).join('').toUpperCase());

    // Shipping & Billing Address
    const ship = o.shippingAddress || {};
    $('#shipping-address-box').html(`
      <strong>${ship.recipientName || o.customerName}</strong><br>
      ${ship.street || ''}${ship.address2 ? ', ' + ship.address2 : ''}<br>
      ${ship.city || ''}, ${ship.state || ''} ${ship.postcode || ''}<br>
      ${ship.country || 'Australia'}<br>
      Phone: ${ship.phone || o.customerPhone}
    `);

    const bill = o.billingAddress || ship;
    $('#billing-address-box').html(`
      <strong>${bill.recipientName || o.customerName}</strong><br>
      ${bill.street || ''}${bill.address2 ? ', ' + bill.address2 : ''}<br>
      ${bill.city || ''}, ${bill.state || ''} ${bill.postcode || ''}<br>
      ${bill.country || 'Australia'}
    `);

    // Order Overview Metadata Box
    $('#shipping-method-text').text(o.shippingMethod || 'Standard Shipping');
    $('#tracking-number-text').html(o.trackingNumber ? `<code>${o.trackingNumber}</code>` : '<span class="text-muted">Not assigned</span>');
    $('#payment-method-text').text(o.paymentMethod || 'Credit Card');
    $('#transaction-id-text').text(o.transactionId || 'N/A');

    // Products Line Items Table
    const $tbody = $('#order-items-tbody');
    $tbody.empty();

    (o.items || []).forEach(item => {
      const lineHtml = `
        <tr>
          <td>
            <div class="table-media-item">
              <img src="../${item.image}" alt="${item.productName}" class="table-thumb" onerror="this.src='../assets/images/products/shirt-white.png';">
              <div class="table-media-info">
                <a href="products/view.html?id=${item.productId}" class="media-title hover-link" style="color:var(--admin-text-main); font-weight:600; text-decoration:none;" target="_blank">
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
          <td>A$${parseFloat(item.unitPrice).toFixed(2)}</td>
          <td><strong>x${item.quantity}</strong></td>
          <td style="text-align:right;"><strong>A$${parseFloat(item.lineTotal).toFixed(2)}</strong></td>
        </tr>
      `;
      $tbody.append(lineHtml);
    });

    // Financial Summary
    $('#summary-subtotal').text(`A$${o.subtotal.toFixed(2)}`);
    $('#summary-discount').text(o.discount > 0 ? `-A$${o.discount.toFixed(2)} (${o.discountCode || 'Promo'})` : 'A$0.00');
    $('#summary-shipping').text(o.shippingFee > 0 ? `A$${o.shippingFee.toFixed(2)}` : 'Free Shipping');
    $('#summary-tax').text(`A$${o.tax.toFixed(2)}`);
    $('#summary-grand-total').text(`A$${o.total.toFixed(2)}`);

    // Timeline Render
    renderTimeline(o.timeline || []);
  }

  function renderTimeline(timeline) {
    const $container = $('#order-timeline-container');
    $container.empty();

    if (timeline.length === 0) {
      $container.html('<div style="font-size:0.8125rem; color:var(--admin-text-muted);">No timeline logs available.</div>');
      return;
    }

    // Sort timeline newest first
    const sorted = [...timeline].reverse();

    sorted.forEach((t, idx) => {
      const dateStr = new Date(t.timestamp).toLocaleString('en-AU', {
        dateStyle: 'medium',
        timeStyle: 'short'
      });

      const itemHtml = `
        <div class="timeline-item ${idx === 0 ? 'active' : ''}">
          <div class="timeline-marker">${idx === 0 ? '✓' : '•'}</div>
          <div class="timeline-header">
            <span class="timeline-title">${t.status}${t.paymentStatus ? ` (${t.paymentStatus})` : ''}</span>
            <span class="timeline-time">${dateStr}</span>
          </div>
          <div class="timeline-desc">${t.note}</div>
          <div class="timeline-author" style="margin-top:0.15rem; font-size:0.75rem; color:var(--admin-text-muted);">Logged by: <strong>${t.author || 'System'}</strong></div>
        </div>
      `;
      $container.append(itemHtml);
    });
  }

  function triggerInvoicePrint() {
    const o = currentOrder;
    const invoiceWindow = window.open('', '_blank', 'width=800,height=900');
    
    const itemsRows = (o.items || []).map(i => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #ddd;">${i.productName} (${i.variantColor}, ${i.variantSize})</td>
        <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: center;">${i.quantity}</td>
        <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: right;">A$${parseFloat(i.unitPrice).toFixed(2)}</td>
        <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: right;">A$${parseFloat(i.lineTotal).toFixed(2)}</td>
      </tr>
    `).join('');

    const invoiceHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Tax Invoice - ${o.orderNumber}</title>
        <style>
          body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; padding: 40px; color: #333; line-height: 1.6; }
          .invoice-header { display: flex; justify-content: space-between; border-bottom: 2px solid #CC7A3F; padding-bottom: 20px; margin-bottom: 30px; }
          .brand-title { font-size: 24px; font-weight: bold; color: #CC7A3F; }
          .invoice-details { text-align: right; }
          .addresses { display: flex; justify-content: space-between; margin-bottom: 30px; }
          .address-block { width: 48%; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
          th { background: #F8F9FA; padding: 12px 10px; border-bottom: 2px solid #ddd; text-align: left; }
          .totals-table { width: 300px; margin-left: auto; }
          .totals-table td { padding: 8px 10px; }
          .grand-total { font-weight: bold; font-size: 18px; border-top: 2px solid #333; border-bottom: 2px solid #333; }
          .footer { margin-top: 50px; text-align: center; font-size: 12px; color: #777; border-top: 1px solid #eee; padding-top: 20px; }
        </style>
      </head>
      <body>
        <div class="invoice-header">
          <div>
            <div class="brand-title">Bongo Curated</div>
            <div>Bangladesh Made. Curated for Australia.</div>
            <div>ABN: 84 928 102 938</div>
          </div>
          <div class="invoice-details">
            <h2>TAX INVOICE</h2>
            <div><strong>Invoice No:</strong> ${o.orderNumber}</div>
            <div><strong>Date:</strong> ${new Date(o.createdAt).toLocaleDateString('en-AU')}</div>
            <div><strong>Status:</strong> ${o.paymentStatus} (${o.orderStatus})</div>
          </div>
        </div>

        <div class="addresses">
          <div class="address-block">
            <h3>Billed To:</h3>
            <strong>${o.customerName}</strong><br>
            ${o.billingAddress ? `${o.billingAddress.street}, ${o.billingAddress.city} ${o.billingAddress.state} ${o.billingAddress.postcode}` : o.customerEmail}<br>
            Email: ${o.customerEmail}<br>
            Phone: ${o.customerPhone}
          </div>
          <div class="address-block">
            <h3>Shipped To:</h3>
            <strong>${o.shippingAddress ? o.shippingAddress.recipientName : o.customerName}</strong><br>
            ${o.shippingAddress ? `${o.shippingAddress.street}, ${o.shippingAddress.city} ${o.shippingAddress.state} ${o.shippingAddress.postcode}` : ''}<br>
            Shipping Method: ${o.shippingMethod}
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Item & Variant</th>
              <th style="text-align: center;">Qty</th>
              <th style="text-align: right;">Unit Price</th>
              <th style="text-align: right;">Amount</th>
            </tr>
          </thead>
          <tbody>
            ${itemsRows}
          </tbody>
        </table>

        <table class="totals-table">
          <tr>
            <td>Subtotal:</td>
            <td style="text-align: right;">A$${o.subtotal.toFixed(2)}</td>
          </tr>
          ${o.discount > 0 ? `<tr><td>Discount (${o.discountCode}):</td><td style="text-align: right;">-A$${o.discount.toFixed(2)}</td></tr>` : ''}
          <tr>
            <td>Shipping:</td>
            <td style="text-align: right;">A$${o.shippingFee.toFixed(2)}</td>
          </tr>
          <tr>
            <td>Includes GST (10%):</td>
            <td style="text-align: right;">A$${o.tax.toFixed(2)}</td>
          </tr>
          <tr class="grand-total">
            <td>Grand Total:</td>
            <td style="text-align: right;">A$${o.total.toFixed(2)}</td>
          </tr>
        </table>

        <div class="footer">
          Thank you for shopping with Bongo Curated Australia!<br>
          For support inquiries, contact support@bongocurated.com.au
        </div>

        <script>
          window.onload = function() { window.print(); }
        </script>
      </body>
      </html>
    `;

    invoiceWindow.document.write(invoiceHtml);
    invoiceWindow.document.close();
  }

})(jQuery);
