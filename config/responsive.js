// config/responsive.js
// Maneja estado responsive global (añade clases al <body> según el ancho)

(function() {
  function applyResponsiveClasses() {
    var width = window.innerWidth || document.documentElement.clientWidth;
    var body = document.body;
    if (!body) return;

    body.classList.remove('is-mobile', 'is-tablet', 'is-desktop');

    if (width < 640) {
      body.classList.add('is-mobile');
    } else if (width < 1024) {
      body.classList.add('is-tablet');
    } else {
      body.classList.add('is-desktop');
    }
  }

  window.addEventListener('resize', applyResponsiveClasses);
  window.addEventListener('orientationchange', applyResponsiveClasses);
  window.addEventListener('DOMContentLoaded', applyResponsiveClasses);
})();
