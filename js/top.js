document.addEventListener("DOMContentLoaded", () => {
  const cards = document.querySelectorAll(
    ".feature-card, .plan-card, .testimonial-card, .persona-card, .step-card"
  );

  cards.forEach((card) => {
    card.style.opacity = "0";
    card.style.transform = "translateY(18px)";
    card.style.transition = "opacity 0.6s ease, transform 0.6s ease";
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = "1";
          entry.target.style.transform = "translateY(0)";
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  cards.forEach((card) => observer.observe(card));

  const buttons = document.querySelectorAll(".btn");
  buttons.forEach((button) => {
    button.addEventListener("mouseenter", () => {
      button.style.transform = "translateY(-2px)";
    });

    button.addEventListener("mouseleave", () => {
      button.style.transform = "";
    });
  });
});