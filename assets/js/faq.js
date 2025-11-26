// FAQ ULTRA SIMPLE - SIN FALLOS
(function () {
  'use strict';

  function setupFAQ() {
    const container = document.getElementById('faq-container');
    if (!container) return;

    const items = container.querySelectorAll('.faq-item');
    if (items.length === 0) return;

    items.forEach((item) => {
      const question = item.querySelector('.faq-question');
      const answer = item.querySelector('.faq-answer');
      const icon = item.querySelector('.faq-icon');

      if (!question || !answer || !icon) return;

      // Clone to remove existing listeners
      const newQuestion = question.cloneNode(true);
      question.parentNode.replaceChild(newQuestion, question);

      // Re-select elements
      const currentQuestion = item.querySelector('.faq-question');
      const currentIcon = item.querySelector('.faq-icon');

      currentQuestion.addEventListener('click', function () {
        const isOpen = item.classList.contains('active');

        // Close all
        items.forEach(otherItem => {
          const otherAnswer = otherItem.querySelector('.faq-answer');
          const otherIcon = otherItem.querySelector('.faq-icon');

          if (otherAnswer) {
            otherAnswer.style.maxHeight = '0px';
            otherAnswer.classList.remove('opacity-100', 'pb-4');
            otherAnswer.classList.add('opacity-0');
          }
          if (otherIcon) {
            otherIcon.classList.remove('bi-dash-lg');
            otherIcon.classList.add('bi-plus-lg');
          }
          otherItem.classList.remove('active');
        });

        // Open clicked if it was closed
        if (!isOpen) {
          answer.classList.remove('opacity-0');
          answer.classList.add('opacity-100', 'pb-4');
          answer.style.maxHeight = answer.scrollHeight + 20 + 'px'; // Add extra space for padding

          currentIcon.classList.remove('bi-plus-lg');
          currentIcon.classList.add('bi-dash-lg');
          item.classList.add('active');
        }
      });
    });
  }

  setupFAQ();
  setTimeout(setupFAQ, 100);

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupFAQ);
  }

  window.addEventListener('hashchange', () => {
    setTimeout(setupFAQ, 300);
  });

  window.activateFAQ = setupFAQ;
})();

// Contact form handling
const contactForm = document.getElementById('contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const button = contactForm.querySelector('button[type="submit"]');
    const originalText = button.textContent;

    button.textContent = 'Enviando...';
    button.disabled = true;

    // Simular envío
    setTimeout(() => {
      button.textContent = '¡Mensaje enviado!';
      button.style.background = 'linear-gradient(135deg, #28a745 0%, #20c997 100%)';

      contactForm.reset();

      setTimeout(() => {
        button.textContent = originalText;
        button.style.background = 'linear-gradient(135deg, #252525 0%, #000000 100%)';
        button.disabled = false;
      }, 3000);
    }, 1500);
  });
}
