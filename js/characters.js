/* =========================================================
   लड़्डू का खेल घर — Characters & Animals
   परिवार की असली photos ही इस घर की जान हैं।
   ========================================================= */
(function () {
  const FAMILY = [
    { id: 'laddu', name: 'लड़्डू', role: 'मुख्य हीरो 👧', img: 'assets/characters/laddu.jpg', emoji: '👧', desc: 'चुलबुली, शरारती और दिमाग़ की तेज़' },
    { id: 'amma',  name: 'अम्मा',  role: 'प्यारी अम्मा 👩', img: 'assets/characters/amma.jpg',  emoji: '👩', desc: 'स्वादिष्ट खाना और प्यारे व्लॉग बनाने वाली' },
    { id: 'papa',  name: 'पापा',  role: 'मस्तीखोर पापा 👨', img: 'assets/characters/papa.jpg',  emoji: '👨', desc: 'नए खेल और मज़ेदार प्रैंक सिखाने वाले' },
    { id: 'dadi',  name: 'दादी',  role: 'कहानी रानी 👵', img: 'assets/characters/dadi.jpg',  emoji: '👵', desc: 'कहानियों और प्यार की रानी' },
    { id: 'chiku', name: 'चीकू', role: 'छोटा भाई 👦', img: 'assets/characters/chiku.jpg',  emoji: '👦', desc: 'लड़्डू का प्यारा और शरारती छोटा भाई' },
    { id: 'mittu', name: 'मिट्टू', role: 'प्यारी बिल्ली 🐱', img: 'assets/characters/mittu.jpg', emoji: '🐱', desc: 'घर की सबसे प्यारी और चतुर बिल्ली' },
    { id: 'dada',  name: 'दादा जी', role: 'बड़े दादा 👴', img: 'assets/characters/dada.jpg', emoji: '👴', desc: 'घर के सबसे बड़े, प्यारे और ज्ञानी' }
  ];

  const BHOOTU = {
    id: 'bhootu', name: 'डरावना भूतू', role: 'शरारती भूत 👻',
    img: 'assets/characters/bhootu.png', emoji: '👻',
    desc: 'हँसी-मज़ाक वाला भूतू — कमरे में छिपकर मज़ेदार प्रैंक करता है!'
  };

  const ANIMALS = [
    { id: 'lizard',   name: 'छिपकली', hindi: 'छिपकली', img: 'assets/characters/lizard.png', emoji: '🦎', sound: 'टिक टिक टिक!', desc: 'दीवार पर चलने वाली चतुर छिपकली' },
    { id: 'snake',    name: 'साँप',    hindi: 'साँप',   img: 'assets/characters/snake.png',  emoji: '🐍', sound: 'हिस्स स्स!', desc: 'हरा भरा प्यारा साँप' },
    { id: 'rat',      name: 'चूहा',    hindi: 'चूहा',   img: 'assets/characters/rat.png',   emoji: '🐀', sound: 'चूँ चूँ चूँ!', desc: 'तेज़ भागने वाला छोटा चूहा' },
    { id: 'squirrel', name: 'गिलहरी', hindi: 'गिलहरी', img: 'assets/characters/squirrel.png', emoji: '🐿️', sound: 'किचि किचि!', desc: 'धारी वाली चुलबुली गिलहरी' },
    { id: 'dog',      name: 'कुत्ता',  hindi: 'कुत्ता', img: 'assets/characters/dog.png',   emoji: '🐕', sound: 'भौं भौं!', desc: 'वफ़ादार और प्यारा कुत्ता' },
    { id: 'monkey',   name: 'बंदर',   hindi: 'बंदर',   img: 'assets/characters/monkey.png', emoji: '🐒', sound: 'खुए खुए!', desc: 'नाटकबाज़ और शरारती बंदर' },
    { id: 'parrot',   name: 'तोता',    hindi: 'तोता',   img: 'assets/characters/parrot.png', emoji: '🦜', sound: 'टैं टैं!', desc: 'लाल चोंच वाला हरा तोता' },
    { id: 'peacock',  name: 'मोर',     hindi: 'मोर',    img: 'assets/characters/peacock.png', emoji: '🦚', sound: 'पीहू पीहू!', desc: 'सुंदर पंखों वाला राष्ट्रीय पक्षी' },
    { id: 'elephant', name: 'हाथी',    hindi: 'हाथी',   img: 'assets/characters/elephant.png', emoji: '🐘', sound: 'पाऊँ!', desc: 'विशाल और प्यारा हाथी' },
    { id: 'lion',     name: 'शेर',     hindi: 'शेर',    img: 'assets/characters/lion.png',   emoji: '🦁', sound: 'दहाड़!', desc: 'जंगल का राजा शेर' }
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
        <img src="${c.img}" alt="${c.name}" loading="lazy" onerror="this.onerror=null; this.outerHTML='<span class=\\'char-emoji-fallback\\'>${c.emoji}</span>';"/>
      </div>`;
    }
  };

  window.Characters = Characters;

  /* ---------------- SCREEN: परिवार गैलरी ---------------- */
  App.screens.family = function (stage) {
    stage.innerHTML = '';
    const back = el('button', 'btn btn-back', '← घर');
    back.onclick = () => { SFX.pop(); App.nav('home'); };
    stage.append(back);

    stage.append(el('div', 'album-head', '👨‍👩‍👧‍👦 मेरा प्यारा परिवार'));
    stage.append(el('div', 'hint', 'हर किसी को छुओ — उनकी फोटो देखो और आवाज़ सुनो! ❤️'));

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
        Speech.say('नमस्ते! मैं हूँ ' + member.name + '! ' + member.desc, { stop: false });
      };
      grid.append(card);
    });

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
      Speech.say('भूऊऊ! मैं हूँ डरावना भूतू! हाहाहा!', { stop: false });
    };
    grid.append(bCard);

    stage.append(grid);
  };

  /* ---------------- SCREEN: जानवर सफ़ारी ---------------- */
  App.screens.animals = function (stage) {
    stage.innerHTML = '';
    const back = el('button', 'btn btn-back', '← घर');
    back.onclick = () => { SFX.pop(); App.nav('home'); };
    stage.append(back);

    stage.append(el('div', 'album-head', '🐾 जानवर सफ़ारी'));
    stage.append(el('div', 'hint', 'जानवरों को छुओ — फोटो देखो, नाम सीखो और उनकी बोली सुनो! 🦁'));

    const grid = el('div', 'animal-grid');
    ANIMALS.forEach((a, i) => {
      const card = el('div', 'animal-card pop-in');
      card.style.animationDelay = (i * 0.05) + 's';
      card.innerHTML =
        Characters.getAvatarHTML(a, 90, 'animal-avatar') +
        '<div class="a-info">' +
          '<h3>' + a.name + '</h3>' +
          '<span class="a-sound">🔊 "' + a.sound + '"</span>' +
          '<p>' + a.desc + '</p>' +
        '</div>';
      card.onclick = (e) => {
        SFX.pop();
        FX.burst(e.clientX, e.clientY, 12);
        card.classList.add('jump');
        setTimeout(() => card.classList.remove('jump'), 500);
        Speech.say(a.name + '! बोली: ' + a.sound + ' ' + a.desc, { stop: false });
      };
      grid.append(card);
    });

    stage.append(grid);
  };
})();
