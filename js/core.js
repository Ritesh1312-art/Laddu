/* =========================================================
   Laddu Ka Khel Ghar — Core: state, router, win overlay
   ========================================================= */
(function () {
  const KEY = 'laddu_khel_ghar_v1';
  const store = {
    load() { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { return {}; } },
    save(d) { try { localStorage.setItem(KEY, JSON.stringify(d)); } catch (e) {} }
  };

  const State = {
    data: Object.assign({ stars: {}, stickers: {}, sound: true, total: 0 }, store.load()),
    save() { store.save(this.data); if (window.App) App.updateHUD(); },
    addStars(n) { this.data.total += n; this.save(); },
    award(id) { if (id && !this.data.stickers[id]) { this.data.stickers[id] = Date.now(); this.save(); } },
    done(id) { return !!this.data.stars[id]; },
    markDone(id) { if (id && !this.data.stars[id]) { this.data.stars[id] = Date.now(); this.save(); } },
    setSound(on) { this.data.sound = on; this.save(); }
  };

  const STICKERS = [
    { id: 'prank',   emoji: '😄', name: 'Hasi Hero',          skill: 'Dhyan aur dekhne ki aadat', zone: 'Comedy & Prank' },
    { id: 'vlog',    emoji: '🎥', name: 'Chhota Vlogger',     skill: 'Plan banana aur baat karna', zone: 'Family & Vlog' },
    { id: 'color',   emoji: '🌈', name: 'Rang Champion',      skill: 'Rang, aakaar aur ginti', zone: 'Cartoon Duniya' },
    { id: 'mystery', emoji: '🔍', name: 'Rahasya Todda',      skill: 'Sochna aur clue samajhna', zone: 'Mystery' },
    { id: 'craft',   emoji: '🖌️', name: 'Kala Ustad',         skill: 'Hathon ki kala (creativity)', zone: 'Chitkara & Kala' },
    { id: 'music',   emoji: '🎵', name: 'Sitar Sena',         skill: 'Swar, taal aur yaad', zone: 'Music & Dance' },
    { id: 'dance',   emoji: '💃', name: 'Natcha Nachi',       skill: 'Rhythm aur coordination', zone: 'Music & Dance' },
    { id: 's1', emoji: '😜', name: 'Hasi ki Kahaani',   skill: 'Dosti aur achhai (SEL)', zone: 'Kahaani Wadi' },
    { id: 's2', emoji: '🏠', name: 'Family yaadein',     skill: 'Family pyaar', zone: 'Kahaani Wadi' },
    { id: 's3', emoji: '📺', name: 'Mera Cartoon',       skill: 'Apni kahani banana', zone: 'Kahaani Wadi' },
    { id: 's4', emoji: '🗝️', name: 'Chabi ka rahasya',   skill: 'Clue se sochna', zone: 'Kahaani Wadi' },
    { id: 's5', emoji: '✂️', name: 'Tohfa ka din',       skill: 'Recycle + creativity', zone: 'Kahaani Wadi' },
    { id: 's6', emoji: '🎂', name: 'Birthday jaadu',     skill: 'Sath mein gana-naachna', zone: 'Kahaani Wadi' },
    { id: 'guru',  emoji: '📚', name: 'Kahaani Guru',       skill: 'Saari 6 kahaaniyan (special!)', zone: 'Kahaani Wadi' }
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
      this.lastNav = { name: name, arg: arg == null ? null : arg };
      this.screen.innerHTML = '';
      const fn = this.screens[name];
      if (fn) fn(this.screen, arg);
      window.scrollTo(0, 0);
      this.updateHUD();
    },

    updateHUD() {
      const el = document.getElementById('starCount');
      if (el) el.textContent = State.data.total;
      const b = document.getElementById('btnSound');
      if (b) b.textContent = State.data.sound ? '🔊' : '🔇';
    },

    win(opt) {
      opt = opt || {};
      const st = opt.sticker ? STICKERS.find(s => s.id === opt.sticker) : null;
      const first = st && !State.data.stickers[st.id];
      if (st) State.award(st.id);
      /* Special: saari 6 kahaaniyan khatam -> Kahaani Guru sticker */
      if (st && /^s[1-6]$/.test(st.id)) {
        const all = ['s1', 's2', 's3', 's4', 's5', 's6'].every(id => State.data.stickers[id]);
        if (all) State.award('guru');
      }
      State.addStars(opt.stars || 3);
      State.markDone(opt.doneId || '');
      FX.rain();
      SFX.chord();
      setTimeout(() => SFX.jingle(), 350);
      const o = this.overlay;
      o.className = 'overlay';
      o.innerHTML =
        '<div class="win-card pop-in">' +
          '<div class="win-trophy">🏆</div>' +
          '<div class="win-title">' + (opt.title || 'Waah!') + '</div>' +
          '<div class="win-sub">' + (opt.sub || 'Aap bahut sharafati ho!') + '</div>' +
          (st
            ? '<div class="win-sticker pop-in"><span class="ws-emoji">' + st.emoji + '</span>' +
              '<span class="ws-name">' + (first ? '🎁 Naya Sticker: ' : '') + st.name + '</span>' +
              '<span class="ws-skill">' + st.skill + '</span></div>'
            : '') +
          '<div class="win-stars">' + '⭐'.repeat(opt.stars || 3) + '</div>' +
          '<div class="win-btns">' +
            '<button class="btn btn-primary" id="wAgain">🔁 Phir se</button>' +
            '<button class="btn btn-primary" id="wHome">🏡 Ghar</button>' +
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

  /* Chhota helper */
  window.el = function (tag, cls, html) {
    const d = document.createElement(tag);
    if (cls) d.className = cls;
    if (html != null) d.innerHTML = html;
    return d;
  };

  /* Har click par halki si awaaz — full-on enjoyment! */
  document.addEventListener('pointerdown', function (e) {
    SFX.unlock();
    if (!App.greeted) {
      App.greeted = true;
      Speech.say('Namaste Laddu! Aaj kya khelenge?');
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
