// La rata sigue el cursor (PC) o el dedo (móvil)
(function () {
  var eyes = Array.prototype.slice.call(document.querySelectorAll('.eye'));
  var MAX = 5;            // máximo desplazamiento de la pupila en px
  var target = null;      // último punto {x, y}
  var ticking = false;

  function update() {
    ticking = false;
    if (!target) return;
    eyes.forEach(function (eye) {
      var r = eye.getBoundingClientRect();
      var cx = r.left + r.width / 2;
      var cy = r.top + r.height / 2;
      var dx = target.x - cx;
      var dy = target.y - cy;
      var dist = Math.sqrt(dx * dx + dy * dy) || 1;
      var k = Math.min(dist / 60, 1) * MAX;   // suaviza cuando el puntero está cerca
      eye.style.setProperty('--px', (dx / dist * k).toFixed(2) + 'px');
      eye.style.setProperty('--py', (dy / dist * k).toFixed(2) + 'px');
    });
  }

  function point(x, y) {
    target = { x: x, y: y };
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(update);
    }
  }

  // Pointer Events cubren mouse, touch y stylus
  window.addEventListener('pointermove', function (e) { point(e.clientX, e.clientY); });
  window.addEventListener('pointerdown', function (e) { point(e.clientX, e.clientY); });

  // Respaldo para navegadores móviles antiguos
  function touch(e) {
    var t = e.touches[0];
    if (t) point(t.clientX, t.clientY);
  }
  window.addEventListener('touchstart', touch, { passive: true });
  window.addEventListener('touchmove', touch, { passive: true });

  // Recalcular si cambia el tamaño o la orientación
  window.addEventListener('resize', function () { point(target ? target.x : 0, target ? target.y : 0); });
})();
