const STORAGE_KEY = 'nanaconne_estimate_draft';


// ========================================
// 見積書データを保存
// ========================================

function saveDraft() {

  const itemRows =
    document.querySelectorAll('.item-input-row');


  const items =
    Array.from(itemRows).map(row => {

      return {

        name:
          row.querySelector('.item-name')?.value || '',

        qty:
          row.querySelector('.item-qty')?.value || '1',

        unit:
          row.querySelector('.item-unit')?.value || '式',

        unitPrice:
          row.querySelector('.item-unit-price')?.value || '0'

      };

    });


  const draft = {

    clientName:
      document.getElementById('client-name')?.value || '',

    issueDate:
      document.getElementById('issue-date')?.value || '',

    invoiceNumber:
      document.getElementById('invoice-number')?.value || '',


    companyName:
      document.getElementById('company-name')?.value || '',

    companyPostcode:
      document.getElementById('company-postcode')?.value || '',

    companyAddress:
      document.getElementById('company-address')?.value || '',

    companyTel:
      document.getElementById('company-tel')?.value || '',

    companyNumber:
      document.getElementById('company-number')?.value || '',


    estimateValidDate:
      document.getElementById('estimate-valid-date')?.value || '',

    deliveryDate:
      document.getElementById('delivery-date')?.value || '',


    note:
      document.getElementById('note')?.value || '',


    stamp:
      document.getElementById('stamp-preview')?.src || '',


    items: items

  };


  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(draft)
  );

}


// ========================================
// 保存した見積書データを読み込む
// ========================================

function loadDraft() {

  const savedDraft =
    localStorage.getItem(STORAGE_KEY);


  if (!savedDraft) {
    return;
  }


  let draft;


  try {

    draft =
      JSON.parse(savedDraft);

  } catch (error) {

    console.error(
      '見積書データを読み込めませんでした。',
      error
    );

    return;

  }


  // ========================================
  // 基本情報
  // ========================================

  const clientNameInput =
    document.getElementById('client-name');

  const issueDateInput =
    document.getElementById('issue-date');

  const invoiceNumberInput =
    document.getElementById('invoice-number');

  const companyNameInput =
    document.getElementById('company-name');

  const companyPostcodeInput =
    document.getElementById('company-postcode');

  const companyAddressInput =
    document.getElementById('company-address');

  const companyTelInput =
    document.getElementById('company-tel');

  const companyNumberInput =
    document.getElementById('company-number');

  const estimateValidDateInput =
    document.getElementById('estimate-valid-date');

  const deliveryDateInput =
    document.getElementById('delivery-date');

  const noteInput =
    document.getElementById('note');


  if (clientNameInput) {
    clientNameInput.value =
      draft.clientName || '';
  }

  if (issueDateInput) {
    issueDateInput.value =
      draft.issueDate || '';
  }

  if (invoiceNumberInput) {
    invoiceNumberInput.value =
      draft.invoiceNumber || '';
  }

  if (companyNameInput) {
    companyNameInput.value =
      draft.companyName || '';
  }

  if (companyPostcodeInput) {
    companyPostcodeInput.value =
      draft.companyPostcode || '';
  }

  if (companyAddressInput) {
    companyAddressInput.value =
      draft.companyAddress || '';
  }

  if (companyTelInput) {
    companyTelInput.value =
      draft.companyTel || '';
  }

  if (companyNumberInput) {
    companyNumberInput.value =
      draft.companyNumber || '';
  }

  if (estimateValidDateInput) {
    estimateValidDateInput.value =
      draft.estimateValidDate || '';
  }

  if (deliveryDateInput) {
    deliveryDateInput.value =
      draft.deliveryDate || '';
  }

  if (noteInput) {
    noteInput.value =
      draft.note || '';
  }


  // ========================================
  // 角印
  // ========================================

  const stampPreview =
    document.getElementById('stamp-preview');

  const invoiceStamp =
    document.querySelector('.invoice-stamp');


  if (
    draft.stamp &&
    stampPreview &&
    invoiceStamp
  ) {

    stampPreview.src =
      draft.stamp;

    invoiceStamp.classList.add(
      'has-image'
    );

  }


  // ========================================
  // 明細
  // ========================================

  const itemsContainer =
    document.getElementById('items-container');


  if (
    itemsContainer &&
    Array.isArray(draft.items) &&
    draft.items.length > 0
  ) {

    itemsContainer.innerHTML = '';


    draft.items.forEach(item => {

      const row =
        document.createElement('div');

      row.className =
        'item-input-row';


      row.innerHTML = `
        <input
          class="item-name"
          type="text"
          placeholder="品目"
        >

        <input
          class="item-qty"
          type="number"
        >

        <input
          class="item-unit"
          type="text"
          placeholder="例：個、式、L"
        >

        <input
          class="item-unit-price"
          type="number"
        >

        <button
          type="button"
          class="delete-item-button"
        >
          削除
        </button>
      `;


      row.querySelector('.item-name').value =
        item.name || '';

      row.querySelector('.item-qty').value =
        item.qty || 1;

      row.querySelector('.item-unit').value =
        item.unit || '式';

      row.querySelector('.item-unit-price').value =
        item.unitPrice || 0;


      itemsContainer.appendChild(row);

    });

  }


  // ========================================
  // プレビュー更新
  // ========================================

  if (
    typeof updateAllPreview ===
    'function'
  ) {

    updateAllPreview();

  } else if (
    typeof updateItems ===
    'function'
  ) {

    updateItems();

  }

}


// ========================================
// 入力したら自動保存
// ========================================

document.addEventListener(
  'input',
  saveDraft
);

document.addEventListener(
  'change',
  saveDraft
);


// ========================================
// ページを開いたら復元
// ========================================

window.addEventListener(
  'DOMContentLoaded',
  () => {

    loadDraft();

  }
);