/* =========================================================
   Game 1 — Chupke Chupke Prank (Comedy / Funny / Prank zone)
   Darawna Bhootu + 8 Naye Animals ko pakdo! Observation game.
   Skill: Critical thinking (observation), spatial search.
   ========================================================= */
(function () {
  const SPOTS = [
    { label: '🛏️ Bed', e: '🛏️' },
    { label: '🚪 Darwaza', e: '🚪' },
    { label: '🪴 Gamla', e: '🪴' },
    { label: '📺 TV', e: '📺' },
    { label: '🧺 Tokri', e: '🧺' },
    { label: '🪑 Kursi', e: '🪑' },
    { label: '🛁 Tub', e: '🛁' },
    { label: '🎁 Dabba', e: '🎁' },
    { label: '🪟 Khidki', e: '🪟' },
    { label: '🛋️ Sofa', e: '🛋️' },
    { label: '🍳 Rasoi', e: '🍳' },
    { label: '📚 Almari', e: '📚' }
  ];

  /* Animals that might give cute sound clues! */
  const ANIMAL_FRIENDS = [
    { name: 'Chipkali', e: '🦎', sound: 'Tik tik tik!', img: 'assets/characters/lizard.png' },
    { name: 'Saanp',    e: '🐍', sound: 'Hiss sss!', img: 'assets/characters/snake.png' },
    { name: 'Chuha',    e: '🐀', sound: 'Chu chu chu!', img: 'assets/characters/rat.png' },
    { name: 'Gilhari', e: '🐿️', sound: 'Kichi kichi!', img: 'assets/characters/squirrel.png' },
    { name: 'Kutta',    e: '🐕', sound: 'Bhow bhow!', img: 'assets/characters/dog.png' },
    { name: 'Bandar',   e: '🐒', sound: 'Khue khue!', img: 'assets/characters/monkey.png' },
    { name: 'Tota',     e: '🦜', sound: 'Tain tain!', img: 'assets/characters/parrot.png' },
    { name: 'Mor',      e: '🦚', sound: 'Peehu peehu!', img: 'assets/characters/peacock.png' }
  ];

  const ROUNDS = 3;

  App.games.prank = {
    zone: 'comedy',
    name: 'Chupke Chupke Prank',
    emoji: '👻',
    render(body) {
      let round = 0, ghostAt = 0, solved = false;

      body.innerHTML =
        '<div class="g-intro">' +
          '<div class="bhootu-header-img"><img src="assets/characters/bhootu.png" alt="Darawna Bhootu" class="bhootu-head-pic"/></div>' +
          '<p><b>Darawna Bhootu</b> kamre mein chhupa hai!<br>' +
          'Jahan uski 👀 dikhe ya shararat ho, wahan tap karke pakdo!</p>' +
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
        const animalSpot = Math.floor(Math.random() * SPOTS.length);
        const randomAnimal = ANIMAL_FRIENDS[Math.floor(Math.random() * ANIMAL_FRIENDS.length)];

        room.innerHTML = '';
        SPOTS.forEach((s, i) => {
          const b = el('div', 'spot tap');
          b.innerHTML = '<span class="spot-emoji">' + s.e + '</span>';
          b.style.setProperty('--i', i);

          if (round === 0 && i === ghostAt) {
            const peek = el('span', 'peek', '👀');
            b.append(peek);
          } else if (i === animalSpot && i !== ghostAt) {
            /* Cute animal friend hiding here! */
            const anim = el('img', 'mini-animal-friend');
            anim.src = randomAnimal.img;
            anim.onerror = () => { anim.style.display = 'none'; };
            b.append(anim);
          }

          b.onclick = function (e) {
            if (solved) return;
            if (i === ghostAt) catchGhost(b, e);
            else if (i === animalSpot) {
              SFX.pop();
              FX.burst(e.clientX, e.clientY, 10);
              Speech.say('Yahan toh ' + randomAnimal.name + ' hai! ' + randomAnimal.sound, { stop: false });
              tip.textContent = randomAnimal.name + ' bola: "' + randomAnimal.sound + '"! Bhootu kisi aur jagah hai! 🕵️';
            } else {
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
          tip.textContent = 'Dhundho! 👀 (Darawna Bhootu ki aankhein dikh rahi hain!)';
          Speech.say('Darawna Bhootu chhupa hai. Uski aankhein dikh rahi hain. Tap karke pakdo!');
        } else if (round === 1) {
          tip.textContent = 'Bhootu ab aankhein chhupa raha hai! 🕵️';
          Speech.say('Bhootu ab aankhein chhupa raha hai. Dhyan se dekho!');
        } else {
          tip.textContent = 'Aakhri baar! Bhootu tez hai! ⚡';
          Speech.say('Aakhri baar! Darawna Bhootu ab bahut tez hai! Jaldi dhundho!');
        }
      }

      function catchGhost(b, e) {
        solved = true;
        SFX.honk();
        FX.burst(e.clientX, e.clientY, 30);
        const r = b.getBoundingClientRect();
        const g = el('div', 'ghost-out');
        g.innerHTML = '<img src="assets/characters/bhootu.png" alt="Bhootu" class="bhootu-caught-pic"/><span class="ring"></span>';
        g.style.left = (r.left + r.width / 2 - 35) + 'px';
        g.style.top = (r.top + r.height / 2 - 35) + 'px';
        document.body.append(g);
        setTimeout(() => g.remove(), 1100);
        tip.textContent = 'Darawna Bhootu pakda gaya! 🎉';
        setTimeout(() => {
          if (!room.isConnected) return;
          round++;
          if (round >= ROUNDS) {
            App.win({
              title: 'Darawna Bhootu pakda gaya! 👻',
              sub: 'Tez aankh, tez haath — aap toh Hasi Hero ho!',
              sticker: 'prank',
              doneId: 'game-prank',
              stars: 3,
              say: 'Shabaash! Darawna Bhootu teeno baar pakad liya! Aap Hasi Hero ho!'
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
