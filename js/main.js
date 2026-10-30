/* =========================================================
   लड़्डू का खेल घर — Main V2: home, zones, album, parents
   ========================================================= */
(function () {
  const ZONES = [
    { id: 'comedy',  emoji: '😜', name: 'कॉमेडी और प्रैंक', sub: 'हँसी और हरकत', bg: 'linear-gradient(135deg,#f7b733,#fc4a1a)', tag: 'ध्यान • अवलोकन' },
    { id: 'family',  emoji: '🎥', name: 'परिवार और व्लॉग', sub: 'परिवार की यादें', bg: 'linear-gradient(135deg,#8e44ad,#e84393)', tag: 'योजना • बातचीत' },
    { id: 'cartoon', emoji: '📺', name: 'कार्टून दुनिया', sub: 'रंग, आकार, गिनती', bg: 'linear-gradient(135deg,#11998e,#38ef7d)', tag: 'रंग • गिनती' },
    { id: 'mystery', emoji: '🕵️', name: 'रहस्य', sub: 'सुराग और सोच', bg: 'linear-gradient(135deg,#2c3e50,#4ca1af)', tag: 'तर्क • सोच' },
    { id: 'craft',   emoji: '🎨', name: 'चित्रकारा और कला', sub: 'बनाओ, रंग दो', bg: 'linear-gradient(135deg,#ee5396,#f6d365)', tag: 'सृजन • हाथ' },
    { id: 'music',   emoji: '🎵', name: 'संगीत और नृत्य', sub: 'गाना और नाच', bg: 'linear-gradient(135deg,#f7971e,#ffd200)', tag: 'ताल • याद' },
    { id: 'school',  emoji: '🎒', name: 'पढ़ाई वाड़ी', sub: 'सुनो • देखो • बोलो • खेलो', bg: 'linear-gradient(135deg,#43cea2,#185a9d)', tag: 'NEP 2020 • NCF आधारित' }
  ];

  function zoneDone(zid) {
    const ids = Object.keys(App.games).filter(g => App.games[g].zone === zid).map(g => 'game-' + g);
    const st = STORIES.find(s => s.zone === zid);
    if (st) ids.push('story-' + st.id);
    return ids.length > 0 && ids.every(id => State.done(id));
  }
  function zoneStars(zid) {
    const ids = Object.keys(App.games).filter(g => App.games[g].zone === zid).map(g => 'game-' + g);
    const st = STORIES.find(s => s.zone === zid);
    if (st) ids.push('story-' + st.id);
    return ids.reduce((a, id) => a + State.best(id), 0);
  }

  /* ---------------- HOME ---------------- */
  App.screens.home = function (stage) {
    stage.innerHTML = '';
    const hello = el('div', 'home-hello pop-in');
    hello.innerHTML =
      '<div class="hello-photo">' + Characters.getAvatarHTML('laddu', 92, 'hello-avatar') + '</div>' +
      '<h1>नमस्ते <span>लड़्डू</span>!</h1>' +
      '<p>आज क्या खेलेंगे? हर खेल में आवाज़, हँसी और नई सीख! 🎈</p>' +
      '<p style="font-size:13px;color:#8e44ad;margin:2px">👆 लड़्डू की फोटो छूओ — वो बात करेगी!</p>';
    const bubble = el('div', 'ln-progress');
    bubble.style.display = 'none';
    hello.append(bubble);
    const photoEl = hello.querySelector('.hello-photo');
    if (photoEl) {
      photoEl.style.cursor = 'pointer';
      photoEl.onclick = () => { SFX.ding(); if (window.BuddyTalk) BuddyTalk(bubble); };
    }
    stage.append(hello);

    if (window.KhazanaMount) {
      const kz = el('div');
      kz.style.margin = '10px 0';
      stage.append(kz);
      KhazanaMount(kz);
    }

    const grid = el('div', 'zone-grid');
    ZONES.forEach((z, i) => {
      const c = el('button', 'zone-card tap');
      c.style.background = z.bg;
      c.style.animationDelay = (i * 0.05) + 's';
      c.classList.add('pop-in');
      c.innerHTML =
        '<span class="z-emoji">' + z.emoji + '</span>' +
        '<div class="z-name">' + z.name + '</div>' +
        '<div class="z-sub">' + z.sub + '</div>' +
        '<span class="z-skill">' + z.tag + '</span>' +
        (zoneDone(z.id) ? '<span class="z-done">⭐' + zoneStars(z.id) + '</span>' : '');
      c.onclick = () => { SFX.ding(); App.nav('zone', z.id); };
      grid.append(c);
    });
    stage.append(grid);

    const extra = el('div', 'extra-row');
    const got = Object.keys(State.data.stickers).length;
    const is = el('button', 'btn card-mini', '🪄 जादुई कहानी <span>खुद रास्ता चुनो!</span>');
    is.onclick = () => { SFX.pop(); App.nav('istory'); };
    const km = el('button', 'btn card-mini', '🏠 लड़्डू का कमरा <span>सितारों से सजावट</span>');
    km.onclick = () => { SFX.pop(); App.nav('kamra'); };
    const kv = el('button', 'btn card-mini', '🎶 कविता वाड़ी <span>24 कविताएँ, असल आवाज़ में</span>');
    kv.onclick = () => { SFX.pop(); App.nav('poems'); };
    extra.append(is, km, kv);
    const f = el('button', 'btn card-mini', '👨‍👩‍👧‍👦 मेरा परिवार <span>असली फोटो</span>');
    f.onclick = () => { SFX.pop(); App.nav('family'); };
    const an = el('button', 'btn card-mini', '🐾 जानवर सफ़ारी <span>10 जानवर और बोलियाँ</span>');
    an.onclick = () => { SFX.pop(); App.nav('animals'); };
    const a = el('button', 'btn card-mini', '📚 स्टिकर एल्बम <span>' + got + '/' + STICKERS.length + '</span>');
    a.onclick = () => { SFX.pop(); App.nav('album'); };
    const b = el('button', 'btn card-mini', '👩‍🏫 माँ-पापा के लिए <span>NEP 2020 • NCF</span>');
    b.onclick = () => { SFX.pop(); App.nav('parents'); };
    extra.append(f, an, a, b);
    stage.append(extra);
  };

  /* ---------------- ZONE ---------------- */
  App.screens.zone = function (stage, zid) {
    const z = ZONES.find(x => x.id === zid);
    if (!z) { App.nav('home'); return; }
    const story = STORIES.find(s => s.zone === zid);
    const games = Object.keys(App.games).filter(g => App.games[g].zone === zid);

    stage.innerHTML = '';
    const back = el('button', 'btn btn-back', '← घर');
    back.onclick = () => { SFX.pop(); App.nav('home'); };
    stage.append(back);

    const hero = el('div', 'zone-hero pop-in');
    hero.style.background = z.bg;
    hero.innerHTML =
      '<span class="zh-emoji">' + z.emoji + '</span>' +
      '<h2>' + z.name + '</h2>' +
      '<p>' + z.sub + '</p>' +
      '<span class="z-skill">' + z.tag + '</span>';
    stage.append(hero);

    const list = el('div', 'zone-list');
    games.forEach(gid => {
      const g = App.games[gid];
      const best = State.best('game-' + gid);
      const b = el('button', 'btn game-btn',
        '<span class="gb-e">' + g.emoji + '</span><span>' + g.name + '<i>खेलो! 🎮</i></span>' +
        (best ? '<span class="mini-star">' + '⭐'.repeat(best) + '</span>' : ''));
      b.onclick = () => { SFX.ding(); App.nav('game', gid); };
      list.append(b);
    });
    if (story) {
      const best = State.best('story-' + story.id);
      const b = el('button', 'btn game-btn story-btn',
        '<span class="gb-e">' + story.emoji + '</span><span>' + story.title + '<i>कहानी सुनो 📖 (आवाज़ में)</i></span>' +
        (best ? '<span class="mini-star">' + '⭐'.repeat(best) + '</span>' : ''));
      b.onclick = () => { SFX.ding(); App.nav('story', story.id); };
      list.append(b);
    }
    stage.append(list);
  };

  /* ---------------- GAME wrapper ---------------- */
  App.screens.game = function (stage, gid) {
    const g = App.games[gid];
    if (!g) { App.nav('home'); return; }
    SFX.stopBeat();
    stage.innerHTML = '';
    const back = el('button', 'btn btn-back', '← पीछे');
    back.onclick = () => { SFX.pop(); App.nav('zone', g.zone); };
    const head = el('div', 'game-head');
    head.append(back, el('div', 'game-title', g.emoji + ' ' + g.name));
    const body = el('div', 'game-body');
    stage.append(head, body);
    g.render(body);
  };

  /* ---------------- ALBUM ---------------- */
  App.screens.album = function (stage) {
    stage.innerHTML = '';
    const back = el('button', 'btn btn-back', '← घर');
    back.onclick = () => { SFX.pop(); App.nav('home'); };
    stage.append(back);
    stage.append(el('div', 'album-head', '📚 मेरी स्टिकर एल्बम'));
    const got = Object.keys(State.data.stickers).length;
    stage.append(el('div', 'hint', 'खेल जीतो और कहानियाँ पूरी करो — स्टिकर यहाँ खुलेंगे! (' + got + '/' + STICKERS.length + ' खुल चुके)'));
    const grid = el('div', 'album-grid');
    STICKERS.forEach(s => {
      const have = !!State.data.stickers[s.id];
      const d = el('div', 'sticker' + (have ? '' : ' locked'));
      d.innerHTML =
        '<span class="st-emoji">' + (have ? s.emoji : '❓') + '</span>' +
        '<span class="st-name">' + (have ? s.name : 'छिपा स्टिकर') + '</span>' +
        '<span class="st-skill">' + (have ? s.skill : s.zone + ' में खेलो!') + '</span>';
      d.onclick = () => {
        if (have) {
          SFX.jingle();
          const r = d.getBoundingClientRect();
          FX.burst(r.left + r.width / 2, r.top + r.height / 2, 14);
        } else SFX.boing();
      };
      grid.append(d);
    });
    stage.append(grid);
  };

  /* ---------------- PARENTS CORNER ---------------- */
  App.screens.parents = function (stage) {
    stage.innerHTML = '';
    const back = el('button', 'btn btn-back', '← घर');
    back.onclick = () => { SFX.pop(); App.nav('home'); };
    stage.append(back);

    stage.append(el('div', 'album-head', '👩‍🏫 माँ-पापा के लिए'));
    stage.append(el('div', 'hint', 'यह app NEP 2020, NCF-FS (Foundational Stage, 3–8 वर्ष) और NCF-SE की शिक्षण-पद्धति पर आधारित है — खेल ही सीखने का माध्यम है, दबाव-वाला कोई quiz नहीं। सीखने का चक्र हर जगह एक ही है: सुनो → देखो → बोलो → खेलो। जहाँ पढ़ना है, वहाँ सुनना भी है — कहानियाँ, जादुई कहानी और सारी 24 कविताएँ असली रिकॉर्ड की गई आवाज़ में सुनाई जाती हैं। सितारे मुफ़्त नहीं मिलते — बच्चे के प्रदर्शन पर मिलते हैं, ताकि प्रगति सच में दिखे।'));

    const c1 = el('div', 'pcard');
    c1.innerHTML =
      '<h3>🏫 NEP 2020 से जुड़ाव</h3><ul>' +
      '<li><b>खेल-आधारित, गतिविधि-आधारित सीख</b> — foundational stage के लिए खेल ही आधार है।</li>' +
      '<li><b>FLN (मूलभूत साक्षरता व संख्या-ज्ञान)</b> — पढ़ाई वाड़ी में ABC, वर्णमाला, गिनती (1–20) और पहला-अक्षर अभ्यास; साथ में श्रवण (सुनो-समझो) और वाक-अभ्यास (बोलो मेरे साथ) — भाषा के चारों कौशल: सुनना, बोलना, पढ़ना, लिखने की तैयारी।</li>' +
      '<li><b>परीक्षा-रहित मूल्यांकन</b> — सितारे प्रदर्शन-आधारित (1–3) हैं; हर गतिविधि का सर्वश्रेष्ठ प्रयास याद रहता है।</li>' +
      '<li><b>मातृभाषा-प्रथम</b> — सारे निर्देश और कहानियाँ देवनागरी हिंदी में, सही उच्चारण के साथ।</li>' +
      '<li><b>समग्र + SEL</b> — कला, संगीत, गति और सहानुभूति (प्रैंक वाली कहानी में "दर्द नहीं, हँसी")।</li>' +
      '</ul>';
    const c2 = el('div', 'pcard');
    c2.innerHTML =
      '<h3>📚 NCF से जुड़ाव</h3><ul>' +
      '<li><b>"बच्चा खुशी से सीखता है"</b> — हर गतिविधि एक खेल है, निर्देश आवाज़ में मिलते हैं।</li>' +
      '<li><b>जीवन से जुड़ा संदर्भ</b> — घर, परिवार, जन्मदिन, त्योहार, कहानियाँ।</li>' +
      '<li><b>कला + गति + संगीत का समावेश</b> — drawing, dance pads, piano पर याद से बजाना।</li>' +
      '</ul>';
    const c3 = el('div', 'pcard');
    c3.innerHTML =
      '<h3>🚀 कौशल — खेल के हिसाब से</h3>' +
      '<table class="ptable">' +
      '<tr><td>👻 छुपके छुपके</td><td>अवलोकन + तर्क — गरम–ठंडा संकेतों से खोज</td></tr>' +
      '<tr><td>🎥 व्लॉग स्टूडियो</td><td>योजना, क्रम, संवाद + प्रतिक्रिया-ध्यान (भूतू भगाना)</td></tr>' +
      '<tr><td>🌈 रंग पटाखा</td><td>रंग/आकार पहचान, एक-एक गिनती, अंक-ज्ञान</td></tr>' +
      '<tr><td>🔍 दादी की चाबी</td><td>तर्क — आधे इशारे से निष्कर्ष, कम खोज = बेहतर</td></tr>' +
      '<tr><td>🖌️ कला भंवरताला</td><td>सृजन + सूक्ष्म मोटर कौशल</td></tr>' +
      '<tr><td>🎵 सुर स्टूडियो</td><td>स्वर पहचान + क्रम-स्मृति (अभ्यास → बिना देखे बजाना)</td></tr>' +
      '<tr><td>💃 नाचो नाचो</td><td>कार्यशील स्मृति, ताल, तालमेल (3→5→7 कदम)</td></tr>' +
      '<tr><td>📖 कहानी वाड़ी</td><td>भाषा, क्रम-बोध, सहानुभूति (SEL)</td></tr>' +
      '<tr><td>🎒 पढ़ाई वाड़ी</td><td>FLN — अक्षर/वर्ण पहचान, गिनती 1–20, पहला-अक्षर बोध</td></tr>' +
      '<tr><td>🎧 सुनो-समझो</td><td>श्रवण-बोध — बिना देखे सिर्फ़ सुनकर पहचानना</td></tr>' +
      '<tr><td>🗣️ बोलो मेरे साथ</td><td>उच्चारण व आत्मविश्वास — सुनकर दोहराना, अपनी आवाज़ रिकॉर्ड करके सुनना</td></tr>' +
      '<tr><td>🎶 कविता वाड़ी</td><td>लय, स्मृति, भाषा-समृद्धि — 24 हिंदी/English कविताएँ, साथ बोलने का अभ्यास</td></tr>' +
      '<tr><td>🪄 जादुई कहानी</td><td>निर्णय-क्षमता, कारण-परिणाम बोध (खुद चुने रास्ते, दो अंत)</td></tr>' +
      '<tr><td>🧩 फोटो पहेली</td><td>दृश्य-स्मृति, भाग-पूर्ण बोध, धैर्य</td></tr>' +
      '</table>';
    const c4 = el('div', 'pcard');
    c4.innerHTML =
      '<h3>🛡️ सुरक्षा व सुझाव</h3><ul>' +
      '<li>कोई विज्ञापन नहीं, कोई chat नहीं, कोई login नहीं — सिर्फ़ खेल। परिवार की photos सिर्फ़ इस app के अंदर, डिवाइस पर ही रहती हैं।</li>' +
      '<li>कहानियों, जादुई कहानी और कविताओं की आवाज़ पहले से रिकॉर्ड की गई असली आवाज़ है (app के अंदर ही रखी है, internet ज़रूरी नहीं); खेलों की छोटी बातें डिवाइस की आवाज़ से होती हैं। बोलो मेरे साथ में माइक की रिकॉर्डिंग सिर्फ़ उसी समय के लिए होती है — कहीं जाती या save नहीं होती।</li>' +
      '<li>प्रगति phone/tablet में ही save होती है (localStorage)।</li>' +
      '</ul>' +
      '<div class="parents-note">💡 सुझाव: एक बार में 20–25 मिनट, फिर बाहर का खेल। कहानी के बाद पूरे परिवार के साथ उस पर बात करें — यही सहयोगात्मक सीख है!</div>';

    const c5 = el('div', 'pcard');
    c5.innerHTML =
      '<h3>🌱 पंचकोश विकास — हर हिस्सा कहाँ जुड़ता है</h3><ul>' +
      '<li><b>शारीरिक विकास</b> — नाचो नाचो (ताल-गति), कला भंवरताला (सूक्ष्म मोटर)।</li>' +
      '<li><b>प्राणिक (सामाजिक-भावनात्मक)</b> — संस्कार की सीख (दादी की बातें), कहानियों की सहानुभूति, परिवार के खेल।</li>' +
      '<li><b>मानसिक विकास</b> — स्मृति खेल (सुर स्टूडियो, फोटो पहेली), ध्यान (सुनो-समझो)।</li>' +
      '<li><b>बौद्धिक विकास</b> — तर्क (दादी की चाबी), FLN (पढ़ाई वाड़ी), निर्णय (जादुई कहानी)।</li>' +
      '<li><b>चैत्य (मूल्य व संस्कृति)</b> — देश के गीत (जन गण मन, वन्दे मातरम्), त्योहार-कहानियाँ, अच्छी आदतें।</li>' +
      '</ul>' +
      '<p style="margin-top:8px"><b>सीखने का चक्र (NCF-FS):</b> हर नई चीज़ पहले <b>सुनाई</b> देती है, फिर <b>दिखाई</b> देती है, बच्चा उसे <b>बोलता</b> है, और अंत में <b>खेलकर</b> पक्का करता है। यही क्रम पढ़ाई वाड़ी, कविताओं और कहानियों — तीनों में रखा गया है।</p>';
    stage.append(c1, c2, c5, c3, c4);
  };
})();
