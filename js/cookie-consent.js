/**
 * Cookie Consent Banner (LGPD)
 * Shows a non-intrusive banner on the first visit asking for cookie consent.
 * Stores the user's choice in localStorage to avoid showing it again.
 */
(function () {
    'use strict';

    var STORAGE_KEY = 'cookie-consent';

    // Do nothing if consent was already given or denied
    if (localStorage.getItem(STORAGE_KEY)) return;

    function createBanner() {
        var banner = document.createElement('div');
        banner.id = 'cookie-banner';
        banner.setAttribute('role', 'dialog');
        banner.setAttribute('aria-label', 'Aviso de cookies');
        banner.innerHTML =
            '<div id="cookie-banner-inner">' +
                '<p id="cookie-banner-text">' +
                    'Usamos cookies para melhorar sua experiência e exibir anúncios relevantes. ' +
                    'Ao continuar navegando, você concorda com nossa ' +
                    '<a href="/privacidade/" id="cookie-banner-link">Política de Privacidade</a>.' +
                '</p>' +
                '<div id="cookie-banner-actions">' +
                    '<button id="cookie-accept" type="button">Aceitar</button>' +
                    '<button id="cookie-decline" type="button">Recusar</button>' +
                '</div>' +
            '</div>';

        var style = document.createElement('style');
        style.textContent =
            '#cookie-banner{' +
                'position:fixed;bottom:0;left:0;right:0;z-index:9999;' +
                'background:var(--bg-card,#fff);' +
                'border-top:1px solid var(--hr-color,rgba(148,163,184,0.2));' +
                'padding:16px 20px;' +
                'box-shadow:0 -4px 20px rgba(0,0,0,.08);' +
            '}' +
            '#cookie-banner-inner{' +
                'max-width:900px;margin:0 auto;' +
                'display:flex;align-items:center;gap:20px;flex-wrap:wrap;' +
            '}' +
            '#cookie-banner-text{' +
                'flex:1;font-size:.875rem;line-height:1.6;' +
                'color:var(--text-main,#0f172a);margin:0;max-width:100%;' +
            '}' +
            '#cookie-banner-link{color:var(--accent,#3b82f6);font-weight:700;}' +
            '#cookie-banner-actions{display:flex;gap:10px;flex-shrink:0;}' +
            '#cookie-accept,#cookie-decline{' +
                'padding:9px 20px;border-radius:50px;font-size:.875rem;' +
                'font-weight:700;cursor:pointer;border:none;transition:opacity .2s;' +
            '}' +
            '#cookie-accept{background:var(--accent,#3b82f6);color:#fff;}' +
            '#cookie-decline{' +
                'background:transparent;color:var(--text-muted,#64748b);' +
                'border:1px solid var(--hr-color,rgba(148,163,184,0.3));' +
            '}' +
            '#cookie-accept:hover,#cookie-decline:hover{opacity:.85;}' +
            '@media(max-width:600px){' +
                '#cookie-banner-inner{flex-direction:column;align-items:flex-start;}' +
                '#cookie-banner-actions{width:100%;}' +
                '#cookie-accept,#cookie-decline{flex:1;text-align:center;}' +
            '}';

        document.head.appendChild(style);
        document.body.appendChild(banner);

        document.getElementById('cookie-accept').addEventListener('click', function () {
            localStorage.setItem(STORAGE_KEY, 'accepted');
            dismiss();
        });

        document.getElementById('cookie-decline').addEventListener('click', function () {
            localStorage.setItem(STORAGE_KEY, 'declined');
            dismiss();
        });
    }

    function dismiss() {
        var el = document.getElementById('cookie-banner');
        if (el) {
            el.style.transition = 'opacity .3s';
            el.style.opacity = '0';
            setTimeout(function () { if (el.parentNode) el.parentNode.removeChild(el); }, 320);
        }
    }

    // Show banner only after the DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createBanner);
    } else {
        createBanner();
    }
}());
