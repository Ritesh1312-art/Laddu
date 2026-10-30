/* =========================================================
   कविता वाड़ी — poems screen
   • सुनो: asal record ki awaaz + bolti line highlight
   • line chhuo: wahi line sunai degi
   • मेरे साथ बोलो: line bologi, baccha dohrayega
   ========================================================= */
(function () {
  const { SFX, Speech, State } = window;

  const style = document.createElement('style');
  style.textContent =
    '.poem-box{background:#fff;border-radius:20px;padding:16px 10px;box-shadow:0 6px 18px rgba(0,0,0,.10);margin:10px 0}' +
    '.poem-line{font-size:clamp(20px,4.8vw,28px);font-weight:700;color:#37474f;padding:9px 12px;border-radius:12px;cursor:pointer;text-align:center;line-height:1.55;transition:all .25s}' +
    '.poem-line.active{background:#fff0b3;color:#b3541e;transform:scale(1.04);box-shadow:0 3px 10px rgba(243,156,18,.35)}' +
    '.btn-play{background:linear-gradient(135deg,#ff7b54,#ff3d68)!important;color:#fff!important}';
  document.head.appendChild(style);

  const loaded = {};
  function loadAudio(lang) {
    if (loaded[lang]) return loaded[lang];
    loaded[lang] = new Promise(res => {
      const s = document.createElement('script');
      s.src = 'js/audio/poems_' + lang + '.js';
      s.onload = () => res(true);
      s.onerror = () => res(false);
      document.head.appendChild(s);
    });
    return loaded[lang];
  }

  const Player = {
    audio: null, timer: null,
    stop() {
      if (this.timer) { clearInterval(this.timer); this.timer = null; }
      if (this.audio) { try { this.audio.pause(); } catch (e) {} this.audio = null; }
      document.querySelectorAll('.poem-line.active').forEach(n => n.classList.remove('active'));
    },
    async play(poem, lineEls, btn, onDone) {
      this.stop(); Speech.stop();
      btn.textContent = '⏳...';
      await loadAudio(poem.lang);
      const src = (window.POEM_AUDIO || {})[poem.id];
      if (!src) { /* fallback: device voice */
        btn.textContent = '▶ सुनो';
        poem.lines.forEach((l, i) => setTimeout(() => { if (poem.lang === 'en') Speech.sayEn(l); else Speech.say(l); }, i * 60));
        if (onDone) onDone();
        return;
      }
      const A = new Audio(src);
      this.audio = A;
      A.onloadedmetadata = () => {
        const D = A.duration;
        const weights = poem.lines.map(l => Math.max(4, l.length));
        const total = weights.reduce((a, b) => a + b, 0);
        const starts = []; let acc = 0;
        weights.forEach(w => { starts.push(acc / total * D); acc += w; });
        btn.textContent = '⏹️ रोको';
        btn.onclick = () => { Player.stop(); btn.textContent = '▶ सुनो'; btn.onclick = () => Player.play(poem, lineEls, btn, onDone); };
        A.play().catch(() => { btn.textContent = '▶ सुनो'; });
        this.timer = setInterval(() => {
          const t = A.currentTime;
          let cur = 0;
          starts.forEach((s, i) => { if (t >= s) cur = i; });
          lineEls.forEach((n, i) => n.classList.toggle('active', i === cur));
          if (A.ended) {
            Player.stop();
            btn.textContent = '▶ सुनो';
            btn.onclick = () => Player.play(poem, lineEls, btn, onDone);
            if (onDone) onDone();
          }
        }, 200);
      };
    }
  };
  window.PoemPlayer = Player;

  function heardCount() { return Object.keys(State.data.poemsHeard || {}).length; }
  function markHeard(id) {
    State.data.poemsHeard = State.data.poemsHeard || {};
    if (!State.data.poemsHeard[id]) {
      State.data.poemsHeard[id] = 1;
      if (heardCount() >= 5) State.award('kavita');
      State.save();
    }
  }

  App.screens.poems = function (stage) {
    stage.innerHTML = '';
    const back = el('button', 'btn btn-back', '← घर');
    back.onclick = () => { SFX.pop(); App.nav('home'); };
    stage.append(back);
    stage.append(el('div', 'album-head', '🎶 कविता वाड़ी'));
    stage.append(el('div', 'hint', 'भारत की सबसे प्यारी कविताएँ — हिंदी और English दोनों! किसी कविता को चुनो, फिर ▶ सुनो दबाओ: असल आवाज़ में कविता चलेगी और बोलती हुई line चमकेगी। किसी line को छूने से वही line सुनाई देगी!'));
    Speech.say('कविता वाड़ी में स्वागत है! अपनी पसंद की कविता चुनो।');
    [['hi', '🇮🇳 हिंदी कविताएँ'], ['en', '🔤 English Poems']].forEach(([lang, head]) => {
      stage.append(el('div', 'sec-title', head));
      const grid = el('div', 'story-grid');
      POEMS.filter(p => p.lang === lang).forEach(p => {
        const heard = (State.data.poemsHeard || {})[p.id];
        const card = el('button', 'story-card tap');
        card.innerHTML = '<span class="s-emoji">' + p.emoji + '</span><span class="s-title">' + p.title + '</span>' +
          '<span class="s-meta">' + (heard ? '✅ सुनी हुई' : (lang === 'hi' ? 'कविता सुनो' : 'Tap to listen')) + '</span>';
        card.onclick = () => { SFX.ding(); App.nav('poem', p.id); };
        grid.append(card);
      });
      stage.append(grid);
    });
  };

  App.screens.poem = function (stage, pid) {
    const poem = POEMS.find(p => p.id === pid) || POEMS[0];
    stage.innerHTML = '';
    const back = el('button', 'btn btn-back', '← कविताएँ');
    back.onclick = () => { Player.stop(); SFX.pop(); App.nav('poems'); };
    stage.append(back);

    const head = el('div', 'story-head');
    head.innerHTML = '<div class="story-emoji">' + poem.emoji + '</div><h2 class="story-title">' + poem.title + '</h2>';
    stage.append(head);

    const box = el('div', 'poem-box');
    const lineEls = poem.lines.map((l, i) => {
      const d = el('div', 'poem-line', l);
      d.title = 'सुनने के लिए छुओ';
      d.onclick = () => {
        SFX.pop();
        if (poem.lang === 'en') Speech.sayEn(l); else Speech.say(l);
        lineEls.forEach(n => n.classList.remove('active'));
        d.classList.add('active');
        setTimeout(() => d.classList.remove('active'), 1600);
      };
      box.append(d);
      return d;
    });
    stage.append(box);
    stage.append(el('div', 'hint', '👆 किसी line को छुओ — वही line सुनाई देगी'));

    const controls = el('div', 'story-controls');
    const playBtn = el('button', 'btn btn-play', '▶ सुनो');
    playBtn.onclick = () => Player.play(poem, lineEls, playBtn, () => {
      markHeard(poem.id);
      Speech.say(poem.lang === 'en' ? 'Bahut badhiya! Poem sun li!' : 'वाह! पूरी कविता सुन ली! अब मेरे साथ बोलकर देखो!');
    });
    const speakBtn = el('button', 'btn btn-ghost', '🗣️ मेरे साथ बोलो');
    speakBtn.onclick = () => speakAlong(poem, lineEls, speakBtn);
    controls.append(playBtn, speakBtn);
    stage.append(controls);

    if (poem.id === 'janganman' || poem.id === 'vande') {
      stage.append(el('div', 'hint', '🇮🇳 देश के गीत के समय सीधे खड़े होते हैं और आदर से सुनते हैं।'));
    }
  };

  function speakAlong(poem, lineEls, btn) {
    Player.stop(); Speech.stop();
    let i = 0;
    btn.disabled = true;
    (function step() {
      if (i >= poem.lines.length) {
        markHeard(poem.id);
        btn.disabled = false;
        Speech.say('शाबाश! तुमने पूरी कविता मेरे साथ बोली! तुम कविता के हीरो हो!');
        if (window.FX) FX.burst();
        return;
      }
      lineEls.forEach((n, k) => n.classList.toggle('active', k === i));
      const l = poem.lines[i];
      const done = el('button', 'btn btn-play');
      done.textContent = '✅ मैंने बोल दिया (' + (i + 1) + '/' + poem.lines.length + ')';
      done.style.display = 'block'; done.style.margin = '12px auto';
      done.onclick = () => { SFX.ding(); done.remove(); i++; step(); };
      document.getElementById('screen').append(done);
      if (done.scrollIntoView) done.scrollIntoView({ block: 'center' });
      setTimeout(() => { if (poem.lang === 'en') Speech.sayEn(l); else Speech.say(l); }, 250);
    })();
  }
})();
