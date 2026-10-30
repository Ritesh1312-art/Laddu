/* =========================================================
   Photo Khel (2026-10-30) — asli parivaar photos ke khel:
   🧩 फोटो पहेली (3x3 tukde jodo) • 🫣 कौन छुपा है?
   (परिवार zone me dikhte hain)
   ========================================================= */
(function () {
  function shuffled(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }
  function member() {
    const F = Characters.FAMILY;
    return F[Math.floor(Math.random() * F.length)];
  }

  /* ---------- 🧩 फोटो पहेली ---------- */
  App.games.puzzle = {
    zone: 'family', name: 'फोटो पहेली', emoji: '🧩',
    render(body) {
      const m = member();
      let order = shuffled([0, 1, 2, 3, 4, 5, 6, 7, 8]);
      if (order.every((v, i) => v === i)) order = [1, 0, 2, 3, 4, 5, 6, 7, 8];
      let sel = -1, swaps = 0, done = false;
      body.innerHTML = '';
      body.append(el('div', 'ln-ask', '🧩 ' + m.name + ' की फोटो के tukde उलट-पुलट हैं! दो tukde छूकर बदलो और फोटो पूरी करो!'));
      Speech.say(m.name + ' की फोटो बिखर गई है! tukde जोड़कर पूरी करो!');

      const grid = el('div');
      grid.style.cssText = 'display:grid;grid-template-columns:repeat(3,1fr);gap:4px;max-width:340px;margin:10px auto;position:relative';
      body.append(grid);
      const peek = el('div');
      peek.style.cssText = 'display:none;position:fixed;inset:0;background:rgba(0,0,0,.75);z-index:50;align-items:center;justify-content:center';
      peek.innerHTML = '<img src="' + m.img + '" style="max-width:82vw;max-height:82vh;border-radius:18px" onerror="this.style.display=\'none\'">';
      document.body.append(peek);

      function draw() {
        grid.innerHTML = '';
        order.forEach((tile, pos) => {
          const r = Math.floor(tile / 3), c = tile % 3;
          const d = el('button');
          d.style.cssText = 'aspect-ratio:1;border-radius:10px;border:' + (sel === pos ? '4px solid #ff7b54' : '2px solid #fff') +
            ';background-image:url(' + m.img + ');background-size:300% 300%;background-position:' + (c * 50) + '% ' + (r * 50) + '%;cursor:pointer;padding:0';
          d.setAttribute('aria-label', 'tukda ' + (pos + 1));
          d.onclick = () => {
            if (done) return;
            if (sel === -1) { sel = pos; SFX.pop(); draw(); return; }
            if (sel === pos) { sel = -1; draw(); return; }
            const t = order[sel]; order[sel] = order[pos]; order[pos] = t;
            sel = -1; swaps++; SFX.ding();
            draw();
            if (order.every((v, i) => v === i)) {
              done = true;
              const stars = swaps <= 12 ? 3 : swaps <= 20 ? 2 : 1;
              setTimeout(() => App.win({ doneId: 'game-puzzle', sticker: 'puzzle', stars: stars, title: 'फोटो पूरी! 🧩', sub: m.name + ' की फोटो ' + swaps + ' badlav me jud gayi!', say: 'कमाल! फोटो पहेली पूरी हो गई!' }), 350);
            }
          };
          grid.append(d);
        });
      }
      draw();
      const peekB = el('button', 'btn ln-go', '👀 असली फोटो झलक देखो');
      peekB.onclick = () => {
        SFX.pop();
        peek.style.display = 'flex';
        setTimeout(() => { peek.style.display = 'none'; }, 1600);
      };
      body.append(peekB);
    }
  };

  /* ---------- 🫣 कौन छुपा है? ---------- */
  App.games.dhundho = {
    zone: 'family', name: 'कौन छुपा है?', emoji: '🫣',
    render(body) {
      const m = member();
      const others = shuffled(Characters.FAMILY.filter(x => x.id !== m.id)).slice(0, 2);
      const options = shuffled([m].concat(others));
      let revealed = 0, mistakes = 0, over = false;
      const covered = [true, true, true, true, true, true, true, true, true];
      body.innerHTML = '';
      body.append(el('div', 'ln-ask', '🫣 परदे के पीछे कोई छुपा है! tukde हटाकर देखो — फिर बताओ, कौन है?'));
      Speech.say('परदे के पीछे कोई छुपा है! tukde हटाओ और पहचानो — कौन है?');

      const frame = el('div');
      frame.style.cssText = 'position:relative;max-width:300px;margin:10px auto;border-radius:18px;overflow:hidden;box-shadow:0 6px 18px rgba(0,0,0,.15)';
      frame.innerHTML = '<img src="' + m.img + '" alt="छुपा हुआ सदस्य" style="width:100%;display:block" onerror="this.outerHTML=\'<div style=&quot;font-size:90px;text-align:center;padding:40px&quot;>' + m.emoji + '</div>\'">';
      const cover = el('div');
      cover.style.cssText = 'position:absolute;inset:0;display:grid;grid-template-columns:repeat(3,1fr);grid-template-rows:repeat(3,1fr)';
      frame.append(cover);
      body.append(frame);
      const status = el('div', 'ln-progress', 'खुले tukde: 0/9');
      body.append(status);

      function drawCover() {
        cover.innerHTML = '';
        covered.forEach((isCovered, i) => {
          const d = el('button');
          d.style.cssText = 'border:2px solid #fff;cursor:pointer;font-size:22px;font-family:inherit;' +
            (isCovered ? 'background:linear-gradient(135deg,#8e44ad,#e84393);color:#fff' : 'background:transparent;color:transparent');
          d.textContent = isCovered ? '?' : '·';
          d.onclick = () => {
            if (over || !covered[i]) return;
            covered[i] = false; revealed++;
            SFX.pop();
            status.textContent = 'खुले tukde: ' + revealed + '/9';
            drawCover();
          };
          cover.append(d);
        });
      }
      drawCover();

      const opts = el('div', 'ln-opts');
      options.forEach(o => {
        const b = el('button', 'ln-opt txt', o.emoji + ' ' + o.name);
        b.onclick = () => {
          if (over) return;
          if (o.id === m.id) {
            over = true;
            covered.fill(false); drawCover();
            const stars = revealed <= 3 ? 3 : revealed <= 6 ? 2 : 1;
            SFX.chord();
            Speech.say('सही पहचाना! ये हैं ' + m.name + '!', { stop: false });
            setTimeout(() => App.win({ doneId: 'game-dhundho', sticker: 'dhundho', stars: mistakes > 0 && stars === 3 ? 2 : stars, title: 'पहचान लिया! 🫣', sub: m.name + ' सिर्फ़ ' + revealed + ' tukdon me पहचाने गए!', say: 'वाह! आपकी नज़र बहुत तेज़ है!' }), 700);
          } else {
            mistakes++; SFX.boing();
            Speech.say('ये वो नहीं हैं! दो tukde और खोल देती हूँ — फिर देखो!', { stop: false });
            let extra = 2;
            for (let i = 0; i < covered.length && extra > 0; i++) {
              if (covered[i]) { covered[i] = false; revealed++; extra--; }
            }
            status.textContent = 'खुले tukde: ' + revealed + '/9';
            b.style.opacity = '.35'; b.disabled = true;
            drawCover();
          }
        };
        opts.append(b);
      });
      body.append(opts);
    }
  };
})();
