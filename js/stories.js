/* =========================================================
   Laddu Ka Khel Ghar — Story engine (Kahaani Wadi)
   Page-wise kahaani, awaaz mein suno, star tap karo,
   aur kahaani ke baad "Kahaani Khel" (order-memory game).
   ========================================================= */
(function () {
  let cur = null;

  App.screens.story = function (stage, id) {
    const st = STORIES.find(s => s.id === id);
    if (!st) { App.nav('home'); return; }
    cur = { st: st, page: 0, tapped: {} };
    render(stage);
  };

  function render(stage) {
    const { st, page } = cur;
    const p = st.pages[page];
    const isLast = page === st.pages.length - 1;
    const decoPos = [['8%','14%'], ['78%','20%'], ['16%','72%']];

    stage.innerHTML = '';
    const back = el('button', 'btn btn-back', '← Ghar');
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

    /* Character photo rendering helper for story scenes */
    function renderElem(target, eVal, charId) {
      if (charId && window.Characters) {
        target.innerHTML = window.Characters.getAvatarHTML(charId, 70, 'story-char-avatar');
      } else {
        target.textContent = eVal || '';
      }
    }

    renderElem(s1, p.e1, p.char1);
    renderElem(s2, p.e2, p.char2);
    scene.append(s1, s2);
    if (!cur.tapped[page]) {
      const star = el('span', 'story-star tap', '⭐');
      star.title = 'Star tap karo!';
      star.onclick = function (e) {
        cur.tapped[page] = true;
        SFX.jingle();
        FX.burst(e.clientX, e.clientY, 14);
        State.addStars(1);
        star.classList.add('got');
        Speech.say('Waah! Ek star mila!', { stop: false });
      };
      scene.append(star);
    }
    book.append(scene);

    const txt = el('div', 'page-text', p.text);
    book.append(txt);

    const ctl = el('div', 'page-ctl');
    const prevB = el('button', 'btn', '← Pichhla');
    prevB.onclick = () => { if (page > 0) { cur.page--; SFX.pop(); render(stage); } };
    if (page === 0) prevB.disabled = true;
    const listenB = el('button', 'btn btn-primary', '🔊 Suno');
    listenB.onclick = function () {
      SFX.pop();
      Speech.say('Page ' + (page + 1) + '. ' + p.text);
    };
    let nextB;
    if (isLast) {
      nextB = el('button', 'btn btn-primary', '🎮 Kahaani Khel');
      nextB.onclick = () => { SFX.ding(); khet(stage); };
    } else {
      nextB = el('button', 'btn btn-primary', 'Agla →');
      nextB.onclick = () => { cur.page++; SFX.pop(); render(stage); };
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
    const hint = el('div', 'hint', '🔊 "Suno" dabao toh kahaani awaaz mein sunai degi. Chhota ⭐ tap karo — bonus star!');
    stage.append(hint);
  }

  /* ---- Kahaani Khel: story ka order yaad karke tap karo ---- */
  function khet(stage) {
    const { st } = cur;
    const items = st.khet.items.slice();
    // shuffle
    for (let i = items.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const t = items[i]; items[i] = items[j]; items[j] = t;
    }
    let nextIdx = 0;

    stage.innerHTML = '';
    const head = el('div', 'story-head');
    const back = el('button', 'btn btn-back', '← Kahaani');
    back.onclick = () => { SFX.pop(); cur.page = 0; render(stage); };
    head.append(back, el('h2', null, '🎮 Kahaani Khel'));
    stage.append(head);

    const say = el('div', 'g-tip', 'Kahaani ke hisaab se tap karo! 👆');
    stage.append(say);

    const chips = el('div', 'kchips');
    st.khet.items.forEach((it, i) => {
      chips.append(el('span', 'kchip' + (i === 0 ? ' on' : ''), it.l));
    });
    stage.append(chips);

    const grid = el('div', 'khet-grid');
    items.forEach((it, i) => {
      const c = el('button', 'kcard', '<span>' + it.e + '</span>' + it.l);
      c.onclick = function (e) {
        const orig = st.khet.items[nextIdx];
        if (it.e === orig.e && it.l === orig.l) {
          SFX.ding();
          FX.burst(e.clientX, e.clientY, 12);
          c.classList.add('done');
          nextIdx++;
          const chip = chips.children[nextIdx - 1];
          if (chip) chip.classList.add('on');
          const nextChip = chips.children[nextIdx];
          if (nextChip) nextChip.classList.add('on');
          if (nextIdx >= st.khet.items.length) {
            setTimeout(() => {
              if (!grid.isConnected) return;
              App.win({
                title: 'Kahaani khatam! 📖',
                sub: st.khet.win,
                sticker: st.id,
                doneId: 'story-' + st.id,
                stars: 3,
                say: 'Shabaash Laddu! Aap ne kahaani poora khel liya! ' + st.khet.win
              });
            }, 500);
          } else {
            Speech.say('Sahi! Ab agla — ' + st.khet.items[nextIdx].l, { stop: false });
          }
        } else {
          SFX.boing();
          c.classList.add('shake');
          setTimeout(() => c.classList.remove('shake'), 500);
          Speech.say('Thoda socho... kahaani mein pehle kya hua tha?', { stop: false });
        }
      };
      grid.append(c);
    });
    stage.append(grid);
    Speech.say(st.khet.say);
  }
})();
