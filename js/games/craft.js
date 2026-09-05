/* =========================================================
   Game 5 — Kala Bhanvartala (DIY / Craft / Drawing zone)
   Ungli se banao: crayon, rainbow brush, chitkare (stamps),
   guide shapes, undo, aur apni kala download karo.
   Skill: creativity, fine motor, colour mixing.
   ========================================================= */
(function () {
  const PALETTE = ['#ff5d5d', '#ffa733', '#ffd93d', '#6bcb77', '#4d96ff', '#b980f0', '#ff8fab', '#6b4f3a'];
  const STAMPS = ['🌸', '❤️', '⭐', '🌈', '🦋', '🍭', '🐞', '🌻'];

  App.games.craft = {
    zone: 'craft',
    name: 'Kala Bhanvartala',
    emoji: '🖌️',
    render(body) {
      body.innerHTML =
        '<div class="craft-bar">' +
          '<div class="tool-group" id="swatches"></div>' +
          '<button class="btn tool" id="tCrayon" title="Crayon">🖍️</button>' +
          '<button class="btn tool" id="tRainbow" title="Rainbow brush">🌈</button>' +
          '<button class="btn tool" id="tStamp" title="Chitkare (stamps)">🌸</button>' +
          '<div class="tool-group hidden" id="stamps"></div>' +
          '<button class="btn tool" id="tBig" title="Mota brush">⚪</button>' +
          '<button class="btn tool" id="tErase" title="Safai">🧽</button>' +
          '<button class="btn tool" id="tUndo" title="Pichhla">⏪</button>' +
          '<button class="btn tool" id="tGuide" title="Guide shape">📐</button>' +
          '<button class="btn tool" id="tClear" title="Sab saaf">🧹</button>' +
          '<button class="btn tool" id="tParty" title="Party">🎉</button>' +
        '</div>' +
        '<canvas id="cv" class="craft-cv"></canvas>' +
        '<div class="craft-actions">' +
          '<button class="btn btn-primary" id="tSave">📥 Meri Kala Download Karo</button>' +
          '<span class="hint">Ungli se chhalo • chitkare lagao • rang do! 🎨</span>' +
        '</div>';

      const cv = body.querySelector('#cv');
      const ctx = cv.getContext('2d');
      let mode = 'crayon', color = PALETTE[0], hue = 0, size = 10, stampEmoji = STAMPS[0];
      let drawing = false, last = null, stroked = false;
      const undoStack = [];
      let guideCycle = 0;

      function setupCanvas() {
        const rect = cv.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;
        let prev = null;
        if (cv.width > 0) {
          prev = document.createElement('canvas');
          prev.width = cv.width; prev.height = cv.height;
          prev.getContext('2d').drawImage(cv, 0, 0);
        }
        cv.width = Math.max(200, rect.width * dpr);
        cv.height = Math.max(200, rect.height * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        if (prev) ctx.drawImage(prev, 0, 0, prev.width, prev.height, 0, 0, rect.width, rect.height);
      }
      setupCanvas();
      window.addEventListener('resize', setupCanvas);

      /* --- tools --- */
      const sw = body.querySelector('#swatches');
      PALETTE.forEach((c, i) => {
        const s = el('span', 'swatch' + (i === 0 ? ' active' : ''));
        s.style.background = c;
        s.onclick = () => {
          color = c;
          setMode('crayon');
          sw.querySelectorAll('.swatch').forEach(x => x.classList.toggle('active', x === s));
          SFX.pop();
        };
        sw.append(s);
      });
      const stampsEl = body.querySelector('#stamps');
      STAMPS.forEach((em, i) => {
        const s = el('button', 'tool' + (i === 0 ? ' active' : ''), em);
        s.onclick = () => {
          stampEmoji = em;
          setMode('stamp');
          stampsEl.querySelectorAll('.tool').forEach(x => x.classList.toggle('active', x === s));
          SFX.pop();
        };
        stampsEl.append(s);
      });

      const buttons = {
        tCrayon: () => setMode('crayon'),
        tRainbow: () => setMode('rainbow'),
        tStamp: () => { setMode('stamp'); stampsEl.classList.toggle('hidden', false); },
        tBig: () => setMode('big'),
        tErase: () => setMode('erase'),
        tUndo: () => undo(),
        tGuide: () => { guideCycle = (guideCycle + 1) % 4; SFX.tick(); drawGuide(guideCycle); },
        tClear: () => { SFX.whoosh(); ctx.clearRect(0, 0, cv.clientWidth, cv.clientHeight); Speech.say('Sab saaf! Nayi kala shuru.', { stop: false }); },
        tParty: () => { SFX.chord(); FX.rain(); Speech.say('Waah waah! Aapki kala kamaal ki hai!', { stop: false }); }
      };
      Object.keys(buttons).forEach(id => {
        body.querySelector('#' + id).onclick = buttons[id];
      });

      function setMode(m) {
        mode = m;
        ['tCrayon', 'tRainbow', 'tStamp', 'tBig', 'tErase'].forEach(id =>
          body.querySelector('#' + id).classList.toggle('active', { tCrayon: 'crayon', tRainbow: 'rainbow', tStamp: 'stamp', tBig: 'big', tErase: 'erase' }[id] === m));
        stampsEl.classList.toggle('hidden', m !== 'stamp');
      }

      function snapshot() {
        if (undoStack.length > 12) undoStack.shift();
        undoStack.push(ctx.getImageData(0, 0, cv.width, cv.height));
      }
      function undo() {
        if (!undoStack.length) { SFX.boing(); return; }
        SFX.pop();
        ctx.putImageData(undoStack.pop(), 0, 0);
      }

      function pt(e) {
        const r = cv.getBoundingClientRect();
        return { x: e.clientX - r.left, y: e.clientY - r.top };
      }
      function currentColor() {
        if (mode === 'rainbow') { hue = (hue + 4) % 360; return 'hsl(' + hue + ' 90% 55%)'; }
        if (mode === 'erase') return '#ffffff';
        return color;
      }
      function stroke(a, b) {
        ctx.strokeStyle = currentColor();
        ctx.lineWidth = mode === 'erase' ? 48 : (mode === 'big' ? 38 : size);
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }

      cv.addEventListener('pointerdown', function (e) {
        e.preventDefault();
        cv.setPointerCapture(e.pointerId);
        drawing = true; stroked = true;
        last = pt(e);
        snapshot();
        if (mode === 'stamp') {
          ctx.font = '46px serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(stampEmoji, last.x, last.y);
          SFX.pop();
          drawing = false;
          return;
        }
        SFX.tap();
        stroke(last, { x: last.x + 0.1, y: last.y + 0.1 });
      });
      cv.addEventListener('pointermove', function (e) {
        if (!drawing) return;
        const p = pt(e);
        stroke(last, p);
        last = p;
      });
      ['pointerup', 'pointercancel', 'pointerleave'].forEach(ev =>
        cv.addEventListener(ev, function () { drawing = false; }));

      /* --- guide shapes --- */
      function drawGuide(type) {
        const w = cv.clientWidth, h = cv.clientHeight;
        const cx = w / 2, cy = h / 2, R = Math.min(w, h) * 0.28;
        ctx.save();
        ctx.setLineDash([12, 10]);
        ctx.strokeStyle = 'rgba(90,70,20,.3)';
        ctx.lineWidth = 3;
        ctx.beginPath();
        if (type === 1) { /* sitara */
          for (let i = 0; i < 10; i++) {
            const r = i % 2 === 0 ? R : R * 0.45;
            const a = -Math.PI / 2 + i * Math.PI / 5;
            const x = cx + Math.cos(a) * r, y = cy + Math.sin(a) * r;
            if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
          }
          ctx.closePath();
        } else if (type === 2) { /* chakra */
          ctx.arc(cx, cy, R, 0, Math.PI * 2);
        } else if (type === 3) { /* dil */
          const s = R / 24;
          ctx.moveTo(cx, cy + 20 * s);
          ctx.bezierCurveTo(cx - 30 * s, cy - 5 * s, cx - 14 * s, cy - 30 * s, cx, cy - 12 * s);
          ctx.bezierCurveTo(cx + 14 * s, cy - 30 * s, cx + 30 * s, cy - 5 * s, cx, cy + 20 * s);
        }
        ctx.stroke();
        ctx.restore();
        if (type > 0) Speech.say('Ye shape dhire-dhire trace karo! 🖍️', { stop: false });
      }

      body.querySelector('#tSave').onclick = function () {
        SFX.ding();
        const a = document.createElement('a');
        a.download = 'laddu-ki-kala.png';
        a.href = cv.toDataURL('image/png');
        a.click();
        if (!State.done('game-craft')) {
          Speech.say('Aapki kala download ho gayi! Dadi ko dikha dena!', { stop: false });
          App.win({
            title: 'Kala taiyaar! 🖌️',
            sub: 'Aap ne apne haathon se kuch khaas banaya — asli Kala Ustad!',
            sticker: 'craft',
            doneId: 'game-craft',
            stars: 3,
            againName: 'game',
            say: 'Aap ki kala download ho gayi!'
          });
        } else {
          FX.rain();
          Speech.say('Dobara download ho gaya! Bahut achhi bana hai!', { stop: false });
        }
      };

      Speech.say('Yahan ungli se banao! Rang choose karo, chhalo, chitkare lagao. Phir apni kala download karo!');
    }
  };
})();
