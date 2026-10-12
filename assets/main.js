/* ============================================================
   intview — main.js
   Shared JS: theme toggle, scroll progress, scroll-to-top
   ============================================================ */
(function () {
    'use strict';

    /* ── Theme ─────────────────────────────────────────────── */
    var KEY = 'theme-mode';

    var SUN_SVG = '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="10" cy="10" r="3.5"/><path d="M10 1.5v2M10 16.5v2M1.5 10h2M16.5 10h2M4.1 4.1l1.4 1.4M14.5 14.5l1.4 1.4M4.1 15.9l1.4-1.4M14.5 5.5l1.4-1.4"/></svg>';
    var MOON_SVG = '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M16.5 12A7.5 7.5 0 0 1 8 3.5 7.5 7.5 0 1 0 16.5 12z"/></svg>';

    function getMode() {
        try { return localStorage.getItem(KEY) || 'system'; } catch (e) { return 'system'; }
    }

    function resolveTheme(mode) {
        if (mode === 'dark') return 'dark';
        if (mode === 'light') return 'light';
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    function applyMode(mode) {
        var theme = resolveTheme(mode);
        document.documentElement.dataset.theme = theme;
        try { localStorage.setItem(KEY, mode); } catch (e) {}

        /* Update icon */
        var btn = document.getElementById('theme-btn');
        if (btn) btn.innerHTML = (theme === 'dark') ? MOON_SVG : SUN_SVG;

        /* Mark active option */
        document.querySelectorAll('.theme-option').forEach(function (opt) {
            opt.classList.toggle('active', opt.dataset.mode === mode);
        });
    }

    /* Apply on load (theme-flash prevention already ran inline in <head>) */
    applyMode(getMode());

    /* Re-apply when system preference changes */
    try {
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function () {
            if (getMode() === 'system') applyMode('system');
        });
    } catch (e) {}

    /* ── DOM-dependent init ──────────────────────────────────── */
    document.addEventListener('DOMContentLoaded', function () {

        /* Theme dropdown */
        var btn = document.getElementById('theme-btn');
        var dropdown = document.getElementById('theme-dropdown');

        if (btn && dropdown) {
            btn.addEventListener('click', function (e) {
                e.stopPropagation();
                var open = !dropdown.hidden;
                dropdown.hidden = open;
                btn.setAttribute('aria-expanded', String(!open));
            });

            document.querySelectorAll('.theme-option').forEach(function (opt) {
                opt.addEventListener('click', function () {
                    applyMode(opt.dataset.mode);
                    dropdown.hidden = true;
                    btn.setAttribute('aria-expanded', 'false');
                });
            });

            /* Close on outside click */
            document.addEventListener('click', function () {
                dropdown.hidden = true;
                btn.setAttribute('aria-expanded', 'false');
            });

            /* Prevent dropdown click propagating to document */
            dropdown.addEventListener('click', function (e) { e.stopPropagation(); });

            /* Close on Escape */
            document.addEventListener('keydown', function (e) {
                if (e.key === 'Escape' && !dropdown.hidden) {
                    dropdown.hidden = true;
                    btn.setAttribute('aria-expanded', 'false');
                    btn.focus();
                }
            });
        }

        /* Scroll progress bar */
        var bar = document.getElementById('scroll-progress');
        if (bar) {
            function updateProgress() {
                var max = document.documentElement.scrollHeight - window.innerHeight;
                bar.style.width = (max > 0 ? (window.scrollY / max) * 100 : 0) + '%';
            }
            window.addEventListener('scroll', updateProgress, { passive: true });
            updateProgress();
        }

        /* Scroll-to-top button */
        var toTop = document.getElementById('to-top');
        if (toTop) {
            window.addEventListener('scroll', function () {
                toTop.classList.toggle('visible', window.scrollY > 500);
            }, { passive: true });
            toTop.addEventListener('click', function () {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        }
    });
})();
