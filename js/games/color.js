/* =========================================================
   Game 3 — रंग पटाखा V2 (कार्टून दुनिया)
   V2 सुधार: सही शब्द (गोल, चौकोर, त्रिकोण — 'बराबर'/'पंझी'
   हटाए), गुब्बारे खुद रंगीन (badge नहीं), गिनती असली
   गिनकर (छूकर गिनो, फिर अंक चुनो), गिनती 10 तक बढ़ती हुई।
   ========================================================= */
(function () {
  const COLORS = [
    { name: 'लाल', hex: '#ff5d5d' },
    { name: 'नीला', hex: '#4d96ff' },
    { name: 'पीला', hex: '#ffd93d' },
    { name: 'हरा', hex: '#6bcb77' },
    { name: 'नारंगी', hex: '#ffa733' },
    { name: 'बैंगनी', hex: '#b980f0' },
    { name: 'गुलाबी', hex: '#ff8fab' }
  ];
  const SHAPES = [
    { name: 'गोल', e: '⭕' },
    { name: 'चौकोर', e: '🟦' },
    { name: 'त्रिकोण', e: '🔺' },
    { name: 'सितारा', e: '⭐' },
    { name: 'दिल', e: '❤️' },
    { name: 'अंडाकार', e: '🥚' }
  ];
  const CHARACTERS = ['🦁', '🐰', '🐘', '🐤', '🦊', '🐼', '🐵', '🦄'];
  const FRUITS = [
    { e: '🍎', name: 'सेब' },
    { e: '🍊', name: 'संतरे' },
    { e: '🌸', name: 'फूल' },
    { e: '🐦', name: 'चिड़ियाँ' }
  ];

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
    shuffled(COLORS).slice(0, 3).forEach(c => {
      const opts = shuffled(COLORS.filter(x => x.name !== c.name)).slice(0, 3);
      opts.push(c);
      rounds.push({ act: 0, ask: 'मुझे ' + c.name + ' गुब्बारा चाहिए!', target: c.name, opts: shuffled(opts), type: 'balloon' });
    });
    shuffled(SHAPES).slice(0, 3).forEach(s => {
      const opts = shuffled(SHAPES.filter(x => x.name !== s.name)).slice(0, 3);
      opts.push(s);
      rounds.push({ act: 1, ask: 'मुझे ' + s.name + ' चाहिए!', target: s.name, opts: shuffled(opts), type: 'shape' });
    });
    [3, 6, 10].forEach((n, k) => {
      const f = FRUITS[k % FRUITS.length];
      const dummy = FRUITS[(k + 1) % FRUITS.length];
      rounds.push({ act: 2, ask: f.e + ' ' + f.name + ' गिनो!', target: f.e, count: n, dummy: dummy.e, type: 'count' });
    });
    return rounds;
  }

  App.games.color = {
    zone: 'cartoon',
    name: 'रंग पटाखा',
    emoji: '🌈',
    render(body) {
      const rounds = buildRounds();
      let idx = 0, mistakes = 0;

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
      const ACT_NAMES = ['🎨 रंग', '🔷 आकार', '🔢 गिनती'];

      function drawDots() {
        dotsEl.innerHTML = '';
        rounds.forEach((r, i) => dotsEl.append(el('span', 'rdot' + (i < idx ? ' on' : ''))));
      }
      function charJump() {
        charEl.classList.remove('jump');
        void charEl.offsetWidth;
        charEl.classList.add('jump');
      }
      function wrong(b) {
        mistakes++;
        SFX.boing();
        if (b) { b.classList.add('shake'); setTimeout(() => b.classList.remove('shake'), 480); }
        charEl.classList.add('shake');
        setTimeout(() => charEl.classList.remove('shake'), 480);
      }
      function finish() {
        const stars = mistakes <= 1 ? 3 : (mistakes <= 4 ? 2 : 1);
        App.win({
          title: 'रंग पटाखा ख़त्म! 🌈',
          sub: mistakes <= 1 ? 'रंग, आकार, गिनती — तीनों में चैम्पियन!' : 'अच्छा खेले! ग़लतियाँ कम करो, 3 सितारे तुम्हारे!',
          sticker: 'color',
          doneId: 'game-color',
          stars: stars,
          say: 'वाह! आपने रंग, आकार और गिनती — तीनों सीख लिए!'
        });
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

        if (r.type === 'balloon') {
          r.opts.forEach((c, i) => {
            const b = el('div', 'balloon tap');
            b.style.left = (3 + i * (80 / Math.max(1, r.opts.length - 1))) + '%';
            b.style.bottom = (20 + (i % 2) * 30) + 'px';
            b.style.setProperty('--d', (i * 0.3) + 's');
            const bal = el('span', 'balloon-body');
            bal.style.background = 'radial-gradient(circle at 32% 30%, rgba(255,255,255,.75), rgba(255,255,255,0) 42%), ' + c.hex;
            b.append(bal);
            b.append(el('span', 'balloon-string', ''));
            b.onclick = function (e) {
              if (c.name === r.target) {
                SFX.popBig();
                FX.burst(e.clientX, e.clientY, 20);
                charJump();
                Speech.say('वाह! ' + c.name + ' ही सही था!', { stop: false });
                nextRound();
              } else wrong(b);
            };
            area.append(b);
          });
          Speech.say(r.ask);
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
                Speech.say('सही पकड़ा! ' + s.name + '!', { stop: false });
                nextRound();
              } else wrong(t);
            };
            row.append(t);
          });
          area.append(row);
          Speech.say(r.ask);
        } else { /* count — पहले छूकर गिनो, फिर अंक चुनो */
          let got = 0, phase = 'count';
          const need = r.count;
          const items = [];
          for (let i = 0; i < need; i++) items.push(r.target);
          for (let i = 0; i < 4; i++) items.push(r.dummy);
          const grid = el('div', 'ginti-grid');
          shuffled(items).forEach(em => {
            const g = el('button', 'gitem tap', em);
            g.onclick = function (e) {
              if (phase !== 'count') return;
              if (em === r.target && !g.classList.contains('got')) {
                SFX.pop();
                g.classList.add('got');
                got++;
                g.append(el('span', 'count-badge', '' + got));
                FX.burst(e.clientX, e.clientY, 8);
                Speech.say('' + got, { stop: false });
                if (got >= need) {
                  phase = 'pick';
                  bub.textContent = 'कुल कितने हुए? अंक चुनो! 🔢';
                  Speech.say('कुल कितने हुए? सही अंक चुनो!');
                  showNumbers();
                }
              } else if (em !== r.target) {
                wrong(g);
              }
            };
            grid.append(g);
          });
          area.append(grid);
          const numRow = el('div', 'tile-row num-row');
          area.append(numRow);
          function showNumbers() {
            const opts = shuffled([need, need + 1, Math.max(1, need - 1)]);
            opts.forEach(n => {
              const t = el('button', 'tile num-tile', '' + n);
              t.onclick = function (e) {
                if (n === need) {
                  SFX.ding();
                  charJump();
                  Speech.say('वाह! ' + need + ' गिने! गिनती कमाल की!', { stop: false });
                  nextRound();
                } else wrong(t);
              };
              numRow.append(t);
            });
          }
          Speech.say(r.ask + ' एक-एक करके छूकर गिनो!');
        }
      }

      drawDots();
      showRound();
    }
  };
})();
