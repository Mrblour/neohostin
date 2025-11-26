// Sistema de modales para Flutcom
//
// - Los modales son archivos HTML en resources/modals/<nombre>.html
//   por ejemplo: resources/modals/modal-discord.html.
// - Desde cualquier vista puedes abrir un modal usando:
//       window.flutcomModals.open('modal-discord')
//   o en el HTML:
//       onclick="window.flutcomModals && window.flutcomModals.open('modal-discord'); return false;"
// - Este archivo se encarga de:
//   * fetch del HTML del modal.
//   * Inyectar el nodo en el DOM.
//   * Animación de entrada.
//   * Cierre al hacer click en el overlay o en elementos con data-modal-close.

(function () {
  const MODAL_BASE_PATH = 'resources/modals/';

  async function loadModalTemplate(name) {
    const file = `${MODAL_BASE_PATH}${name}.html`;
    const res = await fetch(file);
    if (!res.ok) throw new Error(`No se pudo cargar el modal: ${file}`);
    return res.text();
  }

  function injectModal(html) {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = html.trim();

    const modalElement = wrapper.firstElementChild;
    if (!modalElement) return null;

    document.body.appendChild(modalElement);

    // Animación de entrada
    const container = modalElement.querySelector('.modal-container');
    if (container) {
      container.style.opacity = '0';
      container.style.transform = 'translateY(10px) scale(0.97)';
      requestAnimationFrame(() => {
        container.style.transition = 'all 0.2s ease';
        container.style.opacity = '1';
        container.style.transform = 'translateY(0) scale(1)';
      });
    }

    // Cerrar al hacer click en overlay o botones con data-modal-close
    const overlay = modalElement.querySelector('[data-modal-overlay]') || modalElement;

    function close() {
      if (container) {
        container.style.opacity = '0';
        container.style.transform = 'translateY(10px) scale(0.97)';
      }
      setTimeout(() => {
        modalElement.remove();
      }, 180);
    }

    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) close();
    });

    modalElement.querySelectorAll('[data-modal-close]').forEach(btn => {
      btn.addEventListener('click', close);
    });

    return { element: modalElement, close };
  }

  async function openModal(name) {
    try {
      const html = await loadModalTemplate(name);
      return injectModal(html);
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  // Exponer API en window
  window.flutcomModals = {
    open: openModal,
  };

})();
