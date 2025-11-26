// Mapa de rutas y recursos de Flutcom (SPA)
//
// - partials.navbar y partials.footer indican qué archivos HTML se cargan
//   como header y footer.
// - navRoutes y authRoutes son las VISTAS válidas del sistema.
//   * Las claves (home, services, dash, login, etc.) deben coincidir con:
//       - data-view="..." en los <a> del header/footer.
//       - el hash (#...) usado en href, por ejemplo: href="#services".
//   * main.js usa estos mapas para saber qué archivo HTML cargar según el hash.
// - externalResources define el orden de carga de CSS/JS globales.
//   * Aquí se incluyen complements.css, responsive.css y el CSS generado
//     por Tailwind (assets/vendor/tailwind/tailwind.css).

// Parciales HTML (SPA público)
export const partials = {
  navbar: "resources/partials/header.html",
  footer: "resources/partials/footer.html",
  links: "resources/partials/links.html",
  meta: "resources/partials/meta.html"
};


// Rutas públicas del navbar (solo home activa por ahora)
export const navRoutes = {
  home: "resources/views/public/home.html",
  minecraft: "resources/views/public/games/minecraft.html",
  fivem: "resources/views/public/games/fivem.html",
  gta_sa: "resources/views/public/games/gta-sa.html",
  gameservers: "resources/views/public/games/gameservers.html",
  vps: "resources/views/public/server/vps.html",
  dedicados: "resources/views/public/server/dedicados.html",
  databases: "resources/views/public/server/databases.html",
  dedicados: "resources/views/public/server/dedicados.html",
  web: "resources/views/public/server/webhosting.html",
  discord: "resources/views/public/server/discord-bots.html",
  index: "resources/views/public/mante.html",
  soporte: "resources/views/public/soporte.html",
  billing: "resources/views/docs/facturacion.html",
  privacy: "resources/views/docs/privacidad.html",
  terms: "resources/views/docs/terminos.html",
  about: "resources/views/docs/sobre-nosotros.html",
  products: "resources/views/docs/productos.html",
  trust: "resources/views/docs/confianza.html",
  registro_info: "resources/views/docs/registro-info.html",
  tutorial_minecraft: "resources/views/docs/tutorial-minecraft.html",
  tutorial_vps: "resources/views/docs/tutorial-vps.html",
  tutorial_fivem: "resources/views/docs/tutorial-fivem.html",
  tutorial_dedicados: "resources/views/docs/tutorial-dedicados.html",
  mantenimiento: "resources/views/mante_page.html"
};


export const authRoutes = {
  login: "resources/views/auth/loguin.html",
  register: "resources/views/auth/registro.html"
};



// CSS/JS externos mínimos para empezar (incluye Tailwind ya instalado)
export const externalResources = [
  { type: "css", file: "assets/vendor/tailwind/tailwind.css" },
  { type: "css", file: "assets/css/style.css" },
  { type: "css", file: "assets/css/responsive.css" },
  { type: "css", file: "assets/css/fondo.css" },
  { type: "js", file: "config/responsive.js" },
  { type: "js", file: "config/menu-mobile.js" },
  { type: "js", file: "config/menu.js" },
  { type: "js", file: "config/modals.js" },
  { type: "js", file: "assets/js/faq.js" },
  { type: "js", file: "assets/js/pricing.js" },
];
