/* =========================================================
   Game 6 — सुर स्टूडियो V2 (संगीत)
   V2 सुधार: असली piano — सफ़ेद keys के बीच काली keys, और
   सुर दो (C) से शुरू। गाना सही क्रम में बजता है। सीखने के
   दो चरण: अभ्यास (key चमकेगी) → चुनौती (बिना चमक, याद से)।
   ========================================================= */
(function () {
  /* C major: C=दो D=रे E=मी F=फ़ा G=सोल A=ला B=ती C'=दो' */
  const WHITES = [
    { note: 'C4', sol: 'दो' }, { note: 'D4', sol: 'रे' }, { note: 'E4', sol: 'मी' },
    { note: 'F4', sol: 'फ़ा' }, { note: 'G4', sol: 'सोल' }, { note: 'A4', sol: 'ला' },
    { note: 'B4', sol: 'ती' }, { note: 'C5', sol: "दो'" }, { note: 'D5', sol: "रे'" },
    { note: 'E5', sol: "मी'" }, { note: 'F5', sol: "फ़ा'" }, { note: 'G5', sol: "सोल'" }
  ];
  /* काली keys: किस सफ़ेद key के बाद आएगी (index) */
  const BLACKS = [
    { note: 'C#4', after: 0 }, { note: 'D#4', after: 1 },
    { note: 'F#4', after: 3 }, { note: 'G#4', after: 4 }, { note: 'A#4', after: 5 },
    { note: 'C#5', after: 7 }, { note: 'D#5', after: 8 }, { note: 'F#5', after: 10 }
  ];
  const FREQ = { C4: 261.63, 'C#4': 277.18, D4: 293.66, 'D#4': 311.13, E4: 329.63, F4: 349.23, 'F#4': 369.99, G4: 392, 'G#4': 415.3, A4: 440, 'A#4': 466.16, B4: 493.88, C5: 523.25, 'C#5': 554.37, D5: 587.33, 'D#5': 622.25, E5: 659.25, F5: 698.46, 'F#5': 739.99, G5: 783.99 };
  const SOL_OF = { G4: 'सोल', A4: 'ला', B4: 'ती', C5: "दो'", D5: "रे'", E5: "मी'", F5: "फ़ा'", G5: "सोल'" };
  const LINES = [
    { lyric: 'हैप्पी बर्थ-', notes: ['G4', 'G4', 'A4', 'G4', 'C5', 'B4'] },
    { lyric: 'डे टू यू', notes: ['G4', 'G4', 'A4', 'G4', 'D5', 'C5'] },
    { lyric: 'हैप्पी बर्थ-', notes: ['G4', 'G4', 'G5', 'E5', 'C5', 'B4', 'A4'] },
    { lyric: 'डे, दादी!', notes: ['F5', 'F5', 'E5', 'C5', 'D5', 'C5'] }
  ];

  App.games.music = {
    zone: 'music',
    name: 'सुर स्टूडियो',
    emoji: '🎵',
    render(body) {
      let mode = 'free';           /* free | abhyas | chunauti | done */
      let pos = 0, mistakes = 0;
      const seq = LINES.flatMap(l => l.notes);

      body.innerHTML =
        '<div class="chip-board">' +
          '<div class="chip-row" style="justify-content:center;gap:8px;flex-wrap:wrap">' +
            '<button class="btn" id="mFree">🎲 अपनी धुन</button>' +
            '<button class="btn btn-primary" id="mLearn">📖 हैप्पी बर्थडे सीखो</button>' +
            '<button class="btn" id="mPlay">🎧 पूरा गाना सुनो</button>' +
          '</div>' +
          '<div class="chip-row" style="margin-top:12px">' +
            '<span class="hint" id="mTip">Keys दबाओ और अपनी धुन बनाओ! 🎶</span>' +
          '</div>' +
          '<div id="chipArea"></div>' +
          '<div class="chip-row hidden" id="challengeRow" style="justify-content:center;margin-top:10px">' +
            '<button class="btn btn-primary" id="mChallenge">🌟 अब बिना देखे बजाओ (चुनौती)</button>' +
          '</div>' +
        '</div>' +
        '<div class="inst-row">' +
          '<button class="inst" data-inst="drum" title="ढोल">🥁</button>' +
          '<button class="inst" data-inst="clap" title="ताली">👏</button>' +
          '<button class="inst" data-inst="bell" title="घंटी">🔔</button>' +
          '<button class="inst" data-inst="tamb" title="झुनझुना">🎐</button>' +
        '</div>' +
        '<div class="piano2" id="piano"></div>' +
        '<div class="hint" style="text-align:center">सुर: दो रे मी फ़ा सोल ला ती दो — सफ़ेद बड़ी keys, काली छोटी keys 🎼</div>';

      const piano = body.querySelector('#piano');
      const tip = body.querySelector('#mTip');
      const chipArea = body.querySelector('#chipArea');
      const keyEls = {};

      WHITES.forEach(k => {
        const b = el('button', 'wkey', k.sol);
        b.onclick = () => pressKey(k.note, b);
        piano.append(b);
        keyEls[k.note] = b;
      });
      BLACKS.forEach(k => {
        const b = el('button', 'bkey', '');
        b.style.left = 'calc(' + ((k.after + 1) * 8.333) + '% - 2.8%)';
        b.onclick = () => pressKey(k.note, b);
        piano.append(b);
        keyEls[k.note] = b;
      });

      function flashKey(b) {
        b.classList.add('on');
        setTimeout(() => b.classList.remove('on'), 220);
      }

      function pressKey(note, b) {
        if (mode === 'abhyas' || mode === 'chunauti') {
          const need = seq[pos];
          if (note === need) {
            SFX.key(FREQ[note], 0.45, 0.4);
            flashKey(b);
            markChip(pos, true);
            pos++;
            markNext();
            if (pos >= seq.length) {
              if (mode === 'abhyas') abhyasDone();
              else celebrate();
            }
          } else {
            if (mode === 'chunauti') mistakes++;
            SFX.boing();
            b.classList.add('shake');
            setTimeout(() => b.classList.remove('shake'), 450);
            tip.textContent = mode === 'abhyas'
              ? 'चमकती हुई key दबाओ! 👆 (' + (SOL_OF[need] || need) + ')'
              : 'गलत सुर! सोचो — अगला सुर कौन-सा था? 🤔';
          }
        } else {
          SFX.key(FREQ[note], 0.45, 0.5);
          flashKey(b);
        }
      }

      function drawChips() {
        chipArea.innerHTML = '';
        LINES.forEach(line => {
          const row = el('div', 'chip-row');
          row.append(el('span', 'lyric', line.lyric));
          line.notes.forEach(n => row.append(el('span', 'chip', SOL_OF[n])));
          chipArea.append(row);
        });
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
        Object.values(keyEls).forEach(k => k.classList.remove('next'));
        if (mode !== 'abhyas' && mode !== 'chunauti') return;
        const c = chipArea.querySelector('.chip[data-idx="' + pos + '"]');
        if (c) c.classList.add('next');
        if (mode === 'abhyas') {
          const k = keyEls[seq[pos]];
          if (k) k.classList.add('next');
        }
      }

      function abhyasDone() {
        mode = 'free';
        Object.values(keyEls).forEach(k => k.classList.remove('next'));
        tip.textContent = 'अभ्यास पूरा! अब असली कमाल — बिना चमक के, सिर्फ़ याद से बजाओ! 🌟';
        body.querySelector('#challengeRow').classList.remove('hidden');
        SFX.good();
        Speech.say('अभ्यास पूरा! अब चुनौती लो — बिना देखे, याद से बजाओ!');
      }

      function celebrate() {
        mode = 'done';
        Object.values(keyEls).forEach(k => k.classList.remove('next'));
        tip.textContent = 'कमाल! पूरा गाना याद से बजा दिया! अब सुनो! 🎉';
        SFX.chord();
        const stars = mistakes === 0 ? 3 : (mistakes <= 3 ? 2 : 1);
        SFX.playMelody((i) => {
          const c = chipArea.querySelector('.chip[data-idx="' + i + '"]');
          if (c) { c.classList.add('next'); setTimeout(() => c.classList.remove('next'), 260); }
        }).then(() => {
          if (!piano.isConnected) return;
          App.win({
            title: 'हैप्पी बर्थडे तैयार! 🎂',
            sub: mistakes === 0 ? 'एक भी गलती नहीं — याद से पूरा गाना! असली सुर सेना!' : 'गाना याद से बजाया! गलतियाँ और कम करो, 3 सितारे पक्के!',
            sticker: 'music',
            doneId: 'game-music',
            stars: stars,
            say: 'वाह! हैप्पी बर्थडे का गाना आपने याद से सीख लिया!'
          });
        });
      }

      body.querySelector('#mFree').onclick = function () {
        mode = 'free'; pos = 0;
        chipArea.innerHTML = '';
        body.querySelector('#challengeRow').classList.add('hidden');
        Object.values(keyEls).forEach(k => k.classList.remove('next'));
        tip.textContent = 'Keys दबाओ और अपनी धुन बनाओ! 🎶';
        SFX.pop();
      };
      body.querySelector('#mLearn').onclick = function () {
        mode = 'abhyas'; pos = 0; mistakes = 0;
        body.querySelector('#challengeRow').classList.add('hidden');
        drawChips();
        tip.textContent = 'अभ्यास: जो chip और key चमक रही है, उसे दबाओ! 👆';
        SFX.ding();
        Speech.say('चलो हैप्पी बर्थडे सीखते हैं! जो key चमक रही है, उसे दबाओ!');
      };
      body.querySelector('#mChallenge').onclick = function () {
        mode = 'chunauti'; pos = 0; mistakes = 0;
        body.querySelector('#challengeRow').classList.add('hidden');
        chipArea.querySelectorAll('.chip').forEach(c => c.classList.remove('done'));
        drawChips();
        tip.textContent = 'चुनौती: अब key नहीं चमकेगी — याद से बजाओ! 🌟';
        SFX.ding();
        Speech.say('चुनौती शुरू! अब key नहीं चमकेगी। याद से बजाओ!');
      };
      body.querySelector('#mPlay').onclick = function () {
        if (!chipArea.children.length) drawChips();
        SFX.playMelody((i) => {
          const c = chipArea.querySelector('.chip[data-idx="' + i + '"]');
          if (c) { c.classList.add('next'); setTimeout(() => c.classList.remove('next'), 260); }
        });
      };

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

      Speech.say('यह है सुर स्टूडियो! Piano की keys दबाओ, ढोल बजाओ, और हैप्पी बर्थडे का गाना सीखो!');
    }
  };
})();
