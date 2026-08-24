const planRadios = document.querySelectorAll('input[name="plan"]');
const methodRadios = document.querySelectorAll('input[name="method"]');
const paymentAmountElement = document.getElementById('payment-amount');
const paymentTotalElement = document.getElementById('payment-total');
const paymentPlanNameElement = document.getElementById('payment-plan-name');
const cardForm = document.getElementById('card-form');
const purchaseButton = document.getElementById('purchase-button');
const backButton = document.getElementById('back-button');
const consentCheckbox = document.getElementById('consent-checkbox');

function updateSelectedPlan() {
  planRadios.forEach((radio) => {
    const parent = radio.closest('.plan-card');
    if (!parent) return;
    parent.classList.toggle('selected', radio.checked);
  });

  const selected = document.querySelector('input[name="plan"]:checked');
  if (!selected) return;

  const amount = Number(selected.value);
  const selectedLabel = selected.closest('.plan-card')?.querySelector('.plan-title')?.textContent || 'プラン';

  if (paymentAmountElement) {
    paymentAmountElement.textContent = amount.toLocaleString();
  }
  if (paymentTotalElement) {
    paymentTotalElement.textContent = amount.toLocaleString();
  }
  if (paymentPlanNameElement) {
    paymentPlanNameElement.textContent = selectedLabel;
  }
  if (purchaseButton) {
    purchaseButton.textContent = `￥${amount.toLocaleString()}を支払う`;
  }

  // If monthly plan selected, hide payment method section and show monthly summary
  const paymentMethodSection = document.getElementById('payment-method-section');
  const monthlySummary = document.getElementById('monthly-summary');
  const paymentSummary = document.querySelector('.payment-summary');
  const paymentSectionHeader = paymentSummary ? paymentSummary.closest('.payment-section')?.querySelector('h2') : null;
  const monthlyRegisterBtn = document.getElementById('monthly-register');
  if (selected.value === '980') {
    if (paymentMethodSection) paymentMethodSection.style.display = 'none';
    if (monthlySummary) monthlySummary.style.display = 'block';
    if (paymentSummary) paymentSummary.style.display = 'none';
    if (paymentSectionHeader) paymentSectionHeader.style.display = 'none';
    // hide the normal purchase button since payment happens after registration
    if (purchaseButton) { purchaseButton.style.display = 'none'; }
   if (monthlyRegisterBtn) {
  monthlyRegisterBtn.onclick = () => {
    window.location.href = './signup.html?from=payment';
  };
}
  } else {
    if (paymentMethodSection) paymentMethodSection.style.display = '';
    if (monthlySummary) monthlySummary.style.display = 'none';
    if (paymentSummary) paymentSummary.style.display = '';
    if (paymentSectionHeader) paymentSectionHeader.style.display = '';
    if (purchaseButton) { purchaseButton.style.display = ''; }
  }
}

function updatePaymentMethod() {
  methodRadios.forEach((radio) => {
    const parent = radio.closest('.method-card');
    if (!parent) return;
    parent.classList.toggle('selected', radio.checked);
  });

  const selectedMethod = document.querySelector('input[name="method"]:checked');
  if (cardForm) {
    cardForm.style.display = selectedMethod && selectedMethod.value === 'card' ? 'block' : 'none';
  }
}

function initPaymentPage() {
  planRadios.forEach((radio) => {
    radio.addEventListener('change', updateSelectedPlan);
  });
  methodRadios.forEach((radio) => {
    radio.addEventListener('change', updatePaymentMethod);
  });

  if (purchaseButton) {
  purchaseButton.addEventListener('click', async () => {
    const selectedPlan = document.querySelector('input[name="plan"]:checked');
    const selectedMethod = document.querySelector('input[name="method"]:checked');

    if (!selectedPlan || selectedPlan.value !== '330') {
      return;
    }

    if (!consentCheckbox?.checked) {
      alert('利用規約とプライバシーポリシーに同意してください。');
      return;
    }

    if (!selectedMethod) {
      alert('お支払い方法を選択してください。');
      return;
    }

    // TODO:
    // ここにStripe CheckoutやPayPayの本番決済処理を入れる
    console.log('単発決済へ進む', {
      plan: selectedPlan.value,
      method: selectedMethod.value
    });
  });
}

  if (backButton) {
  backButton.addEventListener('click', () => {
    window.location.href = './complete.html';
  });
}

  if (consentCheckbox && purchaseButton) {
    consentCheckbox.addEventListener('change', () => {
      const checked = consentCheckbox.checked;
      purchaseButton.disabled = !checked;
      purchaseButton.classList.toggle('disabled', !checked);
    });
  }

  updateSelectedPlan();
  updatePaymentMethod();
}

initPaymentPage();
