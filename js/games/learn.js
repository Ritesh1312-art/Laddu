/* =========================================================
   पढ़ाई वाड़ी V2 (2026-10-30) — खेल-खेल में सीख:
   🔤 ABC मस्ती (English alphabet) • ✍️ वर्णमाला खेल
   🔢 गिनती मस्ती (1–20, छूकर गिनो) • 🙏 संस्कार खेल (good manners)
   हर खेल: पहले "सीखो पट्टी" (छूओ — सुनो), फिर मज़ेदार चुनौती।
   सितारे प्रदर्शन पर (ग़लती 0 = ⭐⭐⭐), V2 नियम के हिसाब से।
   ========================================================= */
(function () {
  function shuffled(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }
  function starsFor(mistakes) { return mistakes === 0 ? 3 : mistakes <= 2 ? 2 : 1; }
  const PRAISE = ['वाह! 🎉', 'कमाल! 🌟', 'शाबाश! 😄', 'बिल्कुल सही! 🎈'];

  /* सीख-खेलों की अपनी हल्की शैली (मौजूदा design से मेल खाती) */
  if (!document.getElementById('learnStyle')) {
    const st = document.createElement('style');
    st.id = 'learnStyle';
    st.textContent =
      '.ln-strip{display:flex;gap:8px;overflow-x:auto;padding:10px 2px;scrollbar-width:thin}' +
      '.ln-chip{flex:0 0 auto;min-width:52px;height:52px;border-radius:16px;border:none;background:#fff;' +
      'box-shadow:0 3px 0 rgba(0,0,0,.15);font-size:24px;font-weight:800;color:#5b4a8a;cursor:pointer;font-family:inherit}' +
      '.ln-chip:active{transform:scale(.92)}' +
      '.ln-stage{background:#fff;border-radius:22px;padding:18px;text-align:center;box-shadow:0 6px 18px rgba(0,0,0,.12);margin:8px 0}' +
      '.ln-big{font-size:84px;line-height:1.05;font-weight:800;color:#ff7b54}' +
      '.ln-word{font-size:30px;font-weight:700;color:#333;margin-top:4px}' +
      '.ln-emo{font-size:56px}' +
      '.ln-ask{font-size:21px;font-weight:700;color:#444;text-align:center;margin:12px 4px}' +
      '.ln-opts{display:flex;gap:10px;justify-content:center;flex-wrap:wrap;margin:10px 0}' +
      '.ln-opt{min-width:84px;padding:14px 10px;font-size:30px;font-weight:800;border:none;border-radius:18px;' +
      'background:#fff;color:#5b4a8a;box-shadow:0 4px 0 rgba(0,0,0,.18);cursor:pointer;font-family:inherit}' +
      '.ln-opt:active{transform:scale(.94)}' +
      '.ln-opt.txt{font-size:19px;min-width:0;max-width:46%;line-height:1.35}' +
      '.ln-count-zone{display:flex;flex-wrap:wrap;gap:10px;justify-content:center;padding:14px;background:#fff;' +
      'border-radius:22px;box-shadow:0 6px 18px rgba(0,0,0,.12);min-height:120px;align-items:center}' +
      '.ln-obj{font-size:44px;cursor:pointer;transition:transform .15s;border:none;background:none;font-family:inherit}' +
      '.ln-obj.counted{opacity:.35;transform:scale(.8)}' +
      '.ln-progress{text-align:center;font-weight:700;color:#888;margin:6px}' +
      '.ln-go{width:100%;margin-top:10px}';
    document.head.appendChild(st);
  }

  function head(body, stripTitle) {
    const h = el('div', 'ln-progress', stripTitle);
    body.append(h);
    return h;
  }
  function stageCard(body) {
    const s = el('div', 'ln-stage pop-in');
    body.append(s);
    return s;
  }

  /* ================= 🔤 ABC मस्ती ================= */
  const ABC = [
    ['A', 'Apple', '🍎'], ['B', 'Ball', '⚽'], ['C', 'Cat', '🐱'], ['D', 'Dog', '🐶'],
    ['E', 'Elephant', '🐘'], ['F', 'Fish', '🐟'], ['G', 'Grapes', '🍇'], ['H', 'Hen', '🐔'],
    ['I', 'Ice Cream', '🍦'], ['J', 'Juice', '🧃'], ['K', 'Kite', '🪁'], ['L', 'Lion', '🦁'],
    ['M', 'Mango', '🥭'], ['N', 'Nest', '🪺'], ['O', 'Orange', '🍊'], ['P', 'Parrot', '🦜'],
    ['Q', 'Queen', '👸'], ['R', 'Rabbit', '🐰'], ['S', 'Sun', '☀️'], ['T', 'Tiger', '🐯'],
    ['U', 'Umbrella', '☂️'], ['V', 'Van', '🚐'], ['W', 'Watch', '⌚'], ['X', 'X-mas Tree', '🎄'],
    ['Y', 'Yo-Yo', '🪀'], ['Z', 'Zebra', '🦓']
  ];
  App.games.abc = {
    zone: 'school', name: 'ABC मस्ती', emoji: '🔤',
    render(body) {
      head(body, '👇 अक्षर छूओ — सुनो! फिर चुनौती खेलो!');
      const strip = el('div', 'ln-strip');
      const stage = stageCard(body);
      function show(item) {
        stage.innerHTML = '<div class="ln-big">' + item[0] + '</div>' +
          '<div class="ln-emo">' + item[2] + '</div>' +
          '<div class="ln-word">' + item[0] + ' — ' + item[1] + '</div>';
        Speech.sayEn(item[0] + '! ' + item[1] + '!');
      }
      ABC.forEach(item => {
        const c = el('button', 'ln-chip', item[0]);
        c.onclick = () => { SFX.pop(); show(item); };
        strip.append(c);
      });
      body.append(strip);
      show(ABC[0]);
      const go = el('button', 'btn btn-primary ln-go', '🎮 चुनौती शुरू — पहला अक्षर पहचानो!');
      go.onclick = () => { SFX.ding(); quiz(); };
      body.append(go);

      function quiz() {
        body.innerHTML = '';
        const rounds = shuffled(ABC).slice(0, 8);
        let idx = 0, mistakes = 0;
        function round() {
          if (idx >= rounds.length) {
            App.win({ doneId: 'game-abc', sticker: 'abc', stars: starsFor(mistakes), title: 'ABC हीरो! 🔤', sub: 'आपने ' + rounds.length + ' अक्षर पहचाने!', say: 'वाह! आप तो ABC हीरो हो!' });
            return;
          }
          const item = rounds[idx];
          body.innerHTML = '';
          head(body, 'चुनौती ' + (idx + 1) + ' / ' + rounds.length);
          const s = stageCard(body);
          const rest = item[0] === 'X' ? item[1].slice(2) : item[1].slice(1);
          s.innerHTML = '<div class="ln-emo">' + item[2] + '</div>' +
            '<div class="ln-word">_ ' + rest + '</div>';
          const ask = el('div', 'ln-ask', 'इस शब्द का पहला अक्षर कौन सा है?');
          body.append(ask);
          Speech.say(item[1] + ' किस अक्षर से शुरू होता है?', {});
          setTimeout(() => Speech.sayEn(item[1] + '!', { stop: false }), 1400);
          const opts = el('div', 'ln-opts');
          const choices = shuffled([item].concat(shuffled(ABC.filter(x => x[0] !== item[0])).slice(0, 2)));
          choices.forEach(ch => {
            const b = el('button', 'ln-opt', ch[0]);
            b.onclick = () => {
              if (ch[0] === item[0]) {
                SFX.ding(); FX.spark && FX.spark();
                Speech.say(PRAISE[idx % PRAISE.length] + ' ' + item[0] + ' — ' + item[1] + '!', {});
                setTimeout(() => Speech.sayEn(item[0] + '! ' + item[1] + '!', { stop: false }), 900);
                idx++; setTimeout(round, 1500);
              } else {
                SFX.boing(); mistakes++;
                Speech.say('फिर सोचो! ' + item[1] + ' किससे शुरू होता है?', { stop: false });
                b.style.opacity = '.35'; b.disabled = true;
              }
            };
            opts.append(b);
          });
          body.append(opts);
        }
        round();
      }
    }
  };

  /* ================= ✍️ वर्णमाला खेल ================= */
  const SWAR = [
    ['अ', 'अनार', '🍈'], ['आ', 'आम', '🥭'], ['इ', 'इमली', '🌿'], ['ई', 'ईख', '🎋'],
    ['उ', 'उल्लू', '🦉'], ['ऊ', 'ऊन', '🧶'], ['ऋ', 'ऋषि', '🧙'], ['ए', 'एक', '1️⃣'],
    ['ऐ', 'ऐनक', '👓'], ['ओ', 'ओखली', '🥣'], ['औ', 'औरत', '👩'], ['अं', 'अंडा', '🥚']
  ];
  const VYAN = [
    ['क', 'कबूतर', '🕊️'], ['ख', 'खरगोश', '🐰'], ['ग', 'गाय', '🐄'], ['घ', 'घर', '🏠'],
    ['च', 'चूहा', '🐭'], ['छ', 'छतरी', '☂️'], ['ज', 'जहाज़', '🚢'], ['झ', 'झंडा', '🚩'],
    ['ट', 'टमाटर', '🍅'], ['ठ', 'ठंड', '❄️'], ['ड', 'डमरू', '🪘'], ['ढ', 'ढोल', '🥁'],
    ['त', 'तोता', '🦜'], ['थ', 'थरमस', '🍶'], ['द', 'दवात', '🖋️'], ['ध', 'धनुष', '🏹'],
    ['न', 'नल', '🚰'], ['प', 'पतंग', '🪁'], ['फ', 'फल', '🍇'], ['ब', 'बकरी', '🐐'],
    ['भ', 'भालू', '🐻'], ['म', 'मछली', '🐟'], ['य', 'यज्ञ', '🔥'], ['र', 'रथ', '🛕'],
    ['ल', 'लट्टू', '🌀'], ['व', 'वक', '🦢'], ['श', 'शलगम', '🥬'], ['स', 'सपेरा', '🎺'],
    ['ह', 'हाथी', '🐘'], ['ज्ञ', 'ज्ञानी', '🧙']
  ];
  App.games.varn = {
    zone: 'school', name: 'वर्णमाला खेल', emoji: '✍️',
    render(body) {
      head(body, '👇 स्वर और व्यंजन छूओ — सुनो! फिर चुनौती!');
      const stage = stageCard(body);
      function show(item) {
        stage.innerHTML = '<div class="ln-big">' + item[0] + '</div>' +
          '<div class="ln-emo">' + item[2] + '</div>' +
          '<div class="ln-word">' + item[0] + ' — ' + item[1] + '</div>';
        Speech.say(item[0] + '! ' + item[1] + '!');
      }
      const t1 = el('div', 'ln-progress', '— स्वर —');
      body.append(t1);
      const s1 = el('div', 'ln-strip');
      SWAR.forEach(it => { const c = el('button', 'ln-chip', it[0]); c.onclick = () => { SFX.pop(); show(it); }; s1.append(c); });
      body.append(s1);
      const t2 = el('div', 'ln-progress', '— व्यंजन —');
      body.append(t2);
      const s2 = el('div', 'ln-strip');
      VYAN.forEach(it => { const c = el('button', 'ln-chip', it[0]); c.onclick = () => { SFX.pop(); show(it); }; s2.append(c); });
      body.append(s2);
      show(SWAR[0]);
      const go = el('button', 'btn btn-primary ln-go', '🎮 चुनौती शुरू — पहला अक्षर पहचानो!');
      go.onclick = () => { SFX.ding(); quiz(); };
      body.append(go);

      function quiz() {
        body.innerHTML = '';
        const pool = shuffled(SWAR).slice(0, 4).concat(shuffled(VYAN).slice(0, 4));
        const rounds = shuffled(pool);
        let idx = 0, mistakes = 0;
        function round() {
          if (idx >= rounds.length) {
            App.win({ doneId: 'game-varn', sticker: 'varn', stars: starsFor(mistakes), title: 'अक्षर उस्ताद! ✍️', sub: 'आपने ' + rounds.length + ' अक्षर पहचाने!', say: 'कमाल! आप तो अक्षर उस्ताद हो!' });
            return;
          }
          const item = rounds[idx];
          const all = SWAR.concat(VYAN);
          body.innerHTML = '';
          head(body, 'चुनौती ' + (idx + 1) + ' / ' + rounds.length);
          const s = stageCard(body);
          const restV = item[0] === 'ज्ञ' ? 'ानी' : item[1].slice(item[0].length);
          s.innerHTML = '<div class="ln-emo">' + item[2] + '</div>' +
            '<div class="ln-word">_ ' + restV + '</div>';
          const ask = el('div', 'ln-ask', item[1] + ' किस अक्षर से शुरू होता है?');
          body.append(ask);
          Speech.say(item[1] + ' किस अक्षर से शुरू होता है?');
          const opts = el('div', 'ln-opts');
          const choices = shuffled([item].concat(shuffled(all.filter(x => x[0] !== item[0])).slice(0, 2)));
          choices.forEach(ch => {
            const b = el('button', 'ln-opt', ch[0]);
            b.onclick = () => {
              if (ch[0] === item[0]) {
                SFX.ding();
                Speech.say(PRAISE[idx % PRAISE.length] + ' ' + item[0] + ' — ' + item[1] + '!', { stop: false });
                idx++; setTimeout(round, 1500);
              } else {
                SFX.boing(); mistakes++;
                Speech.say('फिर सोचो! ' + item[1] + ' किससे शुरू होता है?', { stop: false });
                b.style.opacity = '.35'; b.disabled = true;
              }
            };
            opts.append(b);
          });
          body.append(opts);
        }
        round();
      }
    }
  };

  /* ================= 🔢 गिनती मस्ती ================= */
  const NUM_HI = ['एक', 'दो', 'तीन', 'चार', 'पाँच', 'छह', 'सात', 'आठ', 'नौ', 'दस', 'ग्यारह', 'बारह', 'तेरह', 'चौदह', 'पंद्रह', 'सोलह', 'सत्रह', 'अठारह', 'उन्नीस', 'बीस'];
  const NUM_EN = ['One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen', 'Twenty'];
  const COUNT_THINGS = [
    { e: '🍎', name: 'सेब' }, { e: '⭐', name: 'सितारे' }, { e: '🐦', name: 'चिड़ियाँ' },
    { e: '🌸', name: 'फूल' }, { e: '🍊', name: 'संतरे' }, { e: '🦋', name: 'तितलियाँ' }
  ];
  App.games.ginti = {
    zone: 'school', name: 'गिनती मस्ती', emoji: '🔢',
    render(body) {
      head(body, '👇 अंक छूओ — हिंदी और English में सुनो!');
      const strip = el('div', 'ln-strip');
      const stage = stageCard(body);
      function show(n) {
        let stars = '';
        for (let i = 0; i < n; i++) stars += '⭐';
        stage.innerHTML = '<div class="ln-big">' + n + '</div>' +
          '<div class="ln-word">' + NUM_HI[n - 1] + ' — ' + NUM_EN[n - 1] + '</div>' +
          '<div style="font-size:22px;line-height:1.5">' + stars + '</div>';
        Speech.say(NUM_HI[n - 1] + '!');
        setTimeout(() => Speech.sayEn(NUM_EN[n - 1] + '!', { stop: false }), 800);
      }
      for (let n = 1; n <= 20; n++) {
        const c = el('button', 'ln-chip', '' + n);
        c.onclick = () => { SFX.pop(); show(n); };
        strip.append(c);
      }
      body.append(strip);
      show(1);
      const go = el('button', 'btn btn-primary ln-go', '🎮 चुनौती शुरू — छूकर गिनो!');
      go.onclick = () => { SFX.ding(); quiz(); };
      body.append(go);

      function quiz() {
        body.innerHTML = '';
        const targets = [4, 7, 9, 12, 15, 18];
        let idx = 0, mistakes = 0;
        function round() {
          if (idx >= targets.length) {
            App.win({ doneId: 'game-ginti', sticker: 'ginti', stars: starsFor(mistakes), title: 'गिनती बादशाह! 🔢', sub: 'आपने 18 तक गिनती कर दिखाई!', say: 'वाह! आप तो गिनती बादशाह हो!' });
            return;
          }
          const n = targets[idx];
          const thing = COUNT_THINGS[idx % COUNT_THINGS.length];
          body.innerHTML = '';
          head(body, 'चुनौती ' + (idx + 1) + ' / ' + targets.length);
          const ask = el('div', 'ln-ask', thing.e + ' ' + thing.name + ' एक-एक करके छूकर गिनो!');
          body.append(ask);
          Speech.say(thing.name + ' गिनो! एक-एक करके छूओ!');
          const zone = el('div', 'ln-count-zone');
          let counted = 0;
          for (let i = 0; i < n; i++) {
            const o = el('button', 'ln-obj', thing.e);
            o.onclick = () => {
              if (o.classList.contains('counted')) return;
              o.classList.add('counted');
              counted++;
              SFX.pop();
              Speech.say(NUM_HI[counted - 1] + '!', { stop: false });
              if (counted === n) setTimeout(askTotal, 900);
            };
            zone.append(o);
          }
          body.append(zone);
          const optWrap = el('div', 'ln-opts');
          body.append(optWrap);
          function askTotal() {
            const a = el('div', 'ln-ask', 'कुल कितने ' + thing.name + ' हुए?');
            body.insertBefore(a, optWrap);
            Speech.say('कुल कितने हुए? सही अंक चुनो!');
            const cand = shuffled([n, n - 1, n + 2].filter((v, i, arr) => v >= 1 && arr.indexOf(v) === i));
            while (cand.length < 3) cand.push(n + 3);
            cand.forEach(v => {
              const b = el('button', 'ln-opt', '' + v);
              b.onclick = () => {
                if (v === n) {
                  SFX.ding();
                  Speech.say(PRAISE[idx % PRAISE.length] + ' पूरे ' + NUM_HI[n - 1] + '!', { stop: false });
                  idx++; setTimeout(round, 1600);
                } else {
                  SFX.boing(); mistakes++;
                  Speech.say('फिर से गिनकर देखो!', { stop: false });
                  b.style.opacity = '.35'; b.disabled = true;
                }
              };
              optWrap.append(b);
            });
          }
        }
        round();
      }
    }
  };

  /* ================= 🙏 संस्कार खेल ================= */
  const MANNERS = [
    { e: '🌅', q: 'सुबह-सुबह दादा जी मिले। क्या कहोगे?', opts: ['नमस्ते दादा जी! 🙏', 'कुछ नहीं कहूँगा', 'रास्ता छोड़ो!'], good: 0, learn: 'बड़ों को सुबह नमस्ते कहना अच्छी आदत है!' },
    { e: '🍬', q: 'अम्मा ने प्यार से टॉफ़ी दी। क्या कहोगे?', opts: ['और दो!', 'धन्यवाद अम्मा! 💛', 'चुपचाप भाग जाऊँगा'], good: 1, learn: 'कुछ मिले तो धन्यवाद कहना चाहिए!' },
    { e: '🧸', q: 'दोस्त का खिलौना खेलना है। कैसे माँगोगे?', opts: ['छीन लूँगा!', 'फेंक दो इधर!', 'कृपया दे दो! 🤲'], good: 2, learn: 'कृपया कहकर माँगना सबसे प्यारा तरीका है!' },
    { e: '😲', q: 'खेल में ग़लती से दोस्त को धक्का लग गया। क्या करोगे?', opts: ['माफ़ करो दोस्त! 😔', 'भाग जाऊँगा', 'उसी की ग़लती थी!'], good: 0, learn: 'ग़लती हो जाए तो माफ़ी माँगना बहादुरी है!' },
    { e: '🍽️', q: 'खाना खाने का समय हुआ। पहले क्या करोगे?', opts: ['सीधे खाने बैठूँगा', 'हाथ धोऊँगा! 🧼', 'मोबाइल चलाऊँगा'], good: 1, learn: 'खाने से पहले हाथ धोना सेहत की आदत है!' },
    { e: '🤧', q: 'छींक आ रही है! क्या करोगे?', opts: ['सब पर छींकूँगा', 'मुँह पर रूमाल रखूँगा! 🤧', 'रोक लूँगा हमेशा'], good: 1, learn: 'छींक-खाँसी में मुँह ढकना सबकी भलाई है!' },
    { e: '🤝', q: 'पापा ने आपकी मदद की। क्या कहोगे?', opts: ['शुक्रिया पापा! 😊', 'ये तो काम था', 'कुछ नहीं'], good: 0, learn: 'मदद मिले तो शुक्रिया कहना न भूलो!' },
    { e: '🌙', q: 'सोने का समय है। सबसे क्या कहकर सोओगे?', opts: ['बिना कहे सो जाऊँगा', 'शोर मचाऊँगा', 'शुभ रात्रि! 🌙'], good: 2, learn: 'शुभ रात्रि कहकर सोना दिन का प्यारा अंत है!' }
  ];
  App.games.manners = {
    zone: 'school', name: 'संस्कार खेल', emoji: '🙏',
    render(body) {
      let idx = 0, mistakes = 0;
      function round() {
        if (idx >= MANNERS.length) {
          App.win({ doneId: 'game-manners', sticker: 'manners', stars: starsFor(mistakes), title: 'संस्कार सितारा! 🙏', sub: 'आपने सारी अच्छी आदतें सीख लीं!', say: 'शाबाश! आप तो संस्कार सितारा हो!' });
          return;
        }
        const m = MANNERS[idx];
        body.innerHTML = '';
        head(body, 'दादी पूछती हैं — ' + (idx + 1) + ' / ' + MANNERS.length);
        const s = stageCard(body);
        s.innerHTML = '<div style="display:flex;justify-content:center">' + Characters.getAvatarHTML('dadi', 76, '') + '</div>' +
          '<div class="ln-emo">' + m.e + '</div>' +
          '<div class="ln-ask" style="margin-top:6px">' + m.q + '</div>';
        Speech.say(m.q);
        const opts = el('div', 'ln-opts');
        m.opts.forEach((t, i) => {
          const b = el('button', 'ln-opt txt', t);
          b.onclick = () => {
            if (i === m.good) {
              SFX.ding();
              Speech.say(PRAISE[idx % PRAISE.length] + ' ' + m.learn, { stop: false });
              idx++; setTimeout(round, 2400);
            } else {
              SFX.boing(); mistakes++;
              Speech.say('हम्म, फिर सोचो! दादी मुस्कुरा रही हैं।', { stop: false });
              b.style.opacity = '.35'; b.disabled = true;
            }
          };
          opts.append(b);
        });
        body.append(opts);
      }
      Speech.say('संस्कार खेल! दादी के सवालों के सबसे प्यारे जवाब चुनो!');
      round();
    }
  };
})();
