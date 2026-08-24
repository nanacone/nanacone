'use strict';

document.addEventListener('DOMContentLoaded', () => {

  const modal = document.querySelector('.template-modal');

  if (!modal) return;

  const cards = document.querySelectorAll('.template-card');

  const modalTitle =
    modal.querySelector('.modal-title');

  const modalDescription =
    modal.querySelector('.modal-description');

  const modalImage =
    modal.querySelector('.modal-image img');

  const modalSelectButton =
    modal.querySelector('.modal-select-button');

  const closeButton =
    modal.querySelector('.modal-close');

  const backdrop =
    modal.querySelector('.modal-backdrop');


  let selectedUrl = '';


  function closeModal() {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
  }


  cards.forEach(card => {

    card.addEventListener('click', () => {

      const title =
        card.querySelector('h3');

      const description =
        card.querySelector('p');

      const image =
        card.querySelector('.template-image img');


      /* 遷移先 */
      selectedUrl = card.dataset.url || '';


      /* タイトル */
      if (modalTitle && title) {
        modalTitle.textContent =
          title.textContent;
      }


      /* 説明 */
      if (modalDescription && description) {
        modalDescription.textContent =
          description.textContent;
      }


      /* 画像 */
      if (modalImage && image) {
        modalImage.src = image.src;

        modalImage.alt =
          image.alt ||
          title?.textContent ||
          'テンプレート';
      }


      /* モーダル表示 */
      modal.classList.add('active');

      modal.setAttribute(
        'aria-hidden',
        'false'
      );

    });

  });


  /* テンプレート決定 */
  modalSelectButton?.addEventListener(
    'click',
    event => {

      event.stopPropagation();

      if (!selectedUrl) {
        console.error(
          'テンプレートのdata-urlが設定されていません'
        );
        return;
      }

      window.location.href =
        selectedUrl;

    }
  );


  /* × */
  closeButton?.addEventListener(
    'click',
    event => {

      event.stopPropagation();

      closeModal();

    }
  );


  /* 背景 */
  backdrop?.addEventListener(
    'click',
    closeModal
  );


  /* ESC */
  document.addEventListener(
    'keydown',
    event => {

      if (event.key === 'Escape') {
        closeModal();
      }

    }
  );

});