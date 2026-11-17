(function () {
    'use strict';

    const prism = window.Prism;
    if (!prism || !prism.highlightElement) return;

    const blocks = document.querySelectorAll('pre > code[class*="language-"], pre[class*="language-"] > code');

    function highlight(block) {
        // Prism replaces the code markup, including any saved annotations.
        if (!block.querySelector('mark[data-ann]')) prism.highlightElement(block);
    }

    if (!('IntersectionObserver' in window)) {
        blocks.forEach(highlight);
        return;
    }

    const pending = new Set(blocks);
    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (!entry.isIntersecting || !pending.delete(entry.target)) return;
            observer.unobserve(entry.target);
            highlight(entry.target);
        });
    }, { rootMargin: '320px 0px' });

    blocks.forEach(function (block) { observer.observe(block); });

    window.addEventListener('beforeprint', function () {
        observer.disconnect();
        pending.forEach(highlight);
        pending.clear();
    });
})();
