const itemsContainer = document.getElementById('items-container');
const addItemButton = document.getElementById('add-item-button');
const previewItemsBody = document.getElementById('preview-items-body');
const previewGrandTotal = document.getElementById('preview-grand-total');

function formatYen(num) {
  return Number(num).toLocaleString();
}


// =========================
// 明細プレビュー更新
// =========================

function updateItems() {
  const rows = document.querySelectorAll('.item-input-row');

  let subtotal = 0;
  previewItemsBody.innerHTML = '';

  rows.forEach(row => {

    const name =
      row.querySelector('.item-name').value || '';

    const qty =
      Number(row.querySelector('.item-qty').value) || 0;

    const unit =
  row.querySelector('.item-unit').value || '';

    const unitPrice =
      Number(row.querySelector('.item-unit-price').value) || 0;

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


// =========================
// 明細行を作る
// =========================

function createItemRow() {

  const newRow = document.createElement('div');

  newRow.className = 'item-input-row';

  newRow.innerHTML = `
    <input
      class="item-name"
      type="text"
      placeholder="品目"
    >

    <input
      class="item-qty"
      type="number"
      value="1"
    >

    <input
  class="item-unit"
  type="text"
  value="式"
  placeholder="例：個、式、L"
>

    <input
      class="item-unit-price"
      type="number"
      value="0"
    >

    <button
      type="button"
      class="delete-item-button"
    >
      削除
    </button>
  `;

  return newRow;
}


// =========================
// 入力したらプレビュー更新
// =========================

itemsContainer.addEventListener('input', updateItems);
itemsContainer.addEventListener('change', updateItems);


// =========================
// ＋ 明細行を追加
// =========================

addItemButton.addEventListener('click', () => {

  const newRow = createItemRow();

  itemsContainer.appendChild(newRow);

  updateItems();

  newRow.querySelector('.item-name').focus();
});


// =========================
// 削除ボタン
// =========================

// =========================
// 削除ボタン
// =========================

itemsContainer.addEventListener('click', function(e) {

  const deleteButton = e.target.closest('.delete-item-button');

  if (!deleteButton) {
    return;
  }

  const row = deleteButton.closest('.item-input-row');

  if (!row) {
    return;
  }

  row.remove();

  updateItems();

  console.log('明細行を削除しました');
});


// =========================
// 最初から5行にする
// =========================

while (
  itemsContainer.querySelectorAll('.item-input-row').length < 5
) {
  itemsContainer.appendChild(createItemRow());
}


// 最初のプレビュー表示
updateItems();