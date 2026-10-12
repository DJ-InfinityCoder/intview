/**
 * intview — Professional Barba.js Page Transitions
 * High-performance smooth page transitions with top progress indicator.
 */
(function () {
    'use strict';

    // Gracefully bypass Barba on file:// protocol to avoid browser CORS restrictions
    if (window.location.protocol === 'file:') {
        return;
    }

    // Wait until Barba core is available
    if (typeof barba === 'undefined') {
        return;
    }

    // Inject Barba styling dynamically so all pages inherit sleek transition effects
    var styleId = 'barba-transition-styles';
    if (!document.getElementById(styleId)) {
        var style = document.createElement('style');
        style.id = styleId;
        style.textContent = [
            '#barba-progress {',
            '    position: fixed;',
            '    top: 0;',
            '    left: 0;',
            '    height: 3px;',
            '    width: 0%;',
            '    background: linear-gradient(90deg, #0969da, #2f81f7, #58a6ff);',
            '    box-shadow: 0 0 10px rgba(47, 129, 247, 0.6);',
            '    z-index: 999999;',
            '    pointer-events: none;',
            '    opacity: 0;',
            '    transition: width 0.2s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.15s ease;',
            '}',
            ':root[data-theme="dark"] #barba-progress {',
            '    background: linear-gradient(90deg, #1f6feb, #388bfd, #79c0ff);',
            '    box-shadow: 0 0 12px rgba(88, 166, 255, 0.7);',
            '}',
            '[data-barba="wrapper"] {',
            '    position: relative;',
            '    width: 100%;',
            '    min-height: 100vh;',
            '}',
            '.barba-page {',
            '    width: 100%;',
            '    min-height: 100vh;',
            '    display: flex;',
            '    flex-direction: column;',
            '    will-change: opacity, transform;',
            '}'
        ].join('\n');
        document.head.appendChild(style);
    }

    // Top progress indicator element
    var progressEl = document.getElementById('barba-progress');
    if (!progressEl) {
        progressEl = document.createElement('div');
        progressEl.id = 'barba-progress';
        progressEl.setAttribute('aria-hidden', 'true');
        document.body.appendChild(progressEl);
    }

    function setProgress(width, opacity) {
        if (!progressEl) return;
        progressEl.style.width = width;
        if (opacity !== undefined) {
            progressEl.style.opacity = opacity;
        }
    }

    function resetProgress() {
        if (!progressEl) return;
        progressEl.style.transition = 'none';
        progressEl.style.width = '0%';
        progressEl.style.opacity = '1';
        void progressEl.offsetHeight; // force reflow
        progressEl.style.transition = '';
    }

    // Re-execute scripts within newly injected Barba container
    function reexecuteScripts(container) {
        if (!container) return;
        var scripts = container.querySelectorAll('script');
        scripts.forEach(function (oldScript) {
            if (oldScript.src && (oldScript.src.indexOf('@barba/core') > -1 || oldScript.src.indexOf('transitions.js') > -1)) {
                return;
            }
            var newScript = document.createElement('script');
            Array.prototype.slice.call(oldScript.attributes).forEach(function (attr) {
                newScript.setAttribute(attr.name, attr.value);
            });
            if (oldScript.src) {
                newScript.src = oldScript.src;
            } else {
                newScript.textContent = oldScript.textContent;
            }
            oldScript.parentNode.replaceChild(newScript, oldScript);
        });
    }

    // Initialize Barba
    barba.init({
        timeout: 6000,
        prevent: function (data) {
            var el = data.el;
            var href = data.href;
            if (!el) return false;

            // Prevent hash links (#top, #section, etc.)
            var rawHref = el.getAttribute('href') || '';
            if (rawHref.charAt(0) === '#') return true;

            // Prevent elements with data-barba-prevent
            if (el.hasAttribute('data-barba-prevent') || el.closest('[data-barba-prevent]')) return true;

            // Prevent external links or new-tab targets
            if (el.getAttribute('target') && el.getAttribute('target') !== '_self') return true;

            // Compare base URLs (ignore differences in anchor hashes)
            var currentBase = window.location.href.split('#')[0];
            var nextBase = href ? href.split('#')[0] : '';
            if (currentBase === nextBase) return true;

            return false;
        },
        transitions: [
            {
                name: 'home-to-directory',
                from: { namespace: 'home' },
                to: { namespace: 'directory' },
                leave: function (data) {
                    resetProgress();
                    setProgress('70%', '1');
                    return new Promise(function (resolve) {
                        var current = data.current.container;
                        current.style.transition = 'opacity 0.35s cubic-bezier(0.4, 0, 0.2, 1), transform 0.38s cubic-bezier(0.4, 0, 0.2, 1)';
                        current.style.opacity = '0';
                        current.style.transform = 'translateX(-35vw)';
                        setTimeout(resolve, 360);
                    });
                },
                enter: function (data) {
                    setProgress('100%', '1');
                    var next = data.next.container;
                    next.style.opacity = '0';
                    next.style.transform = 'translateX(35vw)';
                    next.style.transition = 'opacity 0.38s cubic-bezier(0.16, 1, 0.3, 1), transform 0.42s cubic-bezier(0.16, 1, 0.3, 1)';

                    if (data.next.html) {
                        try {
                            var doc = new DOMParser().parseFromString(data.next.html, 'text/html');
                            if (doc.title) document.title = doc.title;
                        } catch (e) { }
                    }

                    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });

                    return new Promise(function (resolve) {
                        requestAnimationFrame(function () {
                            next.style.opacity = '1';
                            next.style.transform = 'translateX(0)';
                            setTimeout(function () {
                                setProgress('100%', '0');
                                resolve();
                            }, 400);
                        });
                    });
                }
            },
            {
                name: 'directory-to-home',
                from: { namespace: 'directory' },
                to: { namespace: 'home' },
                leave: function (data) {
                    resetProgress();
                    setProgress('70%', '1');
                    return new Promise(function (resolve) {
                        var current = data.current.container;
                        current.style.transition = 'opacity 0.35s cubic-bezier(0.4, 0, 0.2, 1), transform 0.38s cubic-bezier(0.4, 0, 0.2, 1)';
                        current.style.opacity = '0';
                        current.style.transform = 'translateX(35vw)';
                        setTimeout(resolve, 360);
                    });
                },
                enter: function (data) {
                    setProgress('100%', '1');
                    var next = data.next.container;
                    next.style.opacity = '0';
                    next.style.transform = 'translateX(-35vw)';
                    next.style.transition = 'opacity 0.38s cubic-bezier(0.16, 1, 0.3, 1), transform 0.42s cubic-bezier(0.16, 1, 0.3, 1)';

                    if (data.next.html) {
                        try {
                            var doc = new DOMParser().parseFromString(data.next.html, 'text/html');
                            if (doc.title) document.title = doc.title;
                        } catch (e) { }
                    }

                    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });

                    return new Promise(function (resolve) {
                        requestAnimationFrame(function () {
                            next.style.opacity = '1';
                            next.style.transform = 'translateX(0)';
                            setTimeout(function () {
                                setProgress('100%', '0');
                                resolve();
                            }, 400);
                        });
                    });
                }
            },
            {
                name: 'professional-fade',
            leave: function (data) {
                resetProgress();
                setProgress('68%', '1');
                return new Promise(function (resolve) {
                    var current = data.current.container;
                    current.style.transition = 'opacity 0.18s cubic-bezier(0.4, 0, 1, 1), transform 0.18s cubic-bezier(0.4, 0, 1, 1)';
                    current.style.opacity = '0';
                    current.style.transform = 'translateY(-6px)';
                    setTimeout(resolve, 180);
                });
            },
            enter: function (data) {
                setProgress('100%', '1');
                var next = data.next.container;
                next.style.opacity = '0';
                next.style.transform = 'translateY(6px)';
                next.style.transition = 'opacity 0.22s cubic-bezier(0.16, 1, 0.3, 1), transform 0.22s cubic-bezier(0.16, 1, 0.3, 1)';

                // Update document title from incoming page
                if (data.next.html) {
                    try {
                        var doc = new DOMParser().parseFromString(data.next.html, 'text/html');
                        if (doc.title) {
                            document.title = doc.title;
                        }
                    } catch (e) { }
                }

                // Reset scroll position to top
                window.scrollTo({ top: 0, left: 0, behavior: 'auto' });

                return new Promise(function (resolve) {
                    requestAnimationFrame(function () {
                        next.style.opacity = '1';
                        next.style.transform = 'translateY(0)';
                        setTimeout(function () {
                            setProgress('100%', '0');
                            resolve();
                        }, 220);
                    });
                });
            },
            after: function (data) {
                // Re-execute scripts in the new container
                reexecuteScripts(data.next.container);

                // Re-run Prism code highlighting if available
                if (window.Prism && typeof window.Prism.highlightAll === 'function') {
                    window.Prism.highlightAll();
                }

                // Reset progress bar after completion
                setTimeout(function () {
                    if (progressEl) {
                        progressEl.style.width = '0%';
                        progressEl.style.opacity = '0';
                    }
                }, 220);
            }
        }]
    });
})();
