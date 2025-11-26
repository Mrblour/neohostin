// Carga enlaces comunes (CSS, iconos, etc.) en <head>
//
// - Lee resources/partials/links.html y lo inyecta dentro de <head>.
// - Ese archivo suele contener <link rel="stylesheet">, favicons, etc.
// - Esto permite mantener un solo lugar para todos los enlaces comunes
//   sin repetirlos en cada vista.

(function() {
  fetch('resources/partials/links.html')
    .then(function(res) { return res.ok ? res.text() : ''; })
    .then(function(html) {
      if (!html) return;
      var template = document.createElement('template');
      template.innerHTML = html.trim();
      document.head.appendChild(template.content);
    })
    .catch(function() {});
})();
