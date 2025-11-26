import { appConfig } from './app.js';
import { partials, navRoutes, authRoutes, externalResources } from './routes.js';

// Sistema de versionado para cache busting
const VERSION_PARAM = `?v=${appConfig.version}`;

// Función helper para agregar versión a URLs
function addVersion(url) {
  if (!url) return url;
  // No agregar versión a URLs externas o que ya tengan parámetros
  if (url.startsWith('http') || url.includes('?')) return url;
  return url + VERSION_PARAM;
}

window.addEventListener("DOMContentLoaded", async () => {
  // Cargar layout base primero
  await loadLayout();

  // Cambiar título dinámicamente
  document.title = `${appConfig.nombre} | ${appConfig.descripcion}`;

  // Cargar parciales
  await loadHead(partials.meta);
  await loadHead(partials.links);
  await loadHTML("navbar", partials.navbar);
  await loadHTML("footer", partials.footer);

  // Inicializar routing con hash (solo rutas públicas del SPA)
  initRouter();

  // Asignar rutas del navbar (solo vistas públicas)
  assignNavLinks();

  // Asignar nombre del sitio al span #sitio si existe
  const sitio = document.getElementById("sitio");
  if (sitio) sitio.textContent = appConfig.nombre;

  // Asignar versión actual en la píldora de versión si existe
  const versionPill = document.getElementById("app-version-pill");
  if (versionPill) versionPill.textContent = `v${appConfig.version}`;

  // Agregar año actual al footer
  const footer = document.querySelector("#footer p");
  if (footer) {
    const year = new Date().getFullYear();
    footer.innerHTML = `© ${year} ${appConfig.nombre}. Todos los derechos reservados.`;
  }

  // Cargar CSS/JS externos en segundo plano (no bloquear arranque)
  loadExternal(externalResources);

  // Inicializar funcionalidades básicas del SPA
  initScrollEffects();
  initMobileMenu();
  initLoadingSpinner();
  updateMetaTags('Home', appConfig.descripcion);
});

// Función para asignar rutas del navbar desde routes.js
function assignNavLinks() {
  const links = document.querySelectorAll("a[data-view]");
  links.forEach(link => {
    const view = link.getAttribute("data-view");
    // Buscar en rutas públicas y de auth (todas estáticas)
    if (navRoutes[view] || authRoutes[view]) {
      link.addEventListener("click", async (e) => {
        e.preventDefault();
        window.location.hash = view;
      });
    }
  });
}

// Sistema de routing con hash
function initRouter() {
  const loadView = async () => {
    const hash = window.location.hash.slice(1) || appConfig.defaultView || 'home';

    // Primero, verificar si el hash corresponde a un elemento con id en la página actual
    const targetElement = document.getElementById(hash);
    if (targetElement) {
      // Es un anchor interno, hacer scroll suave
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return; // No cargar una vista nueva
    }

    // Buscar en rutas públicas y de auth (todas estáticas)
    const viewPath = navRoutes[hash] || authRoutes[hash];

    if (viewPath) {
      await loadViewWithAnimation(viewPath, hash);
    } else {
      await load404();
    }
  };

  window.addEventListener('hashchange', loadView);
  loadView();
}

// Cargar vista con animación
async function loadViewWithAnimation(viewPath, viewName) {
  const content = document.getElementById('content');
  if (!content) return;

  // Mostrar loading
  showLoading();

  // Iniciar fade out
  content.classList.add('fade-out');

  try {
    // Ejecutar animación y fetch en paralelo para ganar tiempo
    // Mínimo 200ms de animación para que se vea suave, pero aprovechamos ese tiempo para descargar
    const [html] = await Promise.all([
      fetch(addVersion(viewPath)).then(res => {
        if (!res.ok) throw new Error(`Error al cargar ${viewPath}`);
        return res.text();
      }),
      new Promise(resolve => setTimeout(resolve, 200)) // Reducido a 200ms y en paralelo
    ]);

    // Inyectar contenido
    content.innerHTML = html;

    // Inicializar validación de formularios si es necesario
    initFormValidation();

    // Reactivar FAQ si existe
    if (typeof window.activateFAQ === 'function') {
      setTimeout(window.activateFAQ, 50);
    }

    // Actualizar título y meta tags
    const title = viewName.charAt(0).toUpperCase() + viewName.slice(1);
    document.title = `${appConfig.nombre} | ${title}`;
    updateMetaTags(title, `${title} - ${appConfig.nombre}`);

    // Fade in
    content.classList.remove('fade-out');
    content.classList.add('fade-in');

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Reinicializar pricing toggles
    if (typeof window.initPricing === 'function') {
      setTimeout(window.initPricing, 50);
    }

  } catch (error) {
    console.error('Error cargando vista:', error);
    await load404();
  } finally {
    hideLoading();
  }
}

