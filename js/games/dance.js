/* =========================================================
   Game 7 — Nacho Naacho (Music & Dance zone)
   Beat ke saath dance pads ki sequence dekho, phir follow karo.
   3 levels, phir dance party! Skill: memory, rhythm,
   coordination, following instructions.
   ========================================================= */
(function () {
  const PADS = [
    { id: 'up',    e: '💃', a: '⬆️' },
    { id: 'down',  e: '🕺', a: '⬇️' },
    { id: 'left',  e: '👏', a: '⬅️' },
    { id: 'right', e: '🤸', a: '➡️' }
  ];
  const LEVELS = [2, 4, 6];

  App.games.dance = {
    zone: 'music',
    name: 'Nacho Naacho',
    emoji: '💃',
    render(body) {
      let level = 0, seq = [], inI = 0, phase = 'idle', timers = [];

      body.innerHTML =
        '<div class="g-intro">' +
          '<p>Beat karega <b>DHA… DHA</b>! Pads chamkein — dhyan se dekho,<br>' +
          'phir wahi order mein tap karke naach do! 🕺💃</p>' +
          '<div class="round-dots" id="dots"></div>' +
        '</div>' +
        '<div class="status-bub" id="status">Tayaar ho? Button dabao! 👇</div>' +
        '<div class="dance-grid" id="grid"></div>' +
        '<button class="btn btn-primary btn-big" id="go">▶️ Naach Shuru!</button>';

      const grid = body.querySelector('#grid');
      const status = body.querySelector('#status');
      const dotsEl = body.querySelector('#dots');
      const goBtn = body.querySelector('#go');
      const padEls = {};

      PADS.forEach(p => {
        const b = el('button', 'dpad tap', p.e + '<small>' + p.a + ' ' + p.id + '</small>');
        b.onclick = () => tap(p.id);
        grid.append(b);
        padEls[p.id] = b;
      });

      function drawDots() {
        dotsEl.innerHTML = '';
        LEVELS.forEach((l, i) => dotsEl.append(el('span', 'rdot' + (i < level ? ' on' : ''))));
      }
      function later(fn, ms) { timers.push(setTimeout(fn, ms)); }
      function clearTimers() { timers.forEach(clearTimeout); timers = []; }

      function flash(id, ms) {
        const b = padEls[id];
        b.classList.add('on');
        setTimeout(() => { if (phase !== 'party') b.classList.remove('on'); }, ms || 350);
      }

      function startLevel() {
        clearTimers();
        seq = [];
        const len = LEVELS[level];
        for (let i = 0; i < len; i++) seq.push(PADS[Math.floor(Math.random() * 4)].id);
        phase = 'show';
        goBtn.disabled = true;
        status.textContent = 'Dhyan se dekho! 👀 (Level ' + (level + 1) + ')';
        seq.forEach((id, i) => {
          later(() => { flash(id, 330); SFX.tick(); SFX.key([392, 329.63, 440, 523.25][PADS.findIndex(p => p.id === id)] || 440, 0.3, 0.25); }, 800 + i * 750);
        });
        later(() => {
          phase = 'input';
          inI = 0;
          status.textContent = 'Aapki baar! 🔥 Tap karo!';
          SFX.ding();
        }, 800 + seq.length * 750 + 300);
      }

      function tap(id) {
        if (phase === 'party') { flash(id, 300); SFX.clap(); return; }
        if (phase !== 'input') return;
        if (id === seq[inI]) {
          flash(id);
          SFX.ding();
          inI++;
          if (inI >= seq.length) {
            level++;
            drawDots();
            if (level >= LEVELS.length) { party(); }
            else {
              phase = 'idle';
              status.textContent = 'Waah! ' + (level + 1) + ' wala level aaya! 👏';
              Speech.say('Waah! Ab thoda lamba sequence!', { stop: false });
              goBtn.disabled = false;
            }
          }
        } else {
          SFX.boing();
          padEls[id].classList.add('shake');
          setTimeout(() => padEls[id].classList.remove('shake'), 480);
          phase = 'show';
          status.textContent = 'Thoda galat! Phir se dekho 👀';
          Speech.say('Phir se dekho, phir naacho!', { stop: false });
          later(startLevelShowAgain, 1100);
        }
      }

      function startLevelShowAgain() {
        clearTimers();
        phase = 'show';
        seq.forEach((id, i) => {
          later(() => { flash(id, 330); SFX.tick(); }, 500 + i * 750);
        });
        later(() => {
          phase = 'input';
          inI = 0;
          status.textContent = 'Aapki baar! 🔥';
          SFX.ding();
        }, 500 + seq.length * 750 + 200);
      }

      function party() {
        phase = 'party';
        goBtn.disabled = true;
        status.textContent = '🎉 DANCE PARTY! 🎉 Sab saath mein nacho!';
        SFX.chord();
        Speech.say('Dance party! Sab saath mein nacho!', { stop: false });
        Object.keys(padEls).forEach(id => padEls[id].classList.add('party'));
        SFX.startBeat(() => {
          const id = PADS[Math.floor(Math.random() * 4)].id;
          flash(id, 330);
        });
        later(() => {
          if (!grid.isConnected) { SFX.stopBeat(); return; }
          SFX.stopBeat();
          Object.keys(padEls).forEach(id => padEls[id].classList.remove('party'));
          FX.rain();
          App.win({
            title: 'Dance Party khatam! 💃',
            sub: 'Beat yaad ki, sequence nache — aap toh Natcha Nachi ho!',
            sticker: 'dance',
            doneId: 'game-dance',
            stars: 3,
            say: 'Waah! Aap ne dance party jeet li! Phir se karna na!'
          });
        }, 5000);
      }

      goBtn.onclick = function () {
        SFX.pop();
        goBtn.disabled = true;
        SFX.startBeat(() => {});
        later(() => { if (phase !== 'party') SFX.stopBeat(); }, 4000);
        drawDots();
        startLevel();
      };

      drawDots();
      Speech.say('Yeh hai Nacho Naacho! Pads chamkein toh dhyan se dekho, phir wahi taps karo. Beat ke saath nacho!');
    }
  };
})();
