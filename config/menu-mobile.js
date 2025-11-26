// config/menu-mobile.js
// Controla el toggle del menú hamburguesa en móvil

(function() {
  // Delegación de eventos: detecta clicks en el botón aunque el header
  // se haya insertado dinámicamente después de DOMContentLoaded.
  document.addEventListener('click', function(event) {
    var toggle = event.target.closest('[data-mobile-toggle]');
    if (!toggle) return;

    var menu = document.querySelector('[data-mobile-menu]');
    if (!menu) return;

    var isHidden = menu.hasAttribute('hidden');
    if (isHidden) {
      menu.removeAttribute('hidden');
    } else {
      menu.setAttribute('hidden', '');
    }
  });
})();
