/* =========================================================
   लड़्डू का खेल घर — Story engine V2 (कहानी वाड़ी)
   V2 नियम: पन्नों पर छिपा सितारा-फ़ार्मिंग बंद। सितारे
   सिर्फ़ कहानी पूरी करके "कहानी खेल" में प्रदर्शन पर।
   ========================================================= */
(function () {
  let cur = null;

  /* ---- असली आवाज़ (2026-10-30): कहानियों की narration पहले से
     बनी हुई असली आवाज़ (MAI_01) में चलती है — device की robot
     आवाज़ सिर्फ़ तब, जब clip न मिले। Clips js/audio/<id>.js में
     lazy-load होते हैं (bundle में पहले से भरे होते हैं)। ---- */
  const Narrator = {
    audio: null, key: null, btn: null,
    stop() {
      if (this.audio) { try { this.audio.pause(); } catch (e) {} this.audio = null; }
      this.key = null;
      if (this.btn) { try { this.btn.textContent = '🔊 सुनो'; } catch (e) {} this.btn = null; }
    },
    play(sid, idx, fallbackText, btn) {
      const key = sid + ':' + idx;
      if (this.key === key && this.audio) { this.stop(); return; }
      this.stop();
      if (window.Speech) Speech.stop();
      this.key = key; this.btn = btn || null;
      if (this.btn) this.btn.textContent = '⏹️ रोको';
      const self = this;
      const finish = () => { if (self.key === key) self.stop(); };
      const fallback = () => { self.audio = null; if (self.key === key) { Speech.say(fallbackText); finish(); } };
      const useClip = () => {
        const clips = window.STORY_AUDIO && window.STORY_AUDIO[sid];
        if (!clips || !clips[idx]) return false;
        try {
          const a = new Audio(clips[idx]);
          self.audio = a;
          a.onended = finish;
          a.onerror = fallback;
          const pr = a.play();
          if (pr && pr.catch) pr.catch(fallback);
          return true;
        } catch (e) { return false; }
      };
      if (window.STORY_AUDIO && window.STORY_AUDIO[sid]) {
        if (!useClip()) fallback();
      } else {
        const sc = document.createElement('script');
        sc.src = 'js/audio/' + sid + '.js';
        sc.onload = () => { if (self.key === key && !useClip()) fallback(); };
        sc.onerror = () => { if (self.key === key) fallback(); };
        document.head.appendChild(sc);
      }
    }
  };
  window.StoryNarrator = Narrator;

  App.screens.story = function (stage, id) {
    const st = STORIES.find(s => s.id === id);
    if (!st) { App.nav('home'); return; }
    cur = { st: st, page: 0 };
    render(stage);
  };

  function render(stage) {
    const { st, page } = cur;
    const p = st.pages[page];
    const isLast = page === st.pages.length - 1;
    const decoPos = [['8%', '14%'], ['78%', '20%'], ['16%', '72%']];

    stage.innerHTML = '';
    const back = el('button', 'btn btn-back', '← घर');
    back.onclick = () => { SFX.pop(); App.nav('zone', st.zone); };
    const head = el('div', 'story-head');
    head.append(back, el('h2', null, st.emoji + ' ' + st.title));
    stage.append(head);

    const book = el('div', 'book pop-in');
    const scene = el('div', 'scene');
    scene.style.background = st.bg;
    decoPos.forEach((pos, i) => {
      const d = el('span', 'sc-deco', p.deco && p.deco[i] ? p.deco[i] : '✨');
      d.style.left = pos[0]; d.style.top = pos[1];
      d.style.animationDelay = (i * 0.4) + 's';
      scene.append(d);
    });
    const s1 = el('span', 'sc-e1');
    const s2 = el('span', 'sc-e2');

    function renderElem(target, eVal, charId) {
      if (charId && window.Characters) {
        target.innerHTML = window.Characters.getAvatarHTML(charId, 76, 'story-char-avatar');
      } else {
        target.textContent = eVal || '';
      }
    }

    renderElem(s1, p.e1, p.char1);
    renderElem(s2, p.e2, p.char2);
    scene.append(s1, s2);
    book.append(scene);

    const txt = el('div', 'page-text', p.text);
    book.append(txt);

    const ctl = el('div', 'page-ctl');
    const prevB = el('button', 'btn', '← पिछला');
    prevB.onclick = () => { if (page > 0) { Narrator.stop(); cur.page--; SFX.pop(); render(stage); } };
    if (page === 0) prevB.disabled = true;
    const listenB = el('button', 'btn btn-primary', '🔊 सुनो');
    listenB.onclick = function () {
      SFX.pop();
      Narrator.play(st.id, page, p.text, listenB);
    };
    let nextB;
    if (isLast) {
      nextB = el('button', 'btn btn-primary', '🎮 कहानी खेल');
      nextB.onclick = () => { Narrator.stop(); SFX.ding(); khet(stage); };
    } else {
      nextB = el('button', 'btn btn-primary', 'अगला →');
      nextB.onclick = () => { Narrator.stop(); cur.page++; SFX.pop(); render(stage); };
    }
    ctl.append(prevB, listenB, nextB);
    book.append(ctl);

    const dots = el('div', 'dots');
    st.pages.forEach((pg, i) => {
      const d = el('span', 'dot' + (i <= page ? ' on' : ''));
      dots.append(d);
    });
    book.append(dots);

    stage.append(book);
    stage.append(el('div', 'hint', '🔊 "सुनो" दबाओ — कहानी आवाज़ में सुनाई देगी। कहानी पूरी करके खेल खेलो और सितारे पाओ!'));
  }

  /* ---- कहानी खेल: कहानी का क्रम याद करके छुओ ---- */
  function khet(stage) {
    const { st } = cur;
    const items = st.khet.items.slice();
    for (let i = items.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const t = items[i]; items[i] = items[j]; items[j] = t;
    }
    let nextIdx = 0, mistakes = 0;

    stage.innerHTML = '';
    const head = el('div', 'story-head');
    const back = el('button', 'btn btn-back', '← कहानी');
    back.onclick = () => { SFX.pop(); cur.page = 0; render(stage); };
    head.append(back, el('h2', null, '🎮 कहानी खेल'));
    stage.append(head);

    const say = el('div', 'g-tip', 'कहानी के हिसाब से क्रम में छुओ! 👆');
    stage.append(say);

    const chips = el('div', 'kchips');
    st.khet.items.forEach((it, i) => {
      chips.append(el('span', 'kchip' + (i === 0 ? ' on' : ''), it.l));
    });
    stage.append(chips);

    const grid = el('div', 'khet-grid');
    items.forEach((it) => {
      const c = el('button', 'kcard', '<span>' + it.e + '</span>' + it.l);
      c.onclick = function (e) {
        const orig = st.khet.items[nextIdx];
        if (it.e === orig.e && it.l === orig.l) {
          SFX.ding();
          FX.burst(e.clientX, e.clientY, 12);
          c.classList.add('done');
          c.disabled = true;
          nextIdx++;
          const chip = chips.children[nextIdx - 1];
          if (chip) chip.classList.add('on');
          const nextChip = chips.children[nextIdx];
          if (nextChip) nextChip.classList.add('on');
          if (nextIdx >= st.khet.items.length) {
            const stars = mistakes === 0 ? 3 : (mistakes <= 2 ? 2 : 1);
            setTimeout(() => {
              if (!grid.isConnected) return;
              App.win({
                title: 'कहानी पूरी हुई! 📖',
                sub: st.khet.win,
                sticker: st.id,
                doneId: 'story-' + st.id,
                stars: stars,
                say: 'शाबाश लड़्डू! आपने कहानी पूरी कर ली! ' + st.khet.win
              });
            }, 500);
          } else {
            Speech.say('सही! अब अगला — ' + st.khet.items[nextIdx].l, { stop: false });
          }
        } else {
          mistakes++;
          SFX.boing();
          c.classList.add('shake');
          setTimeout(() => c.classList.remove('shake'), 500);
          Speech.say('थोड़ा सोचो... कहानी में पहले क्या हुआ था?', { stop: false });
        }
      };
      grid.append(c);
    });
    stage.append(grid);
    Speech.say(st.khet.say);
  }
})();
