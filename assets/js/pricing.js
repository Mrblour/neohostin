(function () {
    'use strict';

    function initPricing() {
        const toggleContainer = document.getElementById('billing-toggle');
        if (!toggleContainer) {
            // console.log('Pricing toggle container not found');
            return;
        }

        // Eliminar el check de inicialización para permitir reinicialización
        // if (toggleContainer.dataset.initialized === 'true') return;
        // toggleContainer.dataset.initialized = 'true';

        console.log('Initializing pricing toggle');

        const buttons = toggleContainer.querySelectorAll('button');
        const priceElements = document.querySelectorAll('[data-monthly]');
        const periodElements = document.querySelectorAll('[id^="period-"]');

        const periods = {
            monthly: { label: '/mes' },
            quarterly: { label: '/trimestre' },
            annual: { label: '/año' }
        };

        // Limpiar event listeners anteriores clonando los botones
        buttons.forEach((button, index) => {
            const newButton = button.cloneNode(true);
            button.parentNode.replaceChild(newButton, button);
        });

        // Obtener los botones nuevos después de clonar
        const newButtons = toggleContainer.querySelectorAll('button');

        newButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('Button clicked:', button.dataset.period);

                const period = button.dataset.period;
                if (!period || !periods[period]) return;

                // Update button styles
                newButtons.forEach(btn => {
                    if (btn === button) {
                        btn.classList.remove('text-zinc-400', 'hover:text-white');
                        btn.classList.add('bg-blue-600', 'text-white', 'shadow-sm');
                    } else {
                        btn.classList.add('text-zinc-400', 'hover:text-white');
                        btn.classList.remove('bg-blue-600', 'text-white', 'shadow-sm');
                    }
                });

                // Update prices
                priceElements.forEach(el => {
                    const price = el.dataset[period];
                    if (price) {
                        el.textContent = `$${price}`;
                    }
                });

                // Update period labels
                periodElements.forEach(el => {
                    el.textContent = periods[period].label;
                });
            });
        });
    }

    // Exponer la función globalmente para que main.js pueda llamarla
    window.initPricing = initPricing;

    // Try to init immediately
    initPricing();

    // Try on DOMContentLoaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initPricing);
    } else {
        initPricing();
    }

    // Fallback
    setTimeout(initPricing, 500);
})();
