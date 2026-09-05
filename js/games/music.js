/* =========================================================
   Game 6 — Sitar Sitar Studio (Music zone)
   Piano keys + instruments ka free play, aur Happy Birthday
   melody ko step-by-step seekho, phir poora gaana suno.
   Skill: pitch, rhythm, pattern memory, music.
   ========================================================= */
(function () {
  /* keys (key of F): C4=Sol, D4=La, E4=Ti, F4=Do, G4=Re, A4=Mi, Bb4=Fa, C5=Sol' */
  const KEYS = [
    { note: 'C4',  sol: 'Sol' },
    { note: 'D4',  sol: 'La' },
    { note: 'E4',  sol: 'Ti' },
    { note: 'F4',  sol: 'Do' },
    { note: 'G4',  sol: 'Re' },
    { note: 'A4',  sol: 'Mi' },
    { note: 'Bb4', sol: 'Fa' },
    { note: 'C5',  sol: "Sol'" }
  ];
  /* Happy Birthday — 4 lines, solfège of F */
  const LINES = [
    { lyric: 'Happy Birth-', notes: ['Sol', 'Sol', 'La', 'Sol', 'Do', 'Ti'] },
    { lyric: 'day to you',   notes: ['Sol', 'Sol', 'La', 'Sol', 'Re', 'Do'] },
    { lyric: 'Happy Birth-', notes: ["Sol", "Sol", "Sol'", 'Mi', 'Do', 'Ti', 'La'] },
    { lyric: 'day, Dadi!',   notes: ['Fa', 'Fa', 'Mi', 'Do', 'Re', 'Do'] }
  ];
  const FLAT = { Sol: 'C4', La: 'D4', Ti: 'E4', Do: 'F4', Re: 'G4', Mi: 'A4', Fa: 'Bb4', "Sol'": 'C5' };

  App.games.music = {
    zone: 'music',
    name: 'Sitar Sitar Studio',
    emoji: '🎵',
    render(body) {
      let mode = 'free';      /* free | follow | done */
      let pos = 0;            /* index into flat sequence */
      const seq = LINES.flatMap(l => l.notes);

      body.innerHTML =
        '<div class="chip-board">' +
          '<div class="chip-row" style="justify-content:center;gap:8px;flex-wrap:wrap">' +
            '<button class="btn" id="mFree">🎲 Free Music</button>' +
            '<button class="btn btn-primary" id="mFollow">📖 Happy Birthday Seekho</button>' +
            '<button class="btn" id="mPlay">🎧 Poora Gaana Suno</button>' +
          '</div>' +
          '<div class="chip-row" style="margin-top:12px">' +
            '<span class="hint" id="mTip">Keys dabao aur apni dhun banao! 🎶</span>' +
          '</div>' +
          '<div id="chipArea"></div>' +
        '</div>' +
        '<div class="inst-row">' +
          '<button class="inst" data-inst="drum" title="Dhol">🥁</button>' +
          '<button class="inst" data-inst="clap" title="Taali">👏</button>' +
          '<button class="inst" data-inst="bell" title="Ghanti">🔔</button>' +
          '<button class="inst" data-inst="tamb" title="Tambourine">🎐</button>' +
        '</div>' +
        '<div class="piano" id="piano"></div>' +
        '<div class="hint" style="text-align:center">Swar: Do Re Ga... jaise — yahan Sol, La, Ti, Do... (F ka key) 🎼</div>';

      const piano = body.querySelector('#piano');
      const tip = body.querySelector('#mTip');
      const chipArea = body.querySelector('#chipArea');
      const keyEls = {};

      KEYS.forEach(k => {
        const b = el('button', 'key', k.sol);
        b.onclick = () => pressKey(k, b);
        piano.append(b);
        keyEls[k.sol] = b;
      });

      function flashKey(b) {
        b.classList.add('on');
        setTimeout(() => b.classList.remove('on'), 220);
      }

      function pressKey(k, b) {
        if (mode === 'follow') {
          const need = seq[pos];
          if (k.sol === need) {
            SFX.key(freqOf(k.note), 0.45, 0.4);
            flashKey(b);
            markChip(pos, true);
            pos++;
            markNext();
            if (pos >= seq.length) celebrate();
          } else {
            SFX.boing();
            b.classList.add('shake');
            setTimeout(() => b.classList.remove('shake'), 450);
            tip.textContent = 'Hmm... ' + need + ' wali key dabao! 👆';
          }
        } else {
          SFX.key(freqOf(k.note), 0.45, 0.5);
          flashKey(b);
        }
      }

      function freqOf(note) {
        return { C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23, G4: 392, A4: 440, Bb4: 466.16, C5: 523.25 }[note];
      }

      function drawChips() {
        chipArea.innerHTML = '';
        LINES.forEach(line => {
          const row = el('div', 'chip-row');
          row.append(el('span', 'lyric', line.lyric));
          line.notes.forEach(s => row.append(el('span', 'chip', s)));
          chipArea.append(row);
        });
        /* index map (DOM order = melody order) */
        let n = 0;
        chipArea.querySelectorAll('.chip').forEach(c => { c.dataset.idx = n++; });
        markNext();
      }

      function markChip(i, done) {
        const c = chipArea.querySelector('.chip[data-idx="' + i + '"]');
        if (!c) return;
        c.classList.remove('next');
        if (done) c.classList.add('done');
      }
      function markNext() {
        chipArea.querySelectorAll('.chip.next').forEach(c => c.classList.remove('next'));
        if (mode !== 'follow') return;
        const c = chipArea.querySelector('.chip[data-idx="' + pos + '"]');
        if (c) c.classList.add('next');
        const k = keyEls[seq[pos]];
        if (k) { k.classList.remove('next'); void k.offsetWidth; k.classList.add('next'); }
      }

      function celebrate() {
        mode = 'done';
        keyEls && Object.values(keyEls).forEach(k => k.classList.remove('next'));
        tip.textContent = 'Kamaal! Poora gaana ban gaya! Ab suno! 🎉';
        SFX.chord();
        setTimeout(() => {
          SFX.playMelody((i) => {
            const c = chipArea.querySelector('.chip[data-idx="' + i + '"]');
            if (c) { c.classList.add('next'); setTimeout(() => c.classList.remove('next'), 260); }
          });
          setTimeout(() => {
            App.win({
              title: 'Happy Birthday taiyaar! 🎂',
              sub: 'Aap ne melody step-by-step seekhi — asli Sitar Sena!',
              sticker: 'music',
              doneId: 'game-music',
              stars: 3,
              say: 'Waah! Happy Birthday ka gaana aap ne seekh liya! Dadi ko gaana naacho!'
            });
          }, 2600);
        }, 900);
      }

      /* controls */
      body.querySelector('#mFree').onclick = function () {
        mode = 'free';
        pos = 0;
        chipArea.innerHTML = '';
        Object.values(keyEls).forEach(k => k.classList.remove('next'));
        tip.textContent = 'Keys dabao aur apni dhun banao! 🎶';
        SFX.pop();
      };
      body.querySelector('#mFollow').onclick = function () {
        mode = 'follow';
        pos = 0;
        chipArea.querySelectorAll('.chip').forEach(c => c.classList.remove('done'));
        drawChips();
        tip.textContent = 'Jinki chip chamk rahi hai, usi ki key dabao! 👆';
        SFX.ding();
        Speech.say('Chalo Happy Birthday seekhte hain! Jo chip chamk rahi hai, usi ki key dabao!', { stop: false });
      };
      body.querySelector('#mPlay').onclick = function () {
        SFX.playMelody((i) => {
          const c = chipArea.querySelector('.chip[data-idx="' + i + '"]');
          if (c) { c.classList.add('next'); setTimeout(() => c.classList.remove('next'), 260); }
        });
      };

      /* instruments */
      body.querySelectorAll('.inst').forEach(b => {
        b.onclick = () => {
          const t = b.dataset.inst;
          if (t === 'drum') SFX.drum();
          if (t === 'clap') SFX.clap();
          if (t === 'bell') SFX.bell();
          if (t === 'tamb') SFX.tambourine();
          b.style.transform = 'scale(.9)';
          setTimeout(() => { b.style.transform = ''; }, 120);
        };
      });

      body.querySelector('#mFree').classList.add('active');
      Speech.say('Yeh hai Sitar Sitar Studio! Piano ke keys dabao, dhol maaro, aur Happy Birthday ka gaana seekho!');
    }
  };
})();
