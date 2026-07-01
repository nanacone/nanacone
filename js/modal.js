// ===== テンプレートモーダル =====
const cards = document.querySelectorAll('.template-card');
const modal = document.querySelector('.template-modal');
const modalTitle = document.querySelector('.modal-title');
const modalDesc = document.querySelector('.modal-description');
const previewImage = document.getElementById('modal-preview-image');
const closeBtn = document.querySelector('.modal-close');
const backdrop = document.querySelector('.modal-backdrop');
const modalSelectBtn = document.querySelector('.modal-select-button');

cards.forEach(card => {
  card.addEventListener('click', () => {
    const title = card.querySelector('h3')?.textContent || 'テンプレート';
    const desc = card.querySelector('p')?.textContent || '';
    const image = card.dataset.image;

    modalTitle.textContent = title;
    modalDesc.textContent = desc;

    if (image && previewImage) {
      previewImage.src = image;
      previewImage.alt = title;
    }

    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
  });
});

closeBtn.addEventListener('click', () => {
  modal.classList.remove('active');
  modal.setAttribute('aria-hidden', 'true');
});

backdrop.addEventListener('click', () => {
  modal.classList.remove('active');
  modal.setAttribute('aria-hidden', 'true');
});

modalSelectBtn.addEventListener('click', () => {
  window.location.href = './create.html';
});