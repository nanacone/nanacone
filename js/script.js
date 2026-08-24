console.log("nanacone loaded");

const templateList = document.querySelector('.template-list');
const templateCards = Array.from(
  document.querySelectorAll('.template-card')
);

const prevButton = document.querySelector('.template-prev');
const nextButton = document.querySelector('.template-next');
const currentTemplate = document.getElementById('current-template');
const totalTemplate = document.getElementById('total-template');

if (
  templateList &&
  templateCards.length &&
  prevButton &&
  nextButton &&
  currentTemplate &&
  totalTemplate
) {
  totalTemplate.textContent = templateCards.length;

  function getVisibleCards() {
    return templateCards.filter(card => {
      return getComputedStyle(card).display !== 'none';
    });
  }

  function getCurrentIndex() {
    const visibleCards = getVisibleCards();

    if (!visibleCards.length) {
      return 0;
    }

    const listLeft = templateList.getBoundingClientRect().left;

    let nearestIndex = 0;
    let nearestDistance = Infinity;

    visibleCards.forEach((card, index) => {
      const distance = Math.abs(
        card.getBoundingClientRect().left - listLeft
      );

      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearestIndex = index;
      }
    });

    return nearestIndex;
  }

  function updateTemplateControls() {
    const visibleCards = getVisibleCards();
    const currentIndex = getCurrentIndex();

    currentTemplate.textContent =
      visibleCards.length ? currentIndex + 1 : 0;

    totalTemplate.textContent = visibleCards.length;

    prevButton.disabled = currentIndex === 0;
    nextButton.disabled =
      !visibleCards.length || currentIndex === visibleCards.length - 1;
  }

  function scrollToTemplate(direction) {
    const visibleCards = getVisibleCards();

    if (!visibleCards.length) {
      return;
    }

    const currentIndex = getCurrentIndex();
    const nextIndex = Math.min(
      Math.max(currentIndex + direction, 0),
      visibleCards.length - 1
    );

    visibleCards[nextIndex].scrollIntoView({
      behavior: 'smooth',
      inline: 'center',
      block: 'nearest'
    });
  }

  prevButton.addEventListener('click', () => {
    scrollToTemplate(-1);
  });

  nextButton.addEventListener('click', () => {
    scrollToTemplate(1);
  });

  templateList.addEventListener('scroll', () => {
    clearTimeout(templateList.scrollTimer);

    templateList.scrollTimer = setTimeout(() => {
      updateTemplateControls();
    }, 80);
  });

  window.addEventListener('resize', updateTemplateControls);

  updateTemplateControls();
}
const previewConfirmButton =
  document.getElementById("preview-confirm-button");

if (previewConfirmButton) {
  previewConfirmButton.addEventListener("click", () => {
    window.location.href = "./complete.html";
  });
}
// =========================
// マイページからの新規作成を引き継ぐ
// =========================

const indexParams =
  new URLSearchParams(window.location.search);

const fromMypage =
  indexParams.get('from') === 'mypage';

if (fromMypage) {

  localStorage.setItem(
    'nanaconne_from_mypage',
    '1'
  );

}
