const clientNameInput = document.getElementById('client-name');
const previewClient = document.getElementById('preview-client');

    clientNameInput.addEventListener('input', () => {
      previewClient.textContent = clientNameInput.value || '株式会社サンプル';
    });

const issueDateInput = document.getElementById('issue-date');
const invoiceNumberInput = document.getElementById('invoice-number');

const companyNameInput = document.getElementById('company-name');
const companyAddressInput = document.getElementById('company-address');
const companyTelInput = document.getElementById('company-tel');
const companyNumberInput = document.getElementById('company-number');

const bankNameInput = document.getElementById('bank-name');
const bankBranchInput = document.getElementById('bank-branch');
const bankAccountInput = document.getElementById('bank-account');
const paymentDateInput = document.getElementById('payment-date');
const noteInput = document.getElementById('note');

const previewIssueDate = document.getElementById('preview-issue-date');
const previewInvoiceNumber = document.getElementById('preview-invoice-number');

const previewCompanyName = document.getElementById('preview-company-name');
const previewCompanyAddress = document.getElementById('preview-company-address');
const previewCompanyTel = document.getElementById('preview-company-tel');
const previewCompanyNumber = document.getElementById('preview-company-number');

issueDateInput.addEventListener('input', () => {
  previewIssueDate.textContent = issueDateInput.value || '2026年○月○日';
});

invoiceNumberInput.addEventListener('input', () => {
  previewInvoiceNumber.textContent = invoiceNumberInput.value || 'INV-2026001';
});

companyNameInput.addEventListener('input', () => {
  previewCompanyName.textContent = companyNameInput.value || '〇〇会社';
});



companyAddressInput.addEventListener('input', () => {
  previewCompanyAddress.textContent =
    companyAddressInput.value || '〇〇県××市 123456';
});

companyTelInput.addEventListener('input', () => {
  previewCompanyTel.textContent = companyTelInput.value || '〇〇-〇〇-〇〇';
});

companyNumberInput.addEventListener('input', () => {
  previewCompanyNumber.textContent =
    companyNumberInput.value
      ? 'T' + companyNumberInput.value
      : 'T';
});
const companyPostcodeInput =
  document.getElementById('company-postcode');

const previewCompanyPostcode =
  document.getElementById('preview-company-postcode');

companyPostcodeInput.addEventListener('input', () => {
  previewCompanyPostcode.textContent =
    companyPostcodeInput.value
      ? '〒' + companyPostcodeInput.value
      : '〒〇〇〇-〇〇〇〇';
});

const previewBankName = document.getElementById('preview-bank-name');
const previewBankBranch = document.getElementById('preview-bank-branch');
const previewBankAccount = document.getElementById('preview-bank-account');
const previewNote = document.getElementById('preview-note');

bankNameInput.addEventListener('input', () => {
  previewBankName.textContent = bankNameInput.value || '〇〇銀行';
});

bankBranchInput.addEventListener('input', () => {
  previewBankBranch.textContent = bankBranchInput.value || '〇〇支店';
});

bankAccountInput.addEventListener('input', () => {
  previewBankAccount.textContent = bankAccountInput.value || '123456';
});

const previewPaymentDate = document.getElementById('preview-payment-date');

noteInput.addEventListener('input', () => {
  previewNote.textContent = noteInput.value;
});

paymentDateInput.addEventListener('input', () => {

  if (!paymentDateInput.value) {
    previewPaymentDate.textContent =
      '2026年○月○日';
    return;
  }

  const date =
    new Date(paymentDateInput.value);

  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  previewPaymentDate.textContent =
    `${year}年${month}月${day}日`;
});