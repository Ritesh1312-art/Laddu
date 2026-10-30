/* =========================================================
   जादुई कहानी (2026-10-30) — Interactive kahani:
   "लड़्डू और जादुई बाग़" — baccha chunav karta hai, kahani
   usi hisaab se badti hai; 2 alag ant. Narration asal
   record ki hui awaaz (MAI_01) me — js/audio/i1.js (lazy)।
   ========================================================= */
(function () {
  const SEGS = {
    start:    { e: '🚪✨', text: 'एक सुबह लड़्डू घर के पीछे वाले पुराने दरवाज़े के पास खेल रही थी। अचानक दरवाज़े के पीछे से सुनहरी रोशनी झलकने लगी। लड़्डू की आँखें चमक गईं।',
                choices: [['🚪 दरवाज़ा खोलो!', 'gate'], ['👵 दादी को बुलाओ!', 'dadi']] },
    gate:     { e: '🌸🦋🥭', text: 'लड़्डू ने धीरे से दरवाज़ा खोला। अंदर था एक जादुई बाग़! फूल गा रहे थे, तितलियाँ नाच रही थीं, और एक छोटा सा पेड़ सोने के आमों से लदा था।',
                choices: [['🌸 गाते फूलों के पास जाओ', 'flowers'], ['🥭 सोने के आम वाले पेड़ के पास जाओ', 'tree']] },
    dadi:     { e: '👵💛', text: 'लड़्डू दौड़कर दादी को बुला लाई। दादी मुस्कुराईं और बोलीं — यह बाग़ सिर्फ़ उन्हीं को दिखता है, जिनका दिल साफ़ होता है। चलो, साथ चलते हैं!',
                choices: [['🌸 गाते फूलों के पास जाओ', 'flowers'], ['🥭 सोने के आम वाले पेड़ के पास जाओ', 'tree']] },
    flowers:  { e: '🌹🎵', text: 'फूलों ने एक प्यारा गीत गाया, पर गीत के बीच में वे रुक गए। छोटा गुलाब बोला — हम गीत भूल गए हैं। क्या तुम हमारी मदद करोगी?',
                choices: [['🎤 गीत गाकर याद दिलाओ', 'sing'], ['🦋 तितलियों से पूछो', 'butterfly']] },
    tree:     { e: '🐢🥭', text: 'पेड़ के नीचे एक बुज़ुर्ग कछुआ बैठा था। कछुआ बोला — सोने का आम उसी को मिलता है, जो पहले किसी की मदद करता है। दूर कहीं एक छोटी चिड़िया रो रही थी।',
                choices: [['🐦 चिड़िया के पास जाओ', 'bird'], ['🐢 कछुए से बातें करो', 'turtle']] },
    sing:     { e: '🎶🌸', text: 'लड़्डू ने अपना स्कूल वाला गीत गाना शुरू किया। फूल झूम उठे और पूरा गीत गाने लगे। खुश होकर गुलाब ने लड़्डू को एक जादुई बीज दिया।',
                choices: [['🌱 आगे देखो — क्या हुआ?', 'seed_end']] },
    butterfly:{ e: '🦋🌈', text: 'तितलियों ने अपने पंखों से रंगों का इशारा किया — लाल, पीला, नीला। वही गीत के शब्दों का क्रम था! फूल फिर से गाने लगे और बाग़ झूम उठा।',
                choices: [['🌱 आगे देखो — क्या हुआ?', 'seed_end']] },
    bird:     { e: '🐦🪺', text: 'छोटी चिड़िया का घोंसला नीचे गिर गया था। लड़्डू ने धीरे से घोंसला उठाकर डाल पर रख दिया। चिड़िया खुशी से चहचहाने लगी।',
                choices: [['🥭 आगे देखो — क्या हुआ?', 'mango_end']] },
    turtle:   { e: '🐢📖', text: 'कछुए ने बताया — सौ साल पहले एक छोटी लड़की ने यहाँ के पौधों को पानी पिलाया था, तभी से यह पेड़ सोने के आम देता है। अच्छे काम कभी पुराने नहीं होते।',
                choices: [['🥭 आगे देखो — क्या हुआ?', 'mango_end']] },
    seed_end: { e: '🌱🌙', text: 'लड़्डू ने जादुई बीज घर के आँगन में बो दिया। दादी बोलीं — कल यहाँ से एक नया जादू उगेगा। उस रात लड़्डू मुस्कुराते हुए सो गई।', end: 'seed' },
    mango_end:{ e: '🥭✨', text: 'तभी पेड़ से एक सोने का आम लड़्डू की गोद में आ गिरा। कछुआ मुस्कुराया — देखा, मदद करने वालों को तोहफ़ा खुद मिलता है। लड़्डू आम लेकर खुशी-खुशी घर लौट आई।', end: 'mango' }
  };

  /* chhota apna player — ISTORY_AUDIO pehle se ho to wahi, warna lazy-load */
  const Player = {
    audio: null, loading: false,
    stop() { if (this.audio) { try { this.audio.pause(); } catch (e) {} this.audio = null; } if (window.Speech) Speech.stop(); },
    play(segId, fallbackText) {
      this.stop();
      const self = this;
      const useClip = () => {
        const clips = window.ISTORY_AUDIO;
        if (clips && clips[segId]) {
          try {
            const a = new Audio(clips[segId]);
            self.audio = a;
            const pr = a.play();
            if (pr && pr.catch) pr.catch(() => Speech.say(fallbackText));
            return true;
          } catch (e) { return false; }
        }
        return false;
      };
      if (window.ISTORY_AUDIO) { if (!useClip()) Speech.say(fallbackText); return; }
      if (this.loading) { Speech.say(fallbackText); return; }
      this.loading = true;
      const sc = document.createElement('script');
      sc.src = 'js/audio/i1.js';
      sc.onload = () => { self.loading = false; if (!useClip()) Speech.say(fallbackText); };
      sc.onerror = () => { self.loading = false; Speech.say(fallbackText); };
      document.head.appendChild(sc);
    }
  };
  window.IStoryPlayer = Player;

  App.screens.istory = function (stage) {
    let segId = 'start';
    function render() {
      const seg = SEGS[segId];
      stage.innerHTML = '';
      const back = el('button', 'btn btn-back', '← घर');
      back.onclick = () => { Player.stop(); SFX.pop(); App.nav('home'); };
      const head = el('div', 'story-head');
      head.append(back, el('h2', null, '🪄 लड़्डू और जादुई बाग़'));
      stage.append(head);

      const book = el('div', 'book pop-in');
      const scene = el('div', 'scene');
      scene.style.background = 'linear-gradient(135deg,#d9f99d,#a7f3d0)';
      scene.innerHTML = '<span class="sc-e1" style="font-size:64px">' + seg.e + '</span>';
      book.append(scene);
      const segTxt = el('div', 'page-text', seg.text);
      segTxt.style.cursor = 'pointer';
      segTxt.title = 'सुनने के लिए छुओ';
      segTxt.onclick = () => Player.play(seg);
      book.append(segTxt);
      const ctl = el('div', 'page-ctl');
      const listenB = el('button', 'btn btn-primary', '🔊 सुनो');
      listenB.onclick = () => { SFX.pop(); Player.play(segId, seg.text); };
      ctl.append(listenB);
      book.append(ctl);
      stage.append(book);
      Player.play(segId, seg.text);

      if (seg.end) {
        const endings = Object.assign({}, State.data.iEndings || {});
        endings[seg.end] = true;
        State.data.iEndings = endings; State.save();
        const both = endings.seed && endings.mango;
        const fin = el('button', 'btn btn-primary ln-go', both ? '🏆 कहानी पूरी — दोनों अंत मिले!' : '🏆 कहानी पूरी!');
        fin.onclick = () => {
          Player.stop();
          App.win({
            doneId: 'istory-main', sticker: 'istory', stars: both ? 3 : 2,
            title: 'जादुई कहानी पूरी! 🪄',
            sub: both ? 'आपने दोनों अंत देख लिए — बीज वाला भी, आम वाला भी!' : 'एक और अंत भी है — फिर खेलो, दूसरा रास्ता चुनो!',
            say: 'वाह! जादुई कहानी पूरी हो गई!',
            againName: 'istory'
          });
        };
        stage.append(fin);
      } else {
        stage.append(el('div', 'ln-ask', 'अब क्या हो? तुम चुनो! 👇'));
        const opts = el('div', 'ln-opts');
        seg.choices.forEach(ch => {
          const b = el('button', 'ln-opt txt', ch[0]);
          b.onclick = () => { Player.stop(); SFX.ding(); segId = ch[1]; render(); };
          opts.append(b);
        });
        stage.append(opts);
      }
    }
    render();
  };
})();