// Página 404
async function load404() {
  const content = document.getElementById('content');
  if (!content) return;

  content.innerHTML = `
    <main class="min-h-[60vh] flex flex-col items-center justify-center text-center px-6">
        <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-zinc-900 border border-zinc-800 mb-8">
            <svg class="w-8 h-8 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
            </svg>
        </div>
        
        <h1 class="text-4xl md:text-6xl font-bold text-white mb-4 tracking-tight">404</h1>
        <h2 class="text-xl text-zinc-400 mb-8 font-medium">Página no encontrada</h2>
        
        <p class="text-zinc-500 max-w-md mx-auto mb-10 leading-relaxed">
            Lo sentimos, la página que buscas no existe o ha sido movida.
        </p>
        
        <a href="#home" 
           data-view="home" 
           class="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-black font-medium hover:bg-zinc-200 transition-colors">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
            Volver al inicio
        </a>
    </main>
  `;

  document.title = `${appConfig.nombre} | 404`;
}

// Función para cargar HTML en un div
async function loadHTML(id, file) {
  try {
    const res = await fetch(addVersion(file));
    if (!res.ok) throw new Error(`Error al cargar ${file}`);
    const html = await res.text();
    const element = document.getElementById(id);
    if (element) {
      element.innerHTML = html;

      // Inicializar validación de formularios si hay forms
      if (id === 'content') {
        initFormValidation();

        // Reactivar FAQ si está presente en la vista actual
        if (typeof window.activateFAQ === 'function') {
          setTimeout(() => {
            window.activateFAQ();
          }, 100);
        }
      }
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
}


// Función para cargar CSS o JS externo (sin bloquear)
function loadExternal(resources) {
  for (const r of resources) {
    if (r.type === "css") {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = addVersion(r.file);
      document.head.appendChild(link);
    } else if (r.type === "js") {
      const script = document.createElement("script");
      script.src = addVersion(r.file);
      script.defer = true;
      document.body.appendChild(script);
    }
  }
}

// Función para cargar el layout base
async function loadLayout() {
  try {
    const res = await fetch(addVersion('resources/layaut/base.html'));
    if (!res.ok) throw new Error('Error al cargar layout base');
    const html = await res.text();
    document.getElementById('app').innerHTML = html;
  } catch (error) {
    console.error(error);
  }
}

// Loading spinner
function initLoadingSpinner() {
  const spinner = document.createElement('div');
  spinner.className = 'loading-spinner';
  spinner.innerHTML = '<div class="spinner"></div>';
  document.body.appendChild(spinner);

  const overlay = document.createElement('div');
  overlay.className = 'loading-overlay';
  document.body.appendChild(overlay);
}

function showLoading() {
  const spinner = document.querySelector('.loading-spinner');
  const overlay = document.querySelector('.loading-overlay');
  if (spinner) spinner.classList.add('active');
  if (overlay) overlay.classList.add('active');
}

function hideLoading() {
  const spinner = document.querySelector('.loading-spinner');
  const overlay = document.querySelector('.loading-overlay');
  if (spinner) spinner.classList.remove('active');
  if (overlay) overlay.classList.remove('active');
}



// Efectos de scroll en header
function initScrollEffects() {
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    if (!header) return;

    const currentScroll = window.pageYOffset;

    if (currentScroll > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    lastScroll = currentScroll;
  });
}

// Actualizar meta tags para SEO
function updateMetaTags(title, description) {
  // Title
  document.title = `${title} | ${appConfig.nombre}`;

  // Meta description
  let metaDesc = document.querySelector('meta[name="description"]');
  if (!metaDesc) {
    metaDesc = document.createElement('meta');
    metaDesc.name = 'description';
    document.head.appendChild(metaDesc);
  }
  metaDesc.content = description;

  // Open Graph tags
  updateMetaTag('og:title', `${title} | ${appConfig.nombre}`);
  updateMetaTag('og:description', description);
  updateMetaTag('og:type', 'website');

  // Twitter Card
  updateMetaTag('twitter:card', 'summary_large_image');
  updateMetaTag('twitter:title', `${title} | ${appConfig.nombre}`);
  updateMetaTag('twitter:description', description);
}

function updateMetaTag(property, content) {
  let meta = document.querySelector(`meta[property="${property}"]`);
  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute('property', property);
    document.head.appendChild(meta);
  }
  meta.content = content;
}

