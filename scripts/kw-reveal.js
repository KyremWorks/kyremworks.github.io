/* Word-by-word "tapparella" reveal. Add class="reveal-words" to a PLAIN-TEXT
   element; KW.reveal() splits it into per-word spans and drops them in, staggered.
   Reveals are anchored to the containing <section>: when the section appears, all
   its texts play in DOM order (heading first), so scroll direction never changes
   the order. Elements with child markup are left whole (split is textContent-only). */
(function () {
  window.KW = window.KW || {};

  function reveal(root) {
    // Group targets by their section so the whole section reveals as one wave.
    var groups = new Map();
    (root || document).querySelectorAll('.reveal-words').forEach(function (el) {
      if (!el.dataset.split && !el.children.length) {
        var i = 0;
        el.innerHTML = el.textContent.trim().split(/\s+/).map(function (w) {
          return '<span class="reveal-word"><span style="--i:' + (i++) + '">' + w + '</span></span>';
        }).join(' ');
        el.dataset.split = '1';
      }
      var sec = el.closest('section') || el.parentElement;
      if (!groups.has(sec)) groups.set(sec, []);
      groups.get(sec).push(el);   // querySelectorAll is DOM order → heading lands first
    });

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        io.unobserve(e.target);
        var offset = 0;
        (groups.get(e.target) || []).forEach(function (el) {
          el.style.setProperty('--base', offset);
          offset += el.querySelectorAll('.reveal-word').length || 6; // next text waits its turn
          el.classList.add('is-visible');
        });
      });
    }, { threshold: 0 });   // fire as soon as any of the section shows, either direction

    groups.forEach(function (_, sec) { io.observe(sec); });
  }

  KW.reveal = reveal;
})();
