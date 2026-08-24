'use strict';

document.addEventListener('DOMContentLoaded', () => {

  if (!window.matchMedia('(max-width: 768px)').matches) return;


  const formPanel = document.querySelector('.form-panel');
  const createLayout = document.querySelector('.create-layout');
  const canvas = document.querySelector('.preview-canvas');
  const invoice = document.querySelector('.invoice-preview');
  const navigation = document.querySelector('.mobile-form-navigation');

  const backButton =
    document.getElementById('mobile-back-button');

  const nextButton =
    document.getElementById('mobile-next-button');


  if (
    !formPanel ||
    !createLayout ||
    !canvas ||
    !invoice ||
    !navigation ||
    !backButton ||
    !nextButton
  ) {
    return;
  }


  /* ========================================
     見積書の入力ステップ
  ======================================== */

  const settings = [

    [
      '#client-name',
      '見積先情報',
      '#preview-client'
    ],

    [
      '#issue-date',
      '見積書情報',
      '#preview-issue-date'
    ],

    [
      '#invoice-number',
      '見積書情報',
      '#preview-invoice-number'
    ],

    [
      '#company-name',
      '自社情報',
      '#preview-company-name'
    ],

    [
      '#company-postcode',
      '自社情報',
      '#preview-company-postcode'
    ],

    [
      '#company-address',
      '自社情報',
      '#preview-company-address'
    ],

    [
      '#company-tel',
      '自社情報',
      '#preview-company-tel'
    ],

    [
      '#company-number',
      '自社情報',
      '#preview-company-number'
    ],

    [
      '#stamp-upload',
      '角印',
      '.invoice-stamp'
    ],

    [
      '#items-container',
      '明細情報',
      '#preview-items-body'
    ],

    [
      '#estimate-valid-date',
      '見積条件',
      '#preview-estimate-valid-date'
    ],

    [
      '#delivery-date',
      '見積条件',
      '#preview-delivery-date'
    ],

    [
      '#note',
      '備考',
      '#preview-note'
    ]

  ];


  const steps = [];


  settings.forEach(
    ([selector, titleText, previewSelector]) => {

      const element =
        document.querySelector(selector);

      if (!element) return;


      const previewElement =
        document.querySelector(previewSelector);


      const content =
        selector === '#items-container'
          ? element
          : element.closest('label') || element;


      const wrapper =
        document.createElement('div');

      wrapper.className = 'mobile-step';


      const title =
        document.createElement('p');

      title.className =
        'mobile-step-title';

      title.textContent =
        titleText;


      content.parentElement.insertBefore(
        wrapper,
        content
      );


      wrapper.append(
        title,
        content
      );


      /* 明細追加ボタン */
      if (selector === '#items-container') {

        const addItemButton =
          document.getElementById(
            'add-item-button'
          );

        if (addItemButton) {
          wrapper.append(addItemButton);
        }

      }


      element.addEventListener(
        'focus',
        () => focusPreview(previewElement)
      );


      steps.push({
        wrapper,
        element,
        previewElement
      });

    }
  );


  /* ========================================
     最終確認
  ======================================== */

  const reviewWrapper =
    document.createElement('div');

  reviewWrapper.className =
    'mobile-step mobile-review-step';


  const reviewTitle =
    document.createElement('p');

  reviewTitle.className =
    'mobile-step-title';

  reviewTitle.textContent =
    '入力内容の確認';


  const reviewMessage =
    document.createElement('p');

  reviewMessage.className =
    'mobile-review-message';

  reviewMessage.textContent =
    '見積書全体を確認してください。修正する場合は「戻る」で入力画面へ戻れます。';


  reviewWrapper.append(
    reviewTitle,
    reviewMessage
  );


  formPanel.appendChild(
    reviewWrapper
  );


  steps.push({
    wrapper: reviewWrapper,
    element: null,
    previewElement: null,
    isReview: true
  });


  /* ========================================
     ステップカウンター
  ======================================== */

  const counter =
    document.createElement('p');

  counter.className =
    'mobile-step-counter';

  navigation.prepend(counter);


  let currentStep = 0;

  let baseScale = 1;

  let translateX = 0;
  let translateY = 0;


  /* ========================================
     プレビュー表示
  ======================================== */

  function applyPreview(
    scale = baseScale
  ) {

    invoice.style.transform =
      `translate(${translateX}px, ${translateY}px) scale(${scale})`;

  }


  function fitInvoice() {

    const width =
      invoice.offsetWidth || 720;

    const height =
      invoice.scrollHeight ||
      invoice.offsetHeight;

    const canvasWidth =
      canvas.clientWidth;

    const canvasHeight =
      canvas.clientHeight;


    if (
      !width ||
      !height ||
      !canvasWidth ||
      !canvasHeight
    ) {
      return;
    }


    baseScale =
      Math.min(
        canvasWidth / width,
        canvasHeight / height,
        1
      );


    translateX =
      (canvasWidth -
        width * baseScale) / 2;


    translateY =
      Math.max(
        (canvasHeight -
          height * baseScale) / 2,
        0
      );


    applyPreview();

  }


  /* ========================================
     入力位置を拡大
  ======================================== */

  function focusPreview(element) {

    if (!element) {
      fitInvoice();
      return;
    }


    fitInvoice();


    const invoiceRect =
      invoice.getBoundingClientRect();

    const targetRect =
      element.getBoundingClientRect();


    const targetX =
      (
        targetRect.left -
        invoiceRect.left +
        targetRect.width / 2
      ) / baseScale;


    const targetY =
      (
        targetRect.top -
        invoiceRect.top +
        targetRect.height / 2
      ) / baseScale;


    const scale =
      Math.min(
        baseScale * 1.8,
        1.2
      );


    translateX =
      canvas.clientWidth / 2 -
      targetX * scale;


    translateY =
      canvas.clientHeight / 2 -
      targetY * scale;


    const scaledWidth =
      invoice.offsetWidth * scale;

    const scaledHeight =
      invoice.offsetHeight * scale;


    const minX =
      Math.min(
        0,
        canvas.clientWidth -
        scaledWidth
      );

    const maxX =
      Math.max(
        0,
        canvas.clientWidth -
        scaledWidth
      );


    const minY =
      Math.min(
        0,
        canvas.clientHeight -
        scaledHeight
      );

    const maxY =
      Math.max(
        0,
        canvas.clientHeight -
        scaledHeight
      );


    translateX =
      Math.min(
        maxX,
        Math.max(
          minX,
          translateX
        )
      );


    translateY =
      Math.min(
        maxY,
        Math.max(
          minY,
          translateY
        )
      );


    applyPreview(scale);

  }


  /* ========================================
     ステップ表示
  ======================================== */

  function showStep(
    index,
    focus = true
  ) {

    currentStep =
      Math.max(
        0,
        Math.min(
          index,
          steps.length - 1
        )
      );


    steps.forEach(
      (step, stepIndex) => {

        step.wrapper.classList.toggle(
          'active',
          stepIndex === currentStep
        );

      }
    );


    createLayout.classList.toggle(
      'items-step-active',
      steps[currentStep].element?.id ===
        'items-container'
    );


    counter.textContent =
      `${currentStep + 1} / ${steps.length}`;


    /* 角印削除ボタン */
    const removeStampBtn =
      document.getElementById(
        'remove-stamp-button'
      );


    const stampStepIndex =
      steps.findIndex(
        step =>
          step.element &&
          step.element.id ===
            'stamp-upload'
      );


    if (removeStampBtn) {

      removeStampBtn.style.display =
        currentStep === stampStepIndex
          ? ''
          : 'none';

    }


    backButton.disabled = false;


    if (steps[currentStep].isReview) {

      nextButton.textContent =
        'プレビューを確認';

    } else if (
      currentStep ===
      steps.length - 2
    ) {

      nextButton.textContent =
        '確認画面へ';

    } else {

      nextButton.textContent =
        '次へ';

    }


    requestAnimationFrame(
      () => {

        if (focus) {

          focusPreview(
            steps[currentStep]
              .previewElement
          );

        } else {

          fitInvoice();

        }

      }
    );

  }


  /* ========================================
     戻る
  ======================================== */

  backButton.addEventListener(
    'click',
    () => {

      if (currentStep === 0) {

        window.location.href =
          new URL(
            'index.html',
            window.location.href
          ).href;

        return;
      }


      showStep(
        currentStep - 1
      );

    }
  );


  /* ========================================
     次へ
  ======================================== */

  nextButton.addEventListener(
    'click',
    () => {

      if (steps[currentStep].isReview) {

        try {

          if (
            typeof saveDraft ===
            'function'
          ) {
            saveDraft();
          }

        } finally {

         window.location.assign(
  new URL(
    'complete.html?type=estimate',
    window.location.href
  ).href
);
        }

        return;
      }


      if (
        currentStep <
        steps.length - 1
      ) {

        showStep(
          currentStep + 1,
          currentStep + 1 <
            steps.length - 1
        );

      } else {

        fitInvoice();

      }

    }
  );


  /* ========================================
     リサイズ
  ======================================== */

  window.addEventListener(
    'resize',
    fitInvoice
  );

  window.addEventListener(
    'load',
    fitInvoice
  );


  showStep(0, false);


  window.setTimeout(
    fitInvoice,
    100
  );


  /* ========================================
     角印
  ======================================== */

  const stampInputEl =
    document.getElementById(
      'stamp-upload'
    );


  const stampStepIndex =
    steps.findIndex(
      step =>
        step.element &&
        step.element.id ===
          'stamp-upload'
    );


  if (
    stampInputEl &&
    stampStepIndex !== -1
  ) {

    const keepStampFocused =
      () =>
        showStep(
          stampStepIndex,
          true
        );


    stampInputEl.addEventListener(
      'click',
      keepStampFocused
    );

    stampInputEl.addEventListener(
      'focus',
      keepStampFocused
    );

    stampInputEl.addEventListener(
      'change',
      keepStampFocused
    );

  }

});