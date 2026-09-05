/* =========================================================
   Laddu Ka Khel Ghar — Characters & Animals System
   Hyper-realistic Characters (Laddu, Amma, Papa, Dadi, Chiku, Mittu, Dada)
   + Darawna Bhootu + 10 Animals (Lizard, Snake, Rat, Squirrel, Dog, Monkey, Parrot, Peacock, Elephant, Lion)
   ========================================================= */
(function () {
  const FAMILY = [
    { id: 'laddu', name: 'Laddu', role: 'Main Hero 👧', img: 'assets/characters/laddu.jpg', emoji: '👧', desc: 'Chulbuli, sharaarati aur dimaag se tez beti' },
    { id: 'amma',  name: 'Amma',  role: 'Pyaari Amma 👩', img: 'assets/characters/amma.jpg',  emoji: '👩', desc: 'Pyaari Amma jo swadisht khaana aur pyaare vlogs banati hain' },
    { id: 'papa',  name: 'Papa',  role: 'Masti-khor Papa 👨', img: 'assets/characters/papa.jpg',  emoji: '👨', desc: 'Masti-khor Papa jo hamesha naye games aur pranks sikhate hain' },
    { id: 'dadi',  name: 'Dadi',  role: 'Kahaani Rani 👵', img: 'assets/characters/dadi.jpg',  emoji: '👵', desc: 'Kahaaniyon aur pyaar ki rani Dadi Jaan' },
    { id: 'chiku', name: 'Chiku', role: 'Chhota Bhai 👦', img: 'assets/characters/chiku.jpg',  emoji: '👦', desc: 'Laddu ka pyara aur sharaarati chhota bhaiya' },
    { id: 'mittu', name: 'Mittu', role: 'Pyaari Billi 🐱', img: 'assets/characters/mittu.jpg',  emoji: '🐱', desc: 'Ghar ki sabse pyaari aur chatur billi Mittu' },
    { id: 'dada',  name: 'Dada Ji', role: 'Elder Dada 👴', img: 'assets/characters/dada.jpg',  emoji: '👴', desc: 'Ghar ke sabse elder, pyaare aur gyaani Dada ji' }
  ];

  const BHOOTU = {
    id: 'bhootu', name: 'Darawna Bhootu', role: 'Sharaarati Bhoot 👻',
    img: 'assets/characters/bhootu.png', emoji: '👻',
    desc: 'Hasi-mazaak wala Darawna Bhootu — kamre mein chhupkar mast pranks karta hai!'
  };

  const ANIMALS = [
    { id: 'lizard',   name: 'Chipkali', hindi: 'छिपकली', img: 'assets/characters/lizard.png', emoji: '🦎', sound: 'Tik tik tik!', desc: 'Deewar par chalne wali chatur chipkali' },
    { id: 'snake',    name: 'Saanp',    hindi: 'सांप',   img: 'assets/characters/snake.png',  emoji: '🐍', sound: 'Hiss sss!', desc: 'Ranganewala hara pyaara saanp' },
    { id: 'rat',      name: 'Chuha',    hindi: 'चूहा',   img: 'assets/characters/rat.png',   emoji: '🐀', sound: 'Chu chu chu!', desc: 'Tez bhaagnewala chhota chuha' },
    { id: 'squirrel', name: 'Gilhari', hindi: 'गिलहरी', img: 'assets/characters/squirrel.png', emoji: '🐿️', sound: 'Kichi kichi!', desc: 'Dhariyon wali chhulbuli gilhari' },
    { id: 'dog',      name: 'Kutta',    hindi: 'कुत्ता', img: 'assets/characters/dog.png',   emoji: '🐕', sound: 'Bhow bhow!', desc: 'Wafadar aur pyaara kutta' },
    { id: 'monkey',   name: 'Bandar',   hindi: 'बंदर',   img: 'assets/characters/monkey.png', emoji: '🐒', sound: 'Khue khue!', desc: 'Nataakbaz aur sharaarati bandar' },
    { id: 'parrot',   name: 'Tota',     hindi: 'तोता',   img: 'assets/characters/parrot.png', emoji: '🦜', sound: 'Tain tain!', desc: 'Laal choanch wala hara tota' },
    { id: 'peacock',  name: 'Mor',      hindi: 'मोर',    img: 'assets/characters/peacock.png', emoji: '🦚', sound: 'Peehu peehu!', desc: 'Sunder pankhon wala rashtriya pakshi mor' },
    { id: 'elephant', name: 'Hathi',    hindi: 'हाथी',   img: 'assets/characters/elephant.png', emoji: '🐘', sound: 'Pawooo!', desc: 'Vishalkay aur pyara hathi' },
    { id: 'lion',     name: 'Sher',     hindi: 'शेर',    img: 'assets/characters/lion.png',   emoji: '🦁', sound: 'Roarrr!', desc: 'Jangal ka raja sher' }
  ];

  const Characters = {
    FAMILY,
    BHOOTU,
    ANIMALS,

    getAvatarHTML(c, size = 60, cls = '') {
      if (typeof c === 'string') {
        const found = FAMILY.find(x => x.id === c) || ANIMALS.find(x => x.id === c) || (c === 'bhootu' ? BHOOTU : null);
        if (found) c = found;
        else return `<span class="char-emoji-fallback" style="font-size:${size}px">${c}</span>`;
      }
      return `<div class="char-avatar-box ${cls}" style="width:${size}px;height:${size}px;">
        <img src="${c.img}" alt="${c.name}" onerror="this.onerror=null; this.outerHTML='<span class=\'char-emoji-fallback\'>${c.emoji}</span>';"/>
      </div>`;
    }
  };

  window.Characters = Characters;

  /* ---------------- SCREEN: Parivaar Gallery ---------------- */
  App.screens.family = function (stage) {
    stage.innerHTML = '';
    const back = el('button', 'btn btn-back', '← Ghar');
    back.onclick = () => { SFX.pop(); App.nav('home'); };
    stage.append(back);

    const head = el('div', 'album-head', '👨‍👩‍👧‍👦 Mera Pyaara Parivaar');
    stage.append(head);
    stage.append(el('div', 'hint', 'Har character par tap karo — unki real/realistic photo dekho aur awaaz suno! ❤️'));

    const grid = el('div', 'family-grid');
    FAMILY.forEach((member, i) => {
      const card = el('div', 'family-card pop-in');
      card.style.animationDelay = (i * 0.08) + 's';
      card.innerHTML =
        Characters.getAvatarHTML(member, 100, 'family-avatar') +
        '<div class="f-info">' +
          '<h3>' + member.name + '</h3>' +
          '<span class="f-role">' + member.role + '</span>' +
          '<p>' + member.desc + '</p>' +
        '</div>';
      card.onclick = () => {
        SFX.ding();
        card.classList.add('jump');
        setTimeout(() => card.classList.remove('jump'), 500);
        Speech.say('Namaste! Main hoon ' + member.name + '! ' + member.desc, { stop: false });
      };
      grid.append(card);
    });

    /* Add Darawna Bhootu Card too! */
    const bCard = el('div', 'family-card bhootu-card pop-in');
    bCard.innerHTML =
      Characters.getAvatarHTML(BHOOTU, 100, 'family-avatar') +
      '<div class="f-info">' +
        '<h3>' + BHOOTU.name + '</h3>' +
        '<span class="f-role">' + BHOOTU.role + '</span>' +
        '<p>' + BHOOTU.desc + '</p>' +
      '</div>';
    bCard.onclick = () => {
      SFX.honk();
      bCard.classList.add('shake');
      setTimeout(() => bCard.classList.remove('shake'), 500);
      Speech.say('Bhooool! Main hoon Darawna Bhootu! Hahaha!', { stop: false });
    };
    grid.append(bCard);

    stage.append(grid);
  };

  /* ---------------- SCREEN: Janwar Safari (Animals) ---------------- */
  App.screens.animals = function (stage) {
    stage.innerHTML = '';
    const back = el('button', 'btn btn-back', '← Ghar');
    back.onclick = () => { SFX.pop(); App.nav('home'); };
    stage.append(back);

    const head = el('div', 'album-head', '🐾 Janwar Safari & Awaazein');
    stage.append(head);
    stage.append(el('div', 'hint', 'Janwaron par tap karo — photo dekho, Hindi naam seekho aur boliyain suno! 🦁'));

    const grid = el('div', 'animal-grid');
    ANIMALS.forEach((a, i) => {
      const card = el('div', 'animal-card pop-in');
      card.style.animationDelay = (i * 0.05) + 's';
      card.innerHTML =
        Characters.getAvatarHTML(a, 90, 'animal-avatar') +
        '<div class="a-info">' +
          '<h3>' + a.name + ' <small>(' + a.hindi + ')</small></h3>' +
          '<span class="a-sound">🔊 "' + a.sound + '"</span>' +
          '<p>' + a.desc + '</p>' +
        '</div>';
      card.onclick = (e) => {
        SFX.pop();
        FX.burst(e.clientX, e.clientY, 12);
        card.classList.add('jump');
        setTimeout(() => card.classList.remove('jump'), 500);
        Speech.say(a.name + '! ' + a.hindi + '. Boli: ' + a.sound + '. ' + a.desc, { stop: false });
      };
      grid.append(card);
    });

    stage.append(grid);
  };
})();
