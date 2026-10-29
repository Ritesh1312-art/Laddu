/* =========================================================
   Game 1 — छुपके छुपके प्रैंक V2 (कॉमेडी और प्रैंक)
   V2 डिज़ाइन: लॉटरी ख़त्म। अब गरम–ठंडा संकेत मिलता है,
   कभी 👀 झलक दिखती है, और जानवर दोस्त दिशा बताता है।
   ग़लत tap भी जानकारी देता है — यही असली observation है।
   ========================================================= */
(function () {
  const SPOTS = [
    { label: 'पलंग', e: '🛏️' }, { label: 'दरवाज़ा', e: '🚪' }, { label: 'गमला', e: '🪴' }, { label: 'टीवी', e: '📺' },
    { label: 'टोकरी', e: '🧺' }, { label: 'कुर्सी', e: '🪑' }, { label: 'टब', e: '🛁' }, { label: 'डिब्बा', e: '🎁' },
    { label: 'खिड़की', e: '🪟' }, { label: 'सोफ़ा', e: '🛋️' }, { label: 'रसोई', e: '🍳' }, { label: 'अलमारी', e: '📚' }
  ];
  /* 4x3 ग्रिड पर निर्देशांक — दूरी = गरम/ठंडा */
  const XY = i => ({ x: i % 4, y: Math.floor(i / 4) });
  const dist = (a, b) => { const A = XY(a), B = XY(b); return Math.abs(A.x - B.x) + Math.abs(A.y - B.y); };

  const ANIMAL_FRIENDS = [
    { name: 'छिपकली', e: '🦎', sound: 'टिक टिक टिक!', img: 'assets/characters/lizard.png' },
    { name: 'साँप', e: '🐍', sound: 'हिस्स स्स!', img: 'assets/characters/snake.png' },
    { name: 'चूहा', e: '🐀', sound: 'चूँ चूँ चूँ!', img: 'assets/characters/rat.png' },
    { name: 'गिलहरी', e: '🐿️', sound: 'किचि किचि!', img: 'assets/characters/squirrel.png' },
    { name: 'कुत्ता', e: '🐕', sound: 'भौं भौं!', img: 'assets/characters/dog.png' },
    { name: 'बंदर', e: '🐒', sound: 'खुए खुए!', img: 'assets/characters/monkey.png' },
    { name: 'तोता', e: '🦜', sound: 'टैं टैं!', img: 'assets/characters/parrot.png' },
    { name: 'मोर', e: '🦚', sound: 'पीहू पीहू!', img: 'assets/characters/peacock.png' }
  ];
  const ROUNDS = 3;

  function heatText(d) {
    if (d === 1) return { t: 'बहुत गरम! 🔥 भूतू बिल्कुल पास है!', s: 'बहुत गरम! भूतू बिल्कुल पास है!' };
    if (d === 2) return { t: 'गरम है! 🌡️ पास ही कहीं है...', s: 'गरम है! भूतू पास ही है।' };
    if (d === 3) return { t: 'हल्का गरम... 🌤️ थोड़ा और ढूँढो', s: 'हल्का गरम। थोड़ा और ढूँढो।' };
    return { t: 'ठंडा! ❄️ भूतू बहुत दूर है', s: 'ठंडा! भूतू दूर है।' };
  }

  App.games.prank = {
    zone: 'comedy',
    name: 'छुपके छुपके प्रैंक',
    emoji: '👻',
    render(body) {
      let round = 0, ghostAt = 0, animalSpot = -1, animal = null;
      let solved = false, wrongTotal = 0, animalHintUsed = false;

      body.innerHTML =
        '<div class="g-intro">' +
          '<div class="bhootu-header-img"><img src="assets/characters/bhootu.png" alt="डरावना भूतू" class="bhootu-head-pic"/></div>' +
          '<p><b>डरावना भूतू</b> कमरे में छिपा है!<br>' +
          'जगह छुओ — <b>गरम</b> मतलब पास, <b>ठंडा</b> मतलब दूर। संकेतों से पकड़ो!</p>' +
          '<div class="round-dots" id="dots"></div>' +
        '</div>' +
        '<div class="room" id="room"></div>' +
        '<div class="g-tip" id="tip">भूतू को ढूँढो! 👀</div>';

      const room = body.querySelector('#room');
      const dotsEl = body.querySelector('#dots');
      const tip = body.querySelector('#tip');

      function drawDots() {
        dotsEl.innerHTML = '';
        for (let i = 0; i < ROUNDS; i++) dotsEl.append(el('span', 'rdot' + (i < round ? ' on' : '')));
      }

      function setupRound() {
        solved = false; animalHintUsed = false;
        ghostAt = Math.floor(Math.random() * SPOTS.length);
        do { animalSpot = Math.floor(Math.random() * SPOTS.length); } while (animalSpot === ghostAt);
        animal = ANIMAL_FRIENDS[Math.floor(Math.random() * ANIMAL_FRIENDS.length)];

        room.innerHTML = '';
        SPOTS.forEach((s, i) => {
          const b = el('div', 'spot tap');
          b.innerHTML = '<span class="spot-emoji">' + s.e + '</span><span class="spot-label">' + s.label + '</span>';
          if (i === animalSpot) {
            const anim = el('img', 'mini-animal-friend');
            anim.src = animal.img; anim.alt = animal.name;
            anim.onerror = () => { anim.replaceWith(el('span', 'mini-animal-emoji', animal.e)); };
            b.append(anim);
          }
          b.onclick = function (e) {
            if (solved) return;
            if (i === ghostAt) { catchGhost(b, e); return; }
            if (i === animalSpot && !animalHintUsed) {
              animalHintUsed = true;
              SFX.pop();
              FX.burst(e.clientX, e.clientY, 10);
              const dir = XY(ghostAt).x > XY(animalSpot).x ? 'दायीं ओर' : (XY(ghostAt).x < XY(animalSpot).x ? 'बायीं ओर' : 'सीधा ऊपर-नीचे वाली लाइन में');
              tip.textContent = animal.name + ' बोला: "' + animal.sound + ' भूतू मुझसे ' + dir + ' है!" 🕵️';
              Speech.say(animal.name + ' बोला — भूतू मुझसे ' + dir + ' है!', { stop: false });
              return;
            }
            wrongTotal++;
            SFX.boing();
            b.classList.add('shake', 'tried');
            setTimeout(() => b.classList.remove('shake'), 480);
            const h = heatText(dist(i, ghostAt));
            tip.textContent = h.t;
            Speech.say(h.s, { stop: false });
            SFX.warm();
          };
          room.append(b);
        });
        drawDots();
        if (round === 0) {
          tip.textContent = 'ढूँढो! गरम–ठंडा सुनते जाओ! 👂';
          Speech.say('डरावना भूतू छिपा है। जगह छुओ — गरम मतलब पास, ठंडा मतलब दूर!');
        } else if (round === 1) {
          tip.textContent = 'भूतू एक पल को झलक दिखाएगा... ध्यान से देखो! 👀';
          Speech.say('भूतू एक पल को झलक दिखाएगा। ध्यान से देखो!');
          setTimeout(() => {
            if (!room.isConnected || solved) return;
            const cell = room.children[ghostAt];
            if (!cell) return;
            const peek = el('span', 'peek', '👀');
            cell.append(peek);
            setTimeout(() => peek.remove(), 900);
          }, 700);
        } else {
          tip.textContent = 'आख़िरी बार! इस बार कोई झलक नहीं — सिर्फ़ संकेत! ⚡';
          Speech.say('आख़िरी बार! इस बार झलक नहीं मिलेगी। गरम-ठंडा से पकड़ो!');
        }
      }

      function catchGhost(b, e) {
        solved = true;
        SFX.honk();
        FX.burst(e.clientX, e.clientY, 30);
        const r = b.getBoundingClientRect();
        const g = el('div', 'ghost-out');
        g.innerHTML = '<img src="assets/characters/bhootu.png" alt="भूतू" class="bhootu-caught-pic"/><span class="ring"></span>';
        g.style.left = (r.left + r.width / 2 - 35) + 'px';
        g.style.top = (r.top + r.height / 2 - 35) + 'px';
        document.body.append(g);
        setTimeout(() => g.remove(), 1100);
        tip.textContent = 'डरावना भूतू पकड़ा गया! 🎉';
        setTimeout(() => {
          if (!room.isConnected) return;
          round++;
          if (round >= ROUNDS) {
            const stars = wrongTotal <= 3 ? 3 : (wrongTotal <= 7 ? 2 : 1);
            App.win({
              title: 'डरावना भूतू पकड़ा गया! 👻',
              sub: wrongTotal <= 3 ? 'संकेतों को पढ़कर पकड़ा — तेज़ आँख, तेज़ दिमाग़!' : 'पकड़ तो लिया! अगली बार गरम-ठंडा ध्यान से सुनना, 3 सितारे पक्के!',
              sticker: 'prank',
              doneId: 'game-prank',
              stars: stars,
              say: 'शाबाश! डरावना भूतू तीनों बार पकड़ा गया!'
            });
          } else {
            setupRound();
          }
        }, 950);
      }

      setupRound();
    }
  };
})();
