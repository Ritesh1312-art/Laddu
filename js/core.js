/* =========================================================
   लड़्डू का खेल घर — Core V2: state, router, win overlay
   V2 नियम: सितारे "प्रदर्शन" पर मिलते हैं (1–3), पक्षी जीत
   नहीं। हर activity का सबसे अच्छा score याद रहता है।
   ========================================================= */
(function () {
  const KEY = 'laddu_khel_ghar_v2';
  const store = {
    load() { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { return {}; } },
    save(d) { try { localStorage.setItem(KEY, JSON.stringify(d)); } catch (e) {} }
  };

  const State = {
    data: Object.assign({ stars: {}, stickers: {}, sound: true }, store.load()),
    save() { store.save(this.data); if (window.App) App.updateHUD(); },
    best(id) { return this.data.stars[id] || 0; },
    recordStars(id, n) {
      if (!id) return;
      n = Math.max(1, Math.min(3, n | 0));
      if (n > (this.data.stars[id] || 0)) this.data.stars[id] = n;
      this.save();
    },
    total() { return Object.values(this.data.stars).reduce((a, b) => a + b, 0); },
    award(id) { if (id && !this.data.stickers[id]) { this.data.stickers[id] = Date.now(); this.save(); } },
    done(id) { return (this.data.stars[id] || 0) >= 1; },
    setSound(on) { this.data.sound = on; this.save(); }
  };

  const STICKERS = [
    { id: 'prank',   emoji: '😄', name: 'हँसी हीरो',        skill: 'ध्यान से देखना और ढूँढना', zone: 'कॉमेडी और प्रैंक' },
    { id: 'vlog',    emoji: '🎥', name: 'छोटा व्लॉगर',      skill: 'योजना बनाना और बात करना', zone: 'परिवार और व्लॉग' },
    { id: 'color',   emoji: '🌈', name: 'रंग चैम्पियन',     skill: 'रंग, आकार और गिनती', zone: 'कार्टून दुनिया' },
    { id: 'mystery', emoji: '🔍', name: 'रहस्य तोड़',       skill: 'सोचना और सुराग समझना', zone: 'रहस्य' },
    { id: 'craft',   emoji: '🖌️', name: 'कला उस्ताद',       skill: 'हाथों की कला', zone: 'चित्रकारा और कला' },
    { id: 'music',   emoji: '🎵', name: 'सुर सेना',         skill: 'सुर, ताल और याद', zone: 'संगीत और नृत्य' },
    { id: 'dance',   emoji: '💃', name: 'नाचा नाची',        skill: 'ताल और तालमेल', zone: 'संगीत और नृत्य' },
    { id: 's1', emoji: '😜', name: 'हँसी की कहानी',   skill: 'दोस्ती और अच्छाई', zone: 'कहानी वाड़ी' },
    { id: 's2', emoji: '🏠', name: 'परिवार की यादें',  skill: 'परिवार का प्यार', zone: 'कहानी वाड़ी' },
    { id: 's3', emoji: '📺', name: 'मेरा कार्टून',       skill: 'अपनी कहानी बनाना', zone: 'कहानी वाड़ी' },
    { id: 's4', emoji: '🗝️', name: 'चाबी का रहस्य',    skill: 'सुराग से सोचना', zone: 'कहानी वाड़ी' },
    { id: 's5', emoji: '✂️', name: 'तोहफ़े का दिन',     skill: 'रीसायकल और कला', zone: 'कहानी वाड़ी' },
    { id: 's6', emoji: '🎂', name: 'जन्मदिन का जादू',  skill: 'साथ में गाना-नाचना', zone: 'कहानी वाड़ी' },
    { id: 'guru',  emoji: '📚', name: 'कहानी गुरु',       skill: 'सारी 6 कहानियाँ (ख़ास!)', zone: 'कहानी वाड़ी' }
  ];

  const App = {
    screen: document.getElementById('screen'),
    overlay: document.getElementById('overlay'),
    screens: {},
    games: {},
    lastNav: { name: 'home', arg: null },
    greeted: false,

    nav(name, arg) {
      Speech.stop();
      if (window.SFX) SFX.stopBeat();
      this.lastNav = { name: name, arg: arg == null ? null : arg };
      this.screen.innerHTML = '';
      const fn = this.screens[name];
      if (fn) fn(this.screen, arg);
      window.scrollTo(0, 0);
      this.updateHUD();
    },

    updateHUD() {
      const elx = document.getElementById('starCount');
      if (elx) elx.textContent = State.total();
      const b = document.getElementById('btnSound');
      if (b) b.textContent = State.data.sound ? '🔊' : '🔇';
    },

    /* सितारे खेल के प्रदर्शन से आते हैं — opt.stars (1..3) */
    win(opt) {
      opt = opt || {};
      const earned = Math.max(1, Math.min(3, opt.stars || 1));
      const st = opt.sticker ? STICKERS.find(s => s.id === opt.sticker) : null;
      const first = st && !State.data.stickers[st.id];
      if (st) State.award(st.id);
      if (st && /^s[1-6]$/.test(st.id)) {
        const all = ['s1', 's2', 's3', 's4', 's5', 's6'].every(id => State.data.stickers[id]);
        if (all) State.award('guru');
      }
      if (opt.doneId) State.recordStars(opt.doneId, earned);
      FX.rain();
      SFX.chord();
      setTimeout(() => SFX.jingle(), 350);
      const o = this.overlay;
      o.className = 'overlay';
      o.innerHTML =
        '<div class="win-card pop-in">' +
          '<div class="win-trophy">🏆</div>' +
          '<div class="win-title">' + (opt.title || 'वाह!') + '</div>' +
          '<div class="win-sub">' + (opt.sub || 'बहुत बढ़िया खेले!') + '</div>' +
          (st
            ? '<div class="win-sticker pop-in"><span class="ws-emoji">' + st.emoji + '</span>' +
              '<span class="ws-name">' + (first ? '🎁 नया स्टिकर: ' : '') + st.name + '</span>' +
              '<span class="ws-skill">' + st.skill + '</span></div>'
            : '') +
          '<div class="win-stars">' + '⭐'.repeat(earned) + '☆'.repeat(3 - earned) + '</div>' +
          (earned < 3 ? '<div class="win-hint">और अच्छे से खेलो — 3 सितारे पाओ! 🌟</div>' : '') +
          '<div class="win-btns">' +
            '<button class="btn btn-primary" id="wAgain">🔁 फिर से</button>' +
            '<button class="btn btn-primary" id="wHome">🏡 घर</button>' +
          '</div>' +
        '</div>';
      o.querySelector('#wAgain').onclick = () => {
        SFX.pop();
        o.classList.add('hidden'); o.innerHTML = '';
        this.nav(opt.againName || this.lastNav.name, opt.againArg != null ? opt.againArg : this.lastNav.arg);
      };
      o.querySelector('#wHome').onclick = () => {
        SFX.pop();
        o.classList.add('hidden'); o.innerHTML = '';
        this.nav('home');
      };
      if (opt.say) Speech.say(opt.say, { stop: false });
    }
  };

  window.State = State;
  window.STICKERS = STICKERS;
  window.App = App;

  window.el = function (tag, cls, html) {
    const d = document.createElement(tag);
    if (cls) d.className = cls;
    if (html != null) d.innerHTML = html;
    return d;
  };

  document.addEventListener('pointerdown', function (e) {
    SFX.unlock();
    if (!App.greeted) {
      App.greeted = true;
      Speech.say('नमस्ते लड़्डू! आज क्या खेलेंगे?');
    }
    if (e.target.closest('[data-notap]')) return;
    if (e.target.closest('button, .tap')) SFX.tap();
  }, true);

  document.addEventListener('DOMContentLoaded', function () {
    App.updateHUD();
    SFX.setMuted(!State.data.sound);
    document.getElementById('btnSound').onclick = function () {
      State.setSound(!State.data.sound);
      SFX.setMuted(!State.data.sound);
      if (State.data.sound) SFX.ding();
    };
    document.getElementById('btnHome').onclick = function () { SFX.pop(); App.nav('home'); };
    document.getElementById('btnStars').onclick = function () { SFX.pop(); App.nav('album'); };
    App.nav('home');
  });
})();
