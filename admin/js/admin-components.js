/**
 * ADMIN REUSABLE COMPONENTS HELPER — Bongo Curated Admin Panel
 * Provides global namespace `window.Admin` for Toasts, Modals, Table helpers, and Tab switching.
 */

window.Admin = window.Admin || {};

(function($) {
  'use strict';

  // 1. Toast Notification Helper
  Admin.toast = function(options) {
    const defaults = {
      title: 'Notification',
      message: '',
      type: 'success', // success, danger, warning, info
      duration: 4000
    };

    const config = $.extend({}, defaults, options);

    let $container = $('#admin-toast-container');
    if (!$container.length) {
      $container = $('<div id="admin-toast-container" class="toast-container"></div>');
      $('body').append($container);
    }

    const iconMap = {
      success: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>`,
      danger: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`,
      warning: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>`,
      info: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`
    };

    const toastHtml = `
      <div class="admin-toast toast-${config.type}">
        <div class="toast-icon">
          ${iconMap[config.type] || iconMap.info}
        </div>
        <div class="toast-content">
          <div class="toast-title">${config.title}</div>
          ${config.message ? `<div class="toast-message">${config.message}</div>` : ''}
        </div>
        <button type="button" class="toast-close" onclick="$(this).closest('.admin-toast').fadeOut(200, function(){ $(this).remove(); });">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
      </div>
    `;

    const $toast = $(toastHtml);
    $container.append($toast);

    if (config.duration > 0) {
      setTimeout(function() {
        $toast.fadeOut(300, function() {
          $(this).remove();
        });
      }, config.duration);
    }
  };

  // 2. Modal Helper
  Admin.modal = {
    show: function(modalId) {
      const $modal = $('#' + modalId);
      if ($modal.length) {
        $modal.addClass('show');
        $('body').css('overflow', 'hidden');
      }
    },
    hide: function(modalId) {
      const $modal = modalId ? $('#' + modalId) : $('.modal-backdrop');
      $modal.removeClass('show');
      $('body').css('overflow', '');
    }
  };

  // Initialize Modal Click Triggers
  $(document).ready(function() {
    $(document).on('click', '[data-admin-modal]', function(e) {
      e.preventDefault();
      const targetId = $(this).data('admin-modal');
      Admin.modal.show(targetId);
    });

    $(document).on('click', '[data-admin-dismiss="modal"]', function(e) {
      e.preventDefault();
      const $modal = $(this).closest('.modal-backdrop');
      Admin.modal.hide($modal.attr('id'));
    });

    // Close modal on backdrop click
    $(document).on('click', '.modal-backdrop', function(e) {
      if ($(e.target).hasClass('modal-backdrop')) {
        Admin.modal.hide($(this).attr('id'));
      }
    });

    // 3. Table Select-All Checkbox
    $(document).on('change', '.table-select-all', function() {
      const isChecked = $(this).is(':checked');
      const $table = $(this).closest('table');
      $table.find('tbody input[type="checkbox"]').prop('checked', isChecked);
    });

    // 4. Tab Switcher
    $(document).on('click', '[data-admin-tab]', function(e) {
      e.preventDefault();
      const targetTab = $(this).data('admin-tab');
      const $container = $(this).closest('.tabs-wrapper');
      
      $container.find('[data-admin-tab]').removeClass('active');
      $(this).addClass('active');

      $container.find('.tab-pane').removeClass('active').hide();
      $('#' + targetTab).addClass('active').fadeIn(150);
    });
  });

})(jQuery);
