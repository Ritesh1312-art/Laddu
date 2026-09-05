/* =========================================================
   Game 1 — Chupke Chupke Prank (Comedy / Funny / Prank zone)
   Funny bhootu ko pakdo! Observation + attention game.
   Skill: Critical thinking (observation), spatial search.
   ========================================================= */
(function () {
  const SPOTS = ['🛏️', '🚪', '🪴', '📺', '🧺', '🪑', '🛁', '🎁', '🪟', '🛋️', '🍳', '📚'];
  const ROUNDS = 3;

  App.games.prank = {
    zone: 'comedy',
    name: 'Chupke Chupke Prank',
    emoji: '👻',
    render(body) {
      let round = 0, ghostAt = 0, solved = false;

      body.innerHTML =
        '<div class="g-intro">' +
          '<span class="ghost-champ">👻</span>' +
          '<p><b>Bhootu</b> (chhota harkat bhoot) kamre mein chhupa hai!<br>' +
          'Jahan uski 👀 dikhe, wahan tap karo aur pakad lo!</p>' +
          '<div class="round-dots" id="dots"></div>' +
        '</div>' +
        '<div class="room" id="room"></div>' +
        '<div class="g-tip" id="tip">Bhootu ko dhundho! 👀</div>';

      const room = body.querySelector('#room');
      const dotsEl = body.querySelector('#dots');
      const tip = body.querySelector('#tip');

      function drawDots() {
        dotsEl.innerHTML = '';
        for (let i = 0; i < ROUNDS; i++) {
          dotsEl.append(el('span', 'rdot' + (i < round ? ' on' : '')));
        }
      }

      function setupRound() {
        solved = false;
        ghostAt = Math.floor(Math.random() * SPOTS.length);
        room.innerHTML = '';
        SPOTS.forEach((s, i) => {
          const b = el('div', 'spot tap');
          b.textContent = s;
          b.style.setProperty('--i', i);
          if (round === 0 && i === ghostAt) {
            const peek = el('span', 'peek', '👀');
            b.append(peek);
          }
          b.onclick = function (e) {
            if (solved) return;
            if (i === ghostAt) catchGhost(b, e);
            else {
              SFX.boing();
              b.classList.add('shake');
              setTimeout(() => b.classList.remove('shake'), 480);
              tip.textContent = 'Nahi nahi... phir dhundho! 🕵️';
            }
          };
          room.append(b);
        });
        drawDots();
        if (round === 0) {
          tip.textContent = 'Dhundho! 👀 (Aankhein dikh rahi hain!)';
          Speech.say('Bhootu chhupa hai. Uski aankhein dikh rahi hain. Tap karke pakdo!');
        } else if (round === 1) {
          tip.textContent = 'Bhootu ab aankhein chhupa raha hai! 🕵️';
          Speech.say('Bhootu ab aankhein chhupa raha hai. Dhyan se dekho!');
        } else {
          tip.textContent = 'Aakhri baar! Bhootu tez hai! ⚡';
          Speech.say('Aakhri baar! Bhootu ab bahut tez hai! Jaldi dhundho!');
        }
      }

      function catchGhost(b, e) {
        solved = true;
        SFX.honk();
        FX.burst(e.clientX, e.clientY, 24);
        const r = b.getBoundingClientRect();
        const g = el('div', 'ghost-out', '👻<span class="ring"></span>');
        g.style.left = (r.left + r.width / 2 - 27) + 'px';
        g.style.top = (r.top + r.height / 2 - 27) + 'px';
        document.body.append(g);
        setTimeout(() => g.remove(), 900);
        tip.textContent = 'Pakda gaya! 🎉';
        setTimeout(() => {
          if (!room.isConnected) return;
          round++;
          if (round >= ROUNDS) {
            App.win({
              title: 'Bhootu pakda gaya! 👻',
              sub: 'Tez aankh, tez haath — aap toh Hasi Hero ho!',
              sticker: 'prank',
              doneId: 'game-prank',
              stars: 3,
              say: 'Shabaash! Bhootu teeno baar pakad liya! Aap Hasi Hero ho!'
            });
          } else {
            setupRound();
          }
        }, 850);
      }

      setupRound();
    }
  };
})();
