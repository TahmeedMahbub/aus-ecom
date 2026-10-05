/**
 * ADMIN PRODUCT FORM & VIEW CONTROLLER — Bongo Curated Admin Panel
 * Handles Clean Full-Page Create, Edit, View pages, Image Management, Variants & Specs
 */

(function($) {
  'use strict';

  // Sample preset images for quick selection in admin
  const SAMPLE_PRESETS = [
    'assets/images/products/shirt-white.png',
    'assets/images/products/jacket-leather.png',
    'assets/images/products/shoes-sneaker.png',
    'assets/images/products/panjabi-silk.png',
    'assets/images/products/saree-jamdani.png',
    'assets/images/products/bag-tote.png',
    'assets/images/products/hoodie-black.png',
    'assets/images/products/dress-floral.png'
  ];

  let galleryImages = [];

  $(document).ready(function() {
    if (!window.BongoProducts) {
      console.error('BongoProducts store missing!');
      return;
    }

    const pageType = getPageType();
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id') ? parseInt(urlParams.get('id')) : null;

    populateDropdownStores();

    if (pageType === 'create') {
      initCreatePage();
    } else if (pageType === 'edit') {
      initEditPage(productId);
    } else if (pageType === 'view') {
      initViewPage(productId);
    }
  });

  function getPageType() {
    const path = window.location.pathname.toLowerCase();
    if (path.includes('create.html')) return 'create';
    if (path.includes('edit.html')) return 'edit';
    if (path.includes('view.html')) return 'view';
    return 'create';
  }

  function populateDropdownStores() {
    const categories = window.BongoCategories ? window.BongoCategories.getAll().filter(c => !c.isDisabled) : [];
    const brands = window.BongoBrands ? window.BongoBrands.getAll().filter(b => !b.isDisabled) : [];

    const $catSelect = $('#form-product-category');
    if ($catSelect.length) {
      $catSelect.empty();
      categories.forEach(c => $catSelect.append(`<option value="${c.slug}">${c.name}</option>`));
    }

    const $brandSelect = $('#form-product-brand');
    if ($brandSelect.length) {
      $brandSelect.empty();
      $brandSelect.append('<option value="Bongo Curated">Bongo Curated (In-house)</option>');
      brands.forEach(b => {
        if (b.name !== 'Bongo Curated') {
          $brandSelect.append(`<option value="${b.name}">${b.name}</option>`);
        }
      });
    }

    updateSubcategoriesSelect();

    $('#form-product-category').on('change', function() {
      updateSubcategoriesSelect();
    });
  }

  function updateSubcategoriesSelect() {
    const selectedCatSlug = $('#form-product-category').val();
    const subcategories = window.BongoSubcategories ? window.BongoSubcategories.getAll().filter(s => !s.isDisabled) : [];
    const filteredSubs = subcategories.filter(s => s.categorySlug === selectedCatSlug);

    const $subSelect = $('#form-product-subcategory');
    if ($subSelect.length) {
      $subSelect.empty();
      $subSelect.append('<option value="">None (General Category Item)</option>');
      filteredSubs.forEach(s => $subSelect.append(`<option value="${s.slug}">${s.name}</option>`));
    }
  }

  // ── Image Management ──
  function renderGalleryUI() {
    const $container = $('#image-thumbnails-container');
    if (!$container.length) return;

    $container.empty();

    if (galleryImages.length === 0) {
      $container.html('<div style="font-size:0.8125rem; color:var(--admin-text-muted); width:100%; padding:0.5rem 0;">No images added yet. Upload or pick sample images below.</div>');
      return;
    }

    galleryImages.forEach((imgUrl, idx) => {
      const displayPath = (imgUrl.startsWith('http') || imgUrl.startsWith('data:') || imgUrl.startsWith('assets/')) 
        ? (imgUrl.startsWith('assets/') ? `../../${imgUrl}` : imgUrl) 
        : imgUrl;

      const isMain = idx === 0;
      const cardHtml = `
        <div class="image-thumb-card ${isMain ? 'is-main' : ''}">
          <img src="${displayPath}" alt="Product Image ${idx + 1}" onerror="this.src='../../assets/images/products/shirt-white.png';">
          ${isMain ? '<span class="main-tag">Main</span>' : ''}
          <button type="button" class="thumb-remove-btn" data-idx="${idx}" title="Remove image">&times;</button>
        </div>
      `;
      $container.append(cardHtml);
    });

    $('.thumb-remove-btn').off('click').on('click', function() {
      const idx = parseInt($(this).data('idx'));
      galleryImages.splice(idx, 1);
      renderGalleryUI();
    });
  }

  function initImagePicker() {
    // Render preset samples picker
    const $presetContainer = $('#preset-images-picker');
    if ($presetContainer.length) {
      $presetContainer.empty();
      SAMPLE_PRESETS.forEach(url => {
        $presetContainer.append(`
          <img src="../../${url}" class="preset-img-item" data-url="${url}" title="Add ${url.split('/').pop()}">
        `);
      });

      $('.preset-img-item').on('click', function() {
        const url = $(this).data('url');
        if (url && !galleryImages.includes(url)) {
          galleryImages.push(url);
          renderGalleryUI();
        }
      });
    }

    // Trigger File Upload Input
    $('#trigger-file-upload-btn').on('click', function() {
      $('#image-file-input').click();
    });

    $('#image-file-input').on('change', function(e) {
      const files = e.target.files;
      if (files && files.length > 0) {
        Array.from(files).forEach(file => {
          const reader = new FileReader();
          reader.onload = function(evt) {
            galleryImages.push(evt.target.result);
            renderGalleryUI();
          };
          reader.readAsDataURL(file);
        });
        $(this).val('');
      }
    });

    // Custom URL Input
    $('#add-url-img-btn').on('click', function() {
      const url = $('#add-url-img-input').val().trim();
      if (url) {
        galleryImages.push(url);
        $('#add-url-img-input').val('');
        renderGalleryUI();
      }
    });
  }

  // ── Variant Builder ──
  function addVariantRow(variantData = {}) {
    const $tbody = $('#variant-rows-container');
    if (!$tbody.length) return;

    const defaultPrice = $('#form-product-price').val() || '0.00';
    const rowId = Date.now() + Math.random().toString(36).substr(2, 4);
    const rowHtml = `
      <tr class="variant-row" id="var-row-${rowId}">
        <td><input type="text" class="form-control form-control-sm var-color" placeholder="e.g. White" value="${variantData.color || ''}"></td>
        <td><input type="text" class="form-control form-control-sm var-size" placeholder="e.g. M" value="${variantData.size || ''}"></td>
        <td><input type="text" class="form-control form-control-sm var-sku" placeholder="SKU-VAR-01" value="${variantData.sku || ''}"></td>
        <td><input type="number" step="0.01" class="form-control form-control-sm var-price" placeholder="0.00" value="${variantData.price !== undefined ? variantData.price : defaultPrice}"></td>
        <td><input type="number" class="form-control form-control-sm var-stock" placeholder="10" value="${variantData.stock !== undefined ? variantData.stock : 10}"></td>
        <td style="text-align:center;">
          <button type="button" class="btn btn-sm btn-ghost remove-variant-btn" onclick="$(this).closest('tr').remove();" style="color:var(--color-danger); font-size:16px;">&times;</button>
        </td>
      </tr>
    `;
    $tbody.append(rowHtml);
  }

  function collectVariantsFromUI() {
    const variants = [];
    $('.variant-row').each(function() {
      const color = $(this).find('.var-color').val().trim();
      const size = $(this).find('.var-size').val().trim();
      const sku = $(this).find('.var-sku').val().trim();
      const price = parseFloat($(this).find('.var-price').val()) || 0;
      const stock = parseInt($(this).find('.var-stock').val()) || 0;

      if (color || size || price > 0) {
        variants.push({ color, size, sku, price, stock });
      }
    });
    return variants;
  }

  function generateVariantsFromSelections() {
    const colorsStr = $('#form-product-colors').val().trim();
    const sizesStr = $('#form-product-sizes').val().trim();

    const colors = colorsStr ? colorsStr.split(',').map(s => s.trim()).filter(Boolean) : ['Default'];
    const sizes = sizesStr ? sizesStr.split(',').map(s => s.trim()).filter(Boolean) : ['One Size'];

    const baseSku = $('#form-product-sku').val().trim() || 'SKU-VAR';
    const basePrice = $('#form-product-price').val() || '0.00';

    $('#variant-rows-container').empty();

    colors.forEach(c => {
      sizes.forEach(s => {
        addVariantRow({
          color: c !== 'Default' ? c : '',
          size: s !== 'One Size' ? s : '',
          sku: `${baseSku}-${c.substring(0,3).toUpperCase()}-${s.toUpperCase()}`,
          price: basePrice,
          stock: 10
        });
      });
    });
  }

  // ── Form Interactions & Visibility Toggles ──
  function initFormToggles() {
    // Inventory Tracking Toggle
    $('#form-product-track-stock').on('change', function() {
      const isTracked = $(this).is(':checked');
      $('#stock-qty-wrapper').toggle(isTracked);
    });

    // Availability Pre-Order Panel Toggle
    $('#form-product-availability').on('change', function() {
      const isPreorder = $(this).val() === 'preorder';
      $('#preorder-details-panel').toggle(isPreorder);
    });

    // Has Variants Toggle
    $('#form-product-has-variants').on('change', function() {
      const hasVar = $(this).is(':checked');
      $('#variants-management-panel').toggle(hasVar);
    });

    // Generate Variants Button
    $('#auto-generate-variants-btn').on('click', function() {
      generateVariantsFromSelections();
    });

    // Add Single Variant Row
    $('#add-variant-row-btn').on('click', function() {
      addVariantRow();
    });

    // Optional Specs Accordion Toggle
    $('#toggle-optional-specs-btn').on('click', function() {
      const $panel = $('#optional-specs-panel');
      const isVisible = $panel.is(':visible');
      $panel.slideToggle(200);
      $(this).find('.specs-icon').text(isVisible ? '+' : '−');
    });

    // Auto Slug
    $('#form-product-name').on('input', function() {
      const slug = $(this).val().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      $('#form-product-slug').val(slug);
    });
  }

  // ── 1. CREATE PAGE ──
  function initCreatePage() {
    galleryImages = ['assets/images/products/shirt-white.png'];
    renderGalleryUI();
    initImagePicker();
    initFormToggles();

    // Form Submit
    $('#product-full-form').on('submit', function(e) {
      e.preventDefault();
      saveProduct(null);
    });
  }

  // ── 2. EDIT PAGE ──
  function initEditPage(productId) {
    if (!productId) {
      alert('Product ID missing!');
      window.location.href = 'index.html';
      return;
    }

    const prod = window.BongoProducts.getById(productId);
    if (!prod) {
      alert('Product not found!');
      window.location.href = 'index.html';
      return;
    }

    initImagePicker();
    initFormToggles();

    // Prefill Basic Information
    $('#form-product-name').val(prod.name || '');
    $('#form-product-slug').val(prod.slug || '');
    $('#form-product-sku').val(prod.sku || `SKU-BG-${prod.id}`);
    $('#form-product-category').val(prod.category || 'fashion');
    updateSubcategoriesSelect();
    $('#form-product-subcategory').val(prod.subcategory || '');
    $('#form-product-brand').val(prod.brand || 'Bongo Curated');
    $('#form-product-desc').val(prod.desc || '');
    $('#form-product-full-desc').val(prod.fullDesc || prod.desc || '');

    // Pricing & Inventory
    $('#form-product-price').val(prod.price || '');
    $('#form-product-orig-price').val(prod.originalPrice || '');
    $('#form-product-stock-qty').val(prod.stockQty !== undefined ? prod.stockQty : 25);
    const trackStock = prod.trackStock !== false;
    $('#form-product-track-stock').prop('checked', trackStock);
    $('#stock-qty-wrapper').toggle(trackStock);

    // Images
    galleryImages = Array.isArray(prod.images) && prod.images.length > 0 
      ? [...prod.images] 
      : (prod.image ? [prod.image] : ['assets/images/products/shirt-white.png']);
    renderGalleryUI();

    // Visibility & Pre-order
    $('#form-product-active').prop('checked', !prod.isDisabled);
    $('#form-product-featured').prop('checked', Boolean(prod.isFeatured));
    $('#form-product-availability').val(prod.availability || 'instock');
    const isPreorder = prod.availability === 'preorder';
    $('#preorder-details-panel').toggle(isPreorder);
    if (prod.preorderDate) $('#form-preorder-date').val(prod.preorderDate);
    if (prod.preorderNote) $('#form-preorder-note').val(prod.preorderNote);

    // Variants
    const hasVar = Boolean(prod.hasVariants);
    $('#form-product-has-variants').prop('checked', hasVar);
    $('#variants-management-panel').toggle(hasVar);
    $('#form-product-variant-type').val(prod.variantType || 'both');
    $('#form-product-colors').val(Array.isArray(prod.colors) ? prod.colors.join(', ') : (prod.colors || ''));
    $('#form-product-sizes').val(Array.isArray(prod.sizes) ? prod.sizes.join(', ') : (prod.sizes || ''));

    $('#variant-rows-container').empty();
    if (hasVar && Array.isArray(prod.variants) && prod.variants.length > 0) {
      prod.variants.forEach(v => addVariantRow(v));
    }

    // Optional Specs
    const specs = prod.specs || {};
    const hasSpecs = Object.values(specs).some(val => val && val.trim() !== '');
    if (hasSpecs) {
      $('#optional-specs-panel').show();
      $('#toggle-optional-specs-btn').find('.specs-icon').text('−');
    }
    $('#form-spec-material').val(specs.material || '');
    $('#form-spec-fabric').val(specs.fabric || '');
    $('#form-spec-dimensions').val(specs.dimensions || '');
    $('#form-spec-fit').val(specs.fit || '');
    $('#form-spec-pattern').val(specs.pattern || '');
    $('#form-spec-weight').val(specs.weight || '');
    $('#form-spec-care').val(specs.care || '');

    // Form Submit
    $('#product-full-form').on('submit', function(e) {
      e.preventDefault();
      saveProduct(productId);
    });
  }

  // ── SAVE PRODUCT HANDLER ──
  function saveProduct(productId = null) {
    const name = $('#form-product-name').val().trim();
    let slug = $('#form-product-slug').val().trim();

    if (!name) {
      alert('Please enter a Product Name.');
      $('#form-product-name').focus();
      return;
    }

    if (!slug) {
      slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    }

    const sku = $('#form-product-sku').val().trim() || `SKU-BG-${Date.now().toString().substr(-5)}`;
    const category = $('#form-product-category').val() || 'fashion';
    const subcategory = $('#form-product-subcategory').val() || '';
    const brand = $('#form-product-brand').val() || 'Bongo Curated';

    const priceVal = $('#form-product-price').val();
    const price = priceVal !== '' ? parseFloat(priceVal) : 0;
    const origPriceVal = $('#form-product-orig-price').val();
    const originalPrice = origPriceVal !== '' ? parseFloat(origPriceVal) : null;

    const trackStock = $('#form-product-track-stock').is(':checked');
    const stockQty = trackStock ? (parseInt($('#form-product-stock-qty').val()) || 0) : 999;

    const isActive = $('#form-product-active').is(':checked');
    const isFeatured = $('#form-product-featured').is(':checked');
    const availability = $('#form-product-availability').val() || 'instock';

    const cleanImgPath = (src) => {
      if (!src) return 'assets/images/products/shirt-white.png';
      if (src.startsWith('../../assets/')) return src.replace('../../assets/', 'assets/');
      return src;
    };

    const mainImage = cleanImgPath(galleryImages.length > 0 ? galleryImages[0] : 'assets/images/products/shirt-white.png');
    const cleanedGallery = galleryImages.length > 0 ? galleryImages.map(img => cleanImgPath(img)) : [mainImage];
    const desc = $('#form-product-desc').val().trim();
    const fullDesc = $('#form-product-full-desc').val().trim();

    const hasVariants = $('#form-product-has-variants').is(':checked');
    const variantType = $('#form-product-variant-type').val() || 'both';
    const variants = hasVariants ? collectVariantsFromUI() : [];
    const colorsStr = $('#form-product-colors').val().trim();
    const sizesStr = $('#form-product-sizes').val().trim();

    const specs = {
      material: $('#form-spec-material').val().trim(),
      fabric: $('#form-spec-fabric').val().trim(),
      dimensions: $('#form-spec-dimensions').val().trim(),
      fit: $('#form-spec-fit').val().trim(),
      pattern: $('#form-spec-pattern').val().trim(),
      weight: $('#form-spec-weight').val().trim(),
      care: $('#form-spec-care').val().trim()
    };

    const payload = {
      name,
      slug,
      sku,
      category,
      subcategory,
      brand,
      price,
      originalPrice,
      stockQty,
      trackStock,
      availability,
      isFeatured,
      isDisabled: !isActive,
      image: mainImage,
      images: cleanedGallery,
      desc,
      fullDesc,
      colors: colorsStr ? colorsStr.split(',').map(s=>s.trim()) : [],
      sizes: sizesStr ? sizesStr.split(',').map(s=>s.trim()) : [],
      hasVariants,
      variantType,
      variants,
      specs
    };

    if (productId) {
      window.BongoProducts.update(productId, payload);
    } else {
      window.BongoProducts.create(payload);
    }

    // Redirect to Product List
    window.location.href = 'index.html';
  }

  // ── 3. VIEW PAGE (READ-ONLY DETAILS) ──
  function initViewPage(productId) {
    if (!productId) {
      alert('Product ID missing!');
      window.location.href = 'index.html';
      return;
    }

    const prod = window.BongoProducts.getById(productId);
    if (!prod) {
      alert('Product not found!');
      window.location.href = 'index.html';
      return;
    }

    $('#view-edit-btn').attr('href', `edit.html?id=${prod.id}`);
    $('#view-product-name').text(prod.name);

    // Basic Information
    $('#view-title').text(prod.name);
    $('#view-sku').text(prod.sku || `SKU-BG-${prod.id}`);
    $('#view-slug').text(prod.slug);
    $('#view-brand').text(prod.brand || 'Bongo Curated');

    const catObj = window.BongoCategories ? window.BongoCategories.getBySlug(prod.category) : null;
    $('#view-category').text(catObj ? catObj.name : prod.category);

    const subObj = window.BongoSubcategories ? window.BongoSubcategories.getAll().find(s => s.slug === prod.subcategory) : null;
    $('#view-subcategory').text(subObj ? subObj.name : (prod.subcategory || 'None'));

    $('#view-desc').text(prod.desc || 'No short description provided.');
    $('#view-full-desc').text(prod.fullDesc || prod.desc || 'No detailed description provided.');

    // Status Badges
    const $statusPill = $('#view-status-pill');
    if (prod.isDisabled) {
      $statusPill.removeClass().addClass('badge badge-neutral').html('<span class="badge-dot"></span> Disabled');
    } else {
      $statusPill.removeClass().addClass('badge badge-active').html('<span class="badge-dot"></span> Active');
    }

    let stockBadgeHtml = '';
    if (prod.availability === 'instock') {
      stockBadgeHtml = `<span class="badge badge-success"><span class="badge-dot"></span> In Stock (${prod.stockQty || 25})</span>`;
    } else if (prod.availability === 'lowstock') {
      stockBadgeHtml = `<span class="badge badge-warning"><span class="badge-dot"></span> Low Stock (${prod.stockQty || 3})</span>`;
    } else if (prod.availability === 'preorder') {
      stockBadgeHtml = '<span class="badge badge-purple"><span class="badge-dot"></span> Pre-Order</span>';
    } else {
      stockBadgeHtml = '<span class="badge badge-danger"><span class="badge-dot"></span> Out of Stock</span>';
    }
    $('#view-availability-badge').html(stockBadgeHtml);

    // Pricing
    $('#view-price').text(`A$${parseFloat(prod.price).toFixed(2)}`);
    if (prod.originalPrice && prod.originalPrice > prod.price) {
      $('#view-orig-price').text(`A$${parseFloat(prod.originalPrice).toFixed(2)}`);
      $('#view-discount-pill').text(`Sale`).show();
    } else {
      $('#view-orig-price').text('-');
      $('#view-discount-pill').hide();
    }

    $('#view-stock-qty').text(prod.stockQty !== undefined ? prod.stockQty : 25);
    $('#view-track-stock').text(prod.trackStock !== false ? 'Enabled' : 'Disabled');

    // Images
    const imgs = Array.isArray(prod.images) && prod.images.length > 0 ? prod.images : [prod.image];
    const mainImgPath = imgs[0] ? (imgs[0].startsWith('http') || imgs[0].startsWith('data:') || imgs[0].startsWith('assets/') ? (imgs[0].startsWith('assets/') ? `../../${imgs[0]}` : imgs[0]) : imgs[0]) : '../../assets/images/products/shirt-white.png';
    $('#view-main-image').attr('src', mainImgPath);

    const $galleryGrid = $('#view-gallery-grid');
    $galleryGrid.empty();
    imgs.forEach(imgUrl => {
      const displayPath = (imgUrl.startsWith('http') || imgUrl.startsWith('data:') || imgUrl.startsWith('assets/')) ? (imgUrl.startsWith('assets/') ? `../../${imgUrl}` : imgUrl) : imgUrl;
      $galleryGrid.append(`
        <div class="image-thumb-card">
          <img src="${displayPath}" alt="Gallery Image" onerror="this.src='../../assets/images/products/shirt-white.png';">
        </div>
      `);
    });

    // Variants Table
    const $varTable = $('#view-variants-table-tbody');
    $varTable.empty();
    if (prod.hasVariants && Array.isArray(prod.variants) && prod.variants.length > 0) {
      $('#view-variants-section').show();
      prod.variants.forEach(v => {
        $varTable.append(`
          <tr>
            <td>${v.color || '-'}</td>
            <td>${v.size || '-'}</td>
            <td><code>${v.sku || '-'}</code></td>
            <td>A$${parseFloat(v.price || prod.price).toFixed(2)}</td>
            <td>${v.stock !== undefined ? v.stock : 10}</td>
          </tr>
        `);
      });
    } else {
      $('#view-variants-section').hide();
    }

    // Technical Specifications
    const specs = prod.specs || {};
    const hasSpecs = Object.values(specs).some(val => val && val.trim() !== '');

    if (hasSpecs) {
      $('#view-specs-section').show();
      $('#view-spec-material').text(specs.material || '-');
      $('#view-spec-fabric').text(specs.fabric || '-');
      $('#view-spec-dimensions').text(specs.dimensions || '-');
      $('#view-spec-fit').text(specs.fit || '-');
      $('#view-spec-pattern').text(specs.pattern || '-');
      $('#view-spec-care').text(specs.care || '-');
    } else {
      $('#view-specs-section').hide();
    }
  }

})(jQuery);