// Validación de formularios
function initFormValidation() {
  const forms = document.querySelectorAll('form');

  forms.forEach(form => {
    const inputs = form.querySelectorAll('input[required], textarea[required]');

    inputs.forEach(input => {
      input.addEventListener('blur', () => validateField(input));
      input.addEventListener('input', () => {
        if (input.classList.contains('invalid')) {
          validateField(input);
        }
      });
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      let isValid = true;
      inputs.forEach(input => {
        if (!validateField(input)) {
          isValid = false;
        }
      });

      if (isValid) {
        showNotification('Formulario enviado correctamente', 'success');
        form.reset();
      } else {
        showNotification('Por favor corrige los errores', 'error');
      }
    });
  });
}

function validateField(field) {
  const value = field.value.trim();
  let isValid = true;
  let errorMsg = '';

  // Required
  if (field.hasAttribute('required') && !value) {
    isValid = false;
    errorMsg = 'Este campo es obligatorio';
  }

  // Email
  if (field.type === 'email' && value) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      isValid = false;
      errorMsg = 'Email inválido';
    }
  }

  // Min length
  if (field.minLength && value.length < field.minLength) {
    isValid = false;
    errorMsg = `Mínimo ${field.minLength} caracteres`;
  }

  // Update UI
  if (isValid) {
    field.classList.remove('invalid');
    field.classList.add('valid');
  } else {
    field.classList.remove('valid');
    field.classList.add('invalid');
  }

  // Show/hide error message
  let errorElement = field.parentElement.querySelector('.error-message');
  if (!errorElement && !isValid) {
    errorElement = document.createElement('div');
    errorElement.className = 'error-message';
    field.parentElement.appendChild(errorElement);
  }

  if (errorElement) {
    errorElement.textContent = errorMsg;
    errorElement.classList.toggle('show', !isValid);
  }

  return isValid;
}

// Sistema de notificaciones mejorado
function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 15px 25px;
    background: ${type === 'success' ? '#4caf50' : type === 'error' ? '#f44336' : '#2196f3'};
    color: white;
    border-radius: 8px;
    z-index: 10000;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    font-weight: 500;
  `;

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.classList.add('hiding');
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}




// Menú móvil
function initMobileMenu() {
  const btn = document.getElementById('mobile-menu-btn');
  const menu = document.getElementById('mobile-menu');

  if (btn && menu) {
    btn.addEventListener('click', () => {
      menu.classList.toggle('hidden');
    });

    // Cerrar menú al hacer click en un enlace
    menu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        menu.classList.add('hidden');
      });
    });
  }
}

// Función para inyectar contenido en el HEAD
async function loadHead(file) {
  if (!file) return;
  try {
    const res = await fetch(addVersion(file));
    if (!res.ok) throw new Error(`Error al cargar ${file}`);
    const html = await res.text();
    document.head.insertAdjacentHTML('beforeend', html);
  } catch (error) {
    console.error(error);
  }
}
