/* =========================================================
   Game 3 — Rang Pataka (Kids / Cartoon zone)
   3 rounds: RANG, AAKAAR, GINTI — cartoon character ke
   saath. Skill: colors, shapes, counting, listening.
   ========================================================= */
(function () {
  const COLORS = [
    { name: 'laal',    hex: '#ff5d5d' },
    { name: 'neela',   hex: '#4d96ff' },
    { name: 'peela',   hex: '#ffd93d' },
    { name: 'hara',    hex: '#6bcb77' },
    { name: 'narangi', hex: '#ffa733' },
    { name: 'baingani',hex: '#b980f0' }
  ];
  const SHAPES = [
    { name: 'chakra',   e: '⭕' },
    { name: 'barabar',  e: '🟦' },
    { name: 'sitara',   e: '⭐' },
    { name: 'dil',      e: '❤️' },
    { name: 'panjhi',   e: '🌸' },
    { name: 'chandrma', e: '🌙' }
  ];
  const CHARACTERS = ['🦁', '🐰', '🐘', '🐤', '🦊', '🐼', '🐵', '🦄'];

  function shuffled(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  function buildRounds() {
    const rounds = [];
    /* Act 1 — RANG (4) */
    shuffled(COLORS).slice(0, 4).forEach(c => {
      const opts = shuffled(COLORS).slice(0, 4);
      if (!opts.includes(c)) opts[0] = c;
      rounds.push({ act: 0, ask: 'Mujhe ' + c.name + ' gubbara chahiye!', say: 'Mujhe ' + c.name + ' gubbara chahiye!', target: c.name, opts: opts, type: 'balloon' });
    });
    /* Act 2 — AAKAAR (3) */
    shuffled(SHAPES).slice(0, 3).forEach(s => {
      const opts = shuffled(SHAPES).slice(0, 4);
      if (!opts.includes(s)) opts[0] = s;
      rounds.push({ act: 1, ask: 'Mujhe ' + s.name + ' chahiye!', say: 'Mujhe ' + s.name + ' chahiye!', target: s.name, opts: opts, type: 'shape' });
    });
    /* Act 3 — GINTI (3) */
    const counts = [2, 3, 4];
    const fruits = [
      { e: '🍎', name: 'seeb' },
      { e: '🐦', name: 'chidiya' },
      { e: '🌸', name: 'phool' }
    ];
    shuffled(fruits).slice(0, 3).forEach(f => {
      const n = counts[Math.floor(Math.random() * counts.length)];
      const dummies = shuffled(fruits.filter(x => x.e !== f.e))[0];
      rounds.push({ act: 2, ask: n + ' ' + f.name + ' dhundo!', say: n + ' ' + f.name + ' dhundo!', target: f.e, count: n, dummy: dummies.e, type: 'count' });
    });
    return rounds;
  }

  App.games.color = {
    zone: 'cartoon',
    name: 'Rang Pataka',
    emoji: '🌈',
    render(body) {
      const rounds = buildRounds();
      let idx = 0;
      let countGot = 0;

      body.innerHTML =
        '<div class="char-zone">' +
          '<span class="char" id="char">🦁</span>' +
          '<div class="bubble" id="bub"></div>' +
          '<span class="act-tag" id="act"></span>' +
        '</div>' +
        '<div class="play-area" id="area"></div>' +
        '<div class="round-dots" id="dots"></div>';

      const area = body.querySelector('#area');
      const bub = body.querySelector('#bub');
      const actEl = body.querySelector('#act');
      const charEl = body.querySelector('#char');
      const dotsEl = body.querySelector('#dots');
      const ACT_NAMES = ['🎨 RANG', '🔷 AAKAAR', '🔢 GINTI'];

      function drawDots() {
        dotsEl.innerHTML = '';
        rounds.forEach((r, i) => dotsEl.append(el('span', 'rdot' + (i < idx ? ' on' : ''))));
      }

      function finish() {
        App.win({
          title: 'Rang Pataka khatam! 🌈',
          sub: 'Rang, aakaar, ginti — teeno mein aap champion!',
          sticker: 'color',
          doneId: 'game-color',
          stars: 3,
          say: 'Waah! Aap ne rang, aakaar aur ginti teeno seekh liye!'
        });
      }

      function charJump() {
        charEl.classList.remove('jump');
        void charEl.offsetWidth;
        charEl.classList.add('jump');
      }

      function wrong(b) {
        SFX.boing();
        if (b) {
          b.classList.add('shake');
          setTimeout(() => b.classList.remove('shake'), 480);
        }
        charEl.classList.add('shake');
        setTimeout(() => charEl.classList.remove('shake'), 480);
      }

      function nextRound() {
        idx++;
        drawDots();
        if (idx >= rounds.length) { setTimeout(() => { if (area.isConnected) finish(); }, 600); return; }
        setTimeout(() => { if (area.isConnected) showRound(); }, 650);
      }

      function showRound() {
        const r = rounds[idx];
        charEl.textContent = CHARACTERS[idx % CHARACTERS.length];
        bub.textContent = r.ask;
        actEl.textContent = ACT_NAMES[r.act];
        area.innerHTML = '';
        countGot = 0;

        if (r.type === 'balloon') {
          const W = area.clientWidth || 300;
          r.opts.forEach((c, i) => {
            const b = el('div', 'balloon tap', '🎈');
            b.style.left = (6 + i * (84 / Math.max(1, r.opts.length - 1 || 1))) + '%';
            b.style.bottom = (18 + (i % 2) * 26) + 'px';
            b.style.setProperty('--d', (i * 0.3) + 's');
            /* balloon ko rang do */
            b.style.filter = 'hue-rotate(0deg) drop-shadow(0 4px 3px rgba(0,0,0,.15))';
            b.style.fontSize = '52px';
            const span = document.createElement('span');
            span.textContent = '🎈';
            b.textContent = '';
            b.append(span);
            /* colored glow badge */
            const badge = el('span', null, '');
            badge.style.cssText = 'position:absolute;inset:26% 18%;border-radius:50%;background:' + c.hex + ';opacity:.85';
            b.append(badge);
            b.onclick = function (e) {
              if (c.name === r.target) {
                SFX.popBig();
                FX.burst(e.clientX, e.clientY, 20);
                charJump();
                Speech.say('Waah! ' + c.name + ' hi sahi tha!', { stop: false });
                nextRound();
              } else wrong(b);
            };
            area.append(b);
          });
        } else if (r.type === 'shape') {
          const row = el('div', 'tile-row');
          r.opts.forEach((s, i) => {
            const t = el('button', 'tile', s.e);
            t.style.animationDelay = (i * 0.06) + 's';
            t.onclick = function (e) {
              if (s.name === r.target) {
                SFX.ding();
                FX.burst(e.clientX, e.clientY, 16);
                charJump();
                Speech.say('Sahi pakda! ' + s.name + '!', { stop: false });
                nextRound();
              } else wrong(t);
            };
            row.append(t);
          });
          area.append(row);
        } else { /* count */
          const need = r.count;
          const items = [];
          for (let i = 0; i < need; i++) items.push(r.target);
          for (let i = 0; i < 5 - need; i++) items.push(r.dummy);
          const grid = el('div', 'ginti-grid');
          shuffled(items).forEach(em => {
            const g = el('button', 'gitem tap', em);
            g.onclick = function (e) {
              if (em === r.target && !g.classList.contains('got')) {
                SFX.pop();
                g.classList.add('got');
                FX.burst(e.clientX, e.clientY, 10);
                countGot++;
                if (countGot >= need) {
                  charJump();
                  Speech.say('Waah! ' + need + ' mile! Ginti kamaal ki!', { stop: false });
                  nextRound();
                }
              } else wrong(g);
            };
            grid.append(g);
          });
          area.append(grid);
        }
        Speech.say(r.say);
      }

      drawDots();
      showRound();
    }
  };
})();
