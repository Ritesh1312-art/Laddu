# 🏡 Laddu Ka Khel Ghar

**Khelo • Suno • Seekho!** — Ek game-based learning app (Hindi-first) jo NEP 2020 (Foundational Stage 3–8), NCF aur 21st Century Skills ke hisaab se bani hai. Koi quiz nahi — sirf games, awaazein, kahaaniyan aur maza!

## 🎮 Kya-kya hai?

| Zone (Interest) | Activity | Skill |
|---|---|---|
| 😜 Comedy & Prank | **Chupke Chupke Prank** — funny bhootu pakdo | Observation, attention |
| 🎥 Family & Vlog | **Vlog Studio** — apna family vlog banao, record karo, likes kamao | Planning, communication |
| 📺 Cartoon Duniya | **Rang Pataka** — rang / aakaar / ginti, cartoon character ke saath | Colors, shapes, counting |
| 🕵️ Mystery & Rahasya | **Dadi Ki Chabi** — 3 kamron mein clues se chabi dhundho | Logic, reasoning |
| 🎨 Chitkara & Kala | **Kala Bhanvartala** — ungli se drawing, stamps, rainbow brush, download | Creativity, fine motor |
| 🎵 Music & Dance | **Sitar Sitar Studio** — piano + instruments + Happy Birthday melody seekho | Pitch, rhythm, memory |
| 💃 | **Nacho Naacho** — beat ke saath dance pads follow karo, phir party! | Coordination, rhythm |
| 📖 **Kahaani Wadi** | 6 kahaaniyan (Laddu, Chiku, Amma, Papa, Dadi, Mittu) — **awaaz mein suno** 🔊, stars tap karo, aur har kahaani ke baad **Kahaani Khel** | Bhasha, empathy (SEL), sequencing |

## 🔊 Awaaz
- **Har click par awaaz** — tap, pop, boing, ding, chime, camera shutter, taali, dhol… sab Web Audio API se live synthesize (koi audio file nahi).
- **Kahaaniyan Hindi voice mein padhi jaati hain** (Speech Synthesis, hi-IN voice available ho toh).
- **Real music**: Happy Birthday ka poora melody synth se bajta hai; dance game mein DHA-DHA beat.
- Top-right se 🔊/🔇 on/off.

## 🏆 Motivation
- ⭐ Taare (game jeetne, kahaani khatam karne, star tap karne par)
- 📚 **Sticker Album** — 14 stickers, har game/kahaani se khulte hain
- 🎉 Confetti + trophy celebration har jeet par
- Progress phone/tablet mein automatically save (localStorage)

## 🏫 NEP 2020 / NCF / 21st Century mapping
App ke andar **👩‍🏫 "Papa-Ma Ke Liye"** section mein poori mapping hai.
Short: play-based + activity-based + experiential (Foundational Stage), FLN through games, multilingual (Hindi-first), no-exam formative rewards (stars/stickers), SEL through stories, 4Cs har game mein map kiye hue.

## ▶️ Kaise chalaayein
```bash
# Option 1: seedha browser mein
# index.html open karo (double-click)

# Option 2: local server (best)
python3 -m http.server 8000
# phir http://localhost:8000 kholo
```
- Koi dependency nahi, koi build nahi — plain HTML/CSS/JS.
- Tablet/phone par best chalega (touch-first).
- Offline bhi kaam karta hai (fonts Google se aate hain, nahi aaye toh system font).

## 📁 Structure
```
index.html
css/style.css
js/audio.js          # SFX + music engine (Web Audio)
js/speech.js         # Hindi TTS
js/confetti.js       # celebration FX
js/core.js           # state, router, win overlay
js/stories-data.js   # 6 kahaaniyan
js/stories.js        # story engine + Kahaani Khel
js/games/prank.js    # Chupke Chupke
js/games/vlog.js     # Vlog Studio
js/games/color.js    # Rang Pataka
js/games/mystery.js  # Dadi Ki Chabi
js/games/craft.js    # Kala Bhanvartala
js/games/music.js    # Sitar Sitar Studio
js/games/dance.js    # Nacho Naacho
js/main.js           # home, zones, album, parents
```

## 🛡️ Safety
No ads • no chat • no login • no external data. Saara progress local hai.
