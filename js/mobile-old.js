'use strict';

document.addEventListener('DOMContentLoaded', () => {
  const mediaQuery = window.matchMedia('(max-width: 768px)');

  if (!mediaQuery.matches) {
    return;
  }

  const formPanel = document.querySelector('.form-panel');
  const previewCanvas = document.querySelector('.preview-canvas');
  const invoicePreview = document.querySelector('.invoice-preview');
  const navigation = document.querySelector('.mobile-form-navigation');
  const backButton = document.getElementById('mobile-back-button');
  const nextButton = document.getElementById('mobile-next-button');

  if (
    !formPanel ||
    !previewCanvas ||
    !invoicePreview ||
    !navigation ||
    !backButton ||
    !nextButton
  ) {
    console.warn('mobile-create: required element was not found.');
    return;
  }

  const settings = [
    ['#client-name', '請求先情報', '#preview-client'],
    ['#issue-date', '請求書情報', '#preview-issue-date'],
    ['#invoice-number', '請求書情報', '#preview-invoice-number'],
    ['#company-name', '自社情報', '#preview-company-name'],
    ['#company-postcode', '自社情報', '#preview-company-postcode'],
    ['#company-address', '自社情報', '#preview-company-address'],
    ['#company-tel', '自社情報', '#preview-company-tel'],
    ['#company-number', '自社情報', '#preview-company-number'],
    ['#stamp-upload', '角印', '.invoice-stamp'],
    ['#items-container', '明細情報', '.invoice-table'],
    ['#bank-name', '振込先情報', '#preview-bank-name'],
    ['#bank-branch', '振込先情報', '#preview-bank-branch'],
    ['#bank-account', '振込先情報', '#preview-bank-account'],
    ['#payment-date', 'お支払い情報', '#preview-payment-date'],
    ['#note', '備考', '.invoice-note']
  ];

  const steps = [];
  let currentStep = 0;
  let baseScale = 1;

  function makeStep(selector, titleText, targetSelector) {
    const element = document.querySelector(selector);

    if (!element) {
      return;
    }

    let content;

    if (selector === '#items-container') {
      content = document.createElement('div');
      content.className = 'mobile-step-field mobile-items-step';
      element.parentNode.insertBefore(content, element);
      content.appendChild(element);

      const addButton = document.getElementById('add-item-button');
      if (addButton) {
        content.appendChild(addButton);
      }
    } else {
      content = element.closest('label');

      if (!content) {
        content = document.createElement('div');
        content.className = 'mobile-step-field';
        element.parentNode.insertBefore(content, element);
        content.appendChild(element);
      }
    }

    const wrapper = document.createElement('div');
    wrapper.className = 'mobile-step';
    wrapper.dataset.previewTarget = targetSelector;

    const title = document.createElement('p');
    title.className = 'mobile-step-title';
    title.textContent = titleText;

    content.parentNode.insertBefore(wrapper, content);
    wrapper.appendChild(title);
    wrapper.appendChild(content);
    steps.push(wrapper);
  }

  settings.forEach(setting => makeStep(...setting));

  if (!steps.length) {
    return;
  }

  const counter = document.createElement('p');
  counter.id = 'mobile-step-counter';
  counter.className = 'mobile-step-counter';
  formPanel.insertBefore(counter, navigation);

  function getElementPositionInsideInvoice(element) {
    let x = 0;
    let y = 0;
    let node = element;

    while (node && node !== invoicePreview) {
      x += node.offsetLeft || 0;
      y += node.offsetTop || 0;
      node = node.offsetParent;
    }

    return {
      x,
      y,
      width: element.offsetWidth,
      height: element.offsetHeight
    };
  }

  function fitWholeInvoice() {
    const invoiceWidth = invoicePreview.offsetWidth || 720;
    const invoiceHeight = invoicePreview.scrollHeight || invoicePreview.offsetHeight;
    const canvasWidth = previewCanvas.clientWidth;
    const canvasHeight = previewCanvas.clientHeight;

    if (!canvasWidth || !canvasHeight || !invoiceHeight) {
      return;
    }

    baseScale = Math.min(
      canvasWidth / invoiceWidth,
      canvasHeight / invoiceHeight,
      1
    );

    const x = (canvasWidth - invoiceWidth * baseScale) / 2;
    const y = (canvasHeight - invoiceHeight * baseScale) / 2;

    invoicePreview.style.transform =
      `translate(${Math.max(x, 0)}px, ${Math.max(y, 0)}px) scale(${baseScale})`;
  }

  function focusPreview(targetSelector) {
    const target = document.querySelector(targetSelector);

    if (!target) {
      fitWholeInvoice();
      return;
    }

    const canvasWidth = previewCanvas.clientWidth;
    const canvasHeight = previewCanvas.clientHeight;
    const position = getElementPositionInsideInvoice(target);

    if (!canvasWidth || !canvasHeight) {
      return;
    }

    const focusScale = Math.min(Math.max(baseScale * 1.9, 0.55), 0.82);
    const centerX = position.x + position.width / 2;
    const centerY = position.y + position.height / 2;
    const x = canvasWidth / 2 - centerX * focusScale;
    const y = canvasHeight / 2 - centerY * focusScale;

    invoicePreview.style.transform =
      `translate(${x}px, ${y}px) scale(${focusScale})`;
  }

  function showStep(index, focusInput = true) {
    currentStep = Math.max(0, Math.min(index, steps.length - 1));

    steps.forEach((step, stepIndex) => {
      step.classList.toggle('active', stepIndex === currentStep);
    });

    counter.textContent = `${currentStep + 1} / ${steps.length}`;
    backButton.disabled = currentStep === 0;
    nextButton.textContent = currentStep === steps.length - 1 ? '確認へ' : '次へ';
    formPanel.scrollTop = 0;

   requestAnimationFrame(() => {
  fitWholeInvoice();
});

    if (focusInput) {
      const input = steps[currentStep].querySelector('input, select, textarea');
      if (input && input.type !== 'file') {
        window.setTimeout(() => input.focus({ preventScroll: true }), 180);
      }
    }
  }

  backButton.addEventListener('click', () => {
    showStep(currentStep - 1);
  });

  nextButton.addEventListener('click', () => {
    if (currentStep < steps.length - 1) {
      showStep(currentStep + 1);
      return;
    }

    fitWholeInvoice();
    nextButton.textContent = '入力完了';
  });

  /*
formPanel.addEventListener('focusin', () => {
  const step = steps[currentStep];
  if (step) {
    focusPreview(step.dataset.previewTarget);
  }
});

formPanel.addEventListener('input', () => {
  const step = steps[currentStep];
  if (step) {
    focusPreview(step.dataset.previewTarget);
  }
});
*/

  window.addEventListener('resize', () => showStep(currentStep, false));
  window.addEventListener('load', () => showStep(currentStep, false));
let pinchScale = 1;
let translateX = 0;
let translateY = 0;

let startDistance = 0;
let startScale = 1;
let startX = 0;
let startY = 0;
let startTranslateX = 0;
let startTranslateY = 0;

function applyPreviewTransform() {
  invoicePreview.style.transform =
    `translate(${translateX}px, ${translateY}px) scale(${baseScale * pinchScale})`;
}

previewCanvas.addEventListener(
  'touchstart',
  event => {
    if (event.touches.length === 2) {
      event.preventDefault();

      const first = event.touches[0];
      const second = event.touches[1];

      startDistance = Math.hypot(
        second.clientX - first.clientX,
        second.clientY - first.clientY
      );

      startScale = pinchScale;
      return;
    }

    if (event.touches.length === 1 && pinchScale > 1) {
      const touch = event.touches[0];

      startX = touch.clientX;
      startY = touch.clientY;
      startTranslateX = translateX;
      startTranslateY = translateY;
    }
  },
  { passive: false }
);

previewCanvas.addEventListener(
  'touchmove',
  event => {
    if (event.touches.length === 2) {
      event.preventDefault();

      const first = event.touches[0];
      const second = event.touches[1];

      const currentDistance = Math.hypot(
        second.clientX - first.clientX,
        second.clientY - first.clientY
      );

      const ratio = currentDistance / startDistance;

      pinchScale = Math.min(
        Math.max(startScale * ratio, 1),
        3
      );

      applyPreviewTransform();
      return;
    }

    if (event.touches.length === 1 && pinchScale > 1) {
      event.preventDefault();

      const touch = event.touches[0];

      translateX =
        startTranslateX + (touch.clientX - startX);

      translateY =
        startTranslateY + (touch.clientY - startY);

      applyPreviewTransform();
    }
  },
  { passive: false }
);

previewCanvas.addEventListener('touchend', event => {
  if (event.touches.length === 0 && pinchScale <= 1) {
    fitWholeInvoice();
    translateX = 0;
    translateY = 0;
  }
});
  showStep(0, false);
});
