/* =========================================================
   Laddu Ka Khel Ghar — Kahaani Wadi
   6 kahaaniyan — Laddu ke 6 interest ke hisaab se.
   Characters realistic hain: Laddu, Chiku (chhota bhai),
   Amma, Papa, Dadi, aur ghar ka billi Mittu.
   ========================================================= */
window.STORIES = [
  {
    id: 's1', zone: 'comedy', title: 'Laddu Ka Hasi Prank', emoji: '😜',
    bg: 'linear-gradient(135deg,#fff1b8,#ffd9a0)',
    pages: [
      { char1: 'laddu', char2: 'chiku', e1: '🛏️', e2: '💡', deco: ['✨', '🌙'], text: 'Laddu subah uthti hai. Uske dimaag mein ek chamakti si baat aati hai — aaj Chiku ko ek "hase hase" prank karna hai. Par yaad rahe — aisa prank jo kisi ko na dukhaye!' },
      { char1: 'laddu', e1: '🎨', e2: '🍽️', deco: ['🖍️', '⭐'], text: 'Laddu ek safed plate par funny aankhein, chhoti naak aur "chanchal" mommakein kata karti hai. Ye hai uska jaadui "Hasi Plate"!' },
      { char1: 'laddu', char2: 'chiku', e1: '🥄', e2: '🥞', deco: ['☕', '🌻'], text: 'Laddu Chiku ko jagati hai — "Bhaiya! Aaj ka nashta double special hai!" Chiku khushi-khushi rasoi mein aata hai. Uski aankhein chamak rahi hain.' },
      { char1: 'chiku', char2: 'laddu', e1: '😲', e2: '🪞', deco: ['🎈', '😆'], text: 'Jaise hi Chiku baithta hai, Laddu plate uske saamne rakhti hai. "WOW!" — Chiku neeche dekhta hai, phir apni plate mein, aur hasi mein gir jaata hai!' },
      { char1: 'papa', char2: 'dadi', e1: '😂', e2: '👨‍👩‍👧‍👦', deco: ['🎉', '💛'], text: 'Saari family hasne lagti hai. Papa ke glasses hilne lagte hain, Dadi ki chappal tak gir jaati hai. Ghar mein hansi ka toofan chhoon jaata hai!' },
      { char1: 'chiku', char2: 'laddu', e1: '💛', e2: '🌟', deco: ['🤗', '⭐'], text: 'Raat ko Chiku kehta hai — "Laddu, tujhe pranks karna bahut aata hai, par asli jaadu hai aisi hasi, jismein koi na dukhe." Laddu ghoont leti hai — "Samjhi! Dosti mein hasi honi chahiye, dard nahi."' }
    ],
    khet: {
      say: 'Kahaani ke hisaab se items ko tap karo — pehle kya hua, phir kya hua!',
      win: 'Aap ne kahaani ka safar yaad kar liya!',
      items: [
        { e: '💡', l: 'Plan' },
        { e: '🎨', l: 'Hasi Plate' },
        { e: '🥞', l: 'Nashta' },
        { e: '😂', l: 'Hasi ka Toofan' }
      ]
    }
  },
  {
    id: 's2', zone: 'family', title: 'Amma Ka Vlog', emoji: '🏠',
    bg: 'linear-gradient(135deg,#e3d5ff,#ffd9ec)',
    pages: [
      { char1: 'amma', char2: 'laddu', e1: '📱', e2: '👩', deco: ['📸', '💡'], text: 'Amma apna phone uthati hai. "Aaj hum kuch naya karte hain — ek vlog! Par kaisa vlog? Ye aap sab decide karo." Saari family kaan khaati hai.' },
      { char1: 'laddu', char2: 'papa', e1: '🧒', e2: '🎬', deco: ['⭐', '👏'], text: 'Laddu chhaunk uthati hai — "Vlog toh ghar ki story ka banayenge!" Papa bolte hain — "Toh hum saath mein vlog karenge!" Ab plan bana — hum sab saath.' },
      { char1: 'dadi', char2: 'chiku', e1: '🍳', e2: '👵', deco: ['🫓', '🥛'], text: 'Pehla scene: rasoi! Dadi ke haath ke parathe, Chiku ka doodh ka gala, aur Laddu ki "action". Camera record karta hai — click! Click! Click!' },
      { char1: 'papa', char2: 'dadi', e1: '🎤', e2: '👨', deco: ['🎩', '😄'], text: 'Doosra scene: chaupal! Papa funny topi pehente hain, Chiku gaana gaata hai — "Tune kya kiya?" — aur Dadi sabko hasa deti hain. Yehi toh family ka magic hai!' },
      { char1: 'dadi', char2: 'amma', e1: '❤️', e2: '👵', deco: ['💛', '🌸'], text: 'Vlog taiyaar! Sabse pehle Dadi ko dikhaaya jaata hai. Dadi ke aankhon mein aansu aa jaate hain — "Ye video main sadiyon tak rakhungi." Pyaar ka vlog hai yeh.' },
      { char1: 'laddu', char2: 'amma', e1: '🌟', e2: '📱', deco: ['✨', '💖'], text: 'Laddu ko samajh aata hai — vlog ka matlab hai pyaar baantna. Apne parivaar ki haseen yaadein, aise kaam jo hum roz karte hain, unhe apna banana. Ghar ki story, duniya ke saath.' }
    ],
    khet: {
      say: 'Vlog banane ke steps kaunsa order theek hai? Tap karo!',
      win: 'Vlog banana aap ne seekh liya!',
      items: [
        { e: '📱', l: 'Phone uthao' },
        { e: '🍳', l: 'Scene banao' },
        { e: '🎤', l: 'Gaao-naacho' },
        { e: '❤️', l: 'Pyaar baanto' }
      ]
    }
  },
  {
    id: 's3', zone: 'cartoon', title: 'Laddu Ka Pehla Cartoon', emoji: '📺',
    bg: 'linear-gradient(135deg,#c9f0ff,#d9e8ff)',
    pages: [
      { char1: 'laddu', e1: '📺', e2: '🐦', deco: ['🌈', '⭐'], text: 'Sunday ki subah! Laddu apna favourite cartoon dekh rahi hai. Uska favourite character hai ek smart chidiya — "Mithoo". Mithoo hamesha naye ideas laata hai.' },
      { char1: 'laddu', e1: '✏️', e2: '📄', deco: ['🖍️', '💡'], text: 'Cartoon khatam. Laddu ki aankhein chamak jaati hain — "Aur kyun nahi main bhi apna cartoon banau?" Woh kagaz aur rangin pencil uthati hai. Adventure shuru!' },
      { char1: 'laddu', e1: '🎨', e2: '🐤', deco: ['🌟', '🖌️'], text: 'Laddu ek chidiya banati hai — laal par, neele patte, aur naam "Chikki". Chikki ki ek funny baat hai — "Main kabhi soya nahi hoon, main gungunata hoon!"' },
      { char1: 'laddu', char2: 'chiku', e1: '🧦', e2: '🎭', deco: ['😆', '👏'], text: 'Ab action! Laddu purani chaddar se puppet banati hai, aur Chiku "Chikki" ki awaaz nikalta hai — "Krrrr! Ruk kyun raha? Mera show chalu hai!"' },
      { char1: 'dadi', char2: 'chiku', e1: '👏', e2: '👨‍👩‍👧‍👦', deco: ['🎉', '🥳'], text: 'Raat ki "cartoon time"! Poora parivaar baitha hai. Laddu puppet najaatati hai, Chiku awaaz deta hai, Dadi taali bajati hai. Har 5 minute mein ek naya joke!' },
      { char1: 'laddu', e1: '🌟', e2: '🦸', deco: ['✨', '🧠'], text: 'Laddu ko lagta hai — cartoon dekhna achha hai, par apna banana? Woh toh jadui cheez hai! Imagination — yehi asli superhero power hai.' }
    ],
    khet: {
      say: 'Laddu ne apna cartoon kaise banaya? Sahi order mein tap karo!',
      win: 'Aap bhi cartoon bana sakte ho!',
      items: [
        { e: '📺', l: 'Cartoon dekho' },
        { e: '✏️', l: 'Chikki banao' },
        { e: '🎭', l: 'Puppet karo' },
        { e: '👏', l: 'Show do' }
      ]
    }
  },
  {
    id: 's4', zone: 'mystery', title: 'Dadi Ki Chabi Kahan?', emoji: '🔍',
    bg: 'linear-gradient(135deg,#d7c4f7,#b3e3e0)',
    pages: [
      { char1: 'dadi', char2: 'laddu', e1: '🗝️', e2: '👵', deco: ['😟', '🕯️'], text: 'Shaam hoti hai. Dadi bolte hain — "Mera laal keychain wali chabi nahi mil rahi! Bina chabi ke toh almara nahi khulega." Saari family ki naariyan neeche gir jaati hain.' },
      { char1: 'laddu', char2: 'dadi', e1: '🧒', e2: '💡', deco: ['🔍', '⭐'], text: 'Laddu haath uthati hai — "Dadi, main dhundh lungi! Mujhe clues chahiye." Dadi muskurati hain — "Toh suno — pehla clue: kuch ching... ching... ching... ki awaaz aayi thi."' },
      { char1: 'laddu', e1: '👂', e2: '🍳', deco: ['🥄', '❓'], text: 'Laddu kaan lagati hai... "ching... ching..." Awaaz rasoi se aarhi hai! Lekin wahan chabi nahi — sirf ghadi thi. "Ye ek chalaaki thi! Chabi ke paas chhota kanka lagta hai — awaaz chabi ki hai!"' },
      { char1: 'mittu', char2: 'laddu', e1: '🐱', e2: '📦', deco: ['🐾', '❗'], text: 'Dusra clue! Ghar ka billi Mittu ek chhote se box ko peeth raha hai. Mittu kabhi naa-kuch peethta nahi... ye box kahan se aaya? Mittu ki naak utha kar dekhta hai.' },
      { char1: 'laddu', char2: 'mittu', e1: '📦', e2: '🗝️', deco: ['✨', '🎉'], text: 'Laddu box uthati hai... andar hai Dadi ki laal chabi! Mittu ne chabi leke bhaag chuka tha! "Mittu, tu toh asli detective hai!" Mittu — mrreeeuuuw.' },
      { char1: 'dadi', char2: 'laddu', e1: '💛', e2: '🌟', deco: ['🤗', '⭐'], text: 'Dadi Laddu ko ghoont leti hain — "Meri beta, chabi toh mili, par aaj ek aur cheez mili — ek smart beti!" Laddu ko samajh aata hai — dhyan se dekhne se har rahasya toot jaata hai. Aur kabhi-kabhi clues... billi ke paas chubhe rehte hain!' }
    ],
    khet: {
      say: 'Chabi dhundhne ka order kya tha? Tap karo!',
      win: 'Aap toh asli detective ho!',
      items: [
        { e: '🗝️', l: 'Chabi gayi' },
        { e: '👂', l: 'Ching suno' },
        { e: '🐱', l: 'Mittu peeth raha' },
        { e: '📦', l: 'Box khola' }
      ]
    }
  },
  {
    id: 's5', zone: 'craft', title: 'Dadi Ke Liye Tohfa', emoji: '✂️',
    bg: 'linear-gradient(135deg,#ffd6e0,#ffe9c9)',
    pages: [
      { char1: 'dadi', char2: 'laddu', e1: '📅', e2: '👵', deco: ['🎂', '💭'], text: 'Agle hafte Dadi ka birthday! Laddu soch rahi hai — kya tohfa du? Dukaan se nahi... koi naya cheez banaungi, apne haathon se! Kya cheez? Hmm...' },
      { char1: 'laddu', e1: '📰', e2: '🧵', deco: ['🧴', '⭐'], text: 'Laddu purani newspaper, purane kagaz, glue, aur rangin kagaz ikatha karti hai. "Kachra nahi! Ye sab meri tohfe ki taqat hai!" — isko kehte hain recycle.' },
      { char1: 'laddu', char2: 'chiku', e1: '✂️', e2: '🌸', deco: ['🟡', '🌼'], text: 'Chal! Kaato! Laddu newspaper se phool kaati hai — petals gule, center peela. Kape se ek "Dadi ka muh" bhi kaata — gulla, muskaan ke saath. (Chiku ke chehre se copy kiya, Dadi ke jaisa nahi hai!)' },
      { char1: 'laddu', e1: '🖍️', e2: '🎨', deco: ['🌟', '⭐'], text: 'Ab rang aur chitkara! Laddu phoolon ko kagaz par chipkati hai, upar "HAPPY BIRTHDAY DADI" likhti hai, aur har phool par ek chhota sa star lagati hai.' },
      { char1: 'laddu', char2: 'dadi', e1: '🎁', e2: '👵', deco: ['🥹', '💖'], text: 'Birthday din! Laddu tohfa Dadi ko deti hai. Dadi use uthati hain, dekh rahi hain... aur aankhein nam ho jaati hain — "Ye maine dukaan se nahi khareedi, ye toh dil se banaya hai."' },
      { char1: 'dadi', char2: 'laddu', e1: '🌟', e2: '♻️', deco: ['✨', '🌈'], text: 'Laddu ko samajh aata hai — sabse bada tohfa hai pyaar, aur chhote se cheezein bhi badi baat ban jaati hain. Purani cheez se nayi cheez banana — isko kehte hain "recycle + jaadu".' }
    ],
    khet: {
      say: 'Tohfa banane ke steps kaunse the? Tap karo!',
      win: 'Aap bhi tohfe bana sakte ho!',
      items: [
        { e: '📅', l: 'Birthday' },
        { e: '📰', l: 'Kagaz uthao' },
        { e: '✂️', l: 'Kaato' },
        { e: '🎁', l: 'Tohfa do' }
      ]
    }
  },
  {
    id: 's6', zone: 'music', title: 'Happy Birthday Ka Jaadu', emoji: '🎵',
    bg: 'linear-gradient(135deg,#ffe9a8,#ffc9de)',
    pages: [
      { char1: 'dadi', char2: 'amma', e1: '🥘', e2: '👵', deco: ['🎶', '⭐'], text: 'Dadi ka birthday parivaar mein sabse bada din hai! Amma bolte hain — "Aaj hum sab saath mein gaayenge Happy Birthday!" Laddu tayaar hai — uska haath jhaank raha hai.' },
      { char1: 'laddu', char2: 'chiku', e1: '🎵', e2: '👦', deco: ['🥁', '😆'], text: 'Pehle practice! Laddu aur Chiku mitti ke bartan par haath maarte hain — "Dha... dha... dhin... dha!" — "Happy birthday to you..." — galat, par bahut funny! Dono has rahe hain.' },
      { char1: 'papa', char2: 'dadi', e1: '📣', e2: '👨‍👩‍👧‍👦', deco: ['🎤', '🥳'], text: 'Ab poora parivaar! Papa gaane ke saath saath hain, Dadi beat karti hain, Amma lyrics yaad dilati hain. Ek, do, teen — "Happy... BIRTHDAY... to DADI!" — sab chilla kar gaate hain!' },
      { char1: 'laddu', char2: 'dadi', e1: '💃', e2: '🕺', deco: ['🎶', '✨'], text: 'Ab naach ka waqt! Laddu kehti hai — "Round mein baithiye! Music jaise hi chalega, sab saath mein nachenge!" Ek-dhamaka — sab hilne lagte hain. Dadi bhi uth gayi hain!' },
      { char1: 'chiku', char2: 'dadi', e1: '🎂', e2: '🕯️', deco: ['🎈', '💛'], text: 'Cake aaya! 20 candles — Dadi ke 20 pyaare yaadein. Sab neer banaye, Happy Birthday gaate hue, Dadi aankhein band karke wish karti hain. Chiku bhi wish kar raha hai — 3 icecream!' },
      { char1: 'laddu', char2: 'chiku', e1: '💛', e2: '🎶', deco: ['⭐', '🤗'], text: 'Raat ko Laddu Chiku se kehti hai — "Kya pata hai music ka jaadu kya hai?" Chiku sochta hai — "Cake zyada sweet ho jaata hai?" Laddu hasti hai — "Nahi! Music humein saath jorda deta hai — har awaaz, har haath, ek hi dhun mein!"' }
    ],
    khet: {
      say: 'Birthday celebration ke steps kaunse the? Tap karo!',
      win: 'Aap ne music ka jaadu samajh liya!',
      items: [
        { e: '🥘', l: 'Dhamaka banao' },
        { e: '🎵', l: 'Practice karo' },
        { e: '💃', l: 'Round mein nacho' },
        { e: '🎂', l: 'Cake khao' }
      ]
    }
  }
];
