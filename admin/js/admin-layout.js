/**
 * ADMIN LAYOUT CONTROLLER — Bongo Curated Admin Panel
 * Uses jQuery for seamless DOM manipulation and accessibility
 */

(function($) {
  'use strict';

  $(document).ready(function() {
    initSidebar();
    initMobileNav();
    initActiveRoute();
    initDropdowns();
    initKeyboardShortcuts();
  });

  // 1. Sidebar Toggle (Desktop Mini / Expanded)
  function initSidebar() {
    const $sidebar = $('.admin-sidebar');
    const $collapseBtn = $('#sidebar-collapse-btn');

    // Restore saved state
    const isCollapsed = localStorage.getItem('admin_sidebar_collapsed') === 'true';
    if (isCollapsed && $(window).width() >= 992) {
      $sidebar.addClass('collapsed');
    }

    $collapseBtn.on('click', function(e) {
      e.preventDefault();
      $sidebar.toggleClass('collapsed');
      const collapsedNow = $sidebar.hasClass('collapsed');
      localStorage.setItem('admin_sidebar_collapsed', collapsedNow);
    });

    // Submenu Accordion Toggle
    $('.sidebar-group-header').on('click', function(e) {
      // If sidebar is collapsed on desktop, clicking group header expands sidebar first
      if ($sidebar.hasClass('collapsed') && $(window).width() >= 992) {
        $sidebar.removeClass('collapsed');
        localStorage.setItem('admin_sidebar_collapsed', 'false');
      }

      const $parentGroup = $(this).closest('.sidebar-group');
      
      // Close other open groups (Accordion behavior)
      $('.sidebar-group').not($parentGroup).removeClass('open');
      
      $parentGroup.toggleClass('open');
    });
  }

  // 2. Mobile Navigation Toggle & Backdrop Overlay
  function initMobileNav() {
    const $sidebar = $('.admin-sidebar');
    const $overlay = $('#sidebar-overlay');
    const $mobileToggleBtn = $('#mobile-toggle-btn');

    $mobileToggleBtn.on('click', function(e) {
      e.preventDefault();
      $sidebar.toggleClass('mobile-open');
      $overlay.toggleClass('active');
    });

    $overlay.on('click', function() {
      $sidebar.removeClass('mobile-open');
      $overlay.removeClass('active');
    });

    $(window).on('resize', function() {
      if ($(window).width() >= 992) {
        $sidebar.removeClass('mobile-open');
        $overlay.removeClass('active');
      }
    });
  }

  // 3. Highlight Active Menu Item according to current URL
  function initActiveRoute() {
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';

    $('.sidebar-menu a').each(function() {
      const href = $(this).attr('href');
      if (href && (href === currentPath || (currentPath === '' && href === 'index.html'))) {
        $(this).addClass('active');

        // Expand parent group if inside a submenu
        const $parentSubmenu = $(this).closest('.sidebar-submenu');
        if ($parentSubmenu.length) {
          $parentSubmenu.closest('.sidebar-group').addClass('open');
        }
      }
    });
  }

  // 4. Header Dropdown Menus
  function initDropdowns() {
    $(document).on('click', '[data-admin-toggle="dropdown"]', function(e) {
      e.stopPropagation();
      const targetId = $(this).data('target');
      const $targetMenu = $('#' + targetId);

      // Close all other dropdowns
      $('.dropdown-menu').not($targetMenu).removeClass('show');

      $targetMenu.toggleClass('show');
    });

    // Close dropdowns on outside click
    $(document).on('click', function(e) {
      if (!$(e.target).closest('.dropdown-wrapper').length) {
        $('.dropdown-menu').removeClass('show');
      }
    });
  }

  // 5. Global Keyboard Shortcuts (e.g. Ctrl + K to focus search)
  function initKeyboardShortcuts() {
    $(document).on('keydown', function(e) {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        const $search = $('#admin-search-input');
        if ($search.length) {
          $search.focus();
        }
      }
    });
  }

})(jQuery);
