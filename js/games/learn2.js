/* =========================================================
   पढ़ाई वाड़ी — भाग 2: सुनो-समझो (श्रवण) + बोलो मेरे साथ (वाक)
   NCF-FS चक्र: सुनो → देखो → बोलो → खेलो
   (.ln-* शैलियाँ learn.js से आती हैं — यह file उसके बाद load होती है)
   ========================================================= */
(function () {
  const { SFX, Speech, FX } = window;
  const shuffle = a => { const x = a.slice(); for (let i = x.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1));[x[i], x[j]] = [x[j], x[i]]; } return x; };
  const pick = a => a[Math.floor(Math.random() * a.length)];

  /* ---------- 🎧 सुनो-समझो (hearing) ---------- */
  const WORDS = [
    ['आम', '🥭'], ['केला', '🍌'], ['सेब', '🍎'], ['अंगूर', '🍇'], ['गाय', '🐄'],
    ['कुत्ता', '🐶'], ['बिल्ली', '🐱'], ['मछली', '🐟'], ['हाथी', '🐘'], ['चिड़िया', '🐦'],
    ['तितली', '🦋'], ['किताब', '📖'], ['गेंद', '⚽'], ['फूल', '🌸'], ['पेड़', '🌳'],
    ['सूरज', '☀️'], ['चाँद', '🌙'], ['पानी', '💧']
  ];
  const SENTS = [
    ['चिड़िया उड़ रही है', '🐦'], ['मछली पानी में तैर रही है', '🐟'], ['हाथी बहुत बड़ा होता है', '🐘'],
    ['बंदर पेड़ पर कूद रहा है', '🐒'], ['सूरज चमक रहा है', '☀️'], ['बिल्ली दूध पी रही है', '🐱'],
    ['कुत्ता भौंक रहा है', '🐶'], ['तितली फूल पर बैठी है', '🦋']
  ];
  App.games.suno = {
    zone: 'school', name: 'सुनो-समझो', emoji: '🎧',
    render(body) {
      body.innerHTML = '';
      const ask = el('div', 'ln-ask');
      ask.innerHTML = '🎧 <b>सिर्फ़ सुनो</b> — क्या कहा गया? सही तस्वीर छुओ!<br>👂 यह कान की कसरत है — अक्षर छिपे हैं, सिर्फ़ आवाज़ सुनो।';
      body.append(ask);
      Speech.say('सुनो-समझो! मैं कुछ बोलूँगी, तुम सिर्फ सुनकर सही तस्वीर छूना। तैयार?');

      const rounds = [];
      shuffle(WORDS).slice(0, 5).forEach(([w, e]) => rounds.push({ say: w, ans: e, word: w }));
      shuffle(SENTS).slice(0, 3).forEach(([s, e]) => rounds.push({ say: s, ans: e, word: s }));
      const list = shuffle(rounds);
      let idx = 0, mistakes = 0, lock = false;

      const prog = el('div', 'ln-progress'); body.append(prog);
      const stage = el('div', 'ln-stage'); body.append(stage);
      const opts = el('div', 'ln-opts'); body.append(opts);

      function round() {
        lock = false;
        const r = list[idx];
        prog.textContent = '🎧 सवाल ' + (idx + 1) + ' / ' + list.length + (mistakes ? ' • ❌ ' + mistakes : '');
        stage.innerHTML = '';
        const ear = el('button', 'ln-bigword', '🎧');
        ear.style.fontSize = '64px';
        const sayTxt = el('div'); sayTxt.style.cssText = 'font-size:17px;color:#7f8c8d;margin-top:6px';
        sayTxt.textContent = 'सुनने के लिए कान छुओ';
        const reveal = el('button', 'btn btn-ghost', '👀 अक्षर दिखाओ');
        reveal.style.marginTop = '8px';
        reveal.onclick = () => { sayTxt.textContent = '“' + r.say + '”'; sayTxt.style.color = '#2d3436'; sayTxt.style.fontWeight = '800'; SFX.pop(); };
        ear.onclick = () => { SFX.ding(); Speech.say(r.say); };
        stage.append(ear, sayTxt, reveal);
        setTimeout(() => Speech.say(r.say), 450);

        const pool = r.word.length <= 3 && WORDS.some(w => w[0] === r.word)
          ? WORDS : SENTS;
        const others = shuffle(pool.filter(([w, e]) => e !== r.ans)).slice(0, 2).map(([, e]) => e);
        opts.innerHTML = '';
        shuffle([r.ans, ...others]).forEach(e => {
          const b = el('button', 'ln-opt');
          b.innerHTML = '<span style="font-size:44px">' + e + '</span>';
          b.onclick = () => {
            if (lock) return;
            if (e === r.ans) {
              lock = true; b.classList.add('good'); SFX.good(); FX.burst();
              sayTxt.textContent = '✅ ' + r.say; sayTxt.style.color = '#1e8449'; sayTxt.style.fontWeight = '800';
              Speech.say('शाबाश! तुमने सही सुना: ' + r.word);
              idx++;
              setTimeout(() => {
                if (idx >= list.length) {
                  const stars = mistakes === 0 ? 3 : (mistakes <= 2 ? 2 : 1);
                  App.win({ doneId: 'game-suno', stars, sticker: 'suno', againName: 'suno',
                    title: '🎧 सुनने के उस्ताद!', sub: 'सिर्फ़ सुनकर ' + (list.length - mistakes) + '/' + list.length + ' सही पहचाने!',
                    say: 'वाह! तुम्हारे कान बहुत तेज़ हैं! सुनकर समझना ही पक्की पढ़ाई की शुरुआत है!' });
                } else round();
              }, 1500);
            } else {
              mistakes++; b.classList.add('bad'); b.disabled = true; SFX.bad();
              Speech.say('ध्यान से फिर सुनो!');
              setTimeout(() => Speech.say(r.say), 500);
            }
          };
          opts.append(b);
        });
      }
      round();
    }
  };

  /* ---------- 🗣️ बोलो मेरे साथ (speaking) ---------- */
  const BOLO_ITEMS = [
    { e: '🍎', t: 'सेब' }, { e: '🍌', t: 'केला' }, { e: '🐘', t: 'हाथी' },
    { e: '🦋', t: 'तितली' }, { e: '🐟', t: 'मछली' }, { e: '📖', t: 'किताब' },
    { e: '🍎', t: 'Apple', en: true }, { e: '🐶', t: 'Dog', en: true },
    { e: '🙏', t: 'मेरा नाम लड़्डू है' }, { e: '🌈', t: 'मुझे खेलना बहुत पसंद है' }
  ];
  App.games.bolo = {
    zone: 'school', name: 'बोलो मेरे साथ', emoji: '🗣️',
    render(body) {
      body.innerHTML = '';
      const ask = el('div', 'ln-ask');
      ask.innerHTML = '🗣️ <b>मैं बोलूँगी, फिर तुम बोलना!</b><br>🎤 चाहो तो अपनी आवाज़ रिकॉर्ड करके खुद सुन भी सकते हो।';
      body.append(ask);
      Speech.say('बोलो मेरे साथ! मैं बोलूँगी, फिर तुम दोहराना। बोलने से ही भाषा पक्की होती है!');

      let idx = 0, skips = 0, micMode = null; // null=unknown, true, false
      let recorder = null, chunks = [];

      const prog = el('div', 'ln-progress'); body.append(prog);
      const stage = el('div', 'ln-stage'); body.append(stage);
      const controls = el('div'); controls.style.cssText = 'display:flex;gap:10px;justify-content:center;flex-wrap:wrap;margin:8px 0'; body.append(controls);

      function speakItem(it) { if (it.en) Speech.sayEn(it.t); else Speech.say(it.t); }
      function next() {
        idx++;
        if (idx >= BOLO_ITEMS.length) {
          const stars = skips === 0 ? 3 : (skips <= 2 ? 2 : 1);
          App.win({ doneId: 'game-bolo', stars, sticker: 'bolo', againName: 'bolo',
            title: '🗣️ बोलने के हीरो!', sub: BOLO_ITEMS.length + ' शब्द और वाक्य खुद बोले!',
            say: 'शाबाश! तुमने सब कुछ अपने मुँह से बोला! ऐसे ही बोलते रहो, भाषा तुम्हारी दोस्त बन जाएगी!' });
          return;
        }
        show();
      }
      function show() {
        const it = BOLO_ITEMS[idx];
        prog.textContent = '🗣️ ' + (idx + 1) + ' / ' + BOLO_ITEMS.length;
        stage.innerHTML = '<div style="font-size:64px">' + it.e + '</div><div class="ln-bigword" style="font-size:34px">' + it.t + '</div><div style="font-size:15px;color:#7f8c8d">पहले सुनो, फिर ज़ोर से बोलो!</div>';
        setTimeout(() => speakItem(it), 400);
        controls.innerHTML = '';
        const again = el('button', 'btn btn-ghost', '🔊 फिर सुनो');
        again.onclick = () => speakItem(it);
        const mic = el('button', 'btn btn-play', '🎤 बोलकर रिकॉर्ड करो');
        mic.onclick = () => recordFlow(mic, it);
        const said = el('button', 'btn btn-play', '✅ मैंने बोल दिया');
        said.onclick = () => { SFX.good(); FX.burst(); Speech.say('शाबाश!'); setTimeout(next, 800); };
        const skip = el('button', 'btn btn-ghost', '⏭️ छोड़ो');
        skip.onclick = () => { skips++; SFX.pop(); next(); };
        if (micMode === false) controls.append(again, said, skip);
        else controls.append(again, mic, said, skip);
      }
      async function recordFlow(micBtn, it) {
        if (!navigator.mediaDevices || !window.MediaRecorder) { micMode = false; micBtn.remove(); Speech.say('इसमें माइक नहीं चलता — मुँह से बोलकर हरे बटन को दबा दो!'); return; }
        try {
          if (!recorder) {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            recorder = new MediaRecorder(stream);
          }
          chunks = [];
          recorder.ondataavailable = e => { if (e.data.size) chunks.push(e.data); };
          recorder.onstop = () => {
            const url = URL.createObjectURL(new Blob(chunks, { type: 'audio/webm' }));
            const a = new Audio(url);
            micMode = true;
            Speech.say('ये रही तुम्हारी अपनी आवाज़!');
            setTimeout(() => { a.play().catch(() => {}); }, 900);
            SFX.good(); FX.burst();
            setTimeout(next, 2600);
          };
          micBtn.textContent = '⏹️ बोलकर दबाओ — रिकॉर्ड हो रहा है...';
          micBtn.onclick = () => { try { recorder.stop(); } catch (e) {} };
          recorder.start();
          Speech.say('बोलो: ' + it.t);
          setTimeout(() => { if (recorder.state === 'recording') { try { recorder.stop(); } catch (e) {} } }, 5000);
        } catch (e) {
          micMode = false;
          micBtn.remove();
          Speech.say('माइक की इजाज़त नहीं मिली — कोई बात नहीं, मुँह से बोलकर हरे बटन को दबा दो!');
        }
      }
      show();
    }
  };
})();
