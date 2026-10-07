/**
 * Aus Ecom Catalog Management JavaScript
 * Handles dynamic UI logic for Products, Categories, Subcategories, and Brands CRUD
 */

document.addEventListener('DOMContentLoaded', function () {
  
  // ----------------------------------------------------
  // 1. Feature Toggle Card Visibility Switchers
  // ----------------------------------------------------
  const toggleVariants = document.getElementById('toggleVariants');
  const cardVariants = document.getElementById('cardVariants');
  
  const toggleStock = document.getElementById('toggleStock');
  const cardStock = document.getElementById('cardStock');
  const baseStockField = document.getElementById('baseStockField');

  const togglePreorder = document.getElementById('togglePreorder');
  const cardPreorder = document.getElementById('cardPreorder');

  const toggleSizeGuide = document.getElementById('toggleSizeGuide');
  const cardSizeGuide = document.getElementById('cardSizeGuide');

  const toggleSale = document.getElementById('toggleSale');
  const salePriceFields = document.querySelectorAll('.sale-price-field');

  if (toggleVariants && cardVariants) {
    toggleVariants.addEventListener('change', function () {
      cardVariants.style.display = this.checked ? 'block' : 'none';
      if (baseStockField) {
        baseStockField.style.display = this.checked ? 'none' : 'block';
      }
    });
  }

  if (toggleStock) {
    toggleStock.addEventListener('change', function () {
      if (cardStock) cardStock.style.display = this.checked ? 'block' : 'none';
    });
  }

  if (togglePreorder && cardPreorder) {
    togglePreorder.addEventListener('change', function () {
      cardPreorder.style.display = this.checked ? 'block' : 'none';
    });
  }

  if (toggleSizeGuide && cardSizeGuide) {
    toggleSizeGuide.addEventListener('change', function () {
      cardSizeGuide.style.display = this.checked ? 'block' : 'none';
    });
  }

  if (toggleSale) {
    toggleSale.addEventListener('change', function () {
      salePriceFields.forEach(el => {
        el.style.display = this.checked ? 'block' : 'none';
      });
    });
  }

  // ----------------------------------------------------
  // 2. Color Swatch Add/Delete & Picker
  // ----------------------------------------------------
  const btnAddColor = document.getElementById('btnAddColor');
  const colorsContainer = document.getElementById('colorsContainer');

  if (btnAddColor && colorsContainer) {
    btnAddColor.addEventListener('click', function () {
      const colorId = Date.now();
      const colorRow = document.createElement('div');
      colorRow.className = 'd-flex align-items-center gap-2 p-2 rounded border mb-2 color-item-row';
      colorRow.style.backgroundColor = 'var(--beige-bg-alt)';
      colorRow.style.borderColor = 'var(--beige-border-subtle)';
      colorRow.innerHTML = `
        <input type="color" class="form-control form-control-color border-0 p-0 color-picker-input" value="#7E5B44" title="Choose color" style="width: 36px; height: 36px; cursor: pointer;">
        <span class="color-swatch-circle rounded-circle border" style="width: 24px; height: 24px; background-color: #7E5B44; display: inline-block;"></span>
        <input type="text" class="form-control form-control-sm color-name-input" placeholder="Color Name (e.g. Olive Green)" value="New Color">
        <input type="text" class="form-control form-control-sm color-hex-input" placeholder="#HEX" value="#7E5B44" style="width: 100px;">
        <button type="button" class="btn btn-sm btn-icon text-danger btn-remove-color"><i class="mdi mdi-trash-can-outline fs-5"></i></button>
      `;

      colorsContainer.appendChild(colorRow);
      attachColorRowEvents(colorRow);
      updateVariantsMatrix();
    });

    document.querySelectorAll('.color-item-row').forEach(attachColorRowEvents);
  }

  function attachColorRowEvents(row) {
    const picker = row.querySelector('.color-picker-input');
    const swatch = row.querySelector('.color-swatch-circle');
    const hexInput = row.querySelector('.color-hex-input');
    const nameInput = row.querySelector('.color-name-input');
    const btnRemove = row.querySelector('.btn-remove-color');

    if (picker) {
      picker.addEventListener('input', function () {
        if (swatch) swatch.style.backgroundColor = this.value;
        if (hexInput) hexInput.value = this.value.toUpperCase();
        updateVariantsMatrix();
      });
    }

    if (hexInput) {
      hexInput.addEventListener('input', function () {
        if (swatch) swatch.style.backgroundColor = this.value;
        if (picker) picker.value = this.value;
        updateVariantsMatrix();
      });
    }

    if (nameInput) {
      nameInput.addEventListener('input', updateVariantsMatrix);
    }

    if (btnRemove) {
      btnRemove.addEventListener('click', function () {
        row.remove();
        updateVariantsMatrix();
      });
    }
  }

  // ----------------------------------------------------
  // 3. Size Selection Chips
  // ----------------------------------------------------
  const sizeChips = document.querySelectorAll('.size-chip-checkbox');
  sizeChips.forEach(chip => {
    chip.addEventListener('change', updateVariantsMatrix);
  });

  // ----------------------------------------------------
  // 4. Automatic Variant Matrix Generator
  // ----------------------------------------------------
  const btnGenerateVariants = document.getElementById('btnGenerateVariants');
  const variantsTableBody = document.getElementById('variantsTableBody');

  if (btnGenerateVariants) {
    btnGenerateVariants.addEventListener('click', updateVariantsMatrix);
  }

  function updateVariantsMatrix() {
    if (!variantsTableBody) return;

    const selectedColors = [];
    document.querySelectorAll('.color-item-row').forEach(row => {
      const name = row.querySelector('.color-name-input')?.value || 'Color';
      const hex = row.querySelector('.color-hex-input')?.value || '#000000';
      selectedColors.push({ name, hex });
    });

    const selectedSizes = [];
    document.querySelectorAll('.size-chip-checkbox:checked').forEach(chip => {
      selectedSizes.push(chip.value);
    });

    if (selectedColors.length === 0 && selectedSizes.length === 0) {
      return;
    }

    // Keep base SKU prefix
    const baseSku = document.getElementById('productSku')?.value || 'PRD-001';
    const basePrice = document.getElementById('regularPrice')?.value || '100.00';

    let html = '';

    // If both colors and sizes selected
    if (selectedColors.length > 0 && selectedSizes.length > 0) {
      selectedColors.forEach(color => {
        selectedSizes.forEach(size => {
          const varSku = `${baseSku}-${color.name.substr(0, 3).toUpperCase()}-${size}`;
          html += renderVariantRow(color.name, color.hex, size, varSku, basePrice);
        });
      });
    } else if (selectedColors.length > 0) {
      selectedColors.forEach(color => {
        const varSku = `${baseSku}-${color.name.substr(0, 3).toUpperCase()}`;
        html += renderVariantRow(color.name, color.hex, 'Standard', varSku, basePrice);
      });
    } else if (selectedSizes.length > 0) {
      selectedSizes.forEach(size => {
        const varSku = `${baseSku}-${size}`;
        html += renderVariantRow('Default', '#7E5B44', size, varSku, basePrice);
      });
    }

    variantsTableBody.innerHTML = html;
    attachVariantRowEvents();
  }

  function renderVariantRow(colorName, colorHex, size, sku, price) {
    return `
      <tr class="variant-tr align-middle">
        <td>
          <div class="d-flex align-items-center gap-2">
            <span class="rounded-circle border" style="width: 18px; height: 18px; background-color: ${colorHex}; display: inline-block;"></span>
            <span class="fw-medium text-dark fs-8">${colorName}</span>
          </div>
        </td>
        <td><span class="badge bg-label-secondary fs-8">${size}</span></td>
        <td><input type="text" class="form-control form-control-sm" value="${sku}"></td>
        <td><input type="number" class="form-control form-control-sm" value="${price}"></td>
        <td><input type="number" class="form-control form-control-sm" placeholder="Optional"></td>
        <td><input type="number" class="form-control form-control-sm" value="25"></td>
        <td>
          <div class="form-check form-switch mb-0">
            <input class="form-check-input" type="checkbox" checked>
          </div>
        </td>
        <td class="text-end">
          <button type="button" class="btn btn-sm btn-icon text-danger btn-remove-variant"><i class="mdi mdi-close fs-5"></i></button>
        </td>
      </tr>
    `;
  }

  function attachVariantRowEvents() {
    document.querySelectorAll('.btn-remove-variant').forEach(btn => {
      btn.addEventListener('click', function () {
        this.closest('tr').remove();
      });
    });
  }

  // ----------------------------------------------------
  // 5. Size Guide Table Rows Builder
  // ----------------------------------------------------
  const btnAddSizeGuideRow = document.getElementById('btnAddSizeGuideRow');
  const sizeGuideTableBody = document.getElementById('sizeGuideTableBody');

  if (btnAddSizeGuideRow && sizeGuideTableBody) {
    btnAddSizeGuideRow.addEventListener('click', function () {
      const tr = document.createElement('tr');
      tr.className = 'align-middle';
      tr.innerHTML = `
        <td><input type="text" class="form-control form-control-sm" value="L"></td>
        <td><input type="text" class="form-control form-control-sm" value="100 - 105"></td>
        <td><input type="text" class="form-control form-control-sm" value="85 - 90"></td>
        <td><input type="text" class="form-control form-control-sm" value="75"></td>
        <td class="text-end">
          <button type="button" class="btn btn-sm btn-icon text-danger btn-remove-sg-row"><i class="mdi mdi-trash-can-outline fs-5"></i></button>
        </td>
      `;
      sizeGuideTableBody.appendChild(tr);
      tr.querySelector('.btn-remove-sg-row').addEventListener('click', function () {
        tr.remove();
      });
    });

    document.querySelectorAll('.btn-remove-sg-row').forEach(btn => {
      btn.addEventListener('click', function () {
        this.closest('tr').remove();
      });
    });
  }

  // ----------------------------------------------------
  // 6. Custom Attributes Builder
  // ----------------------------------------------------
  const btnAddAttribute = document.getElementById('btnAddAttribute');
  const attributesContainer = document.getElementById('attributesContainer');

  if (btnAddAttribute && attributesContainer) {
    btnAddAttribute.addEventListener('click', function () {
      const row = document.createElement('div');
      row.className = 'row g-2 mb-2 align-items-center attribute-row';
      row.innerHTML = `
        <div class="col-5">
          <input type="text" class="form-control form-control-sm" placeholder="Key (e.g. Finish)">
        </div>
        <div class="col-6">
          <input type="text" class="form-control form-control-sm" placeholder="Value (e.g. Matte Wax Finish)">
        </div>
        <div class="col-1 text-end">
          <button type="button" class="btn btn-sm btn-icon text-danger btn-remove-attr"><i class="mdi mdi-trash-can-outline fs-5"></i></button>
        </div>
      `;
      attributesContainer.appendChild(row);
      row.querySelector('.btn-remove-attr').addEventListener('click', function () {
        row.remove();
      });
    });

    document.querySelectorAll('.btn-remove-attr').forEach(btn => {
      btn.addEventListener('click', function () {
        this.closest('.attribute-row').remove();
      });
    });
  }

  // ----------------------------------------------------
  // 7. Save / Submit Notification Feedback
  // ----------------------------------------------------
  const productForm = document.getElementById('productForm');
  if (productForm) {
    productForm.addEventListener('submit', function (e) {
      e.preventDefault();
      alert('Product saved successfully!');
      window.location.href = 'products.html';
    });
  }

});
