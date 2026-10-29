/* =========================================================
   Game 4 — दादी की चाबी V2 (रहस्य)
   V2 डिज़ाइन: Hint अब पूरा कमरा नहीं बताता — सिर्फ़ इतना
   इशारा देता है कि चाबी किस तरह की चीज़ में है। कमरे का
   गरम–ठंडा संकेत, हर बार नए मज़ाक-आइटम, और सितारे इस पर
   कि कितने कम डिब्बे खोले।
   ========================================================= */
(function () {
  const ROOMS = [
    { name: 'रसोई', e: '🍳', boxes: [
      { e: '🧺', n: 'टोकरी', tag: 'बरतन जैसी चीज़' },
      { e: '🍱', n: 'टिफ़िन', tag: 'खाने की चीज़' },
      { e: '🪴', n: 'गमला', tag: 'पौधे वाली चीज़' },
      { e: '📚', n: 'किताबें', tag: 'किताब' }
    ]},
    { name: 'कमरा', e: '🛏️', boxes: [
      { e: '🧸', n: 'टेडी', tag: 'खिलौना' },
      { e: '📦', n: 'डिब्बा', tag: 'सामान का डिब्बा' },
      { e: '🪞', n: 'शीशा', tag: 'सजावट की चीज़' },
      { e: '👟', n: 'जूते', tag: 'कपड़े वाली चीज़' }
    ]},
    { name: 'चौपाल', e: '🌳', boxes: [
      { e: '🪑', n: 'कुर्सी', tag: 'फ़र्नीचर' },
      { e: '📰', n: 'अख़बार', tag: 'किताब' },
      { e: '🧶', n: 'ऊन का गोला', tag: 'कपड़े वाली चीज़' },
      { e: '🏺', n: 'मटका', tag: 'बरतन जैसी चीज़' }
    ]}
  ];
  const JOKE_ITEMS = ['🍪 बिस्कुट', '🧦 मोज़ा', '🥕 गाजर', '🍬 टॉफ़ी', '🥒 खीरा', '🧢 टोपी', '🪀 यो-यो', '🥔 आलू', '🐚 सीप', '🥥 नारियल', '🧲 चुंबक', '🍌 केला', '🧀 पनीर', '🎈 गुब्बारा', '🧻 रुमाल', '🍩 डोनट'];

  App.games.mystery = {
    zone: 'mystery',
    name: 'दादी की चाबी',
    emoji: '🔍',
    render(body) {
      const keyRoom = Math.floor(Math.random() * ROOMS.length);
      const keyBox = Math.floor(Math.random() * 4);
      let curRoom = 0, found = false, hintUsed = false, openedCount = 0;
      const opened = {};

      body.innerHTML =
        '<div class="g-intro"><span style="font-size:52px">🗝️</span>' +
          '<p>दादी की <b>लाल डोरी वाली चाबी</b> कहीं गुम है!<br>' +
          'तीन कमरों में बारह डिब्बे हैं — चाबी एक ही में है। कम डिब्बे खोलोगे, ज़्यादा सितारे पाओगे!</p>' +
        '</div>' +
        '<div class="room-tabs" id="tabs"></div>' +
        '<div class="boxes" id="boxes"></div>' +
        '<div class="hint-bar">' +
          '<button class="btn" id="hintBtn">🔮 भूतू का इशारा</button>' +
          '<span class="hint" id="hintTxt">इशारा सिर्फ़ एक बार मिलेगा — सोचकर लेना!</span>' +
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
            Speech.say(r.name + ' में गए।', { stop: false });
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
          const box = el('button', 'boxbox tap', b.e);
          if (opened[key]) {
            box.classList.add('open');
            box.innerHTML = b.e + '<span>' + (opened[key] === 'key' ? '🗝️ मिली!' : '😅 ' + opened[key]) + '</span>';
            box.disabled = true;
          }
          box.onclick = function (e) {
            if (found || opened[key]) return;
            if (curRoom === keyRoom && i === keyBox) {
              found = true;
              opened[key] = 'key';
              SFX.ching();
              setTimeout(() => SFX.jingle(), 300);
              FX.burst(e.clientX, e.clientY, 30);
              const r = box.getBoundingClientRect();
              const k = el('div', 'key-pop', '🗝️');
              k.style.left = (r.left + r.width / 2 - 28) + 'px';
              k.style.top = (r.top - 30) + 'px';
              document.body.append(k);
              setTimeout(() => k.remove(), 1200);
              Speech.say('छिन! छिन! चाबी मिल गई! दादी बहुत खुश हुईं!', { stop: false });
              const stars = openedCount <= 2 ? 3 : (openedCount <= 5 ? 2 : 1);
              setTimeout(() => {
                if (!boxesEl.isConnected) return;
                App.win({
                  title: 'चाबी मिल गई! 🗝️',
                  sub: openedCount <= 2 ? 'सिर्फ़ ' + (openedCount + 1) + ' डिब्बों में चाबी मिली — असली रहस्य तोड़!' :
                       openedCount <= 5 ? 'बढ़िया खोज! थोड़ा और सोचोगे तो 3 सितारे पक्के!' :
                       'मिल तो गई! अगली बार इशारे और आवाज़ का ध्यान रखना।',
                  sticker: 'mystery',
                  doneId: 'game-mystery',
                  stars: stars,
                  say: 'वाह! आप तो असली जासूस हो। दादी खुश हुईं!'
                });
              }, 1100);
            } else {
              openedCount++;
              opened[key] = JOKE_ITEMS[Math.floor(Math.random() * JOKE_ITEMS.length)];
              SFX.whisper();
              SFX.boing();
              drawBoxes();
              if (curRoom === keyRoom) {
                SFX.ching();
                hintTxt.textContent = 'धीमी-सी "छिन..." सुनाई दी... चाबी इसी कमरे में कहीं है! 👂';
                Speech.say('धीमी छिन आवाज़ आई... चाबी इसी कमरे में है!', { stop: false });
              } else {
                hintTxt.textContent = 'यहाँ कुछ नहीं... यह कमरा ठंडा है, दूसरा कमरा देखो! 🚪';
                Speech.say('यहाँ चाबी नहीं है। दूसरा कमरा देखो।', { stop: false });
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
        const tag = ROOMS[keyRoom].boxes[keyBox].tag;
        hintTxt.innerHTML = '👻 भूतू का इशारा: चाबी किसी <b>' + tag + '</b> में छिपी है!';
        Speech.say('भूतू ने इशारा किया — चाबी किसी ' + tag + ' में है!', { stop: false });
      };

      drawTabs();
      drawBoxes();
      Speech.say('दादी की चाबी गुम है! तीन कमरे देखो। डिब्बे खोलो और छिन की आवाज़ का ध्यान रखो!');
    }
  };
})();
