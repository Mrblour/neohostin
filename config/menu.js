(function () {
  // Sistema de menú principal de Flutcom
  //
  // REGLAS IMPORTANTES PARA QUE FUNCIONE CON CUALQUIER HEADER:
  // - Cada enlace del navbar debe tener atributo data-view="nombreVista".
  //   Ejemplos:
  //     <a href="#home" data-view="home">Home</a>
  //     <a href="#services" data-view="services">Servicios</a>
  //     <a href="#dash" data-view="dash">Dashboard</a>
  //     <a href="#login" data-view="login">Login</a>
  // - El valor de data-view DEBE coincidir con las claves de routes.js
  //   (navRoutes y authRoutes) y con el hash (#) que se pone en href.
  // - Este archivo SOLO se encarga del estado visual (.active) y de
  //   cerrar el menú móvil; no cambia estilos CSS.

  // --- Función: Aplica la clase .active según la vista guardada ---
  function applySavedActive() {
    const saved = localStorage.getItem('activeView');
    if (!saved) return;
    document.querySelectorAll('a[data-view].active').forEach(x => x.classList.remove('active'));
    const el = document.querySelector(`a[data-view="${saved}"]`);
    if (el) el.classList.add('active');
  }

  // --- Función: Maneja el cambio de vista (marca/desmarca .active) ---
  function handleViewChange(viewName) {
    // Quitar clase active de todos
    document.querySelectorAll('a[data-view].active').forEach(x => x.classList.remove('active'));

    // Buscar y activar el enlace correspondiente
    const targetLink = document.querySelector(`a[data-view="${viewName}"]`);
    if (targetLink) {
      targetLink.classList.add('active');
    }

    // Guardar estado actual
    localStorage.setItem('activeView', viewName);
    
    // Cerrar el menú móvil si está abierto
    const menuCheck = document.getElementById('menu-check');
    if (menuCheck) {
      menuCheck.checked = false;
    }
  }

  // --- Click delegado para manejar el estado activo ---
  // Escucha clicks en cualquier <a data-view="..."> del documento.
  // Usa data-view como "nombre de vista" y NO toca el enrutamiento
  // (eso lo hace main.js leyendo window.location.hash).
  document.addEventListener('click', function (e) {
    const a = e.target.closest('a[data-view]');
    if (!a) return;
    
    // IMPORTANTE: NO prevenir el comportamiento por defecto aquí
    // Deja que el sistema de rutas (#hash) funcione normalmente
    
    // Solo maneja el estado visual del active
    const viewName = a.dataset.view;
    if (viewName) {
      handleViewChange(viewName);
    }
  }, false);

  // --- Observa si el DOM cambia y reaplica la vista activa guardada ---
  const mo = new MutationObserver(() => {
    if (document.querySelector('a[data-view]')) {
      applySavedActive();
    }
  });
  mo.observe(document.body, { childList: true, subtree: true });

  // --- Aplica la vista activa al iniciar ---
  document.addEventListener('DOMContentLoaded', applySavedActive);

  // --- Detecta cambios en el hash (#) para sincronizar el active ---
  // Si la URL cambia a #about, #services, #dash, etc., busca
  // <a data-view="about">, <a data-view="services">, etc. y marca
  // el correspondiente como activo.
  window.addEventListener('hashchange', function() {
    const hash = window.location.hash.replace('#', '') || 'home';
    
    // Actualizar el active basado en el hash actual
    const targetLink = document.querySelector(`a[data-view="${hash}"]`);
    if (targetLink) {
      handleViewChange(hash);
    }
  });

  // --- Detecta scroll para agregar/quitar la sombra al header ---
  document.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    if (!header) return;
    if (window.scrollY > 10) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
})();
