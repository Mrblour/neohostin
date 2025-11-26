(function() {
  const LOGO_LIGHT = 'assets/img/icon1.png';
  const LOGO_DARK  = 'assets/img/icon.png';
  const CHECK_POINT_MARGIN = 30;
  const DEBOUNCE_MS = 80;

  const marca = document.createElement('div');
  marca.style.position = 'fixed';
  marca.style.bottom = '15px';
  marca.style.right = '15px';
  marca.style.zIndex = '999999';
  marca.style.cursor = 'default';
  marca.style.padding = '6px 14px';
  marca.style.borderRadius = '30px';
  marca.style.display = 'flex';
  marca.style.alignItems = 'center';
  marca.style.gap = '10px';
  marca.style.userSelect = 'none';
  marca.style.pointerEvents = 'none';
  marca.style.transition = 'all 0.25s ease';

  marca.style.background = 'rgba(255,255,255,0.03)';
  marca.style.backdropFilter = 'blur(10px) saturate(200%)';
  marca.style.webkitBackdropFilter = 'blur(10px) saturate(200%)';
  marca.style.border = '1px solid rgba(0,0,0,0.06)';
  marca.style.boxShadow = '0 8px 20px rgba(0,0,0,0.18)';

  const logo = document.createElement('img');
  logo.src = LOGO_DARK;
  logo.alt = 'Flutcom Logo';
  logo.style.width = '32px';
  logo.style.height = '32px';
  logo.style.objectFit = 'contain';
  logo.style.transition = 'filter 0.2s ease, opacity 0.2s ease';

  const texto = document.createElement('span');
  texto.textContent = 'Flutcom';
  texto.style.fontSize = '17px';
  texto.style.fontWeight = '600';
  texto.style.letterSpacing = '0.5px';
  texto.style.transition = 'color 0.2s ease, text-shadow 0.2s ease';

  marca.appendChild(logo);
  marca.appendChild(texto);
  document.body.appendChild(marca);

  function rgbStringToLuminance(rgb) {
    const m = rgb && rgb.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/i);
    if (!m) return 1;
    const r = Number(m[1]), g = Number(m[2]), b = Number(m[3]);
    return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
  }

  function sampleUnderlyingElement(x, y) {
    const prevDisplay = marca.style.display;
    marca.style.display = 'none';
    const el = document.elementFromPoint(x, y);
    marca.style.display = prevDisplay;
    return el;
  }

  function findEffectiveBackgroundColor(el) {
    let node = el;
    while (node && node !== document.documentElement) {
      const st = window.getComputedStyle(node);
      const bg = st.backgroundColor;
      if (bg && bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent') {
        return bg;
      }
      node = node.parentElement;
    }
    const bodyColor = window.getComputedStyle(document.body).backgroundColor;
    return bodyColor || 'rgb(255,255,255)';
  }

  function actualizarContraste() {
    const x = window.innerWidth - CHECK_POINT_MARGIN;
    const y = window.innerHeight - CHECK_POINT_MARGIN;
    const el = sampleUnderlyingElement(x, y);
    if (!el) { aplicarTema('light'); return; }
    const bg = findEffectiveBackgroundColor(el);
    const lum = rgbStringToLuminance(bg);
    if (lum > 0.55) {
      aplicarTema('dark');
    } else {
      aplicarTema('light');
    }
  }

  function aplicarTema(theme) {
    if (theme === 'dark') {
      texto.style.color = 'rgba(0, 0, 0, 0.58)';
      texto.style.textShadow = 'none';
      logo.src = LOGO_DARK;
      marca.style.background = 'rgba(255,255,255,0.55)';
      marca.style.border = '1px solid rgba(0,0,0,0.06)';
      marca.style.backdropFilter = 'blur(6px) saturate(140%)';
    } else {
      texto.style.color = 'rgba(255,255,255,0.92)';
      texto.style.textShadow = '0 0 8px rgba(255,255,255,0.12)';
      logo.src = LOGO_LIGHT;
      marca.style.background = 'rgba(0,0,0,0.25)';
      marca.style.border = '1px solid rgba(255,255,255,0.06)';
      marca.style.backdropFilter = 'blur(12px) saturate(220%)';
    }
  }

  function debounce(fn, ms) {
    let t;
    return function(...args) {
      clearTimeout(t);
      t = setTimeout(() => fn.apply(this, args), ms);
    };
  }

  const debouncedActualizar = debounce(actualizarContraste, DEBOUNCE_MS);

  window.addEventListener('load', debouncedActualizar);
  window.addEventListener('resize', debouncedActualizar);
  window.addEventListener('scroll', debouncedActualizar, { passive: true });
  window.addEventListener('mousemove', debouncedActualizar);

  const observer = new MutationObserver(() => {
    if (!document.body.contains(marca)) document.body.appendChild(marca);
  });
  observer.observe(document.body, { childList: true, subtree: false });

  marca.animate([
    { transform: 'translateY(20px)', opacity: 0 },
    { transform: 'translateY(0)', opacity: 1 }
  ], { duration: 450, easing: 'cubic-bezier(.2,.8,.2,1)' });

  actualizarContraste();
})();
