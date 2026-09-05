/* =========================================================
   Game 2 — Vlog Studio (Family / Vlog zone)
   Apna family vlog banao: jaha, kaun, kya — phir record!
   Skill: Planning, sequencing, communication, family roles.
   ========================================================= */
(function () {
  const PLACES = {
    rasoi:   { name: 'rasoi',   bg: '🍳' },
    chaupal: { name: 'chaupal', bg: '🌳' },
    kamra:   { name: 'kamra',   bg: '🛏️' }
  };
  const PEOPLE = {
    amma:  { name: 'Amma',  e: '👩' },
    papa:  { name: 'Papa',  e: '👨' },
    chiku: { name: 'Chiku', e: '👦' },
    dadi:  { name: 'Dadi',  e: '👵' }
  };
  const ACTS = {
    khana:  { name: 'khaana bana rahe hain', e: '🍲' },
    gaana:  { name: 'gaana ga rahe hain', e: '🎤' },
    kahani: { name: 'kahani suna rahe hain', e: '📖' },
    dance:  { name: 'dance kar rahe hain', e: '🕺' }
  };

  App.games.vlog = {
    zone: 'family',
    name: 'Vlog Studio',
    emoji: '🎥',
    render(body) {
      const sel = { place: null, people: [], act: null };

      body.innerHTML =
        '<div id="v1" class="vstep">' +
          '<h3>Step 1: Kahan banega vlog?</h3>' +
          '<div class="opt-grid">' +
            Object.keys(PLACES).map(k =>
              '<button class="opt" data-place="' + k + '"><span class="opt-e">' + PLACES[k].bg + '</span>' + PLACES[k].name + '</button>'
            ).join('') +
          '</div>' +
        '</div>' +
        '<div id="v2" class="vstep hidden">' +
          '<h3>Step 2: Vlog mein kaun aayega?</h3>' +
          '<div class="opt-grid" id="peopleGrid">' +
            Object.keys(PEOPLE).map(k =>
              '<button class="opt" data-p="' + k + '"><span class="opt-e">' + PEOPLE[k].e + '</span>' + PEOPLE[k].name + '</button>'
            ).join('') +
          '</div>' +
          '<button class="btn btn-primary btn-big" id="to3" disabled>Agla →</button>' +
        '</div>' +
        '<div id="v3" class="vstep hidden">' +
          '<h3>Step 3: Parivaar kya kar raha hai?</h3>' +
          '<div class="opt-grid">' +
            Object.keys(ACTS).map(k =>
              '<button class="opt" data-act="' + k + '"><span class="opt-e">' + ACTS[k].e + '</span>' + ACTS[k].name + '</button>'
            ).join('') +
          '</div>' +
          '<button class="btn btn-primary btn-big" id="rec">🔴 RECORD KARO!</button>' +
        '</div>' +
        '<div id="v4" class="vstep hidden">' +
          '<div class="vlog-frame" id="vframe"></div>' +
          '<div class="vlog-caption" id="vcap"></div>' +
          '<div class="like-row">👍 <b id="likes">0</b> likes ' +
            '<button class="btn btn-like" id="likeBtn">❤️ Like karo!</button></div>' +
          '<div id="vdone" class="hidden" style="text-align:center">' +
            '<button class="btn btn-primary btn-big" id="vdoneBtn">🏆 Vlog taiyaar!</button>' +
          '</div>' +
        '</div>';

      const $ = id => body.querySelector('#' + id);
      const show = (on, off) => { $(on).classList.remove('hidden'); if (off) $(off).classList.add('hidden'); };

      /* Step 1 */
      body.querySelectorAll('[data-place]').forEach(b => {
        b.onclick = () => {
          sel.place = b.dataset.place;
          body.querySelectorAll('[data-place]').forEach(x => x.classList.toggle('sel', x === b));
          SFX.ding();
          Speech.say('Bahut achha! ' + PLACES[sel.place].name + ' mein vlog banega.', { stop: false });
          setTimeout(() => show('v2', 'v1'), 350);
        };
      });

      /* Step 2 */
      const to3 = $('to3');
      body.querySelectorAll('[data-p]').forEach(b => {
        b.onclick = () => {
          const k = b.dataset.p;
          const i = sel.people.indexOf(k);
          if (i >= 0) sel.people.splice(i, 1); else sel.people.push(k);
          b.classList.toggle('sel', i < 0);
          SFX.pop();
          to3.disabled = sel.people.length === 0;
          Speech.say((i < 0 ? PEOPLE[k].name + ' aayenge' : PEOPLE[k].name + ' nahi aayenge') + '.', { stop: false });
        };
      });
      to3.onclick = () => { SFX.ding(); show('v3', 'v2'); Speech.say('Ab batao, parivaar kya kar raha hai vlog mein?', { stop: false }); };

      /* Step 3 */
      body.querySelectorAll('[data-act]').forEach(b => {
        b.onclick = () => {
          sel.act = b.dataset.act;
          body.querySelectorAll('[data-act]').forEach(x => x.classList.toggle('sel', x === b));
          SFX.ding();
        };
      });

      /* Record! */
      $('rec').onclick = function () {
        if (!sel.act) { Speech.say('Pehle choose karo — parivaar kya kar raha hai?', { stop: false }); SFX.boing(); return; }
        SFX.record();
        const flash = el('div', 'cam-flash');
        document.body.append(flash);
        setTimeout(() => flash.remove(), 550);
        setTimeout(() => SFX.shutter(), 250);

        const fr = $('vframe');
        fr.innerHTML =
          '<div class="vf-bg">' + PLACES[sel.place].bg + '</div>' +
          '<div class="vf-rec">🔴 REC</div>' +
          '<div class="vf-act">' + ACTS[sel.act].e + '</div>' +
          '<div class="vf-people">' +
            sel.people.map((k, i) =>
              '<span class="vf-person" style="--i:' + i + '">' + PEOPLE[k].e + '</span>'
            ).join('') +
          '</div>';

        const names = sel.people.map(k => PEOPLE[k].name).join(', ');
        const cap = 'Namaste dosto! 🎥 Aaj hum ' + PLACES[sel.place].name + ' mein ' +
          ACTS[sel.act].name + '. Yeh rahe hamare — ' + names + '!';
        $('vcap').textContent = cap;
        show('v4', 'v3');
        Speech.say(cap);

        let likes = 0;
        $('likeBtn').onclick = function (e) {
          likes++;
          $('likes').textContent = likes;
          SFX.like();
          const h = el('span', 'float-heart', '❤️');
          h.style.left = e.clientX + 'px';
          h.style.top = e.clientY + 'px';
          document.body.append(h);
          setTimeout(() => h.remove(), 1400);
          if (likes === 3) {
            $('vdone').classList.remove('hidden');
            SFX.jingle();
            Speech.say('Teen likes! Vlog ab taiyaar hai. Button dabao!', { stop: false });
          }
        };

        $('vdoneBtn').onclick = function () {
          App.win({
            title: 'Aapka vlog taiyaar! 🎥',
            sub: 'Plan banaya, scene set kiya, record kiya — aap toh Chhota Vlogger ho!',
            sticker: 'vlog',
            doneId: 'game-vlog',
            stars: 3,
            say: 'Aapka family vlog taiyaar! Sabko dikhao!'
          });
        };
      };

      Speech.say('Chalo apna vlog banate hain! Pehle choose karo — vlog kahan banega?');
    }
  };
})();
