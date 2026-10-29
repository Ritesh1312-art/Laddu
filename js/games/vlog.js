/* =========================================================
   Game 2 — व्लॉग स्टूडियो V2 (परिवार और व्लॉग)
   V2 डिज़ाइन: असली परिवार की photos के साथ दृश्य, फिर
   रिकॉर्डिंग का असली खेल — भूतू फोटो-बॉम्ब करने आएगा,
   उसे समय पर छूकर भगाओ! अंत में premiere: परिवार की
   प्रतिक्रिया। (खुद को Like दबाने वाला खेल ख़त्म।)
   ========================================================= */
(function () {
  const PLACES = {
    rasoi:   { name: 'रसोई',   bg: '🍳' },
    chaupal: { name: 'चौपाल', bg: '🌳' },
    kamra:   { name: 'कमरा',   bg: '🛏️' }
  };
  const ACTS = {
    khana:  { name: 'खाना बना रहे हैं', e: '🍲' },
    gaana:  { name: 'गाना गा रहे हैं', e: '🎤' },
    kahani: { name: 'कहानी सुना रहे हैं', e: '📖' },
    dance:  { name: 'नाच रहे हैं', e: '🕺' }
  };
  const CAST_IDS = ['amma', 'papa', 'chiku', 'dadi', 'mittu'];
  const PRAISE = {
    amma: 'अम्मा: "मेरा व्लॉग तो बहुत प्यारा बना!" 😍',
    papa: 'पापा: "वाह! कैमरा तो कमाल का चलाया!" 🤩',
    chiku: 'चीकू: "मैं टीवी पर आ गया! मैं टीवी पर आ गया!" 😆',
    dadi: 'दादी: "यह याद मैं हमेशा रखूँगी।" 🥹',
    mittu: 'मिट्टू: "म्याऊँ!" 🐱 (मतलब — बहुत बढ़िया!)'
  };

  App.games.vlog = {
    zone: 'family',
    name: 'व्लॉग स्टूडियो',
    emoji: '🎥',
    render(body) {
      const sel = { place: null, people: [], act: null };
      const cast = {};
      Characters.FAMILY.forEach(m => { cast[m.id] = m; });

      body.innerHTML =
        '<div id="v1" class="vstep">' +
          '<h3>चरण 1: व्लॉग कहाँ बनेगा?</h3>' +
          '<div class="opt-grid">' +
            Object.keys(PLACES).map(k =>
              '<button class="opt" data-place="' + k + '"><span class="opt-e">' + PLACES[k].bg + '</span>' + PLACES[k].name + '</button>'
            ).join('') +
          '</div>' +
        '</div>' +
        '<div id="v2" class="vstep hidden">' +
          '<h3>चरण 2: व्लॉग में कौन आएगा? (फोटो छुओ)</h3>' +
          '<div class="opt-grid" id="peopleGrid"></div>' +
          '<button class="btn btn-primary btn-big" id="to3" disabled>अगला →</button>' +
        '</div>' +
        '<div id="v3" class="vstep hidden">' +
          '<h3>चरण 3: परिवार क्या कर रहा होगा?</h3>' +
          '<div class="opt-grid">' +
            Object.keys(ACTS).map(k =>
              '<button class="opt" data-act="' + k + '"><span class="opt-e">' + ACTS[k].e + '</span>' + ACTS[k].name + '</button>'
            ).join('') +
          '</div>' +
          '<button class="btn btn-primary btn-big" id="rec">🔴 रिकॉर्ड करो!</button>' +
          '<p class="hint" style="text-align:center">⚠️ रिकॉर्डिंग में भूतू शरारत करने आएगा — उसे छूकर भगाना!</p>' +
        '</div>' +
        '<div id="v4" class="vstep hidden">' +
          '<div class="vlog-frame rec-frame" id="vframe"></div>' +
          '<div class="vlog-caption" id="vcap"></div>' +
          '<div class="vlog-status" id="vstatus"></div>' +
          '<div id="vdone" class="hidden" style="text-align:center">' +
            '<button class="btn btn-primary btn-big" id="vdoneBtn">🏆 व्लॉग तैयार!</button>' +
          '</div>' +
        '</div>';

      const $ = id => body.querySelector('#' + id);
      const show = (on, off) => { $(on).classList.remove('hidden'); if (off) $(off).classList.add('hidden'); };

      /* चरण 2 के लोग — असली photos */
      const pg = $('peopleGrid');
      CAST_IDS.forEach(id => {
        const m = cast[id];
        const b = el('button', 'opt person-opt');
        b.innerHTML = Characters.getAvatarHTML(m, 56, 'opt-avatar') + '<span>' + m.name + '</span>';
        b.onclick = () => {
          const i = sel.people.indexOf(id);
          if (i >= 0) sel.people.splice(i, 1); else sel.people.push(id);
          b.classList.toggle('sel', i < 0);
          SFX.pop();
          $('to3').disabled = sel.people.length === 0;
          Speech.say((i < 0 ? m.name + ' आएँगे' : m.name + ' नहीं आएँगे') + '।', { stop: false });
        };
        pg.append(b);
      });

      body.querySelectorAll('[data-place]').forEach(b => {
        b.onclick = () => {
          sel.place = b.dataset.place;
          body.querySelectorAll('[data-place]').forEach(x => x.classList.toggle('sel', x === b));
          SFX.ding();
          Speech.say('बहुत अच्छा! ' + PLACES[sel.place].name + ' में व्लॉग बनेगा।', { stop: false });
          setTimeout(() => show('v2', 'v1'), 350);
        };
      });
      $('to3').onclick = () => { SFX.ding(); show('v3', 'v2'); Speech.say('अब बताओ, परिवार क्या कर रहा होगा?', { stop: false }); };
      body.querySelectorAll('[data-act]').forEach(b => {
        b.onclick = () => {
          sel.act = b.dataset.act;
          body.querySelectorAll('[data-act]').forEach(x => x.classList.toggle('sel', x === b));
          SFX.ding();
        };
      });

      /* ---------- रिकॉर्डिंग: भूतू फोटो-बॉम्ब खेल ---------- */
      $('rec').onclick = function () {
        if (!sel.act) { Speech.say('पहले चुनो — परिवार क्या कर रहा होगा?', { stop: false }); SFX.boing(); return; }
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
            sel.people.map(id =>
              '<span class="vf-person">' + Characters.getAvatarHTML(cast[id], 54, 'vf-avatar') + '</span>'
            ).join('') +
          '</div>';
        const names = sel.people.map(id => cast[id].name).join(', ');
        $('vcap').textContent = 'नमस्ते दोस्तों! 🎥 आज हम ' + PLACES[sel.place].name + ' में ' +
          ACTS[sel.act].name + '। साथ हैं — ' + names + '!';
        show('v4', 'v3');
        Speech.say('रिकॉर्डिंग शुरू! भूतू आए तो उसे छूकर भगाओ!');

        let caught = 0, spawns = 0;
        const status = $('vstatus');
        status.textContent = '🎬 रिकॉर्डिंग चल रही है... भूतू पर नज़र रखो! 👀';

        function spawnBhootu() {
          if (!fr.isConnected) return;
          spawns++;
          const g = el('div', 'bhootu-bomb');
          g.innerHTML = '<img src="assets/characters/bhootu.png" alt="भूतू"/>';
          g.style.left = (8 + Math.random() * 68) + '%';
          g.style.top = (6 + Math.random() * 40) + '%';
          let got = false;
          g.onclick = (e) => {
            if (got) return;
            got = true;
            caught++;
            SFX.honk();
            FX.burst(e.clientX, e.clientY, 14);
            g.classList.add('caught');
            status.textContent = 'भगाया! 🎉 (' + caught + '/4)';
            Speech.say('भगाया!', { stop: false });
            setTimeout(() => g.remove(), 200);
          };
          fr.append(g);
          setTimeout(() => {
            if (!got && g.isConnected) {
              g.classList.add('bombed');
              status.textContent = 'ओहो! भूतू फोटो में आ गया! 📸😜';
              Speech.say('ओहो! भूतू फोटो में आ गया!', { stop: false });
              setTimeout(() => g.remove(), 700);
            }
          }, 1150);
        }
        [1200, 3400, 5600, 7800].forEach(t => setTimeout(spawnBhootu, t));
        setTimeout(() => { if (fr.isConnected) premiere(caught); }, 10200);
      };

      function premiere(caught) {
        const status = $('vstatus');
        status.textContent = '🎉 Premiere! परिवार देख रहा है...';
        Speech.say('प्रिमियर! देखो, सब क्या कहते हैं!');
        const fr = $('vframe');
        fr.querySelector('.vf-rec').textContent = '▶️ PREMIERE';
        let delay = 400;
        sel.people.forEach(id => {
          setTimeout(() => {
            if (!fr.isConnected) return;
            status.textContent = PRAISE[id];
            Speech.say(PRAISE[id].replace(/.*?: /, ''), { stop: false });
            SFX.like();
            const h = el('span', 'float-heart', '❤️');
            h.style.left = (30 + Math.random() * 40) + '%';
            h.style.top = '30%';
            fr.append(h);
            setTimeout(() => h.remove(), 1400);
          }, delay);
          delay += 1500;
        });
        setTimeout(() => {
          if (!fr.isConnected) return;
          status.textContent = '👀 ' + (120 + caught * 40 + sel.people.length * 25) + ' लोगों ने देखा • ❤️ सबको बहुत पसंद आया!';
          $('vdone').classList.remove('hidden');
          SFX.jingle();
        }, delay + 300);

        $('vdoneBtn').onclick = function () {
          const stars = caught >= 4 ? 3 : (caught === 3 ? 2 : 1);
          App.win({
            title: 'आपका व्लॉग तैयार! 🎥',
            sub: caught >= 4 ? 'एक भी फोटो-बॉम्ब नहीं! परफ़ेक्ट शूटिंग — असली छोटा व्लॉगर!' :
                 caught === 3 ? 'सिर्फ़ एक बार भूतू घुस पाया — बढ़िया शूटिंग!' :
                 'भूतू कई बार फोटो में आ गया! अगली बार तेज़ हाथ, 3 सितारे पक्के!',
            sticker: 'vlog',
            doneId: 'game-vlog',
            stars: stars,
            say: 'आपका परिवार व्लॉग तैयार! सबको दिखाओ!'
          });
        };
      }

      Speech.say('चलो अपना व्लॉग बनाते हैं! पहले चुनो — व्लॉग कहाँ बनेगा?');
    }
  };
})();
