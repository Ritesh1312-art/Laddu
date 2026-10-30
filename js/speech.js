/* =========================================================
   लड़्डू का खेल घर — आवाज़ (Speech Synthesis) V2.1
   सुधार (2026-10-30): "Suno दबता है पर आवाज़ नहीं आती" वाली
   दिक़्क़त की जड़ें ठीक की गईं —
   1) cancel() के तुरंत बाद speak() कई Android/WebView पर
      चुपचाप गिर जाता था → अब हल्की देर (70ms) बाद बोलता है।
   2) synthesis 'paused' हालत में अटक जाता था → हर बार
      resume() करके जगाया जाता है + लंबी कहानी के बीच-बीच में
      keep-alive resume (Chrome का मशहूर 15s वाला स्टॉल)।
   3) voices की सूची देर से आती है → हर say() पर ताज़ा सूची,
      खाली हो तो voiceschanged का एक बार इंतज़ार।
   4) किसी ख़ास voice object पर चुपचाप fail → error पर एक बार
      बिना voice चुने (सिर्फ़ lang से) दोबारा कोशिश।
   5) पहली आवाज़ user के tap से जुड़ी हो → pointerdown पर
      unlock (core.js का greeting ही पहला tap बनता है)।
   अंग्रेज़ी अक्षरों के लिए sayEn() — en-IN आवाज़ से।
   नियम वही: TTS की कोई भी गड़बड़ खेल को कभी नहीं रोकेगी।
   ========================================================= */
(function () {
  const has = 'speechSynthesis' in window;
  let voices = [];
  let unlocked = false;

  function refresh() {
    if (!has) return;
    try { voices = speechSynthesis.getVoices() || []; } catch (e) { voices = []; }
  }
  function pick(langPref) {
    refresh();
    if (!voices.length) return null;
    if (langPref === 'en') {
      return voices.find(v => /en[-_]IN/i.test(v.lang)) ||
             voices.find(v => /en[-_]US/i.test(v.lang)) ||
             voices.find(v => /^en/i.test(v.lang)) || null;
    }
    return voices.find(v => /hi[-_]IN/i.test(v.lang)) ||
           voices.find(v => /^hi/i.test(v.lang)) ||
           voices.find(v => /en[-_]IN/i.test(v.lang)) || null;
  }
  if (has) {
    refresh();
    try { speechSynthesis.onvoiceschanged = refresh; } catch (e) {}
    /* कुछ WebView में सूची थोड़ी देर से भरती है — दो बार और झाँको */
    setTimeout(refresh, 300);
    setTimeout(refresh, 1200);
  }

  function speakNow(text, opts, langPref, isRetry) {
    const lang = langPref === 'en' ? 'en-IN' : 'hi-IN';
    const u = new SpeechSynthesisUtterance(text);
    u.lang = lang;
    const v = pick(langPref);
    if (v && !isRetry) u.voice = v;
    u.rate = opts.rate || (langPref === 'en' ? 0.9 : 0.95);
    u.pitch = opts.pitch || 1.1;
    u.volume = 1;
    let alive = null;
    const cleanup = () => { if (alive) { clearInterval(alive); alive = null; } };
    u.onend = () => { cleanup(); if (opts.onend) opts.onend(); };
    u.onerror = () => {
      cleanup();
      /* चुनी हुई voice पर fail हुआ हो तो एक बार बिना voice के बोलो */
      if (!isRetry && v) { try { speakNow(text, opts, langPref, true); return; } catch (e) {} }
      if (opts.onend) opts.onend();
    };
    try { speechSynthesis.resume(); } catch (e) {}
    speechSynthesis.speak(u);
    /* लंबी कहानी Chrome में ~15s पर अटकती है — हल्का keep-alive */
    alive = setInterval(() => {
      try {
        if (!speechSynthesis.speaking) { cleanup(); return; }
        speechSynthesis.pause(); speechSynthesis.resume();
      } catch (e) { cleanup(); }
    }, 10000);
  }

  function sayInternal(text, opts, langPref) {
    try {
      opts = opts || {};
      if (!has || !text) return;
      text = String(text);
      const start = () => {
        try {
          const busy = speechSynthesis.speaking || speechSynthesis.pending;
          if (opts.stop !== false && busy) {
            speechSynthesis.cancel();
            /* cancel के बाद तुरंत speak गिरता है — साँस भर की देर */
            setTimeout(() => { try { speakNow(text, opts, langPref, false); } catch (e) {} }, 70);
          } else {
            speakNow(text, opts, langPref, false);
          }
        } catch (e) { /* चुपचाप आगे बढ़ो */ }
      };
      refresh();
      if (!voices.length) {
        /* सूची अभी खाली है — voiceschanged का एक छोटा इंतज़ार, फिर कोशिश */
        let done = false;
        const go = () => { if (!done) { done = true; start(); } };
        try { speechSynthesis.addEventListener('voiceschanged', function h() { speechSynthesis.removeEventListener('voiceschanged', h); go(); }); } catch (e) {}
        setTimeout(go, 250);
      } else {
        start();
      }
    } catch (e) { /* आवाज़ कभी खेल नहीं रोकेगी */ }
  }

  const Speech = {
    say(text, opts) { sayInternal(text, opts, 'hi'); },
    sayEn(text, opts) { sayInternal(text, opts, 'en'); },
    stop() { if (has) { try { speechSynthesis.cancel(); } catch (e) {} } },
    unlock() {
      /* पहले user-tap पर एक खाली utterance — कई browser/WebView
         इसी से TTS को 'जागा हुआ' मानते हैं */
      try {
        if (!has || unlocked) return;
        unlocked = true;
        const u = new SpeechSynthesisUtterance('');
        u.volume = 0;
        speechSynthesis.speak(u);
      } catch (e) {}
    },
    hasVoice() { refresh(); return voices.length > 0; }
  };
  window.Speech = Speech;

  if (has) {
    document.addEventListener('pointerdown', () => Speech.unlock(), { once: true, capture: true });
  }
})();
