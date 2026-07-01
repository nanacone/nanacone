const STORAGE_KEY = 'nanacone_invoice_draft';

function saveDraft() {
  const itemRows = document.querySelectorAll('.item-input-row');

  const items = Array.from(itemRows).map(row => {
    return {
      name: row.querySelector('.item-name').value,
      qty: row.querySelector('.item-qty').value,
      unit: row.querySelector('.item-unit').value,
      unitPrice: row.querySelector('.item-unit-price').value
    };
  });

  const draft = {
    clientName: clientNameInput.value,
    issueDate: issueDateInput.value,
    invoiceNumber: invoiceNumberInput.value,

    companyName: companyNameInput.value,
    companyPostcode: companyPostcodeInput.value,
    companyAddress: companyAddressInput.value,
    companyTel: companyTelInput.value,
    companyNumber: companyNumberInput.value,

    bankName: bankNameInput.value,
    bankBranch: bankBranchInput.value,
    bankAccount: bankAccountInput.value,
    paymentDate: paymentDateInput.value,
    note: noteInput.value,

    items: items
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
}
function loadDraft() {
  const savedDraft = localStorage.getItem(STORAGE_KEY);
  if (!savedDraft) return;

  const draft = JSON.parse(savedDraft);

  clientNameInput.value = draft.clientName || '';
  issueDateInput.value = draft.issueDate || '';
  invoiceNumberInput.value = draft.invoiceNumber || '';

  companyNameInput.value = draft.companyName || '';
  companyPostcodeInput.value = draft.companyPostcode || '';
  companyAddressInput.value = draft.companyAddress || '';
  companyTelInput.value = draft.companyTel || '';
  companyNumberInput.value = draft.companyNumber || '';

  bankNameInput.value = draft.bankName || '';
  bankBranchInput.value = draft.bankBranch || '';
  bankAccountInput.value = draft.bankAccount || '';
  paymentDateInput.value = draft.paymentDate || '';
  noteInput.value = draft.note || '';

  if (draft.items && draft.items.length > 0) {
    itemsContainer.innerHTML = '';

    draft.items.forEach(item => {
      const row = document.createElement('div');
      row.className = 'item-input-row';

      row.innerHTML = `
        <input class="item-name" type="text" placeholder="品目" value="${item.name || ''}">
        <input class="item-qty" type="number" value="${item.qty || 1}">
        <select class="item-unit">
          <option value="式">式</option>
          <option value="個">個</option>
          <option value="件">件</option>
          <option value="時間">時間</option>
          <option value="日">日</option>
          <option value="月">月</option>
        </select>
        <input class="item-unit-price" type="number" value="${item.unitPrice || 0}">
        <button type="button" class="delete-item-button">削除</button>
      `;

      row.querySelector('.item-unit').value = item.unit || '式';

      itemsContainer.appendChild(row);
    });
  }

  updateAllPreview();
}
function updateAllPreview() {
  previewClient.textContent = clientNameInput.value || '株式会社サンプル';

  previewIssueDate.textContent =
    issueDateInput.value || '2026年○月○日';

  previewInvoiceNumber.textContent =
    invoiceNumberInput.value || 'INV-2026001';

  previewCompanyName.textContent =
    companyNameInput.value || '〇〇会社';

  previewCompanyPostcode.textContent =
    companyPostcodeInput.value
      ? '〒' + companyPostcodeInput.value
      : '〒〇〇〇-〇〇〇〇';

  previewCompanyAddress.textContent =
    companyAddressInput.value || '〇〇県××市 123456';

  previewCompanyTel.textContent =
    companyTelInput.value || '〇〇-〇〇-〇〇';

  previewCompanyNumber.textContent =
    companyNumberInput.value
      ? 'T' + companyNumberInput.value
      : 'T';

  previewBankName.textContent =
    bankNameInput.value || '〇〇銀行';

  previewBankBranch.textContent =
    bankBranchInput.value || '〇〇支店';

  previewBankAccount.textContent =
    bankAccountInput.value || '123456';

  previewNote.textContent = noteInput.value;

  if (!paymentDateInput.value) {
    previewPaymentDate.textContent = '2026年○月○日';
  } else {
    const date = new Date(paymentDateInput.value);
    previewPaymentDate.textContent =
      `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
  }

  updateItems();
}
document.addEventListener('input', saveDraft);
document.addEventListener('change', saveDraft);

window.addEventListener('DOMContentLoaded', () => {
  loadDraft();
});