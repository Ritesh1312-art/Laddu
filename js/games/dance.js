/* =========================================================
   Game 7 — नाचो नाचो V2 (संगीत और नृत्य)
   V2 सुधार: Levels 3→5→7 steps (पहले 2 से शुरू होता था)।
   Beat-timer की गड़बड़ हटाई — demo में beat नहीं बजेगा,
   party में सही शुरू/बंद होगा। सितारे प्रदर्शन पर।
   ========================================================= */
(function () {
  const PADS = [
    { id: 'up',    e: '💃', a: '⬆️', n: 'ऊपर' },
    { id: 'down',  e: '🕺', a: '⬇️', n: 'नीचे' },
    { id: 'left',  e: '👏', a: '⬅️', n: 'बाएँ' },
    { id: 'right', e: '🤸', a: '➡️', n: 'दाएँ' }
  ];
  const LEVELS = [3, 5, 7];

  App.games.dance = {
    zone: 'music',
    name: 'नाचो नाचो',
    emoji: '💃',
    render(body) {
      let level = 0, seq = [], inI = 0, phase = 'idle', timers = [], mistakes = 0;

      body.innerHTML =
        '<div class="g-intro">' +
          '<p>पैड चमकेंगे — ध्यान से देखो,<br>' +
          'फिर वही क्रम में दबाकर नाच दो! 🕺💃</p>' +
          '<div class="round-dots" id="dots"></div>' +
        '</div>' +
        '<div class="status-bub" id="status">तैयार हो? बटन दबाओ! 👇</div>' +
        '<div class="dance-grid" id="grid"></div>' +
        '<button class="btn btn-primary btn-big" id="go">▶️ नाच शुरू!</button>';

      const grid = body.querySelector('#grid');
      const status = body.querySelector('#status');
      const dotsEl = body.querySelector('#dots');
      const goBtn = body.querySelector('#go');
      const padEls = {};

      PADS.forEach(p => {
        const b = el('button', 'dpad tap', p.e + '<small>' + p.a + ' ' + p.n + '</small>');
        b.onclick = () => tap(p.id);
        grid.append(b);
        padEls[p.id] = b;
      });

      function drawDots() {
        dotsEl.innerHTML = '';
        LEVELS.forEach((l, i) => dotsEl.append(el('span', 'rdot' + (i < level ? ' on' : ''))));
      }
      function later(fn, ms) { timers.push(setTimeout(() => { if (grid.isConnected) fn(); }, ms)); }
      function clearTimers() { timers.forEach(clearTimeout); timers = []; }

      function flash(id, ms) {
        const b = padEls[id];
        b.classList.add('on');
        setTimeout(() => { if (phase !== 'party') b.classList.remove('on'); }, ms || 350);
      }

      function showSequence(delay0) {
        phase = 'show';
        seq.forEach((id, i) => {
          later(() => { flash(id, 330); SFX.tick(); SFX.key([392, 329.63, 440, 523.25][PADS.findIndex(p => p.id === id)] || 440, 0.3, 0.25); }, delay0 + i * 750);
        });
        later(() => {
          phase = 'input';
          inI = 0;
          status.textContent = 'आपकी बारी! 🔥 दबाओ!';
          SFX.ding();
        }, delay0 + seq.length * 750 + 300);
      }

      function startLevel() {
        clearTimers();
        seq = [];
        const len = LEVELS[level];
        for (let i = 0; i < len; i++) seq.push(PADS[Math.floor(Math.random() * 4)].id);
        goBtn.disabled = true;
        status.textContent = 'ध्यान से देखो! 👀 (स्तर ' + (level + 1) + ' — ' + len + ' कदम)';
        showSequence(800);
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
              status.textContent = 'वाह! अब स्तर ' + (level + 1) + ' — ' + LEVELS[level] + ' कदम! 👏';
              Speech.say('वाह! अब थोड़ा लंबा क्रम!', { stop: false });
              goBtn.disabled = false;
              goBtn.textContent = '▶️ स्तर ' + (level + 1) + ' शुरू!';
            }
          }
        } else {
          mistakes++;
          SFX.boing();
          padEls[id].classList.add('shake');
          setTimeout(() => padEls[id].classList.remove('shake'), 480);
          phase = 'show';
          status.textContent = 'थोड़ा ग़लत हुआ! क्रम फिर से देखो 👀';
          Speech.say('फिर से देखो, फिर नाचो!', { stop: false });
          later(() => showSequence(400), 1100);
        }
      }

      function party() {
        phase = 'party';
        goBtn.disabled = true;
        status.textContent = '🎉 डांस पार्टी! 🎉 सब साथ में नाचो!';
        SFX.chord();
        Speech.say('डांस पार्टी! सब साथ में नाचो!', { stop: false });
        Object.keys(padEls).forEach(id => padEls[id].classList.add('party'));
        SFX.startBeat(() => {
          const id = PADS[Math.floor(Math.random() * 4)].id;
          flash(id, 330);
        });
        later(() => {
          SFX.stopBeat();
          Object.keys(padEls).forEach(id => padEls[id].classList.remove('party'));
          FX.rain();
          const stars = mistakes === 0 ? 3 : (mistakes <= 2 ? 2 : 1);
          App.win({
            title: 'डांस पार्टी ख़त्म! 💃',
            sub: mistakes === 0 ? 'एक भी गलती नहीं — क्रम याद रखकर नाचे! असली नाचा नाची!' : 'ताल याद की और नाचे! गलतियाँ कम करो, 3 सितारे पक्के!',
            sticker: 'dance',
            doneId: 'game-dance',
            stars: stars,
            say: 'वाह! आपने डांस पार्टी जीत ली!'
          });
        }, 5000);
      }

      goBtn.onclick = function () {
        SFX.pop();
        drawDots();
        startLevel();
      };

      drawDots();
      Speech.say('यह है नाचो नाचो! पैड चमकें तो ध्यान से देखो, फिर वही क्रम में दबाओ!');
    }
  };
})();
