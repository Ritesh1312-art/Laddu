/* =========================================================
   Laddu Ka Khel Ghar — Confetti / celebration FX
   ========================================================= */
(function () {
  const COLORS = ['#ff5d73', '#ffb84d', '#ffd93d', '#6bcb77', '#4d96ff', '#b980f0', '#ff8fab'];
  const EMO = ['🎉', '⭐', '🌸', '🎈', '✨', '🍬', '💖'];
  function rnd(a) { return a[(Math.random() * a.length) | 0]; }

  function piece(emoji) {
    const el = document.createElement('div');
    if (emoji) {
      el.textContent = emoji;
      el.style.fontSize = (16 + Math.random() * 12) + 'px';
    } else {
      const s = 7 + Math.random() * 9;
      el.style.width = el.style.height = s + 'px';
      el.style.background = rnd(COLORS);
      el.style.borderRadius = Math.random() < 0.5 ? '50%' : '3px';
    }
    el.className = 'confetti-piece';
    return el;
  }

  function burst(x, y, n) {
    n = n || 18;
    for (let i = 0; i < n; i++) {
      const el = piece(Math.random() < 0.3 ? rnd(EMO) : null);
      el.style.left = x + 'px';
      el.style.top = y + 'px';
      const a = Math.random() * Math.PI * 2, r = 45 + Math.random() * 100;
      el.style.setProperty('--dx', (Math.cos(a) * r) + 'px');
      el.style.setProperty('--dy', (Math.sin(a) * r - 40) + 'px');
      document.body.appendChild(el);
      setTimeout(() => el.remove(), 1200);
    }
  }

  function rain(n) {
    n = n || 60;
    for (let i = 0; i < n; i++) {
      const el = piece(Math.random() < 0.25 ? rnd(EMO) : null);
      el.style.left = (Math.random() * 100) + 'vw';
      el.style.top = '-6vh';
      el.style.position = 'fixed';
      el.classList.add('falling');
      el.style.animationDelay = (Math.random() * 0.9) + 's';
      el.style.animationDuration = (1.7 + Math.random() * 1.5) + 's';
      document.body.appendChild(el);
      setTimeout(() => el.remove(), 3600);
    }
  }

  window.FX = { burst: burst, rain: rain };
})();
