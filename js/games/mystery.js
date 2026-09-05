/* =========================================================
   Game 4 — Dadi Ki Chabi (Mystery / Horror / Fantasy zone)
   Teen kamre, doze boxes, ek chabi. Clues + soch se dhundho.
   Skill: logic, reasoning, memory, persistence.
   ========================================================= */
(function () {
  const ROOMS = [
    { name: 'Rasoi', e: '🍳', boxes: ['🧺', '🍱', '🪴', '📚'] },
    { name: 'Kamra', e: '🛏️', boxes: ['🧸', '📦', '🪞', '👟'] },
    { name: 'Chaupal', e: '🌳', boxes: ['🪑', '📰', '🧶', '🏺'] }
  ];
  const JOKE_ITEMS = ['🍪', '🧦', '🥕', '🍬', '🥒', '🧢', '🪀', '🥔', '🐚', '🎪', '🥥', '🧲'];

  App.games.mystery = {
    zone: 'mystery',
    name: 'Dadi Ki Chabi',
    emoji: '🔍',
    render(body) {
      const keyRoom = Math.floor(Math.random() * ROOMS.length);
      const keyBox = Math.floor(Math.random() * 4);
      let curRoom = 0, found = false, hintUsed = false, opened = {};

      body.innerHTML =
        '<div class="g-intro"><span style="font-size:52px">🗝️</span>' +
          '<p>Dadi ki <b>laal keychain wali chabi</b> kahi gayab hai!<br>' +
          'Teen kamre mein doze boxes hain. Chabi ek hi box mein hai. Clues se socho! 🕵️</p>' +
        '</div>' +
        '<div class="room-tabs" id="tabs"></div>' +
        '<div class="boxes" id="boxes"></div>' +
        '<div class="hint-bar">' +
          '<button class="btn" id="hintBtn">🔮 Bhootu ka Hint</button>' +
          '<span class="hint" id="hintTxt">Hint ek baar ka hai — dhyan se!</span>' +
        '</div>';

      const tabs = body.querySelector('#tabs');
      const boxesEl = body.querySelector('#boxes');
      const hintBtn = body.querySelector('#hintBtn');
      const hintTxt = body.querySelector('#hintTxt');

      function drawTabs() {
        tabs.innerHTML = '';
        ROOMS.forEach((r, i) => {
          const t = el('button', 'btn rtab' + (i === curRoom ? ' on' : ''), r.e + ' ' + r.name);
          t.onclick = () => {
            if (i === curRoom || found) return;
            curRoom = i;
            SFX.step();
            Speech.say(r.name + ' mein gaye.', { stop: false });
            drawTabs(); drawBoxes();
          };
          tabs.append(t);
        });
      }

      function drawBoxes() {
        boxesEl.innerHTML = '';
        const room = ROOMS[curRoom];
        room.boxes.forEach((b, i) => {
          const key = curRoom + '-' + i;
          const box = el('button', 'boxbox tap', b);
          if (opened[key]) {
            box.classList.add('open');
            box.innerHTML = b + '<span>' + (opened[key] === 'key' ? '🗝️ MILI!' : '😅 ' + opened[key] + ' mila') + '</span>';
            box.disabled = true;
          }
          box.onclick = function (e) {
            if (found || opened[key]) return;
            if (curRoom === keyRoom && i === keyBox) {
              found = true;
              SFX.ching();
              setTimeout(() => SFX.jingle(), 300);
              FX.burst(e.clientX, e.clientY, 30);
              const r = box.getBoundingClientRect();
              const k = el('div', 'key-pop', '🗝️');
              k.style.left = (r.left + r.width / 2 - 28) + 'px';
              k.style.top = (r.top - 30) + 'px';
              document.body.append(k);
              setTimeout(() => k.remove(), 1200);
              Speech.say('Ching! Ching! Chabi mil gayi! Dadi bohot khush hui!', { stop: false });
              setTimeout(() => {
                if (!boxesEl.isConnected) return;
                App.win({
                title: 'Chabi mil gayi! 🗝️',
                sub: 'Aap ne clues follow kiye — asli Rahasya Todda!',
                sticker: 'mystery',
                doneId: 'game-mystery',
                stars: 3,
                say: 'Waah! Aap toh asli detective ho. Dadi khush hui!'
              });
                }, 1100);
            } else {
              opened[key] = JOKE_ITEMS[(curRoom * 4 + i) % JOKE_ITEMS.length];
              SFX.whisper();
              SFX.boing();
              drawBoxes();
              if (curRoom === keyRoom) {
                SFX.ching();
                hintTxt.textContent = 'Dheemi si "ching..." sunai di... ye kamra sahi lagta hai! 👂';
                Speech.say('Dheemi ching awaaz suni... shayad chabi is hi kamre mein hai!', { stop: false });
              } else {
                hintTxt.textContent = 'Yahan kuch nahi... doosra kamra try karo? 🚪';
              }
            }
          };
          boxesEl.append(box);
        });
      }

      hintBtn.onclick = function () {
        if (hintUsed || found) return;
        hintUsed = true;
        hintBtn.disabled = true;
        SFX.whisper();
        const r = ROOMS[keyRoom];
        hintTxt.innerHTML = '👻 Bhootu ne ishara kiya: <b>' + r.e + ' ' + r.name + '</b>!';
        Speech.say('Bhootu ne ishara kiya — chabi ' + r.name + ' mein hai!', { stop: false });
        curRoom = keyRoom;
        drawTabs();
        drawBoxes();
      };

      drawTabs();
      drawBoxes();
      Speech.say('Dadi ki chabi gayab! Teen kamre check karo. Box kholo aur clues ka dhyan rakho. Ching awaaz... mat bhoolna!');
    }
  };
})();
