/* =========================================================
   लड़्डू का खेल घर — Hindi voice (Speech Synthesis)
   सारा text देवनागरी में है, ताकि hi-IN voice का उच्चारण
   सही आए (Roman text पर Hindi voice अटकती है)।
   ========================================================= */
(function () {
  let voice = null;
  function pick() {
    if (!('speechSynthesis' in window)) return;
    const vs = speechSynthesis.getVoices();
    voice =
      vs.find(v => /hi[-_]IN/i.test(v.lang)) ||
      vs.find(v => /^hi/i.test(v.lang)) ||
      vs.find(v => /en[-_]IN/i.test(v.lang)) ||
      null;
  }
  if ('speechSynthesis' in window) {
    pick();
    speechSynthesis.onvoiceschanged = pick;
  }
  const Speech = {
    say(text, opts) {
      /* आवाज़ कभी खेल को नहीं रोकेगी — TTS में कोई भी गड़बड़ हो, खेल चलता रहेगा */
      try {
        opts = opts || {};
        if (!('speechSynthesis' in window)) return;
        if (opts.stop !== false) speechSynthesis.cancel();
        const u = new SpeechSynthesisUtterance(text);
        u.lang = 'hi-IN';
        if (voice) u.voice = voice;
        u.rate = opts.rate || 0.95;
        u.pitch = opts.pitch || 1.1;
        u.volume = 1;
        if (opts.onend) u.onend = opts.onend;
        speechSynthesis.speak(u);
      } catch (e) { /* चुपचाप आगे बढ़ो */ }
    },
    stop() { if ('speechSynthesis' in window) speechSynthesis.cancel(); }
  };
  window.Speech = Speech;
})();
