/* =========================================================
   Game 5 — कला भंवरताला V2 (चित्रकारा और कला)
   V2 सुधार: जीत सिर्फ़ असली drawing पर ("तैयार" बटन तब
   खुलेगा जब सच में कुछ बना हो — खाली canvas पर नहीं)।
   Guide अब अलग परत (overlay) में है — drawing में नहीं
   जलती। Resize listener खुद साफ़ हो जाता है।
   ========================================================= */
(function () {
  const PALETTE = ['#ff5d5d', '#ffa733', '#ffd93d', '#6bcb77', '#4d96ff', '#b980f0', '#ff8fab', '#6b4f3a'];
  const STAMPS = ['🌸', '❤️', '⭐', '🌈', '🦋', '🍭', '🐞', '🌻'];
  const GUIDES = [
    '',
    '<svg viewBox="0 0 100 100" preserveAspectRatio="none"><polygon points="50,6 61,38 95,38 67,58 78,92 50,71 22,92 33,58 5,38" fill="none" stroke="rgba(90,70,20,.4)" stroke-width="1.6" stroke-dasharray="4 3"/></svg>',
    '<svg viewBox="0 0 100 100" preserveAspectRatio="none"><circle cx="50" cy="50" r="42" fill="none" stroke="rgba(90,70,20,.4)" stroke-width="1.6" stroke-dasharray="4 3"/></svg>',
    '<svg viewBox="0 0 100 100" preserveAspectRatio="none"><path d="M50 88 C20 62 8 44 8 30 C8 14 20 8 32 8 C42 8 50 16 50 24 C50 16 58 8 68 8 C80 8 92 14 92 30 C92 44 80 62 50 88Z" fill="none" stroke="rgba(90,70,20,.4)" stroke-width="1.6" stroke-dasharray="4 3"/></svg>'
  ];

  App.games.craft = {
    zone: 'craft',
    name: 'कला भंवरताला',
    emoji: '🖌️',
    render(body) {
      body.innerHTML =
        '<div class="craft-bar">' +
          '<div class="tool-group" id="swatches"></div>' +
          '<button class="btn tool" id="tCrayon" title="क्रेयॉन">🖍️</button>' +
          '<button class="btn tool" id="tRainbow" title="इंद्रधनुष ब्रश">🌈</button>' +
          '<button class="btn tool" id="tStamp" title="छापे">🌸</button>' +
          '<div class="tool-group hidden" id="stamps"></div>' +
          '<button class="btn tool" id="tBig" title="मोटा ब्रश">⚪</button>' +
          '<button class="btn tool" id="tErase" title="मिटाना">🧽</button>' +
          '<button class="btn tool" id="tUndo" title="पीछे">⏪</button>' +
          '<button class="btn tool" id="tGuide" title="आकार की मदद">📐</button>' +
          '<button class="btn tool" id="tClear" title="सब साफ़">🧹</button>' +
          '<button class="btn tool" id="tParty" title="वाह-वाह">🎉</button>' +
        '</div>' +
        '<div class="craft-wrap">' +
          '<canvas id="cv" class="craft-cv"></canvas>' +
          '<div class="guide-layer" id="guideLayer"></div>' +
        '</div>' +
        '<div class="craft-actions">' +
          '<button class="btn" id="tSave">📥 डाउनलोड करो</button>' +
          '<button class="btn btn-primary" id="tDone">✅ मेरी कला तैयार!</button>' +
          '<span class="hint" id="craftHint">उंगली से बनाओ • रंग भरो • छापे लगाओ! 🎨</span>' +
        '</div>';

      const cv = body.querySelector('#cv');
      const ctx = cv.getContext('2d');
      const guideLayer = body.querySelector('#guideLayer');
      let mode = 'crayon', color = PALETTE[0], hue = 0, size = 10, stampEmoji = STAMPS[0];
      let drawing = false, last = null;
      let strokes = 0, stampsUsed = 0;
      const colorsUsed = new Set([PALETTE[0]]);
      const undoStack = [];
      let guideCycle = 0;

      function setupCanvas() {
        if (!cv.isConnected) { window.removeEventListener('resize', setupCanvas); return; }
        const rect = cv.getBoundingClientRect();
        if (rect.width < 10) return;
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

      const sw = body.querySelector('#swatches');
      PALETTE.forEach((c, i) => {
        const s = el('span', 'swatch' + (i === 0 ? ' active' : ''));
        s.style.background = c;
        s.onclick = () => {
          color = c; colorsUsed.add(c);
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
        tStamp: () => setMode('stamp'),
        tBig: () => setMode('big'),
        tErase: () => setMode('erase'),
        tUndo: () => undo(),
        tGuide: () => {
          guideCycle = (guideCycle + 1) % GUIDES.length;
          guideLayer.innerHTML = GUIDES[guideCycle];
          SFX.tick();
          if (guideCycle > 0) Speech.say('आकार आ गया! धीरे-धीरे इसके ऊपर रंग भरो!', { stop: false });
        },
        tClear: () => {
          snapshot();
          SFX.whoosh();
          ctx.clearRect(0, 0, cv.clientWidth, cv.clientHeight);
          strokes = 0; stampsUsed = 0;
          Speech.say('सब साफ़! नई कला शुरू करो।', { stop: false });
        },
        tParty: () => { SFX.chord(); FX.rain(); Speech.say('वाह वाह! आपकी कला कमाल की है!', { stop: false }); }
      };
      Object.keys(buttons).forEach(id => { body.querySelector('#' + id).onclick = buttons[id]; });

      function setMode(m) {
        mode = m;
        ['tCrayon', 'tRainbow', 'tStamp', 'tBig', 'tErase'].forEach(id =>
          body.querySelector('#' + id).classList.toggle('active', { tCrayon: 'crayon', tRainbow: 'rainbow', tStamp: 'stamp', tBig: 'big', tErase: 'erase' }[id] === m));
        stampsEl.classList.toggle('hidden', m !== 'stamp');
      }

      function snapshot() {
        if (undoStack.length > 12) undoStack.shift();
        try { undoStack.push(ctx.getImageData(0, 0, cv.width, cv.height)); } catch (e) {}
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
        snapshot();
        last = pt(e);
        if (mode === 'stamp') {
          ctx.font = '46px serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(stampEmoji, last.x, last.y);
          stampsUsed++;
          SFX.pop();
          return;
        }
        drawing = true;
        strokes++;
        if (mode === 'rainbow') colorsUsed.add('rainbow');
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

      body.querySelector('#tSave').onclick = function () {
        SFX.ding();
        const a = document.createElement('a');
        a.download = 'laddu-ki-kala.png';
        a.href = cv.toDataURL('image/png');
        a.click();
        Speech.say('आपकी कला डाउनलोड हो गई! दादी को दिखा देना!', { stop: false });
      };

      body.querySelector('#tDone').onclick = function () {
        const score = strokes + stampsUsed * 2 + colorsUsed.size * 2;
        if (strokes < 3 && stampsUsed < 2) {
          SFX.boing();
          body.querySelector('#craftHint').textContent = 'अभी थोड़ा और बनाओ — कुछ रेखाएँ खींचो, रंग भरो, छापे लगाओ! 🖍️';
          Speech.say('अभी थोड़ा और बनाओ! कुछ रंग भरो, कुछ फूल-सितारे लगाओ!');
          return;
        }
        const stars = score >= 16 ? 3 : (score >= 8 ? 2 : 1);
        App.win({
          title: 'कला तैयार! 🖌️',
          sub: score >= 16 ? 'रंग, रेखाएँ और छापे — पूरी मेहनत वाली कलाकारी! असली कला उस्ताद!' : 'आपने अपने हाथों से कुछ ख़ास बनाया!',
          sticker: 'craft',
          doneId: 'game-craft',
          stars: stars,
          againName: 'game',
          say: 'आपकी कला तैयार हो गई!'
        });
      };

      Speech.say('यहाँ उंगली से बनाओ! रंग चुनो, रेखाएँ खींचो, छापे लगाओ। जब सच में कुछ बन जाए, तब "मेरी कला तैयार" दबाना!');
    }
  };
})();
