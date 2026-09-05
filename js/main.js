/* =========================================================
   Laddu Ka Khel Ghar — Main: home, zones, album, parents
   ========================================================= */
(function () {
  const ZONES = [
    { id: 'comedy',  emoji: '😜', name: 'Comedy & Prank', sub: 'Hasi aur harkat', bg: 'linear-gradient(135deg,#ffd200,#ff7e5f)', tag: 'Dhyan • Observation' },
    { id: 'family',  emoji: '🎥', name: 'Family & Vlog', sub: 'Parivaar ki yaadein', bg: 'linear-gradient(135deg,#a18cd1,#fbc2eb)', tag: 'Plan • Baat-cheet' },
    { id: 'cartoon', emoji: '📺', name: 'Cartoon Duniya', sub: 'Rang, aakaar, ginti', bg: 'linear-gradient(135deg,#89f7fe,#66a6ff)', tag: 'Rang • Ginti' },
    { id: 'mystery', emoji: '🕵️', name: 'Mystery & Rahasya', sub: 'Clues aur soch', bg: 'linear-gradient(135deg,#5f2c82,#49a09d)', tag: 'Logic • Soch' },
    { id: 'craft',   emoji: '🎨', name: 'Chitkara & Kala', sub: 'Banao, rang do', bg: 'linear-gradient(135deg,#ff9a9e,#fecfef)', tag: 'Creativity • Hath' },
    { id: 'music',   emoji: '🎵', name: 'Music & Dance', sub: 'Gaana aur naach', bg: 'linear-gradient(135deg,#f6d365,#fda085)', tag: 'Rhythm • Yaad' }
  ];

  function zoneDone(zid) {
    const ids = Object.keys(App.games).filter(g => App.games[g].zone === zid).map(g => 'game-' + g);
    const st = STORIES.find(s => s.zone === zid);
    if (st) ids.push('story-' + st.id);
    return ids.length > 0 && ids.every(id => State.done(id));
  }

  /* ---------------- HOME ---------------- */
  App.screens.home = function (stage) {
    stage.innerHTML = '';
    const hello = el('div', 'home-hello pop-in');
    hello.innerHTML =
      '<span class="hello-emoji">🌸</span>' +
      '<h1>Namaste <span>Laddu</span>!</h1>' +
      '<p>Aaj kya khelenge? Har game mein awaaz, hasi aur seekh! 🎈</p>';
    stage.append(hello);

    const grid = el('div', 'zone-grid');
    ZONES.forEach((z, i) => {
      const c = el('button', 'zone-card tap');
      c.style.background = z.bg;
      c.style.animationDelay = (i * 0.05) + 's';
      c.classList.add('pop-in');
      c.innerHTML =
        '<span class="z-emoji">' + z.emoji + '</span>' +
        '<div class="z-name">' + z.name + '</div>' +
        '<div class="z-sub">' + z.sub + '</div>' +
        '<span class="z-skill">' + z.tag + '</span>' +
        (zoneDone(z.id) ? '<span class="z-done">⭐</span>' : '');
      c.onclick = () => { SFX.ding(); App.nav('zone', z.id); };
      grid.append(c);
    });
    stage.append(grid);

    const extra = el('div', 'extra-row');
    const got = Object.keys(State.data.stickers).length;
    const f = el('button', 'btn card-mini', '👨‍👩‍👧‍👦 Mera Parivaar <span>Hyper-realistic Photos</span>');
    f.onclick = () => { SFX.pop(); App.nav('family'); };
    const an = el('button', 'btn card-mini', '🐾 Janwar Safari <span>8+ Animals & Boli</span>');
    an.onclick = () => { SFX.pop(); App.nav('animals'); };
    const a = el('button', 'btn card-mini', '📚 Sticker Album <span>' + got + '/' + STICKERS.length + '</span>');
    a.onclick = () => { SFX.pop(); App.nav('album'); };
    const b = el('button', 'btn card-mini', '👩‍🏫 Papa-Ma Ke Liye <span>NEP 2020 • NCF • 21st Century</span>');
    b.onclick = () => { SFX.pop(); App.nav('parents'); };
    extra.append(f, an, a, b);
    stage.append(extra);
  };

  /* ---------------- ZONE ---------------- */
  App.screens.zone = function (stage, zid) {
    const z = ZONES.find(x => x.id === zid);
    if (!z) { App.nav('home'); return; }
    const story = STORIES.find(s => s.zone === zid);
    const games = Object.keys(App.games).filter(g => App.games[g].zone === zid);

    stage.innerHTML = '';
    const back = el('button', 'btn btn-back', '← Ghar');
    back.onclick = () => { SFX.pop(); App.nav('home'); };
    stage.append(back);

    const hero = el('div', 'zone-hero pop-in');
    hero.style.background = z.bg;
    hero.innerHTML =
      '<span class="zh-emoji">' + z.emoji + '</span>' +
      '<h2>' + z.name + '</h2>' +
      '<p>' + z.sub + '</p>' +
      '<span class="z-skill">' + z.tag + '</span>';
    stage.append(hero);

    const list = el('div', 'zone-list');
    games.forEach(gid => {
      const g = App.games[gid];
      const b = el('button', 'btn game-btn',
        '<span class="gb-e">' + g.emoji + '</span><span>' + g.name + '<i>Khelo! 🎮</i></span>' +
        (State.done('game-' + gid) ? '<span class="mini-star">⭐</span>' : ''));
      b.onclick = () => { SFX.ding(); App.nav('game', gid); };
      list.append(b);
    });
    if (story) {
      const b = el('button', 'btn game-btn story-btn',
        '<span class="gb-e">' + story.emoji + '</span><span>' + story.title + '<i>Kahaani suno 📖 (awaaz mein)</i></span>' +
        (State.done('story-' + story.id) ? '<span class="mini-star">⭐</span>' : ''));
      b.onclick = () => { SFX.ding(); App.nav('story', story.id); };
      list.append(b);
    }
    stage.append(list);
  };

  /* ---------------- GAME wrapper ---------------- */
  App.screens.game = function (stage, gid) {
    const g = App.games[gid];
    if (!g) { App.nav('home'); return; }
    SFX.stopBeat();
    stage.innerHTML = '';
    const back = el('button', 'btn btn-back', '← Ghar');
    back.onclick = () => { SFX.pop(); App.nav('zone', g.zone); };
    const head = el('div', 'game-head');
    head.append(back, el('div', 'game-title', g.emoji + ' ' + g.name));
    const body = el('div', 'game-body');
    stage.append(head, body);
    g.render(body);
  };

  /* ---------------- ALBUM ---------------- */
  App.screens.album = function (stage) {
    stage.innerHTML = '';
    const back = el('button', 'btn btn-back', '← Ghar');
    back.onclick = () => { SFX.pop(); App.nav('home'); };
    stage.append(back);
    stage.append(el('div', 'album-head', '📚 Meri Sticker Album'));
    const got = Object.keys(State.data.stickers).length;
    stage.append(el('div', 'hint', 'Games jeeto aur kahaaniyan karo — stickers yahan aayenge! (' + got + '/' + STICKERS.length + ' khul chuke)'));
    const grid = el('div', 'album-grid');
    STICKERS.forEach(s => {
      const have = !!State.data.stickers[s.id];
      const d = el('div', 'sticker' + (have ? '' : ' locked'));
      d.innerHTML =
        '<span class="st-emoji">' + (have ? s.emoji : '❓') + '</span>' +
        '<span class="st-name">' + (have ? s.name : 'Chhupa Sticker') + '</span>' +
        '<span class="st-skill">' + (have ? s.skill : s.zone + ' mein khelo!') + '</span>';
      d.onclick = () => {
        if (have) {
          SFX.jingle();
          const r = d.getBoundingClientRect();
          FX.burst(r.left + r.width / 2, r.top + r.height / 2, 14);
        } else SFX.boing();
      };
      grid.append(d);
    });
    stage.append(grid);
  };

  /* ---------------- PARENTS CORNER ---------------- */
  App.screens.parents = function (stage) {
    stage.innerHTML = '';
    const back = el('button', 'btn btn-back', '← Ghar');
    back.onclick = () => { SFX.pop(); App.nav('home'); };
    stage.append(back);

    const head = el('div', 'album-head', '👩‍🏫 Papa-Ma Ke Liye');
    stage.append(head);
    stage.append(el('div', 'hint', 'Yeh app NEP 2020 (Foundational Stage 3–8), NCF aur 21st Century Skills ke hisaab se banayi gayi hai — poori tarah game-based, quiz nahi. Har cheez awaaz ke saath hai, taaki bachcha khelta-khelta seekhe.'));

    const c1 = el('div', 'pcard');
    c1.innerHTML =
      '<h3>🏫 NEP 2020 alignment</h3><ul>' +
      '<li><b>Play-based, activity-based, experiential learning</b> — foundational stage (3–8) ke liye khel hi peethi hai.</li>' +
      '<li><b>FLN (Foundational Literacy & Numeracy)</b> — rang/aakaar/ginti ka "Rang Pataka", kahaaniyan se bhasha.</li>' +
      '<li><b>Assessment without exam</b> — stars aur stickers formative motivation hain, koi mark nahi.</li>' +
      '<li><b>Multilingual</b> — pehle se Hindi, saath mein aasan English labels.</li>' +
      '<li><b>Holistic + SEL</b> — kala, music, movement, empathy (prank wali kahaani mein "dard nahi, hasi").</li>' +
      '</ul>';
    const c2 = el('div', 'pcard');
    c2.innerHTML =
      '<h3>📚 NCF alignment</h3><ul>' +
      '<li><b>"Bachcha khushi se seekhta hai"</b> — har activity game hai, instructions awaaz mein aati hain.</li>' +
      '<li><b>Gyan ka sandarbh</b> — ghar, parivaar, birthday, tyohaar, kahaniyan.</li>' +
      '<li><b>Art + movement + music integration</b> — drawing, dance pads, piano melody.</li>' +
      '</ul>';
    const c3 = el('div', 'pcard');
    c3.innerHTML =
      '<h3>🚀 21st Century Skills (4Cs + zyada)</h3>' +
      '<table class="ptable">' +
      '<tr><td>👻 Chupke Chupke</td><td>Critical thinking — observation, spatial search</td></tr>' +
      '<tr><td>🎥 Vlog Studio</td><td>Communication + Collaboration — planning, sequencing</td></tr>' +
      '<tr><td>🌈 Rang Pataka</td><td>Attention + cognitive flexibility — rang, aakaar, ginti</td></tr>' +
      '<tr><td>🔍 Dadi Ki Chabi</td><td>Reasoning — clue se sochna, memory</td></tr>' +
      '<tr><td>🖌️ Kala Bhanvartala</td><td>Creativity + fine motor skills</td></tr>' +
      '<tr><td>🎵 Sitar Studio</td><td>Pattern memory, pitch, rhythm</td></tr>' +
      '<tr><td>💃 Nacho Naacho</td><td>Memory, coordination, rhythm</td></tr>' +
      '<tr><td>📖 Kahaani Wadi</td><td>Bhasha, empathy (SEL), sequencing</td></tr>' +
      '</table>';
    const c4 = el('div', 'pcard');
    c4.innerHTML =
      '<h3>🛡️ Safety & Suggestive Use</h3><ul>' +
      '<li>No ads, no chat, no login — sirf khel.</li>' +
      '<li>Koi audio file nahi — saari awaazein browser mein live banti hain; kahaaniyan Hindi voice (TTS) se padhi jaati hain.</li>' +
      '<li>Progress phone/tablet mein hi save hota hai (localStorage).</li>' +
      '</ul>' +
      '<div class="parents-note">💡 Suggestive: ek baar mein 20–25 minute, phir outdoor khel. Kahaani khatam hone ke baad poora parivaar saath mein discuss kare — yehi NEP 2020 ka collaborative learning hai!</div>';

    stage.append(c1, c2, c3, c4);
  };
})();
