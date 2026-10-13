/**
 * intview — Smooth Navigation Feedback
 * Lightweight visual feedback for page navigation without DOM interception.
 */
(function () {
    'use strict';

    // Show top progress bar feedback on internal link click
    document.addEventListener('click', function (e) {
        var link = e.target.closest('a');
        if (!link) return;
        var href = link.getAttribute('href');
        if (!href || href.charAt(0) === '#' || href.indexOf('javascript:') === 0 || link.target === '_blank') return;

        var bar = document.getElementById('scroll-progress');
        if (bar) {
            bar.style.transition = 'width 0.4s ease-out';
            bar.style.width = '75%';
        }
    });
})();
