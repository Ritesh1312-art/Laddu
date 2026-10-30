/* =========================================================
   Masti Wadi (2026-10-30) — ghar ki jaan:
   🗣️ Bolne wala dost (Laddu ki photo chhuo — asal awaaz me
      baat karegi; clips js/audio/buddy.js, lazy)
   🎁 Aaj Ka Khazana — roz ek surprise (sticker/tohfa)
   🏠 Laddu ka Kamra — sitaaron se khulti sajawat
   ========================================================= */
(function () {
  /* ---------- Bolne wala dost ---------- */
  const LINES = [
    'नमस्ते दोस्त! मैं लड़्डू! आज हम खूब मज़ा करेंगे!',
    'एक मज़ाक सुनाऊँ? मछली स्कूल क्यों नहीं जाती? क्योंकि उसे पानी के बाहर की पढ़ाई समझ नहीं आती!',
    'मुझे पता है, आप आज कुछ नया ज़रूर सीखोगे! चलो शुरू करते हैं!',
    'भूतू कहता है — डरना मना है, हँसना ज़रूरी है!',
    'आज आपने कितने सितारे कमाए? और कमाओ, मेरा कमरा भी तो सजाना है!',
    'मिट्टू बिल्ली कहती है — म्याऊँ! मतलब होता है, तुम बहुत प्यारे हो!',
    'चीकू मेरा छोटा भाई है। वो सो रहा है। शोर मत करना, ही ही!',
    'क्या आपको पता है? तितली अपने पैरों से स्वाद चखती है! है ना कमाल की बात!',
    'दादी कहती हैं — जो रोज़ कुछ नया सीखता है, वो रोज़ थोड़ा और बड़ा होता है।',
    'चलो एक वादा करो — आज एक अच्छी बात ज़रूर करोगे! पक्का वाला वादा!'
  ];
  let buddyAudio = null, buddyLoading = false, lastLine = -1;
  window.BuddyTalk = function (bubbleEl) {
    let i = Math.floor(Math.random() * LINES.length);
    if (i === lastLine) i = (i + 1) % LINES.length;
    lastLine = i;
    if (bubbleEl) { bubbleEl.textContent = '💬 ' + LINES[i]; bubbleEl.style.display = 'block'; }
    if (buddyAudio) { try { buddyAudio.pause(); } catch (e) {} buddyAudio = null; }
    if (window.Speech) Speech.stop();
    const useClip = () => {
      const clips = window.BUDDY_AUDIO;
      if (clips && clips[i]) {
        try {
          const a = new Audio(clips[i]);
          buddyAudio = a;
          const pr = a.play();
          if (pr && pr.catch) pr.catch(() => Speech.say(LINES[i]));
          return true;
        } catch (e) { return false; }
      }
      return false;
    };
    if (window.BUDDY_AUDIO) { if (!useClip()) Speech.say(LINES[i]); return; }
    if (buddyLoading) { Speech.say(LINES[i]); return; }
    buddyLoading = true;
    const sc = document.createElement('script');
    sc.src = 'js/audio/buddy.js';
    sc.onload = () => { buddyLoading = false; if (!useClip()) Speech.say(LINES[i]); };
    sc.onerror = () => { buddyLoading = false; Speech.say(LINES[i]); };
    document.head.appendChild(sc);
  };

  /* ---------- Aaj Ka Khazana ---------- */
  const KHAZANA_STICKERS = ['k1', 'k2', 'k3', 'k4', 'k5', 'k6'];
  const KHAZANA_LINES = [
    'आज का खज़ाना खुला! कल फिर आना, नया surprise मिलेगा!',
    'वाह! खज़ाना बाबा खुश हुए! ये tohfa सिर्फ़ आज के लिए था!',
    'खज़ाना कहता है — जो रोज़ आता है, उसे रोज़ नया tohfa मिलता है!'
  ];
  function todayKey() {
    const d = new Date();
    return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
  }
  window.KhazanaMount = function (host) {
    host.innerHTML = '';
    const opened = State.data.khazanaDay === todayKey();
    const box = el('button', 'btn pop-in');
    box.style.cssText = 'width:100%;font-size:20px;padding:14px;background:linear-gradient(135deg,#f6d365,#fda085);border:none';
    if (opened) {
      box.innerHTML = '🎁 आज का खज़ाना <span style="font-size:14px">खुल गया — कल फिर आना! 🌅</span>';
      box.onclick = () => { SFX.pop(); Speech.say('आज का खज़ाना खुल चुका है! कल सुबह नया surprise मिलेगा!'); };
    } else {
      box.innerHTML = '🎁 <b>आज का खज़ाना</b> <span style="font-size:14px">दबाओ — surprise मिलेगा! ✨</span>';
      box.onclick = () => {
        State.data.khazanaDay = todayKey();
        const remaining = KHAZANA_STICKERS.filter(id => !State.data.stickers[id]);
        let line;
        if (remaining.length) {
          const id = remaining[Math.floor(Math.random() * remaining.length)];
          State.award(id);
          const st = STICKERS.find(s => s.id === id);
          line = 'नया स्टिकर मिला — ' + (st ? st.name : 'खज़ाना स्टिकर') + '! एल्बम में देखो!';
        } else {
          line = KHAZANA_LINES[Math.floor(Math.random() * KHAZANA_LINES.length)];
        }
        State.save();
        SFX.chord(); FX.rain();
        Speech.say('खज़ाना खुला! ' + line);
        window.KhazanaMount(host);
        const note = el('div', 'ln-progress', '🎉 ' + line);
        host.append(note);
      };
    }
    host.append(box);
  };

  /* ---------- Laddu ka Kamra ---------- */
  const ROOM_ITEMS = [
    { cost: 4,  e: '🪟', name: 'रंगीन पर्दा',       style: 'left:6%;top:8%' },
    { cost: 9,  e: '🧸', name: 'बड़ा भालू खिलौना',  style: 'right:8%;bottom:16%' },
    { cost: 15, e: '🖼️', name: 'दीवार की तस्वीर',   style: 'right:10%;top:10%' },
    { cost: 22, e: '🌸', name: 'फूलों का गमला',     style: 'left:10%;bottom:14%' },
    { cost: 30, e: '📚', name: 'किताबों की अलमारी', style: 'left:38%;bottom:12%' },
    { cost: 39, e: '🛋️', name: 'आराम कुर्सी',       style: 'right:34%;bottom:10%' },
    { cost: 49, e: '🎈', name: 'गुब्बारों का गुच्छा', style: 'left:44%;top:6%' },
    { cost: 60, e: '👑', name: 'सुनहरा ताज कमरा',   style: 'right:44%;top:6%' }
  ];
  App.screens.kamra = function (stage) {
    stage.innerHTML = '';
    const back = el('button', 'btn btn-back', '← घर');
    back.onclick = () => { SFX.pop(); App.nav('home'); };
    const head = el('div', 'game-head');
    head.append(back, el('div', 'game-title', '🏠 लड़्डू का कमरा'));
    stage.append(head);

    const total = State.total();
    const openedCount = ROOM_ITEMS.filter(it => total >= it.cost).length;
    if (openedCount === ROOM_ITEMS.length) State.award('kamra');

    const room = el('div');
    room.style.cssText = 'position:relative;height:340px;border-radius:22px;overflow:hidden;background:linear-gradient(180deg,#ffe3ec 0%,#ffe3ec 68%,#d9a066 68%,#c98d54 100%);box-shadow:0 6px 18px rgba(0,0,0,.15)';
    room.innerHTML = '<div style="position:absolute;left:50%;bottom:26%;transform:translateX(-50%)">' +
      Characters.getAvatarHTML('laddu', 110, '') + '</div>';
    ROOM_ITEMS.forEach(it => {
      const has = total >= it.cost;
      const d = el('button');
      d.style.cssText = 'position:absolute;' + it.style + ';font-size:44px;background:none;border:none;cursor:pointer;font-family:inherit;' + (has ? '' : 'filter:grayscale(1);opacity:.35');
      d.textContent = it.e;
      d.title = it.name;
      d.onclick = () => {
        if (has) { SFX.ding(); Speech.say('ये है — ' + it.name + '! आपके सितारों से खुला है!'); }
        else { SFX.boing(); Speech.say(it.name + ' के लिए ' + it.cost + ' सितारे चाहिए। अभी आपके पास ' + total + ' हैं। और खेलो, और कमाओ!'); }
      };
      room.append(d);
    });
    stage.append(room);
    const next = ROOM_ITEMS.find(it => total < it.cost);
    stage.append(el('div', 'ln-ask',
      'आपके सितारे: ⭐ ' + total + ' — खुली sajawat: ' + openedCount + '/' + ROOM_ITEMS.length +
      (next ? '<br>अगला तोहफ़ा: ' + next.e + ' ' + next.name + ' (' + next.cost + ' ⭐ पर)' : '<br>👑 पूरा कमरा सज गया! आप तो कमाल हो!')));
    Speech.say('ये है लड़्डू का कमरा! आपके ' + total + ' सितारों से ' + openedCount + ' sajawat खुली है!');
  };
})();
