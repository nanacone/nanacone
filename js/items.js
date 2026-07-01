const itemsContainer = document.getElementById('items-container');
const addItemButton = document.getElementById('add-item-button');
const previewItemsBody = document.getElementById('preview-items-body');
const previewGrandTotal = document.getElementById('preview-grand-total');

function formatYen(num) {
  return Number(num).toLocaleString();
}

function updateItems() {
  const rows = document.querySelectorAll('.item-input-row');

  let subtotal = 0;
  previewItemsBody.innerHTML = '';

  rows.forEach(row => {
    const name = row.querySelector('.item-name').value || 'デザイン制作費';
    const qty = Number(row.querySelector('.item-qty').value) || 0;
    const unit = row.querySelector('.item-unit').value || '式';
    const unitPrice = Number(row.querySelector('.item-unit-price').value) || 0;

    const amount = qty * unitPrice;
    subtotal += amount;

    previewItemsBody.innerHTML += `
      <tr>
        <td>${name}</td>
        <td>${qty}</td>
        <td>${unit}</td>
        <td>￥${formatYen(unitPrice)}</td>
        <td>￥${formatYen(amount)}</td>
      </tr>
    `;
  });

  const tax = Math.floor(subtotal * 0.1);
  const total = subtotal + tax;

  previewItemsBody.innerHTML += `
  <tr class="summary-row">
    <td colspan="3" class="no-border"></td>
    <td>小計（税抜）</td>
    <td>￥${formatYen(subtotal)}</td>
  </tr>
  <tr class="summary-row">
    <td colspan="3" class="no-border"></td>
    <td>消費税（10%）</td>
    <td>￥${formatYen(tax)}</td>
  </tr>
  <tr class="summary-row">
    <td colspan="3" class="no-border"></td>
    <td>合計（税込）</td>
    <td>￥<span id="preview-total">${formatYen(total)}</span></td>
  </tr>
`;

  previewGrandTotal.textContent = formatYen(total);
}

itemsContainer.addEventListener('input', updateItems);
itemsContainer.addEventListener('change', updateItems);

addItemButton.addEventListener('click', () => {
  const newRow = document.createElement('div');
  newRow.className = 'item-input-row';

  newRow.innerHTML = `
  <input class="item-name" type="text" placeholder="品目">
  <input class="item-qty" type="number" value="1">
  <select class="item-unit">
    <option value="式">式</option>
    <option value="個">個</option>
    <option value="件">件</option>
    <option value="時間">時間</option>
    <option value="日">日</option>
    <option value="月">月</option>
  </select>
  <input class="item-unit-price" type="number" value="0">
  <button type="button" class="delete-item-button">削除</button>
`;
itemsContainer.addEventListener('click', (e) => {
  if (e.target.classList.contains('delete-item-button')) {
    e.target.closest('.item-input-row').remove();
    updateItems();
  }
});

  itemsContainer.appendChild(newRow);
  updateItems();
});

updateItems();