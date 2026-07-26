/* 
  पिक्सर बाल शिक्षा - Kids Learning Academy JS Engine
  Features: ABC, Hindi Vowels & Consonants (अ से ज्ञ), 123 Counting range stage, 
  Rhymes Player (Natural Phrase Singing & Piano), and Masti Park (Physics Sandbox with 8 unique animals).
*/

// --- Audio System (Web Audio API Synthesizer) ---
let audioCtx = null;
const NOTE_FREQS = {
    'C4': 261.63, 'D4': 293.66, 'E4': 329.63, 'F4': 349.23, 'G4': 392.00, 'A4': 440.00, 'B4': 493.88,
    'C5': 523.25, 'D5': 587.33, 'E5': 659.25, 'F5': 698.46, 'G5': 783.99, 'A5': 880.00, 'B5': 987.77
};

function getAudioContext() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
    return audioCtx;
}

function playSynthNote(noteName, duration = 0.4, type = 'triangle') {
    if (isMuted) return;
    try {
        const ctx = getAudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc.type = type;
        osc.frequency.setValueAtTime(NOTE_FREQS[noteName] || 261.63, ctx.currentTime);
        
        gain.gain.setValueAtTime(0.25, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.005, ctx.currentTime + duration);
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.start();
        osc.stop(ctx.currentTime + duration);
    } catch (e) {
        console.warn("Synth note error: ", e);
    }
}

// System sound effects
function playSoundEffect(type) {
    if (isMuted) return;
    try {
        const ctx = getAudioContext();
        switch (type) {
            case 'pop': {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.frequency.setValueAtTime(500, ctx.currentTime);
                osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.08);
                gain.gain.setValueAtTime(0.2, ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);
                osc.start();
                osc.stop(ctx.currentTime + 0.08);
                break;
            }
            case 'chime': {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.frequency.setValueAtTime(523.25, ctx.currentTime);
                osc.frequency.exponentialRampToValueAtTime(1046.50, ctx.currentTime + 0.25);
                gain.gain.setValueAtTime(0.2, ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);
                osc.start();
                osc.stop(ctx.currentTime + 0.25);
                break;
            }
            case 'victory': {
                const scale = ['C4', 'E4', 'G4', 'C5', 'E5', 'G5'];
                scale.forEach((note, i) => {
                    setTimeout(() => playSynthNote(note, 0.45, 'sine'), i * 80);
                });
                break;
            }
            case 'buzzer': {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(130, ctx.currentTime);
                gain.gain.setValueAtTime(0.15, ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
                osc.start();
                osc.stop(ctx.currentTime + 0.2);
                break;
            }
            case 'boing': {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(150, ctx.currentTime);
                osc.frequency.exponentialRampToValueAtTime(450, ctx.currentTime + 0.12);
                osc.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.25);
                gain.gain.setValueAtTime(0.25, ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);
                osc.start();
                osc.stop(ctx.currentTime + 0.25);
                break;
            }
            case 'splash': {
                const bufferSize = ctx.sampleRate * 0.35;
                const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
                const data = buffer.getChannelData(0);
                for (let i = 0; i < bufferSize; i++) {
                    data[i] = Math.random() * 2 - 1;
                }
                const noise = ctx.createBufferSource();
                noise.buffer = buffer;
                
                const filter = ctx.createBiquadFilter();
                filter.type = 'bandpass';
                filter.Q.value = 4;
                filter.frequency.setValueAtTime(800, ctx.currentTime);
                filter.frequency.exponentialRampToValueAtTime(160, ctx.currentTime + 0.35);
                
                const gain = ctx.createGain();
                gain.gain.setValueAtTime(0.25, ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);
                
                noise.connect(filter);
                filter.connect(gain);
                gain.connect(ctx.destination);
                noise.start();
                noise.stop(ctx.currentTime + 0.35);
                break;
            }
            case 'whistle': {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.type = 'sine';
                osc.frequency.setValueAtTime(550, ctx.currentTime);
                osc.frequency.exponentialRampToValueAtTime(220, ctx.currentTime + 0.45);
                gain.gain.setValueAtTime(0.2, ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.45);
                osc.start();
                osc.stop(ctx.currentTime + 0.45);
                break;
            }
            case 'lion': {
                // Low growling roar
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                const filter = ctx.createBiquadFilter();
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(85, ctx.currentTime);
                osc.frequency.linearRampToValueAtTime(50, ctx.currentTime + 0.6);
                
                // Add tremolo/vibrato growl modulator
                const mod = ctx.createOscillator();
                const modGain = ctx.createGain();
                mod.frequency.value = 35;
                modGain.gain.value = 20;
                mod.connect(modGain);
                modGain.connect(osc.frequency);
                
                filter.type = 'lowpass';
                filter.frequency.value = 350;
                
                gain.gain.setValueAtTime(0.01, ctx.currentTime);
                gain.gain.linearRampToValueAtTime(0.35, ctx.currentTime + 0.1);
                gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.6);
                
                osc.connect(filter);
                filter.connect(gain);
                gain.connect(ctx.destination);
                
                mod.start();
                osc.start();
                mod.stop(ctx.currentTime + 0.6);
                osc.stop(ctx.currentTime + 0.6);
                break;
            }
            case 'cat': {
                // Cute meow: Sweep up then down
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(580, ctx.currentTime);
                osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15);
                osc.frequency.exponentialRampToValueAtTime(500, ctx.currentTime + 0.45);
                
                gain.gain.setValueAtTime(0.01, ctx.currentTime);
                gain.gain.linearRampToValueAtTime(0.25, ctx.currentTime + 0.1);
                gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.45);
                
                osc.connect(gain);
                gain.connect(ctx.destination);
                
                osc.start();
                osc.stop(ctx.currentTime + 0.45);
                break;
            }
            case 'dog': {
                // Bark: Short woof woof
                const playBark = (delay) => {
                    const osc = ctx.createOscillator();
                    const gain = ctx.createGain();
                    const filter = ctx.createBiquadFilter();
                    osc.type = 'sawtooth';
                    osc.frequency.setValueAtTime(280, ctx.currentTime + delay);
                    osc.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + delay + 0.12);
                    filter.type = 'bandpass';
                    filter.frequency.value = 450;
                    gain.gain.setValueAtTime(0.01, ctx.currentTime + delay);
                    gain.gain.linearRampToValueAtTime(0.28, ctx.currentTime + delay + 0.02);
                    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + delay + 0.12);
                    osc.connect(filter);
                    filter.connect(gain);
                    gain.connect(ctx.destination);
                    osc.start(ctx.currentTime + delay);
                    osc.stop(ctx.currentTime + delay + 0.12);
                };
                playBark(0);
                playBark(0.18);
                break;
            }
            case 'elephant': {
                // Trumpet: High buzzy sawtooth with vibrato
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                const filter = ctx.createBiquadFilter();
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(380, ctx.currentTime);
                osc.frequency.linearRampToValueAtTime(420, ctx.currentTime + 0.45);
                
                const mod = ctx.createOscillator();
                const modGain = ctx.createGain();
                mod.frequency.value = 45;
                modGain.gain.value = 35;
                mod.connect(modGain);
                modGain.connect(osc.frequency);
                
                filter.type = 'bandpass';
                filter.frequency.setValueAtTime(800, ctx.currentTime);
                filter.frequency.linearRampToValueAtTime(1500, ctx.currentTime + 0.45);
                
                gain.gain.setValueAtTime(0.01, ctx.currentTime);
                gain.gain.linearRampToValueAtTime(0.25, ctx.currentTime + 0.08);
                gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.45);
                
                osc.connect(filter);
                filter.connect(gain);
                gain.connect(ctx.destination);
                
                mod.start();
                osc.start();
                mod.stop(ctx.currentTime + 0.45);
                osc.stop(ctx.currentTime + 0.45);
                break;
            }
            case 'rat': 
            case 'squirrel': {
                // High squeaks
                const playSqueak = (delay) => {
                    const osc = ctx.createOscillator();
                    const gain = ctx.createGain();
                    osc.type = 'sine';
                    osc.frequency.setValueAtTime(1800, ctx.currentTime + delay);
                    osc.frequency.exponentialRampToValueAtTime(2400, ctx.currentTime + delay + 0.06);
                    gain.gain.setValueAtTime(0.01, ctx.currentTime + delay);
                    gain.gain.linearRampToValueAtTime(0.12, ctx.currentTime + delay + 0.02);
                    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + delay + 0.08);
                    osc.connect(gain);
                    gain.connect(ctx.destination);
                    osc.start(ctx.currentTime + delay);
                    osc.stop(ctx.currentTime + delay + 0.08);
                };
                playSqueak(0);
                playSqueak(0.1);
                playSqueak(0.2);
                break;
            }
            case 'snake': {
                // Hiss: Filtered high noise
                const bufferSize = ctx.sampleRate * 0.45;
                const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
                const data = buffer.getChannelData(0);
                for (let i = 0; i < bufferSize; i++) {
                    data[i] = Math.random() * 2 - 1;
                }
                const noise = ctx.createBufferSource();
                noise.buffer = buffer;
                
                const filter = ctx.createBiquadFilter();
                filter.type = 'highpass';
                filter.frequency.value = 5200;
                
                const gain = ctx.createGain();
                gain.gain.setValueAtTime(0.18, ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.005, ctx.currentTime + 0.45);
                
                noise.connect(filter);
                filter.connect(gain);
                gain.connect(ctx.destination);
                
                noise.start();
                noise.stop(ctx.currentTime + 0.45);
                break;
            }
            case 'lizard': {
                // Chirp sweep
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = 'sine';
                osc.frequency.setValueAtTime(950, ctx.currentTime);
                osc.frequency.exponentialRampToValueAtTime(1900, ctx.currentTime + 0.12);
                gain.gain.setValueAtTime(0.15, ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.12);
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start();
                osc.stop(ctx.currentTime + 0.12);
                break;
            }
            case 'parrot': {
                // Parrot squawk: Two fast high chirpy sweeps with noise
                const playSquawk = (delay) => {
                    const osc = ctx.createOscillator();
                    const gain = ctx.createGain();
                    
                    osc.type = 'sawtooth';
                    osc.frequency.setValueAtTime(800, ctx.currentTime + delay);
                    osc.frequency.exponentialRampToValueAtTime(1400, ctx.currentTime + delay + 0.1);
                    
                    const mod = ctx.createOscillator();
                    const modGain = ctx.createGain();
                    mod.frequency.value = 60;
                    modGain.gain.value = 80;
                    mod.connect(modGain);
                    modGain.connect(osc.frequency);
                    
                    gain.gain.setValueAtTime(0.01, ctx.currentTime + delay);
                    gain.gain.linearRampToValueAtTime(0.18, ctx.currentTime + delay + 0.03);
                    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + delay + 0.12);
                    
                    osc.connect(gain);
                    gain.connect(ctx.destination);
                    
                    mod.start(ctx.currentTime + delay);
                    osc.start(ctx.currentTime + delay);
                    
                    mod.stop(ctx.currentTime + delay + 0.12);
                    osc.stop(ctx.currentTime + delay + 0.12);
                };
                playSquawk(0);
                playSquawk(0.16);
                break;
            }
            case 'monkey': {
                // Monkey chatter: 3 rapid high pitch sweeps
                const playChatter = (delay) => {
                    const osc = ctx.createOscillator();
                    const gain = ctx.createGain();
                    osc.type = 'triangle';
                    osc.frequency.setValueAtTime(900, ctx.currentTime + delay);
                    osc.frequency.exponentialRampToValueAtTime(1800, ctx.currentTime + delay + 0.07);
                    gain.gain.setValueAtTime(0.01, ctx.currentTime + delay);
                    gain.gain.linearRampToValueAtTime(0.18, ctx.currentTime + delay + 0.02);
                    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + delay + 0.08);
                    osc.connect(gain);
                    gain.connect(ctx.destination);
                    osc.start(ctx.currentTime + delay);
                    osc.stop(ctx.currentTime + delay + 0.08);
                };
                playChatter(0);
                playChatter(0.1);
                playChatter(0.2);
                break;
            }
        }
    } catch (e) {
        console.warn("Sound Effect Error: ", e);
    }
}

// --- Databases ---

// 1. English ABCs (2-3 items per letter)
const ABC_DATABASE = {
    A: [
        { wordEn: 'Apple', wordHi: 'सेब / एप्पल', emoji: '🍎', cheerEn: 'A for Apple', cheerHi: 'A for Apple! ए से एप्पल!' },
        { wordEn: 'Aeroplane', wordHi: 'हवाई जहाज़ / एरोप्लेन', emoji: '✈️', cheerEn: 'A for Aeroplane', cheerHi: 'A for Aeroplane! ए से एरोप्लेन!' },
        { wordEn: 'Ant', wordHi: 'चींटी / आंट', emoji: '🐜', cheerEn: 'A for Ant', cheerHi: 'A for Ant! ए से आंट!' }
    ],
    B: [
        { wordEn: 'Ball', wordHi: 'गेंद / बॉल', emoji: '⚽', cheerEn: 'B for Ball', cheerHi: 'B for Ball! बी से बॉल!' },
        { wordEn: 'Balloon', wordHi: 'गुब्बारा / बलून', emoji: '🎈', cheerEn: 'B for Balloon', cheerHi: 'B for Balloon! बी से बलून!' },
        { wordEn: 'Butterfly', wordHi: 'तितली / बटरफ्लाई', emoji: '🦋', cheerEn: 'B for Butterfly', cheerHi: 'B for Butterfly! बी से बटरफ्लाई!' }
    ],
    C: [
        { wordEn: 'Cat', wordHi: 'बिल्ली / कैट', emoji: '🐱', cheerEn: 'C for Cat', cheerHi: 'C for Cat! सी से कैट!' },
        { wordEn: 'Cake', wordHi: 'केक / केक', emoji: '🎂', cheerEn: 'C for Cake', cheerHi: 'C for Cake! सी से केक!' },
        { wordEn: 'Car', wordHi: 'कार / गाड़ी', emoji: '🚗', cheerEn: 'C for Car', cheerHi: 'C for Car! सी से कार!' }
    ],
    D: [
        { wordEn: 'Dog', wordHi: 'कुत्ता / डॉग', emoji: '🐶', cheerEn: 'D for Dog', cheerHi: 'D for Dog! डी से डॉग!' },
        { wordEn: 'Duck', wordHi: 'बतख / डक', emoji: '🦆', cheerEn: 'D for Duck', cheerHi: 'D for Duck! डी से डक!' },
        { wordEn: 'Drum', wordHi: 'ड्रम / ढोलक', emoji: '🥁', cheerEn: 'D for Drum', cheerHi: 'D for Drum! डी से ड्रम!' }
    ],
    E: [
        { wordEn: 'Elephant', wordHi: 'हाथी / एलीफेंट', emoji: '🐘', cheerEn: 'E for Elephant', cheerHi: 'E for Elephant! ई से एलीफेंट!' },
        { wordEn: 'Egg', wordHi: 'अंडा / एग', emoji: '🥚', cheerEn: 'E for Egg', cheerHi: 'E for Egg! ई से एग!' },
        { wordEn: 'Eagle', wordHi: 'चील / ईगल', emoji: '🦅', cheerEn: 'E for Eagle', cheerHi: 'E for Eagle! ई से ईगल!' }
    ],
    F: [
        { wordEn: 'Fish', wordHi: 'मछली / फिश', emoji: '🐟', cheerEn: 'F for Fish', cheerHi: 'F for Fish! एफ से फिश!' },
        { wordEn: 'Frog', wordHi: 'मेंढक / फ्रॉग', emoji: '🐸', cheerEn: 'F for Frog', cheerHi: 'F for Frog! एफ से फ्रॉग!' },
        { wordEn: 'Fox', wordHi: 'लोमड़ी / फॉक्स', emoji: '🦊', cheerEn: 'F for Fox', cheerHi: 'F for Fox! एफ से फॉक्स!' }
    ],
    G: [
        { wordEn: 'Grapes', wordHi: 'अंंगूर / ग्रेप्स', emoji: '🍇', cheerEn: 'G for Grapes', cheerHi: 'G for Grapes! जी से ग्रेप्स!' },
        { wordEn: 'Giraffe', wordHi: 'जिराफ', emoji: '🦒', cheerEn: 'G for Giraffe', cheerHi: 'G for Giraffe! जी से जिराफ!' },
        { wordEn: 'Goat', wordHi: 'बकरी / गोट', emoji: '🐐', cheerEn: 'G for Goat', cheerHi: 'G for Goat! जी से गोट!' }
    ],
    H: [
        { wordEn: 'Hat', wordHi: 'टोपी / हैट', emoji: '🎩', cheerEn: 'H for Hat', cheerHi: 'H for Hat! एच से हैट!' },
        { wordEn: 'Horse', wordHi: 'घोड़ा / हॉर्स', emoji: '🐴', cheerEn: 'H for Horse', cheerHi: 'H for Horse! एच से हॉर्स!' },
        { wordEn: 'Hen', wordHi: 'मुर्गी / हेन', emoji: '🐔', cheerEn: 'H for Hen', cheerHi: 'H for Hen! एच से हेन!' }
    ],
    I: [
        { wordEn: 'Ice Cream', wordHi: 'आइसक्रीम', emoji: '🍦', cheerEn: 'I for Ice Cream', cheerHi: 'I for Ice Cream! आई से आइसक्रीम!' },
        { wordEn: 'Igloo', wordHi: 'इग्लू', emoji: '🛖', cheerEn: 'I for Igloo', cheerHi: 'I for Igloo! आई से इग्लू!' },
        { wordEn: 'Iron', wordHi: 'इस्त्री / आयरन', emoji: '🔌', cheerEn: 'I for Iron', cheerHi: 'I for Iron! आई से आयरन!' }
    ],
    J: [
        { wordEn: 'Joker', wordHi: 'जोकर', emoji: '🤡', cheerEn: 'J for Joker', cheerHi: 'J for Joker! जे से जोकर!' },
        { wordEn: 'Jug', wordHi: 'जग', emoji: '🥛', cheerEn: 'J for Jug', cheerHi: 'J for Jug! जे से जग!' },
        { wordEn: 'Jellyfish', wordHi: 'जैलफिश', emoji: '🪼', cheerEn: 'J for Jellyfish', cheerHi: 'J for Jellyfish! जे से जैलफिश!' }
    ],
    K: [
        { wordEn: 'Kite', wordHi: 'पतंग / काइट', emoji: '🪁', cheerEn: 'K for Kite', cheerHi: 'K for Kite! के से काइट!' },
        { wordEn: 'Kangaroo', wordHi: 'कंगारू', emoji: '🦘', cheerEn: 'K for Kangaroo', cheerHi: 'K for Kangaroo! के से कंगारू!' },
        { wordEn: 'Key', wordHi: 'चाबी / की', emoji: '🔑', cheerEn: 'K for Key', cheerHi: 'K for Key! के से चाबी!' }
    ],
    L: [
        { wordEn: 'Lion', wordHi: 'शेर / लॉयन', emoji: '🦁', cheerEn: 'L for Lion', cheerHi: 'L for Lion! एल से लॉयन!' },
        { wordEn: 'Leaf', wordHi: 'पत्ता / लीफ़', emoji: '🍃', cheerEn: 'L for Leaf', cheerHi: 'L for Leaf! एल से पत्ता!' },
        { wordEn: 'Lemon', wordHi: 'नींबू / लेमन', emoji: '🍋', cheerEn: 'L for Lemon', cheerHi: 'L for Lemon! एल से नींबू!' }
    ],
    M: [
        { wordEn: 'Monkey', wordHi: 'बंदर / मंकी', emoji: '🐵', cheerEn: 'M for Monkey', cheerHi: 'M for Monkey! एम से मंकी!' },
        { wordEn: 'Mango', wordHi: 'आम / मैंगो', emoji: '🥭', cheerEn: 'M for Mango', cheerHi: 'M for Mango! एम से आम!' },
        { wordEn: 'Milk', wordHi: 'दूध / मिल्क', emoji: '🥛', cheerEn: 'M for Milk', cheerHi: 'M for Milk! एम से दूध!' }
    ],
    N: [
        { wordEn: 'Nest', wordHi: 'घोंसला / नेस्ट', emoji: '🪺', cheerEn: 'N for Nest', cheerHi: 'N for Nest! एन से नेस्ट!' },
        { wordEn: 'Net', wordHi: 'जाल / नेट', emoji: '🕸️', cheerEn: 'N for Net', cheerHi: 'N for Net! एन से जाल!' },
        { wordEn: 'Nose', wordHi: 'नाक / नोज़', emoji: '👃', cheerEn: 'N for Nose', cheerHi: 'N for Nose! एन से नाक!' }
    ],
    O: [
        { wordEn: 'Orange', wordHi: 'संतरा / ऑरेंज', emoji: '🍊', cheerEn: 'O for Orange', cheerHi: 'O for Orange! ओ से संतरा!' },
        { wordEn: 'Owl', wordHi: 'उल्लू / आउल', emoji: '🦉', cheerEn: 'O for Owl', cheerHi: 'O for Owl! ओ से उल्लू!' },
        { wordEn: 'Onion', wordHi: 'प्याज / अनियन', emoji: '🧅', cheerEn: 'O for Onion', cheerHi: 'O for Onion! ओ से प्याज!' }
    ],
    P: [
        { wordEn: 'Peacock', wordHi: 'मोर / पिकॉक', emoji: '🦚', cheerEn: 'P for Peacock', cheerHi: 'P for Peacock! पी से मोर!' },
        { wordEn: 'Parrot', wordHi: 'तोता / पैरट', emoji: '🦜', cheerEn: 'P for Parrot', cheerHi: 'P for Parrot! पी से तोता!' },
        { wordEn: 'Pen', wordHi: 'कलम / पेन', emoji: '🖊️', cheerEn: 'P for Pen', cheerHi: 'P for Pen! पी से पेन!' }
    ],
    Q: [
        { wordEn: 'Queen', wordHi: 'रानी / क्वीन', emoji: '👸', cheerEn: 'Q for Queen', cheerHi: 'Q for Queen! क्यू से रानी!' },
        { wordEn: 'Quill', wordHi: 'पंख / क्विल', emoji: '🪶', cheerEn: 'Q for Quill', cheerHi: 'Q for Quill! क्यू से पंख!' },
        { wordEn: 'Question', wordHi: 'सवाल / क्वेश्चन', emoji: '❓', cheerEn: 'Q for Question', cheerHi: 'Q for Question! क्यू से सवाल!' }
    ],
    R: [
        { wordEn: 'Rabbit', wordHi: 'खरगोश / रैबिट', emoji: '🐰', cheerEn: 'R for Rabbit', cheerHi: 'R for Rabbit! आर से खरगोश!' },
        { wordEn: 'Rat', wordHi: 'चूहा / रैट', emoji: '🐭', cheerEn: 'R for Rat', cheerHi: 'R for Rat! आर से चूहा!' },
        { wordEn: 'Ring', wordHi: 'अंगूठी / रिंग', emoji: '💍', cheerEn: 'R for Ring', cheerHi: 'R for Ring! आर से अंगूठी!' }
    ],
    S: [
        { wordEn: 'Star', wordHi: 'तारा / स्टार', emoji: '⭐', cheerEn: 'S for Star', cheerHi: 'S for Star! एस से तारा!' },
        { wordEn: 'Sun', wordHi: 'सूरज / सन', emoji: '☀️', cheerEn: 'S for Sun', cheerHi: 'S for Sun! एस से सूरज!' },
        { wordEn: 'Ship', wordHi: 'पानी का जहाज़ / शिप', emoji: '🚢', cheerEn: 'S for Ship', cheerHi: 'S for Ship! एस से जहाज़!' }
    ],
    T: [
        { wordEn: 'Tree', wordHi: 'पेड़ / ट्री', emoji: '🌳', cheerEn: 'T for Tree', cheerHi: 'T for Tree! टी से पेड़!' },
        { wordEn: 'Tiger', wordHi: 'बाघ / टाइगर', emoji: '🐯', cheerEn: 'T for Tiger', cheerHi: 'T for Tiger! टी से टाइगर!' },
        { wordEn: 'Toy', wordHi: 'खिलौना / टॉय', emoji: '🧸', cheerEn: 'T for Toy', cheerHi: 'T for Toy! टी से खिलौना!' }
    ],
    U: [
        { wordEn: 'Umbrella', wordHi: 'छाता / अम्ब्रेला', emoji: '☔', cheerEn: 'U for Umbrella', cheerHi: 'U for Umbrella! यू से छाता!' },
        { wordEn: 'Unicorn', wordHi: 'एक सींग वाला घोड़ा / यूनिकॉर्न', emoji: '🦄', cheerEn: 'U for Unicorn', cheerHi: 'U for Unicorn! यू से यूनिकॉर्न!' },
        { wordEn: 'Uniform', wordHi: 'वर्दी / यूनिफॉर्म', emoji: '🎽', cheerEn: 'U for Uniform', cheerHi: 'U for Uniform! यू से वर्दी!' }
    ],
    V: [
        { wordEn: 'Violin', wordHi: 'वायलिन / बाजा', emoji: '🎻', cheerEn: 'V for Violin', cheerHi: 'V for Violin! वी से वायलिन!' },
        { wordEn: 'Van', wordHi: 'वैन / गाड़ी', emoji: '🚐', cheerEn: 'V for Van', cheerHi: 'V for Van! वी से वैन!' },
        { wordEn: 'Vase', wordHi: 'फूलदान / वेस', emoji: '🏺', cheerEn: 'V for Vase', cheerHi: 'V for Vase! वी से फूलदान!' }
    ],
    W: [
        { wordEn: 'Watch', wordHi: 'घड़ी / वॉच', emoji: '⌚', cheerEn: 'W for Watch', cheerHi: 'W for Watch! डब्लू से घड़ी!' },
        { wordEn: 'Watermelon', wordHi: 'तरबूज / वॉटरमेलन', emoji: '🍉', cheerEn: 'W for Watermelon', cheerHi: 'W for Watermelon! डब्लू से तरबूज!' },
        { wordEn: 'Window', wordHi: 'खिड़की / विंडो', emoji: '🪟', cheerEn: 'W for Window', cheerHi: 'W for Window! डब्लू से खिड़की!' }
    ],
    X: [
        { wordEn: 'Xylophone', wordHi: 'जायलोफोन / बाजा', emoji: '🎹', cheerEn: 'X for Xylophone', cheerHi: 'X for Xylophone! एक्स से जायलोफोन!' },
        { wordEn: 'X-ray', wordHi: 'एक्सरे', emoji: '🩻', cheerEn: 'X for X-ray', cheerHi: 'X for X-ray! एक्स से एक्सरे!' },
        { wordEn: 'Christmas Tree', wordHi: 'क्रिसमस ट्री', emoji: '🎄', cheerEn: 'X for Xmas Tree', cheerHi: 'एक्स से क्रिसमस ट्री!' }
    ],
    Y: [
        { wordEn: 'Yacht', wordHi: 'याट / नाव', emoji: '⛵', cheerEn: 'Y for Yacht', cheerHi: 'वाई से नाव!' },
        { wordEn: 'Yak', wordHi: 'याक / जंगली सांड', emoji: '🐂', cheerEn: 'Y for Yak', cheerHi: 'वाई से याक!' },
        { wordEn: 'Yo-yo', wordHi: 'यो-यो / लट्टू', emoji: '🪀', cheerEn: 'Y for Yo-yo', cheerHi: 'वाई से यो-यो!' }
    ],
    Z: [
        { wordEn: 'Zebra', wordHi: 'जेब्रा', emoji: '🦓', cheerEn: 'Z for Zebra', cheerHi: 'ज़ेड से जेब्रा!' },
        { wordEn: 'Zip', wordHi: 'चैन / ज़िप', emoji: '🤐', cheerEn: 'Z for Zip', cheerHi: 'ज़ेड से ज़िप!' },
        { wordEn: 'Zoo', wordHi: 'चिड़ियाघर / ज़ू', emoji: '🦁', cheerEn: 'Z for Zoo', cheerHi: 'ज़ेड से ज़ू!' }
    ]
};

// 2. Hindi Swar & Vyanjan (All 49 letters with 2-3 items each)
const HINDI_DATABASE = {
    // Swar (Vowels)
    'अ': [
        { wordHi: 'अनार', emoji: '🍎', cheerHi: 'अ से अनार!', cheerEn: 'A se Anaar!' },
        { wordHi: 'अदरक', emoji: '🫚', cheerHi: 'अ से अदरक!', cheerEn: 'A se Adrak!' },
        { wordHi: 'अमरूद', emoji: '🍐', cheerHi: 'अ से अमरूद!', cheerEn: 'A se Amrood!' }
    ],
    'आ': [
        { wordHi: 'आम', emoji: '🥭', cheerHi: 'आ से आम!', cheerEn: 'Aa se Aam!' },
        { wordHi: 'आलू', emoji: '🥔', cheerHi: 'आ से आलू!', cheerEn: 'Aa se Aaloo!' },
        { wordHi: 'आग', emoji: '🔥', cheerHi: 'आ से आग!', cheerEn: 'Aa se Aag!' }
    ],
    'इ': [
        { wordHi: 'इमली', emoji: '🍇', cheerHi: 'इ से इमली!', cheerEn: 'I se Imli!' },
        { wordHi: 'इमारत', emoji: '🏢', cheerHi: 'इ से इमारत!', cheerEn: 'I se Imaarat!' },
        { wordHi: 'इलायची', emoji: '🫑', cheerHi: 'इ से इलायची!', cheerEn: 'I se Elaichi!' }
    ],
    'ई': [
        { wordHi: 'ईख', emoji: '🎋', cheerHi: 'ई से ईख!', cheerEn: 'Ee se Eekh!' },
        { wordHi: 'ईंट', emoji: '🧱', cheerHi: 'ई से ईंट!', cheerEn: 'Ee se Eent!' },
        { wordHi: 'ईश्वर', emoji: '🙏', cheerHi: 'ई से ईश्वर!', cheerEn: 'Ee se Eeshwar!' }
    ],
    'उ': [
        { wordHi: 'उल्लू', emoji: '🦉', cheerHi: 'उ से उल्लू!', cheerEn: 'U se Ullu!' },
        { wordHi: 'उपहार', emoji: '🎁', cheerHi: 'उ से उपहार!', cheerEn: 'U se Upahaar!' },
        { wordHi: 'उंगली', emoji: '☝️', cheerHi: 'उ से उंगली!', cheerEn: 'U se Ungli!' }
    ],
    'ऊ': [
        { wordHi: 'ऊन', emoji: '🧶', cheerHi: 'ऊ से ऊन!', cheerEn: 'Oo se Oon!' },
        { wordHi: 'ऊँट', emoji: '🐫', cheerHi: 'ऊ से ऊँट!', cheerEn: 'Oo se Oont!' },
        { wordHi: 'ऊपर', emoji: '⬆️', cheerHi: 'ऊ से ऊपर!', cheerEn: 'Oo se Oopar!' }
    ],
    'ऋ': [
        { wordHi: 'ऋषि', emoji: '🧘', cheerHi: 'ऋ से ऋषि!', cheerEn: 'Ri se Rishi!' },
        { wordHi: 'ऋषभ / बैल', emoji: '🐂', cheerHi: 'ऋ से ऋषभ!', cheerEn: 'Ri se Rishabh!' }
    ],
    'ए': [
        { wordHi: 'एड़ी', emoji: '👣', cheerHi: 'ए से एड़ी!', cheerEn: 'E se Edee!' },
        { wordHi: 'एक', emoji: '1️⃣', cheerHi: 'ए से एक!', cheerEn: 'E se Ek!' },
        { wordHi: 'एल्बम', emoji: '📕', cheerHi: 'ए से एल्बम!', cheerEn: 'E se Album!' }
    ],
    'ऐ': [
        { wordHi: 'ऐनक', emoji: '👓', cheerHi: 'ऐ से ऐनक!', cheerEn: 'Ai se Ainak!' },
        { wordHi: 'ऐरावत / हाथी', emoji: '🐘', cheerHi: 'ऐ से ऐरावत!', cheerEn: 'Ai se Airawat!' }
    ],
    'ओ': [
        { wordHi: 'ओखली', emoji: '🥣', cheerHi: 'ओ से ओखली!', cheerEn: 'O se Okhli!' },
        { wordHi: 'ओस', emoji: '💧', cheerHi: 'ओ से ओस!', cheerEn: 'O se Os!' },
        { wordHi: 'ओढ़नी', emoji: '🧣', cheerHi: 'ओ से ओढ़नी!', cheerEn: 'O se Odhni!' }
    ],
    'औ': [
        { wordHi: 'औरत', emoji: '👩', cheerHi: 'औ से औरत!', cheerEn: 'Au se Aurat!' },
        { wordHi: 'औज़ार', emoji: '🛠️', cheerHi: 'औ से औज़ार!', cheerEn: 'Au se Auzaar!' },
        { wordHi: 'औषधि', emoji: '💊', cheerHi: 'औ से औषधि!', cheerEn: 'Au se Aushadhi!' }
    ],
    'अं': [
        { wordHi: 'अंगूर', emoji: '🍇', cheerHi: 'अं से अंगूर!', cheerEn: 'Am se Angoor!' },
        { wordHi: 'अंडा', emoji: '🥚', cheerHi: 'अं से अंडा!', cheerEn: 'Am se Anda!' },
        { wordHi: 'अंगूठी', emoji: '💍', cheerHi: 'अं से अंगूठी!', cheerEn: 'Am se Angoothi!' }
    ],
    'अः': [
        { wordHi: 'खाली', emoji: '😄', cheerHi: 'अः खाली! मुस्कुराओ!', cheerEn: 'Ahah empty! Smile!' }
    ],
    
    // Vyanjan (Consonants)
    'क': [
        { wordHi: 'कबूतर', emoji: '🐦', cheerHi: 'क से कबूतर!', cheerEn: 'Ka se Kabootar!' },
        { wordHi: 'कमल', emoji: '🪷', cheerHi: 'क से कमल!', cheerEn: 'Ka se Kamal!' },
        { wordHi: 'कछुआ', emoji: '🐢', cheerHi: 'क से कछुआ!', cheerEn: 'Ka se Kachhua!' }
    ],
    'ख': [
        { wordHi: 'खरगोश', emoji: '🐰', cheerHi: 'ख से खरगोश!', cheerEn: 'Kha se Khargosh!' },
        { wordHi: 'खिड़की', emoji: '🪟', cheerHi: 'ख से खिड़की!', cheerEn: 'Kha se Khidki!' },
        { wordHi: 'खरबूजा', emoji: '🍈', cheerHi: 'ख से खरबूजा!', cheerEn: 'Kha se Kharbooja!' }
    ],
    'ग': [
        { wordHi: 'गमला', emoji: '🪴', cheerHi: 'ग से गमला!', cheerEn: 'Ga se Gamla!' },
        { wordHi: 'गाजर', emoji: '🥕', cheerHi: 'ग से गाजर!', cheerEn: 'Ga se Gaajar!' },
        { wordHi: 'गाय', emoji: '🐄', cheerHi: 'ग से गाय!', cheerEn: 'Ga se Gaay!' }
    ],
    'घ': [
        { wordHi: 'घर', emoji: '🏠', cheerHi: 'घ से घर!', cheerEn: 'Gha se Ghar!' },
        { wordHi: 'घड़ी', emoji: '⌚', cheerHi: 'घ से घड़ी!', cheerEn: 'Gha se Ghadi!' },
        { wordHi: 'घड़ा', emoji: '🏺', cheerHi: 'घ से घड़ा!', cheerEn: 'Gha se Ghada!' }
    ],
    'ङ': [
        { wordHi: 'खाली', emoji: '😄', cheerHi: 'ङ खाली!', cheerEn: 'Nga is empty!' }
    ],
    'च': [
        { wordHi: 'चम्मच', emoji: '🥄', cheerHi: 'च से चम्मच!', cheerEn: 'Cha se Chammach!' },
        { wordHi: 'चश्मा', emoji: '👓', cheerHi: 'च से चश्मा!', cheerEn: 'Cha se Chashma!' },
        { wordHi: 'चाबी', emoji: '🔑', cheerHi: 'च से चाबी!', cheerEn: 'Cha se Chaabi!' }
    ],
    'छ': [
        { wordHi: 'छतरी', emoji: '☂️', cheerHi: 'छ से छतरी!', cheerEn: 'Chha se Chhatri!' },
        { wordHi: 'छड़ी', emoji: '🪄', cheerHi: 'छ से छड़ी!', cheerEn: 'Chha se Chhadi!' },
        { wordHi: 'छत', emoji: '🏠', cheerHi: 'छ से छत!', cheerEn: 'Chha se Chhat!' }
    ],
    'ज': [
        { wordHi: 'जहाज', emoji: '🚢', cheerHi: 'ज से जहाज!', cheerEn: 'Ja se Jahaaj!' },
        { wordHi: 'जग', emoji: '🥛', cheerHi: 'ज से जग!', cheerEn: 'Ja se Jug!' },
        { wordHi: 'जलेबी', emoji: '🥨', cheerHi: 'ज से जलेबी!', cheerEn: 'Ja se Jalebi!' }
    ],
    'झ': [
        { wordHi: 'झंडा', emoji: '🇮🇳', cheerHi: 'झ से झंडा!', cheerEn: 'Jha se Jhanda!' },
        { wordHi: 'झूला', emoji: '🛝', cheerHi: 'झ से झूला!', cheerEn: 'Jha se Jhoola!' },
        { wordHi: 'झोपड़ी', emoji: '🛖', cheerHi: 'झ से झोपड़ी!', cheerEn: 'Jha se Jhopdi!' }
    ],
    'ञ': [
        { wordHi: 'खाली', emoji: '😄', cheerHi: 'ञ खाली!', cheerEn: 'Nya is empty!' }
    ],
    'ट': [
        { wordHi: 'टमाटर', emoji: '🍅', cheerHi: 'ट से टमाटर!', cheerEn: 'Ta se Tamaatar!' },
        { wordHi: 'टब', emoji: '🛁', cheerHi: 'ट से टब!', cheerEn: 'Ta se Tab!' },
        { wordHi: 'टोपी', emoji: '🎩', cheerHi: 'ट से टोपी!', cheerEn: 'Ta se Topi!' }
    ],
    'ठ': [
        { wordHi: 'ठप्पा', emoji: '🎯', cheerHi: 'ठ से ठप्पा!', cheerEn: 'Tha se Thappa!' },
        { wordHi: 'ठेला', emoji: '🛒', cheerHi: 'ठ से ठेला!', cheerEn: 'Tha se Thela!' },
        { wordHi: 'ठंड', emoji: '🥶', cheerHi: 'ठ से ठंड!', cheerEn: 'Tha se Thand!' }
    ],
    'ड': [
        { wordHi: 'डमरू', emoji: '🪘', cheerHi: 'ड से डमरू!', cheerEn: 'Da se Damroo!' },
        { wordHi: 'डाकिया', emoji: '✉️', cheerHi: 'ड से डाकिया!', cheerEn: 'Da se Daakiya!' },
        { wordHi: 'डोरी', emoji: '🧵', cheerHi: 'ड से डोरी!', cheerEn: 'Da se Dori!' }
    ],
    'ढ': [
        { wordHi: 'ढोलक', emoji: '🥁', cheerHi: 'ढ से ढोलक!', cheerEn: 'Dha se Dholak!' },
        { wordHi: 'ढक्कन', emoji: '🫙', cheerHi: 'ढ से ढक्कन!', cheerEn: 'Dha se Dhakkan!' },
        { wordHi: 'ढाल', emoji: '🛡️', cheerHi: 'ढ से ढाल!', cheerEn: 'Dha se Dhaal!' }
    ],
    'ण': [
        { wordHi: 'खाली', emoji: '😄', cheerHi: 'ण खाली!', cheerEn: 'Nna is empty!' }
    ],
    'त': [
        { wordHi: 'तरबूज', emoji: '🍉', cheerHi: 'त से तरबूज!', cheerEn: 'Ta se Tarbooj!' },
        { wordHi: 'तितली', emoji: '🦋', cheerHi: 'त से तितली!', cheerEn: 'Ta se Titli!' },
        { wordHi: 'तकिया', emoji: '🛏️', cheerHi: 'त से तकिया!', cheerEn: 'Ta se Takiya!' }
    ],
    'थ': [
        { wordHi: 'थरमस', emoji: '🍼', cheerHi: 'थ से थरमस!', cheerEn: 'Tha se Tharmas!' },
        { wordHi: 'थाली', emoji: '🍽️', cheerHi: 'थ से थाली!', cheerEn: 'Tha se Thaali!' },
        { wordHi: 'थैला', emoji: '🛍️', cheerHi: 'थ से थैला!', cheerEn: 'Tha se Thela!' }
    ],
    'द': [
        { wordHi: 'दरवाज़ा', emoji: '🚪', cheerHi: 'द से दरवाज़ा!', cheerEn: 'Da se Darwaaja!' },
        { wordHi: 'दवात', emoji: '✒️', cheerHi: 'द से दवात!', cheerEn: 'Da se Dawaat!' },
        { wordHi: 'दांत', emoji: '🦷', cheerHi: 'द से दांत!', cheerEn: 'Da se Daant!' }
    ],
    'ध': [
        { wordHi: 'धनुष', emoji: '🏹', cheerHi: 'ध से धनुष!', cheerEn: 'Dha se Dhanush!' },
        { wordHi: 'धोबी', emoji: '👕', cheerHi: 'ध से धोबी!', cheerEn: 'Dha se Dhobi!' },
        { wordHi: 'धूप', emoji: '☀️', cheerHi: 'ध से धूप!', cheerEn: 'Dha se Dhoop!' }
    ],
    'न': [
        { wordHi: 'नारियल', emoji: '🥥', cheerHi: 'न से नारियल!', cheerEn: 'Na se Naariyal!' },
        { wordHi: 'नल', emoji: '🚰', cheerHi: 'न से नल!', cheerEn: 'Na se Nal!' },
        { wordHi: 'नाव', emoji: '⛵', cheerHi: 'न से नाव!', cheerEn: 'Na se Naav!' }
    ],
    'प': [
        { wordHi: 'पतंग', emoji: '🪁', cheerHi: 'प से पतंग!', cheerEn: 'Pa se Patang!' },
        { wordHi: 'पपीता', emoji: '🥭', cheerHi: 'प से पपीता!', cheerEn: 'Pa se Papeeta!' },
        { wordHi: 'पेड़', emoji: '🌳', cheerHi: 'प से पेड़!', cheerEn: 'Pa se Ped!' }
    ],
    'फ': [
        { wordHi: 'फल', emoji: '🍎', cheerHi: 'फ से फल!', cheerEn: 'Pha se Phal!' },
        { wordHi: 'फूल', emoji: '🪷', cheerHi: 'फ से फूल!', cheerEn: 'Pha se Phool!' },
        { wordHi: 'फव्वारा', emoji: '⛲', cheerHi: 'फ से फव्वारा!', cheerEn: 'Pha se Phawwaara!' }
    ],
    'ब': [
        { wordHi: 'बत्तख', emoji: '🦆', cheerHi: 'ब से बत्तख!', cheerEn: 'Ba se Battakh!' },
        { wordHi: 'बंदर', emoji: '🐵', cheerHi: 'ब से बंदर!', cheerEn: 'Ba se Bandar!' },
        { wordHi: 'बैलून', emoji: '🎈', cheerHi: 'ब से बैलून!', cheerEn: 'Ba se Balloon!' }
    ],
    'भ': [
        { wordHi: 'भालू', emoji: '🐻', cheerHi: 'भ से भालू!', cheerEn: 'Bha se Bhaloo!' },
        { wordHi: 'भिंडी', emoji: '🫑', cheerHi: 'भ से भिंडी!', cheerEn: 'Bha se Bhindi!' },
        { wordHi: 'भोजन', emoji: '🍛', cheerHi: 'भ से भोजन!', cheerEn: 'Bha se Bhojan!' }
    ],
    'म': [
        { wordHi: 'मछली', emoji: '🐟', cheerHi: 'म से मछली!', cheerEn: 'Ma se Machhli!' },
        { wordHi: 'मटर', emoji: '🫛', cheerHi: 'म से मटर!', cheerEn: 'Ma se Matar!' },
        { wordHi: 'मटका', emoji: '🏺', cheerHi: 'म से मटका!', cheerEn: 'Ma se Matka!' }
    ],
    'य': [
        { wordHi: 'याक', emoji: '🐂', cheerHi: 'य से याक!', cheerEn: 'Ya se Yaak!' },
        { wordHi: 'यज्ञ', emoji: '🔥', cheerHi: 'य से यज्ञ!', cheerEn: 'Ya se Yagya!' },
        { wordHi: 'योगा', emoji: '🧘', cheerHi: 'य से योगा!', cheerEn: 'Ya se Yoga!' }
    ],
    'र': [
        { wordHi: 'रथ', emoji: '🎪', cheerHi: 'र से रथ!', cheerEn: 'Ra se Rath!' },
        { wordHi: 'रस्सी', emoji: '🧵', cheerHi: 'र से रस्सी!', cheerEn: 'Ra se Rassi!' },
        { wordHi: 'रसोई', emoji: '🍳', cheerHi: 'र से रसोई!', cheerEn: 'Ra se Rasoi!' }
    ],
    'ल': [
        { wordHi: 'लट्टू', emoji: '🪀', cheerHi: 'ल से लट्टू!', cheerEn: 'La se Lattoo!' },
        { wordHi: 'लड़की', emoji: '👧', cheerHi: 'ल से लड़की!', cheerEn: 'La se Ladki!' },
        { wordHi: 'लहसुन', emoji: '🧄', cheerHi: 'ल से लहसुन!', cheerEn: 'La se Lahsun!' }
    ],
    'व': [
        { wordHi: 'वन', emoji: '🌳', cheerHi: 'व से वन!', cheerEn: 'Va se Van!' },
        { wordHi: 'वर्षा', emoji: '🌧️', cheerHi: 'व से वर्षा!', cheerEn: 'Va se Varsha!' },
        { wordHi: 'वीणा', emoji: '🎸', cheerHi: 'व से वीणा!', cheerEn: 'Va se Veena!' }
    ],
    'श': [
        { wordHi: 'शलगम', emoji: '🧅', cheerHi: 'श से शलगम!', cheerEn: 'Sha se Shalgam!' },
        { wordHi: 'शेर', emoji: '🦁', cheerHi: 'श से शेर!', cheerEn: 'Sha se Sher!' },
        { wordHi: 'शंख', emoji: '🐚', cheerHi: 'श से शंख!', cheerEn: 'Sha se Shankh!' }
    ],
    'ष': [
        { wordHi: 'षट्कोण', emoji: '🔷', cheerHi: 'ष से षट्कोण!', cheerEn: 'Sha se Shatkon!' }
    ],
    'स': [
        { wordHi: 'सेब', emoji: '🍎', cheerHi: 'स से सेब!', cheerEn: 'Sa se Seb!' },
        { wordHi: 'सूरज', emoji: '☀️', cheerHi: 'स से सूरज!', cheerEn: 'Sa se Sooraj!' },
        { wordHi: 'सब्जी', emoji: '🥦', cheerHi: 'स से सब्जी!', cheerEn: 'Sa se Sabji!' }
    ],
    'ह': [
        { wordHi: 'हाथी', emoji: '🐘', cheerHi: 'ह से हाथी!', cheerEn: 'Ha se Haathi!' },
        { wordHi: 'हिरन', emoji: '🦌', cheerHi: 'ह से हिरन!', cheerEn: 'Ha se Hiran!' },
        { wordHi: 'हाथ', emoji: '🖐️', cheerHi: 'ह से हाथ!', cheerEn: 'Ha se Haath!' }
    ],
    'क्ष': [
        { wordHi: 'क्षत्रिय', emoji: '🛡️', cheerHi: 'क्ष से क्षत्रिय!', cheerEn: 'Ksha se Kshatriya!' },
        { wordHi: 'एक्सरे', emoji: '🩻', cheerHi: 'क्ष से एक्सरे!', cheerEn: 'Ksha se Xray!' }
    ],
    'त्र': [
        { wordHi: 'त्रिशूल', emoji: '🔱', cheerHi: 'त्र से त्रिशूल!', cheerEn: 'Tra se Trishool!' },
        { wordHi: 'त्रिभुज', emoji: '🔺', cheerHi: 'त्र से त्रिभुज!', cheerEn: 'Tra se Tribhuj!' }
    ],
    'ज्ञ': [
        { wordHi: 'ज्ञानी', emoji: '📖', cheerHi: 'ज्ञ से ज्ञानी!', cheerEn: 'Gya se Gyaani!' },
        { wordHi: 'ज्ञान', emoji: '🎓', cheerHi: 'ज्ञ से ज्ञान!', cheerEn: 'Gya se Gyaan!' }
    ]
};

// 3. 3D Pixar Animals List & Config for Masti Park Playground
const PLAYGROUND_ANIMALS = [
    { id: 'lion', nameEn: 'Lion', nameHi: 'शेर', soundName: 'lion', trickTextHi: 'शेर दहाड़ रहा है!', trickTextEn: 'Lion roars loudly!' },
    { id: 'elephant', nameEn: 'Elephant', nameHi: 'हाथी', soundName: 'elephant', trickTextHi: 'हाथी सूंड से पानी फेंक रहा है!', trickTextEn: 'Elephant sprays water!' },
    { id: 'cat', nameEn: 'Cat', nameHi: 'बिल्ली', soundName: 'cat', trickTextHi: 'बिल्ली ने बैकफ्लिप मारी!', trickTextEn: 'Cat did a backflip!' },
    { id: 'dog', nameEn: 'Dog', nameHi: 'कुत्ता', soundName: 'dog', trickTextHi: 'कुत्ते ने गुलाटी मारी!', trickTextEn: 'Dog did a backflip!' },
    { id: 'snake', nameEn: 'Snake', nameHi: 'साँप', soundName: 'snake', trickTextHi: 'साँप लहरदार डांस कर रहा है!', trickTextEn: 'Snake is doing a wiggly dance!' },
    { id: 'lizard', nameEn: 'Lizard', nameHi: 'छिपकली', soundName: 'lizard', trickTextHi: 'छिपकली का रंग बदल गया!', trickTextEn: 'Lizard changed colors!' },
    { id: 'squirrel', nameEn: 'Squirrel', nameHi: 'गिलहरी', soundName: 'acorn', trickTextHi: 'गिलहरी कुतर रही है!', trickTextEn: 'Squirrel is nibbling!' },
    { id: 'rat', nameEn: 'Rat', nameHi: 'चूहा', soundName: 'rat', trickTextHi: 'चूहा फुदक रहा है!', trickTextEn: 'Rat is jumping!' },
    { id: 'parrot', nameEn: 'Parrot', nameHi: 'तोता', soundName: 'parrot', trickTextHi: 'तोता बोल रहा है: मिठ्ठू मिठ्ठू!', trickTextEn: 'Parrot says: Mithu Mithu!' },
    { id: 'monkey', nameEn: 'Monkey', nameHi: 'बंदर', soundName: 'monkey', trickTextHi: 'बंदर पेड़ पर झूल रहा है!', trickTextEn: 'Monkey swings on the branch!' }
];

const PLAYGROUND_ANIMAL_IMAGES = {
    lion: 'assets/lion_3d.png',
    elephant: 'assets/elephant_3d.png',
    cat: 'assets/cat_3d.png',
    dog: 'assets/dog_3d.png',
    snake: 'assets/snake_3d.png',
    lizard: 'assets/lizard_3d.png',
    squirrel: 'assets/squirrel_3d.png',
    rat: 'assets/rat_3d.png',
    parrot: 'assets/parrot_3d.png',
    monkey: 'assets/monkey_3d.png'
};

const PLAYGROUND_FOODS = ['banana', 'milk', 'bone', 'meat', 'acorn', 'cheese', 'bug', 'egg', 'chili', 'leaf'];
const PLAYGROUND_FOOD_MAP = {
    lion: 'meat', elephant: 'leaf', cat: 'milk', dog: 'bone',
    snake: 'egg', lizard: 'bug', squirrel: 'acorn', rat: 'cheese', parrot: 'chili', monkey: 'banana'
};

const RHYMES_DATABASE = {
    twinkle: {
        titleHi: 'ट्विंकल ट्विंकल लिटिल स्टार',
        titleEn: 'Twinkle Twinkle Little Star',
        notes: [
            ['C4', 'C4', 'G4', 'G4', 'A4', 'A4', 'G4'],
            ['F4', 'F4', 'E4', 'E4', 'D4', 'D4', 'C4'],
            ['G4', 'G4', 'F4', 'F4', 'E4', 'E4', 'D4'],
            ['G4', 'G4', 'F4', 'F4', 'E4', 'E4', 'D4'],
            ['C4', 'C4', 'G4', 'G4', 'A4', 'A4', 'G4'],
            ['F4', 'F4', 'E4', 'E4', 'D4', 'D4', 'C4']
        ],
        tempo: 3300,
        phrasesHi: [
            "ट्विंकल, ट्विंकल, लिटिल स्टार।",
            "हाउ आई वंडर, व्हाट यू आर।",
            "अप अबव, द वर्ल्ड सो हाई।",
            "लाइक ए डायमंड, इन द स्काई।",
            "ट्विंकल, ट्विंकल, लिटिल स्टार।",
            "हाउ आई वंडर, व्हाट यू आर।"
        ],
        phrasesEn: [
            "Twinkle, twinkle, little star,",
            "How I wonder, what you are.",
            "Up above, the world so high,",
            "Like a diamond, in the sky.",
            "Twinkle, twinkle, little star,",
            "How I wonder, what you are."
        ],
        singingWordsEn: [
            ["Twinkle", "twinkle", "little", "star"],
            ["How", "I", "wonder", "what", "you", "are"],
            ["Up", "above", "the", "world", "so", "high"],
            ["Like", "a", "diamond", "in", "the", "sky"],
            ["Twinkle", "twinkle", "little", "star"],
            ["How", "I", "wonder", "what", "you", "are"]
        ],
        singingWordsHi: [
            ["ट्विंकल", "ट्विंकल", "लिटिल", "स्टार"],
            ["हाउ", "आई", "वंडर", "व्हाट", "यू", "आर"],
            ["अप", "अबव", "द", "वर्ल्ड", "सो", "हाई"],
            ["लाइक", "ए", "डायमंड", "इन", "द", "स्काई"],
            ["ट्विंकल", "ट्विंकल", "लिटिल", "स्टार"],
            ["हाउ", "आई", "वंडर", "व्हाट", "यू", "आर"]
        ]
    },
    abc: {
        titleHi: 'ए-बी-सी वर्णमाला गीत',
        titleEn: 'Alphabet Song (ABC)',
        notes: [
            ['C4', 'C4', 'G4', 'G4', 'A4', 'A4', 'G4'],
            ['F4', 'F4', 'E4', 'E4', 'D4', 'D4', 'C4'],
            ['G4', 'G4', 'F4', 'F4', 'E4', 'E4', 'D4'],
            ['G4', 'G4', 'F4', 'F4', 'E4', 'E4', 'D4'],
            ['C4', 'C4', 'G4', 'G4', 'A4', 'A4', 'G4'],
            ['F4', 'F4', 'E4', 'E4', 'D4', 'D4', 'C4']
        ],
        tempo: 3300,
        phrasesHi: [
            "ए, बी, सी, डी, ई, एफ, जी।",
            "एच, आई, जे, के, एल, एम, एन, ओ, पी।",
            "क्यू, आर, एस, और टी, यू, वी।",
            "डब्लू, एक्स, और वाई, एंड, ज़ेड।",
            "नाउ आई नो, माई एबीसी।",
            "नेक्स्ट टाइम, वोंट यू सिंग विद मी।"
        ],
        phrasesEn: [
            "A, B, C, D, E, F, G,",
            "H, I, J, K, L, M, N, O, P.",
            "Q, R, S, and T, U, V.",
            "W, X, and Y, and Z.",
            "Now I know, my ABCs,",
            "Next time, won't you sing with me!"
        ],
        singingWordsEn: [
            ["A", "B", "C", "D", "E", "F", "G"],
            ["H", "I", "J", "K", "L", "M", "N", "O", "P"],
            ["Q", "R", "S", "and", "T", "U", "V"],
            ["W", "X", "and", "Y", "and", "Z"],
            ["Now", "I", "know", "my", "A", "B", "C"],
            ["Next", "time", "won't", "you", "sing", "with", "me"]
        ],
        singingWordsHi: [
            ["ए", "बी", "सी", "डी", "ई", "एफ", "जी"],
            ["एच", "आई", "जे", "के", "एल", "एम", "एन", "ओ", "पी"],
            ["क्यू", "आर", "एस", "और", "टी", "यू", "वी"],
            ["डब्लू", "एक्स", "और", "वाई", "एंड", "ज़ेड"],
            ["नाउ", "आई", "नो", "माई", "ए", "बी", "सी"],
            ["नेक्स्ट", "टाइम", "वोंट", "यू", "सिंग", "विद", "मी"]
        ]
    },
    machhli: {
        titleHi: 'मछली जल की रानी है',
        titleEn: 'Machhli Jal Ki Rani Hai',
        notes: [
            ['C4', 'E4', 'G4', 'G4', 'A4', 'G4'],
            ['E4', 'C4', 'D4', 'D4', 'E4', 'D4', 'C4'],
            ['E4', 'E4', 'G4', 'G4', 'A4', 'G4'],
            ['C4', 'D4', 'D4', 'E4', 'D4', 'C4', 'C4']
        ],
        tempo: 3300,
        phrasesHi: [
            "मछली जल की, रानी है,",
            "जीवन उसका, पानी है।",
            "हाथ लगाओगे, तो डर जायेगी,",
            "बाहर निकालोगे, तो मर जायेगी।"
        ],
        phrasesEn: [
            "Fish is the queen, of water,",
            "Her life is, only water.",
            "Touch her, and she gets scared,",
            "Take her out, and she will die."
        ],
        singingWordsEn: [
            ["Fish", "is", "the", "queen", "of", "water"],
            ["Her", "life", "is", "only", "water"],
            ["Touch", "her", "and", "she", "gets", "scared"],
            ["Take", "her", "out", "and", "she", "will", "die"]
        ],
        singingWordsHi: [
            ["मछली", "जल", "की", "रानी", "है"],
            ["जीवन", "उसका", "पानी", "है"],
            ["हाथ", "लगाओगे", "तो", "डर", "जायेगी"],
            ["बाहर", "निकालोगे", "तो", "मर", "जायेगी"]
        ]
    },
    chanda: {
        titleHi: 'चंदा मामा दूर के',
        titleEn: 'Chanda Mama Door Ke',
        notes: [
            ['C4', 'D4', 'E4', 'C4', 'E4', 'F4', 'G4'],
            ['G4', 'A4', 'A4', 'G4', 'F4', 'E4', 'D4', 'C4'],
            ['C4', 'D4', 'E4', 'C4', 'E4', 'F4', 'G4'],
            ['G4', 'A4', 'A4', 'G4', 'F4', 'E4', 'D4', 'C4']
        ],
        tempo: 3300,
        phrasesHi: [
            "चंदा मामा, दूर के, पुए पकाएं, बूर के।",
            "आप खाएं, थाली में, मुन्ने को दें, प्याली में।",
            "प्याली गई, टूट, मुन्ना गया, रूठ।",
            "लाएंगे नई, प्यालियां, बजा बजा के, तालियां!"
        ],
        phrasesEn: [
            "Uncle Moon, lives far away, cooking sweets, far away.",
            "He eats, on a plate, gives baby, in a cup.",
            "The cup, broke, baby, got upset.",
            "We will buy, new cups, clap hands, to make him smile!"
        ],
        singingWordsEn: [
            ["Uncle", "Moon", "lives", "far", "away"],
            ["Cooking", "sweets", "so", "far", "away"],
            ["He", "eats", "on", "a", "plate", "so", "fine"],
            ["Gives", "the", "baby", "in", "a", "cup"]
        ],
        singingWordsHi: [
            ["चंदा", "मामा", "दूर", "के"],
            ["पुए", "पकाएं", "बूर", "के"],
            ["आप", "खाएं", "थाली", "में"],
            ["मुन्ने", "को", "दें", "प्याली", "में"]
        ]
    },
    titli: {
        titleHi: 'तितली उड़ी बस पर चढ़ी',
        titleEn: 'Titli Udi Bus Par Chhadi',
        notes: [
            ['E4', 'G4', 'E4', 'G4', 'A4', 'G4'],
            ['D4', 'D4', 'F4', 'E4', 'D4', 'C4'],
            ['E4', 'G4', 'E4', 'G4', 'A4', 'G4'],
            ['D4', 'D4', 'F4', 'E4', 'D4', 'C4']
        ],
        tempo: 3200,
        phrasesHi: [
            "तितली उड़ी, बस पर चढ़ी,",
            "सीट ना मिली, तो रोने लगी।",
            "ड्राइवर ने कहा, आजा मेरे पास,",
            "तितली बोली, ना बाबा ना, मेरा घर है पास!"
        ],
        phrasesEn: [
            "Butterfly flew, boarded the bus,",
            "Found no seat, so she started crying.",
            "Driver said, come sit with me,",
            "Butterfly said, no way, my home is near."
        ],
        singingWordsEn: [
            ["Butterfly", "flew", "up", "high", "in", "sky"],
            ["Found", "no", "seat", "started", "crying"],
            ["Driver", "said", "come", "sit", "here"],
            ["She", "said", "no", "my", "home", "is", "near"]
        ],
        singingWordsHi: [
            ["तितली", "उड़ी", "बस", "पर", "चढ़ी"],
            ["सीट", "ना", "मिली", "तो", "रोने", "लगी"],
            ["ड्राइवर", "ने", "कहा", "आजा", "मेरे", "पास"],
            ["तितली", "बोली", "ना", "बाबा", "ना", "मेरा", "घर", "पास"]
        ]
    },
    humpty: {
        titleHi: 'हम्टी डम्टी दीवार पर',
        titleEn: 'Humpty Dumpty Sat on a Wall',
        notes: [
            ['C4', 'E4', 'C4', 'E4', 'G4', 'G4', 'A4'],
            ['A4', 'G4', 'F4', 'F4', 'E4', 'E4', 'D4'],
            ['G4', 'G4', 'F4', 'F4', 'E4', 'E4', 'D4'],
            ['C4', 'E4', 'C4', 'E4', 'G4', 'G4', 'A4']
        ],
        tempo: 3200,
        phrasesHi: [
            "हम्टी डम्टी बैठे थे दीवार पर,",
            "हम्टी डम्टी गिरे धड़ाम से!",
            "राजा के घोड़े और राजा के सिपाही,",
            "हम्टी को जोड़ ना पाए दुबारा!"
        ],
        phrasesEn: [
            "Humpty Dumpty sat on a wall,",
            "Humpty Dumpty had a great fall.",
            "All the king's horses and all the king's men,",
            "Couldn't put Humpty together again!"
        ],
        singingWordsEn: [
            ["Humpty", "Dumpty", "sat", "on", "a", "wall"],
            ["Humpty", "Dumpty", "had", "a", "great", "fall"],
            ["All", "king's", "horses", "and", "all", "his", "men"],
            ["Couldn't", "put", "Humpty", "together", "again"]
        ],
        singingWordsHi: [
            ["हम्टी", "डम्टी", "बैठे", "दीवार", "पर"],
            ["हम्टी", "डम्टी", "गिरे", "धड़ाम", "से"],
            ["राजा", "के", "घोड़े", "और", "सिपाही"],
            ["हम्टी", "को", "जोड़", "ना", "पाए", "दुबारा"]
        ]
    }
};

// --- App State ---
let currentLang = 'hi';
let isMuted = false;
let currentScreen = 'screen-dashboard';

// --- Text to Speech (Natural Vocals) ---
function speak(textHi, textEn, pitch = 1.0, rate = 0.9) {
    if (isMuted) return;
    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        
        const text = (currentLang === 'hi') ? textHi : textEn;
        const utterance = new SpeechSynthesisUtterance(text);
        
        const targetLocale = (currentLang === 'hi') ? 'hi-IN' : 'en-US';
        const voices = window.speechSynthesis.getVoices();
        const matchingVoice = voices.find(v => v.lang.includes(targetLocale));
        if (matchingVoice) {
            utterance.voice = matchingVoice;
        }
        
        utterance.lang = targetLocale;
        utterance.pitch = pitch;
        utterance.rate = rate; // read naturally and slightly slower
        
        document.getElementById('caption-text').textContent = text;
        window.speechSynthesis.speak(utterance);
    }
}

// --- Navigation Controller ---
function showScreen(screenId) {
    const screens = document.querySelectorAll('.app-screen');
    screens.forEach(s => s.classList.add('hidden'));
    
    document.getElementById(screenId).classList.remove('hidden');
    currentScreen = screenId;
    
    // Stop loops/timers of other screens
    stopCurrentRhyme();
    
    const btnHome = document.getElementById('btn-home');
    if (screenId === 'screen-dashboard') {
        btnHome.classList.add('hidden');
        speak("क्या सीखें आज? Choose a world to learn!", "What do you want to learn today? Tap a card!");
    } else {
        btnHome.classList.remove('hidden');
        if (screenId === 'screen-abc') {
            speak("चलो ए बी सी डी सीखें! Let's learn ABC!", "Let's learn English ABCs!");
        } else if (screenId === 'screen-hindi') {
            speak("चलो हिंदी वर्णमाला सीखें! Let's learn Hindi alphabet!", "Let's learn Hindi alphabet!");
        } else if (screenId === 'screen-numbers') {
            resetCountingStage();
            speak("चलो गिनती सीखें! Choose a number to count!", "Let's learn counting! Pick a number!");
        } else if (screenId === 'screen-rhymes') {
            speak("चलो संगीत बजाएं! पियानो की कुंजियां दबाएं या गिटार के तार बजाएं!", "Let's play music! Tap the piano keys or strum the guitar strings!");
        } else if (screenId === 'screen-playground') {
            initializePlayground();
            speak("एनिमल केयर एडवेंचर में आपका स्वागत है! जानवरों की देखभाल करें!", "Welcome to Animal Care Adventure! Take care of the cute animals!");
        }
    }
}

// Sparkle emitter
function spawnConfetti(x, y, emoji, count = 10) {
    const stage = document.getElementById('screen-container');
    const bounds = stage.getBoundingClientRect();
    
    const relX = x - bounds.left;
    const relY = y - bounds.top;

    for (let i = 0; i < count; i++) {
        const p = document.createElement('div');
        p.className = 'particle';
        p.textContent = emoji;
        p.style.left = `${relX}px`;
        p.style.top = `${relY}px`;
        
        const angle = Math.random() * Math.PI * 2;
        const dist = 30 + Math.random() * 80;
        const dx = Math.cos(angle) * dist;
        const dy = Math.sin(angle) * dist - 25;
        const dr = -90 + Math.random() * 180;
        
        p.style.setProperty('--dx', `${dx}px`);
        p.style.setProperty('--dy', `${dy}px`);
        p.style.setProperty('--dr', `${dr}deg`);
        
        stage.appendChild(p);
        setTimeout(() => p.remove(), 850);
    }
}

// --- Module 1: ABC World ---
function initializeAbcWorld() {
    const container = document.getElementById('container-abc');
    container.innerHTML = '';
    
    const colors = ['#FF5722', '#E91E63', '#4CAF50', '#2196F3', '#9C27B0', '#FFC107', '#00BCD4', '#FF9800'];
    
    Object.keys(ABC_DATABASE).forEach((letter, i) => {
        const btn = document.createElement('button');
        btn.className = 'bubble-key';
        btn.textContent = letter;
        btn.style.backgroundColor = colors[i % colors.length];
        btn.addEventListener('click', (e) => openAbcPopup(letter, e.clientX, e.clientY));
        container.appendChild(btn);
    });
    
    document.querySelectorAll('#popup-abc .popup-close').forEach(b => {
        b.addEventListener('click', () => {
            document.getElementById('popup-abc').classList.add('hidden');
            playSoundEffect('pop');
        });
    });
}

function openAbcPopup(letter, clientX, clientY) {
    playSoundEffect('pop');
    const items = ABC_DATABASE[letter];
    
    const popup = document.getElementById('popup-abc');
    popup.classList.remove('hidden');
    
    document.getElementById('popup-letter-val').textContent = letter;
    
    const container = document.getElementById('popup-letter-items');
    container.innerHTML = '';
    
    items.forEach((item) => {
        const card = document.createElement('div');
        card.className = 'popup-item-card';
        card.innerHTML = `
            <span class="popup-item-emoji">${item.emoji}</span>
            <span class="popup-item-label">${item.wordEn}<br><span style="font-size:12px; color:#7F8C8D;">${item.wordHi}</span></span>
        `;
        card.addEventListener('click', (e) => {
            e.stopPropagation();
            playSoundEffect('chime');
            speak(item.cheerHi, item.cheerEn, 1.25);
            spawnConfetti(e.clientX, e.clientY, item.emoji, 10);
        });
        container.appendChild(card);
    });
    
    // Auto speak the first item on load
    if (items.length > 0) {
        speak(items[0].cheerHi, items[0].cheerEn, 1.25);
        spawnConfetti(clientX || window.innerWidth/2, clientY || window.innerHeight/2, items[0].emoji, 10);
    }
}

// --- Module 2: Hindi Varnamala ---
function initializeHindiWorld() {
    const container = document.getElementById('container-hindi');
    container.innerHTML = '';
    
    const colors = ['#E91E63', '#2196F3', '#4CAF50', '#FF9800', '#9C27B0', '#00BCD4', '#FF5722', '#FFC107'];
    
    Object.keys(HINDI_DATABASE).forEach((akshar, i) => {
        const btn = document.createElement('button');
        btn.className = 'bubble-key';
        btn.textContent = akshar;
        btn.style.backgroundColor = colors[i % colors.length];
        btn.addEventListener('click', (e) => openHindiPopup(akshar, e.clientX, e.clientY));
        container.appendChild(btn);
    });
    
    document.querySelectorAll('#popup-hindi .popup-close').forEach(b => {
        b.addEventListener('click', () => {
            document.getElementById('popup-hindi').classList.add('hidden');
            playSoundEffect('pop');
        });
    });
}

function openHindiPopup(akshar, clientX, clientY) {
    playSoundEffect('pop');
    const items = HINDI_DATABASE[akshar];
    
    const popup = document.getElementById('popup-hindi');
    popup.classList.remove('hidden');
    
    document.getElementById('popup-hindi-val').textContent = akshar;
    
    const container = document.getElementById('popup-hindi-items');
    container.innerHTML = '';
    
    items.forEach((item) => {
        const card = document.createElement('div');
        card.className = 'popup-item-card';
        card.innerHTML = `
            <span class="popup-item-emoji">${item.emoji}</span>
            <span class="popup-item-label">${item.wordHi}</span>
        `;
        card.addEventListener('click', (e) => {
            e.stopPropagation();
            playSoundEffect('chime');
            speak(item.cheerHi, item.cheerHi, 1.2);
            spawnConfetti(e.clientX, e.clientY, item.emoji, 10);
        });
        container.appendChild(card);
    });
    
    // Auto speak the first item on load
    if (items.length > 0) {
        speak(items[0].cheerHi, items[0].cheerHi, 1.2);
        spawnConfetti(clientX || window.innerWidth/2, clientY || window.innerHeight/2, items[0].emoji, 10);
    }
}

// --- Module 3: 123 Counting Range Stage ---
let countCurrent = 0;
let countTarget = 0;
let countItemsArray = [];
let countAnimId = null;

function resetCountingStage() {
    countCurrent = 0;
    countTarget = 0;
    countItemsArray = [];
    document.getElementById('spawn-layer').innerHTML = '';
    document.getElementById('count-current').textContent = '0';
    document.getElementById('count-target').textContent = '0';
    document.getElementById('counting-instruction').classList.remove('hidden');
    
    const active = document.querySelector('.num-btn.active-num');
    if (active) active.classList.remove('active-num');
}

function initializeNumbersWorld() {
    const rangeSelect = document.getElementById('range-select');
    rangeSelect.addEventListener('change', () => {
        rebuildNumberButtons(parseInt(rangeSelect.value));
    });
    
    // Default load (1 to 10)
    rebuildNumberButtons(10);
}

function rebuildNumberButtons(maxRange) {
    const selectorRow = document.getElementById('number-selector-row');
    selectorRow.innerHTML = '';
    resetCountingStage();
    
    for (let i = 1; i <= maxRange; i++) {
        const btn = document.createElement('button');
        btn.className = 'num-btn';
        btn.textContent = i;
        btn.setAttribute('data-num', i);
        
        btn.addEventListener('click', () => {
            document.querySelectorAll('.num-btn').forEach(b => b.classList.remove('active-num'));
            btn.classList.add('active-num');
            startCountingSession(i);
        });
        
        selectorRow.appendChild(btn);
    }
}

function startCountingSession(targetNum) {
    playSoundEffect('pop');
    countCurrent = 0;
    countTarget = targetNum;
    countItemsArray = [];
    
    const spawnLayer = document.getElementById('spawn-layer');
    spawnLayer.innerHTML = '';
    
    document.getElementById('count-current').textContent = '0';
    document.getElementById('count-target').textContent = targetNum;
    document.getElementById('counting-instruction').classList.add('hidden');
    
    const introHi = `चलो गिने! ${targetNum} प्यारे जानवर! एक-एक करके छुओ!`;
    const introEn = `Let's count! ${targetNum} cute animals! Tap them one by one!`;
    speak(introHi, introEn, 1.15);
    
    const stage = document.getElementById('counting-stage');
    const width = stage.clientWidth;
    const height = stage.clientHeight;
    
    for (let i = 0; i < targetNum; i++) {
        // Choose a random animal for each spawned toy
        const randomAnimal = PLAYGROUND_ANIMALS[Math.floor(Math.random() * PLAYGROUND_ANIMALS.length)];
        
        const el = document.createElement('div');
        el.className = 'toy-fruit';
        el.innerHTML = `<img src="${PLAYGROUND_ANIMAL_IMAGES[randomAnimal.id]}" style="width:100%; height:100%; object-fit:contain; border-radius:50%;">`;
        
        const rx = 30 + Math.random() * (width - 120);
        const ry = 30 + Math.random() * (height - 120);
        
        spawnLayer.appendChild(el);
        
        const item = {
            element: el,
            animal: randomAnimal,
            emoji: '✨',
            x: rx, y: ry,
            vx: (Math.random() - 0.5) * 3.5,
            vy: (Math.random() - 0.5) * 3.5,
            width: 70, height: 70,
            isCounted: false
        };
        
        el.style.left = `${item.x}px`;
        el.style.top = `${item.y}px`;
        
        el.addEventListener('pointerdown', (e) => {
            e.preventDefault();
            handleCountingClick(item, e.clientX, e.clientY);
        });
        
        countItemsArray.push(item);
    }
    
    if (!countAnimId) {
        animateCountingStage();
    }
}

function handleCountingClick(item, clientX, clientY) {
    if (item.isCounted) return;
    
    countCurrent++;
    item.isCounted = true;
    item.element.classList.add('counted');
    document.getElementById('count-current').textContent = countCurrent;
    
    spawnConfetti(clientX, clientY, '✨', 8);
    
    // Play animal specific sound
    playSoundEffect(item.animal.soundName === 'acorn' ? 'chime' : item.animal.soundName);
    
    speak(`${countCurrent}!`, `${countCurrent}!`, 1.25);
    
    if (countCurrent === countTarget) {
        setTimeout(() => {
            playSoundEffect('victory');
            speak(
                `अरे वाह! आपने पूरे ${countTarget} जानवरों को गिन लिया! बहुत बढ़िया!`, 
                `Awesome! You counted all ${countTarget} animals! Good job!`
            );
            
            for (let j = 0; j < 3; j++) {
                setTimeout(() => {
                    spawnConfetti(
                        (window.innerWidth / 2) - 150 + Math.random() * 300, 
                        (window.innerHeight / 2) - 100 + Math.random() * 200, 
                        '🎉', 10
                    );
                }, j * 220);
            }
        }, 700);
    }
}

function animateCountingStage() {
    if (currentScreen !== 'screen-numbers') {
        countAnimId = null;
        return;
    }
    
    const stage = document.getElementById('counting-stage');
    const width = stage.clientWidth;
    const height = stage.clientHeight;
    
    countItemsArray.forEach(item => {
        if (item.isCounted) return;
        
        item.x += item.vx;
        item.y += item.vy;
        
        if (item.x < 5) { item.x = 5; item.vx = -item.vx; }
        else if (item.x > width - item.width - 5) { item.x = width - item.width - 5; item.vx = -item.vx; }
        
        if (item.y < 5) { item.y = 5; item.vy = -item.vy; }
        else if (item.y > height - item.height - 5) { item.y = height - item.height - 5; item.vy = -item.vy; }
        
        item.element.style.left = `${item.x}px`;
        item.element.style.top = `${item.y}px`;
    });
    
    countAnimId = requestAnimationFrame(animateCountingStage);
}

// --- Module 4: Magic Music World (Piano & Guitar) ---
let isSongPlaying = false; // dummy for backward compatibility

function initializeInstrumentsWorld() {
    // 1. Setup Piano Keys
    const whiteKeys = document.querySelectorAll('.piano-key-white');
    whiteKeys.forEach(key => {
        key.onclick = (e) => {
            e.preventDefault();
            const note = key.getAttribute('data-note');
            playSynthNote(note, 0.55, 'triangle');
            
            const bounds = key.getBoundingClientRect();
            spawnMusicParticle(bounds.left + bounds.width/2, bounds.top, '🎵');
        };
    });
    
    const blackKeys = document.querySelectorAll('.piano-key-black');
    blackKeys.forEach(key => {
        key.onclick = (e) => {
            e.preventDefault();
            const note = key.getAttribute('data-note');
            playSynthNote(note, 0.45, 'sine');
            
            const bounds = key.getBoundingClientRect();
            spawnMusicParticle(bounds.left + bounds.width/2, bounds.top, '🎶');
        };
    });
    
    // 2. Setup Guitar Strings (Strum & Tap)
    const strings = document.querySelectorAll('.guitar-string');
    let isMouseDown = false;
    
    document.addEventListener('pointerdown', () => { isMouseDown = true; });
    document.addEventListener('pointerup', () => { isMouseDown = false; });
    
    strings.forEach(str => {
        const triggerPluck = (clientX, clientY) => {
            const note = str.getAttribute('data-note');
            
            // Visual vibration
            str.classList.add('vibrate');
            setTimeout(() => str.classList.remove('vibrate'), 220);
            
            playGuitarPluck(note);
            spawnMusicParticle(clientX || window.innerWidth/2, clientY || window.innerHeight/2, '✨');
        };
        
        // Tap/click string
        str.onpointerdown = (e) => {
            e.preventDefault();
            triggerPluck(e.clientX, e.clientY);
        };
        
        // Strum (drag pointer across strings)
        str.onpointerenter = (e) => {
            if (isMouseDown || e.pointerType === 'touch') {
                triggerPluck(e.clientX, e.clientY);
            }
        };
    });
}

function playGuitarPluck(noteName) {
    if (isMuted) return;
    try {
        const ctx = getAudioContext();
        const now = ctx.currentTime;
        
        // Triangle oscillator for the string vibration tone
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(NOTE_FREQS[noteName] || 196.00, now);
        
        // Short white noise burst for transient pluck click
        const bufferSize = ctx.sampleRate * 0.015; // 15ms click
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }
        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 1000;
        
        const noiseGain = ctx.createGain();
        noiseGain.gain.setValueAtTime(0.2, now);
        noiseGain.gain.exponentialRampToValueAtTime(0.01, now + 0.015);
        
        // Connections
        noise.connect(filter);
        filter.connect(noiseGain);
        noiseGain.connect(gainNode);
        
        gainNode.gain.setValueAtTime(0.4, now);
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + 1.3);
        
        osc.connect(gainNode);
        gainNode.connect(ctx.destination);
        
        osc.start(now);
        noise.start(now);
        
        osc.stop(now + 1.3);
        noise.stop(now + 0.015);
    } catch (e) {
        console.warn("Guitar pluck synth error: ", e);
    }
}

function spawnMusicParticle(x, y, char = '🎵') {
    const stage = document.getElementById('screen-container');
    if (!stage) return;
    const bounds = stage.getBoundingClientRect();
    
    const p = document.createElement('div');
    p.className = 'floating-music-particle';
    p.textContent = char;
    p.style.left = `${x - bounds.left}px`;
    p.style.top = `${y - bounds.top}px`;
    
    const dx = (Math.random() - 0.5) * 80;
    const dr = -35 + Math.random() * 70;
    p.style.setProperty('--drift-x', `${dx}px`);
    p.style.setProperty('--drift-r', `${dr}deg`);
    
    stage.appendChild(p);
    setTimeout(() => p.remove(), 900);
}

// Dummy karaoke functions for dashboard navigation compatibility
function stopCurrentRhyme() {}
function initializeRhymesWorld() {
    initializeInstrumentsWorld();
}

// --- Module 5: 4-in-1 Games Suite & Engine ---
let activeGameMode = 'care'; // 'care', 'doctor', 'hideseek', 'train'
let adventureScore = 0;
let isQuestActive = false;

// Global Game variables
let activeQuestAnimal = null;
let activeCorrectFood = null;
let activeCorrectHabitat = null;
let activeCorrectQuizAnimal = null;

// Doctor game state
let activePatientAnimal = null;
let activeAilment = null; // 'thorn', 'mud', 'fever'
let doctorStep = 0; // 0: untreated, 1: half-treated, 2: cured

// Hide & Seek state
let hsTargetSpot = 0;
let hsTargetAnimal = null;

// Pattern Train state
let trainPatternType = 'ABAB';
let trainPatternSequence = [];
let trainCorrectChoice = null;

const HABITATS = {
    cave: { id: 'cave', nameHi: 'गुफा', nameEn: 'Cave', icon: '🪨', animals: ['lion'] },
    tree: { id: 'tree', nameHi: 'पेड़ का घोंसला', nameEn: 'Tree Nest', icon: '🌳', animals: ['parrot', 'monkey', 'squirrel'] },
    water: { id: 'water', nameHi: 'तालाब', nameEn: 'Water Pond', icon: '🌊', animals: ['elephant', 'snake', 'lizard'] },
    house: { id: 'house', nameHi: 'घर', nameEn: 'House', icon: '🏡', animals: ['cat', 'dog', 'rat'] }
};

function initializePlayground() {
    adventureScore = 0;
    updateScoreUI();
    
    // Bind Main Game Select Dropdown
    const selector = document.getElementById('game-select-menu');
    selector.onchange = () => {
        switchMainGame(selector.value);
    };
    
    // Bind Game 1 Tabs
    document.getElementById('tab-feed').onclick = () => switchCareMode('feed');
    document.getElementById('tab-home').onclick = () => switchCareMode('home');
    document.getElementById('tab-quiz').onclick = () => switchCareMode('quiz');
    
    // Bind Quiz Speaker event
    document.getElementById('quiz-speaker-btn').onclick = () => playQuizSound();
    
    // Load default selected game
    switchMainGame(selector.value || 'care');
}

function switchMainGame(gameVal) {
    playSoundEffect('pop');
    activeGameMode = gameVal;
    isQuestActive = false;
    
    // Hide all viewports
    document.querySelectorAll('.game-suite-viewport').forEach(view => {
        view.classList.add('hidden');
    });
    
    // Show selected viewport
    if (gameVal === 'care') {
        document.getElementById('game-viewport-care').classList.remove('hidden');
        switchCareMode('feed');
    } else if (gameVal === 'doctor') {
        document.getElementById('game-viewport-doctor').classList.remove('hidden');
        generateDoctorChallenge();
    } else if (gameVal === 'hideseek') {
        document.getElementById('game-viewport-hideseek').classList.remove('hidden');
        generateHideSeekChallenge();
    } else if (gameVal === 'train') {
        document.getElementById('game-viewport-train').classList.remove('hidden');
        generateTrainChallenge();
    }
}

function updateScoreUI() {
    const stars = document.querySelectorAll('.score-star');
    stars.forEach((star, idx) => {
        if (idx < adventureScore) {
            star.classList.add('active-star');
        } else {
            star.classList.remove('active-star');
        }
    });
}

function addScorePoint() {
    adventureScore++;
    updateScoreUI();
    
    if (adventureScore >= 5) {
        setTimeout(() => {
            playSoundEffect('victory');
            speak("बधाई हो! आपने सभी खेलों को बहुत अच्छे से खेला!", "Congratulations! You did amazing in all the games!");
            
            // Shower confetti
            for (let i = 0; i < 6; i++) {
                setTimeout(() => {
                    spawnConfetti(
                        (window.innerWidth / 2) - 150 + Math.random() * 300, 
                        (window.innerHeight / 2) - 100 + Math.random() * 200, 
                        '🎉', 12
                    );
                }, i * 180);
            }
            
            adventureScore = 0;
            setTimeout(() => {
                updateScoreUI();
                switchMainGame(activeGameMode);
            }, 1800);
        }, 1200);
    } else {
        setTimeout(() => {
            // Next challenge in active game
            if (activeGameMode === 'care') {
                const activeTab = document.querySelector('.adventure-tab.active-tab');
                const subMode = activeTab ? activeTab.id.replace('tab-', '') : 'feed';
                switchCareMode(subMode);
            } else if (activeGameMode === 'doctor') {
                generateDoctorChallenge();
            } else if (activeGameMode === 'hideseek') {
                generateHideSeekChallenge();
            } else if (activeGameMode === 'train') {
                generateTrainChallenge();
            }
        }, 1800);
    }
}

// ==========================================
// GAME 1: CARE ADVENTURE (FEED, HOME, QUIZ)
// ==========================================
let careSubMode = 'feed'; // 'feed', 'home', 'quiz'

function switchCareMode(subMode) {
    careSubMode = subMode;
    isQuestActive = false;
    
    // Toggle active tab classes
    document.querySelectorAll('.adventure-tab').forEach(t => t.classList.remove('active-tab'));
    document.getElementById(`tab-${subMode}`).classList.add('active-tab');
    
    // Toggle views
    document.getElementById('view-feed').classList.add('hidden');
    document.getElementById('view-home').classList.add('hidden');
    document.getElementById('view-quiz').classList.add('hidden');
    
    if (subMode === 'feed') {
        document.getElementById('view-feed').classList.remove('hidden');
        generateFeedChallenge();
    } else if (subMode === 'home') {
        document.getElementById('view-home').classList.remove('hidden');
        generateHomeChallenge();
    } else if (subMode === 'quiz') {
        document.getElementById('view-quiz').classList.remove('hidden');
        generateQuizChallenge();
    }
}

function generateFeedChallenge() {
    if (isQuestActive) return;
    isQuestActive = true;
    
    activeQuestAnimal = PLAYGROUND_ANIMALS[Math.floor(Math.random() * PLAYGROUND_ANIMALS.length)];
    activeCorrectFood = PLAYGROUND_FOOD_MAP[activeQuestAnimal.id];
    
    // Render Animal
    const dropzone = document.getElementById('feed-animal-drop');
    dropzone.innerHTML = `<img src="${PLAYGROUND_ANIMAL_IMAGES[activeQuestAnimal.id]}" class="animal-img" id="quest-feed-animal">`;
    dropzone.className = "adventure-animal-dropzone";
    
    const promptHi = `${activeQuestAnimal.nameHi} को भूख लगी है! उसका पसंदीदा भोजन खिलाओ!`;
    const promptEn = `${activeQuestAnimal.nameEn} is hungry! Feed its favorite food!`;
    document.getElementById('quest-feed-text').textContent = (currentLang === 'hi') ? promptHi : promptEn;
    speak(promptHi, promptEn, 1.25);
    
    const foodsList = [...PLAYGROUND_FOODS];
    const incorrectChoices = foodsList.filter(f => f !== activeCorrectFood);
    shuffleArray(incorrectChoices);
    
    const choices = [activeCorrectFood, incorrectChoices[0], incorrectChoices[1]];
    shuffleArray(choices);
    
    const choicesRow = document.getElementById('feed-choices');
    choicesRow.innerHTML = '';
    
    choices.forEach(foodId => {
        const card = document.createElement('div');
        card.className = 'adventure-food-card';
        card.innerHTML = FOOD_SVGS[foodId];
        card.onclick = (e) => handleFeedClick(card, foodId, e.clientX, e.clientY);
        choicesRow.appendChild(card);
    });
}

function handleFeedClick(cardEl, foodId, clientX, clientY) {
    if (!isQuestActive) return;
    const animalImg = document.getElementById('quest-feed-animal');
    
    if (foodId === activeCorrectFood) {
        isQuestActive = false;
        playSoundEffect('chime');
        spawnConfetti(clientX, clientY, '❤️', 8);
        
        animalImg.classList.add('chewing', 'happy-jump');
        setTimeout(() => animalImg.classList.remove('chewing', 'happy-jump'), 1200);
        
        setTimeout(() => {
            playSoundEffect(activeQuestAnimal.soundName === 'acorn' ? 'chime' : activeQuestAnimal.soundName);
            speak(activeQuestAnimal.trickTextHi, activeQuestAnimal.trickTextEn, 1.25);
            triggerAnimalVisualTrick(animalImg, activeQuestAnimal.id);
        }, 600);
        
        addScorePoint();
    } else {
        playSoundEffect('buzzer');
        animalImg.classList.add('refusing');
        setTimeout(() => animalImg.classList.remove('refusing'), 500);
        speak("नहीं, मुझे यह खाना पसंद नहीं है!", "No, I don't eat this food!", 1.15);
    }
}

function generateHomeChallenge() {
    if (isQuestActive) return;
    isQuestActive = true;
    
    activeQuestAnimal = PLAYGROUND_ANIMALS[Math.floor(Math.random() * PLAYGROUND_ANIMALS.length)];
    
    activeCorrectHabitat = null;
    for (const habKey in HABITATS) {
        if (HABITATS[habKey].animals.includes(activeQuestAnimal.id)) {
            activeCorrectHabitat = HABITATS[habKey];
            break;
        }
    }
    
    const dragzone = document.getElementById('home-animal-drag');
    dragzone.innerHTML = `<img src="${PLAYGROUND_ANIMAL_IMAGES[activeQuestAnimal.id]}" class="animal-img" id="quest-home-animal">`;
    dragzone.className = "adventure-draggable-animal";
    
    const promptHi = `${activeQuestAnimal.nameHi} का घर कहाँ है? उस पर क्लिक करें!`;
    const promptEn = `Where is ${activeQuestAnimal.nameEn}'s home? Tap its correct home!`;
    document.getElementById('quest-home-text').textContent = (currentLang === 'hi') ? promptHi : promptEn;
    speak(promptHi, promptEn, 1.2);
    
    const habList = Object.values(HABITATS);
    const incorrectHabitats = habList.filter(h => h.id !== activeCorrectHabitat.id);
    shuffleArray(incorrectHabitats);
    
    const choices = [activeCorrectHabitat, incorrectHabitats[0], incorrectHabitats[1]];
    shuffleArray(choices);
    
    const habitatsGrid = document.getElementById('home-habitats');
    habitatsGrid.innerHTML = '';
    
    choices.forEach(hab => {
        const card = document.createElement('div');
        card.className = 'adventure-habitat-card';
        card.innerHTML = `
            <span class="habitat-icon">${hab.icon}</span>
            <span class="habitat-label">${(currentLang === 'hi') ? hab.nameHi : hab.nameEn}</span>
        `;
        card.onclick = (e) => handleHabitatClick(card, hab.id, e.clientX, e.clientY);
        habitatsGrid.appendChild(card);
    });
}

function handleHabitatClick(cardEl, habitatId, clientX, clientY) {
    if (!isQuestActive) return;
    const animalImg = document.getElementById('quest-home-animal');
    
    if (habitatId === activeCorrectHabitat.id) {
        isQuestActive = false;
        playSoundEffect('victory');
        spawnConfetti(clientX, clientY, '🎉', 10);
        
        cardEl.style.backgroundColor = '#E8F5E9';
        cardEl.style.borderColor = '#4CAF50';
        animalImg.classList.add('happy-jump');
        
        const successHi = `हाँ! ${activeQuestAnimal.nameHi} का घर ${activeCorrectHabitat.nameHi} है!`;
        const successEn = `Yes! ${activeQuestAnimal.nameEn} lives in the ${activeCorrectHabitat.nameEn}!`;
        speak(successHi, successEn, 1.25);
        
        addScorePoint();
    } else {
        playSoundEffect('buzzer');
        cardEl.style.animation = 'shake-refuse 0.4s ease';
        setTimeout(() => cardEl.style.animation = '', 400);
        speak("नहीं, यह मेरा घर नहीं है!", "No, that is not my home!", 1.15);
    }
}

function generateQuizChallenge() {
    if (isQuestActive) return;
    isQuestActive = true;
    
    activeCorrectQuizAnimal = PLAYGROUND_ANIMALS[Math.floor(Math.random() * PLAYGROUND_ANIMALS.length)];
    
    setTimeout(() => { playQuizSound(); }, 800);
    
    const animalsList = [...PLAYGROUND_ANIMALS];
    const incorrectAnimals = animalsList.filter(a => a.id !== activeCorrectQuizAnimal.id);
    shuffleArray(incorrectAnimals);
    
    const choices = [activeCorrectQuizAnimal, incorrectAnimals[0], incorrectAnimals[1]];
    shuffleArray(choices);
    
    const choicesRow = document.getElementById('quiz-choices');
    choicesRow.innerHTML = '';
    
    choices.forEach(animal => {
        const card = document.createElement('div');
        card.className = 'adventure-animal-card';
        card.innerHTML = `<img src="${PLAYGROUND_ANIMAL_IMAGES[animal.id]}" class="animal-img">`;
        card.onclick = (e) => handleQuizClick(card, animal.id, e.clientX, e.clientY);
        choicesRow.appendChild(card);
    });
}

function playQuizSound() {
    if (!activeCorrectQuizAnimal) return;
    playSoundEffect(activeCorrectQuizAnimal.soundName === 'acorn' ? 'chime' : activeCorrectQuizAnimal.soundName);
}

function handleQuizClick(cardEl, animalId, clientX, clientY) {
    if (!isQuestActive) return;
    
    if (animalId === activeCorrectQuizAnimal.id) {
        isQuestActive = false;
        playSoundEffect('victory');
        spawnConfetti(clientX, clientY, '🎉', 10);
        cardEl.classList.add('happy-jump');
        
        const successHi = `अरे वाह! यह आवाज़ ${activeCorrectQuizAnimal.nameHi} की ही है!`;
        const successEn = `Awesome! That is the sound of the ${activeCorrectQuizAnimal.nameEn}!`;
        speak(successHi, successEn, 1.25);
        
        addScorePoint();
    } else {
        playSoundEffect('buzzer');
        cardEl.classList.add('refusing');
        setTimeout(() => cardEl.classList.remove('refusing'), 500);
        speak("नहीं, दुबारा सोचो!", "No, try again!", 1.15);
    }
}

// ==========================================
// GAME 2: SAFARI DOCTOR ("सफारी डॉक्टर")
// ==========================================
function generateDoctorChallenge() {
    if (isQuestActive) return;
    isQuestActive = true;
    
    // Pick random patient & illness
    activePatientAnimal = PLAYGROUND_ANIMALS[Math.floor(Math.random() * PLAYGROUND_ANIMALS.length)];
    const ailments = ['thorn', 'mud', 'fever'];
    activeAilment = ailments[Math.floor(Math.random() * ailments.length)];
    doctorStep = 0;
    
    // Render patient
    const patientZone = document.getElementById('doctor-animal-patient');
    patientZone.innerHTML = `<img src="${PLAYGROUND_ANIMAL_IMAGES[activePatientAnimal.id]}" class="animal-img" id="doctor-patient-img">`;
    
    const overlay = document.getElementById('doctor-ailment-overlay');
    overlay.innerHTML = '';
    
    // Prompts and ailment visual effects
    let promptHi = "", promptEn = "";
    if (activeAilment === 'thorn') {
        promptHi = `${activePatientAnimal.nameHi} के पैर में कांटा लगा है! चिमटी (tweezers) से निकालें और पट्टी (bandage) लगाएँ!`;
        promptEn = `${activePatientAnimal.nameEn} has a thorn in its foot! Use tweezers first, then bandage!`;
        overlay.innerHTML = `<div class="ailment-thorn">📍</div>`;
    } else if (activeAilment === 'mud') {
        promptHi = `${activePatientAnimal.nameHi} मिट्टी में बहुत गंदा हो गया है! साबुन (soap) लगाएँ और फव्वारे (water) से धोएँ!`;
        promptEn = `${activePatientAnimal.nameEn} is dirty! Rub soap first, then rinse with water!`;
        overlay.innerHTML = `<div class="ailment-mud"></div>`;
    } else if (activeAilment === 'fever') {
        promptHi = `${activePatientAnimal.nameHi} को बुखार (fever) है! थर्मामीटर (thermometer) से जाँचें और दवा (medicine) दें!`;
        promptEn = `${activePatientAnimal.nameEn} has a fever! Check with thermometer first, then feed medicine!`;
        overlay.innerHTML = `<div class="ailment-spots"></div>`;
        document.getElementById('doctor-patient-img').style.filter = 'saturate(1.8) hue-rotate(-15deg)'; // flush cheeks
    }
    
    document.getElementById('quest-doctor-text').textContent = (currentLang === 'hi') ? promptHi : promptEn;
    speak(promptHi, promptEn, 1.25);
    
    // Render medical tools
    const toolsRow = document.getElementById('doctor-tools');
    toolsRow.innerHTML = '';
    
    const tools = [
        { id: 'tweezers', icon: '✂️', labelHi: 'चिमटी', labelEn: 'Tweezers' },
        { id: 'bandage', icon: '🩹', labelHi: 'पट्टी', labelEn: 'Bandage' },
        { id: 'soap', icon: '🧼', labelHi: 'साबुन', labelEn: 'Soap' },
        { id: 'spray', icon: '🚿', labelHi: 'पानी', labelEn: 'Water' },
        { id: 'thermometer', icon: '🌡️', labelHi: 'थर्मामीटर', labelEn: 'Temp' },
        { id: 'spoon', icon: '🥄', labelHi: 'दवा चम्मच', labelEn: 'Medicine' }
    ];
    
    tools.forEach(tool => {
        const card = document.createElement('div');
        card.className = 'doctor-tool-card';
        card.innerHTML = `
            <span class="doctor-tool-icon">${tool.icon}</span>
            <span class="doctor-tool-label">${(currentLang === 'hi') ? tool.labelHi : tool.labelEn}</span>
        `;
        card.onclick = (e) => handleDoctorToolClick(card, tool.id, e.clientX, e.clientY);
        toolsRow.appendChild(card);
    });
}

function handleDoctorToolClick(toolCard, toolId, clientX, clientY) {
    if (!isQuestActive) return;
    
    const patientImg = document.getElementById('doctor-patient-img');
    const overlay = document.getElementById('doctor-ailment-overlay');
    
    let expectedTool = null;
    
    if (activeAilment === 'thorn') {
        expectedTool = (doctorStep === 0) ? 'tweezers' : 'bandage';
    } else if (activeAilment === 'mud') {
        expectedTool = (doctorStep === 0) ? 'soap' : 'spray';
    } else if (activeAilment === 'fever') {
        expectedTool = (doctorStep === 0) ? 'thermometer' : 'spoon';
    }
    
    if (toolId === expectedTool) {
        playSoundEffect('chime');
        spawnConfetti(clientX, clientY, '🩹', 6);
        
        toolCard.classList.add('active-tool');
        setTimeout(() => toolCard.classList.remove('active-tool'), 1000);
        
        if (doctorStep === 0) {
            doctorStep = 1;
            // Half treated visual update
            if (activeAilment === 'thorn') {
                overlay.innerHTML = ''; // removed thorn
                speak("कांटा निकल गया! अब पट्टी लगाओ!", "Thorn is out! Now apply bandage!", 1.25);
            } else if (activeAilment === 'mud') {
                overlay.querySelector('.ailment-mud').style.background = 'rgba(255, 255, 255, 0.4)'; // soapy lather
                overlay.querySelector('.ailment-mud').style.border = '4px dashed white';
                speak("साबुन लग गया! अब पानी से नहलाओ!", "Soap rubbed! Now rinse with water!", 1.25);
            } else if (activeAilment === 'fever') {
                overlay.innerHTML = ''; // fever checked
                speak("तापमान देख लिया! अब चम्मच से दवा पिलाओ!", "Temperature checked! Now feed medicine!", 1.25);
            }
        } else {
            // Healed!
            isQuestActive = false;
            playSoundEffect('victory');
            spawnConfetti(clientX, clientY, '🎉', 10);
            
            overlay.innerHTML = '';
            patientImg.style.filter = ''; // restore filter
            patientImg.classList.add('happy-jump');
            
            const successHi = `अरे वाह! ${activePatientAnimal.nameHi} अब बिल्कुल ठीक हो गया है!`;
            const successEn = `Wow! ${activePatientAnimal.nameEn} is fully healed now!`;
            speak(successHi, successEn, 1.25);
            
            // Animal sound trigger
            setTimeout(() => {
                playSoundEffect(activePatientAnimal.soundName === 'acorn' ? 'chime' : activePatientAnimal.soundName);
            }, 800);
            
            addScorePoint();
        }
    } else {
        // Wrong tool
        playSoundEffect('buzzer');
        toolCard.style.animation = 'shake-refuse 0.4s ease';
        setTimeout(() => toolCard.style.animation = '', 400);
        speak("नहीं, इस टूल से इलाज नहीं होगा!", "No, that's the wrong tool for this!", 1.15);
    }
}

// ==========================================
// GAME 3: HIDE & SEEK ("जानवरों की छुपन-छुपाई")
// ==========================================
function generateHideSeekChallenge() {
    if (isQuestActive) return;
    isQuestActive = true;
    
    // Choose 4 unique random animals
    const pool = [...PLAYGROUND_ANIMALS];
    shuffleArray(pool);
    const hsAnimals = pool.slice(0, 4);
    
    // Select one target
    hsTargetSpot = Math.floor(Math.random() * 4);
    hsTargetAnimal = hsAnimals[hsTargetSpot];
    
    // Render Hiding Spots
    for (let i = 0; i < 4; i++) {
        const card = document.querySelector(`.hiding-spot-card[data-spot="${i}"]`);
        card.classList.remove('revealed', 'shake-spot');
        
        const holder = document.getElementById(`spot-holder-${i}`);
        holder.innerHTML = `<img src="${PLAYGROUND_ANIMAL_IMAGES[hsAnimals[i].id]}">`;
        
        // Setup click action
        card.onclick = (e) => handleHideSeekClick(card, i, e.clientX, e.clientY);
    }
    
    // Make target spot shake
    const targetCard = document.querySelector(`.hiding-spot-card[data-spot="${hsTargetSpot}"]`);
    targetCard.classList.add('shake-spot');
    
    // Prompts and Sound play
    const promptHi = `सुनो! यह आवाज़ किस झाड़ी या पेड़ के पीछे छुपे जानवर की है? उसे छूकर ढूंढो!`;
    const promptEn = `Listen! Whose sound is that hiding? Tap the correct hiding spot!`;
    document.getElementById('quest-hideseek-text').textContent = (currentLang === 'hi') ? promptHi : promptEn;
    speak(promptHi, promptEn, 1.25);
    
    setTimeout(() => {
        playSoundEffect(hsTargetAnimal.soundName === 'acorn' ? 'chime' : hsTargetAnimal.soundName);
    }, 1000);
}

function handleHideSeekClick(spotCard, spotIndex, clientX, clientY) {
    if (!isQuestActive) return;
    
    if (spotIndex === hsTargetSpot) {
        // Correct find!
        isQuestActive = false;
        spotCard.classList.remove('shake-spot');
        spotCard.classList.add('revealed');
        
        playSoundEffect('victory');
        spawnConfetti(clientX, clientY, '🎉', 12);
        
        const successHi = `मिल गया! यह आवाज़ तो ${hsTargetAnimal.nameHi} की ही है!`;
        const successEn = `Found it! That sound belongs to ${hsTargetAnimal.nameEn}!`;
        speak(successHi, successEn, 1.25);
        
        // Make revealed animal jump
        const animBadge = spotCard.querySelector('.spot-badge-holder');
        animBadge.classList.add('happy-jump');
        
        setTimeout(() => {
            playSoundEffect(hsTargetAnimal.soundName === 'acorn' ? 'chime' : hsTargetAnimal.soundName);
        }, 800);
        
        addScorePoint();
    } else {
        // Wrong spot
        playSoundEffect('buzzer');
        spotCard.style.animation = 'shake-refuse 0.4s ease';
        setTimeout(() => spotCard.style.animation = '', 400);
        speak("नहीं, मैं यहाँ नहीं हूँ, दोबारा ढूंढो!", "No, I'm not here! Try another spot!", 1.15);
    }
}

// ==========================================
// GAME 4: PATTERN TRAIN ("पैटर्न रेलगाड़ी")
// ==========================================
function generateTrainChallenge() {
    if (isQuestActive) return;
    isQuestActive = true;
    
    // Reset train animation classes
    const trainNode = document.getElementById('steam-train-container');
    trainNode.classList.remove('chug-off');
    trainNode.style.left = '20px';
    
    // Pick two animals for pattern
    const pool = [...PLAYGROUND_ANIMALS];
    shuffleArray(pool);
    const animalA = pool[0];
    const animalB = pool[1];
    
    // Select pattern type ABAB or AABA
    const types = ['ABAB', 'AABA'];
    trainPatternType = types[Math.floor(Math.random() * types.length)];
    
    if (trainPatternType === 'ABAB') {
        trainPatternSequence = [animalA, animalB, animalA, animalB]; // last B is empty question mark
        trainCorrectChoice = animalB;
    } else {
        trainPatternSequence = [animalA, animalA, animalB, animalA]; // last A is empty question mark
        trainCorrectChoice = animalA;
    }
    
    // Render carriages list
    const carriagesList = document.getElementById('train-carriages-list');
    carriagesList.innerHTML = '';
    
    for (let i = 0; i < 4; i++) {
        if (i < 3) {
            const carriage = document.createElement('div');
            carriage.className = 'train-carriage';
            carriage.innerHTML = `
                <div class="carriage-badge">
                    <img src="${PLAYGROUND_ANIMAL_IMAGES[trainPatternSequence[i].id]}">
                </div>
            `;
            carriagesList.appendChild(carriage);
            
            // Add connector
            const conn = document.createElement('div');
            conn.className = 'train-carriage-connector';
            carriagesList.appendChild(conn);
        } else {
            // Last carriage is empty/question mark
            const carriage = document.createElement('div');
            carriage.className = 'train-carriage';
            carriage.id = 'train-empty-wagon';
            carriage.innerHTML = `<div class="carriage-question">?</div>`;
            carriagesList.appendChild(carriage);
        }
    }
    
    const promptHi = `रेलगाड़ी का पैटर्न पूरा करो! प्रश्नचिह्न की जगह कौन सा जानवर आएगा?`;
    const promptEn = `Complete the train pattern! Which animal belongs in the question mark?`;
    document.getElementById('quest-train-text').textContent = (currentLang === 'hi') ? promptHi : promptEn;
    speak(promptHi, promptEn, 1.25);
    
    // Choices (1 correct, 2 incorrect)
    const incorrectChoices = pool.slice(2, 4); // animal C and D
    const choices = [trainCorrectChoice, incorrectChoices[0], incorrectChoices[1]];
    shuffleArray(choices);
    
    const choicesRow = document.getElementById('train-choices');
    choicesRow.innerHTML = '';
    
    choices.forEach(animal => {
        const card = document.createElement('div');
        card.className = 'adventure-animal-card';
        card.innerHTML = `<img src="${PLAYGROUND_ANIMAL_IMAGES[animal.id]}">`;
        card.onclick = (e) => handleTrainChoiceClick(card, animal, e.clientX, e.clientY);
        choicesRow.appendChild(card);
    });
}

function handleTrainChoiceClick(choiceCard, animal, clientX, clientY) {
    if (!isQuestActive) return;
    
    if (animal.id === trainCorrectChoice.id) {
        isQuestActive = false;
        playSoundEffect('chime');
        spawnConfetti(clientX, clientY, '🎉', 10);
        
        // Fill the empty wagon
        const emptyWagon = document.getElementById('train-empty-wagon');
        emptyWagon.innerHTML = `
            <div class="carriage-badge">
                <img src="${PLAYGROUND_ANIMAL_IMAGES[animal.id]}">
            </div>
        `;
        
        // Whistle & Chug animation
        setTimeout(() => {
            playSoundEffect('whistle');
            const trainNode = document.getElementById('steam-train-container');
            trainNode.classList.add('chug-off');
            speak("बहुत बढ़िया! ट्रेन चली छुक-छुक!", "Well done! The train completed the pattern!", 1.25);
        }, 500);
        
        addScorePoint();
    } else {
        // Wrong choice
        playSoundEffect('buzzer');
        choiceCard.classList.add('refusing');
        setTimeout(() => choiceCard.classList.remove('refusing'), 500);
        speak("नहीं, दोबारा सोचो!", "No, that's not the correct pattern animal!", 1.15);
    }
}

// Micro animation tricks
function triggerAnimalVisualTrick(element, animalId) {
    if (!element) return;
    if (animalId === 'parrot') {
        element.style.transition = 'transform 0.15s ease-in-out';
        element.style.transform = 'skewX(12deg) scale(1.15)';
        setTimeout(() => {
            element.style.transform = 'skewX(-12deg) scale(1.15)';
            setTimeout(() => {
                element.style.transition = '';
                element.style.transform = '';
            }, 150);
        }, 150);
    } else if (animalId === 'monkey') {
        element.style.transition = 'transform 0.2s ease-in-out';
        element.style.transform = 'translateY(-20px) rotate(15deg) scale(1.1)';
        setTimeout(() => {
            element.style.transform = 'translateY(-20px) rotate(-15deg) scale(1.1)';
            setTimeout(() => {
                element.style.transition = '';
                element.style.transform = '';
            }, 200);
        }, 200);
    } else if (animalId === 'snake') {
        element.style.transition = 'transform 0.2s ease-out';
        element.style.transform = 'scaleY(1.3) skewX(8deg)';
        setTimeout(() => {
            element.style.transition = '';
            element.style.transform = '';
        }, 300);
    } else {
        element.style.transition = 'transform 0.4s ease-out';
        element.style.transform = 'rotate(360deg)';
        setTimeout(() => {
            element.style.transition = '';
            element.style.transform = '';
        }, 400);
    }
}

// Utility shuffler
function shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
}

// --- Menu Dashboard Init ---
function setupDashboard() {
    const cards = document.querySelectorAll('.menu-card');
    cards.forEach(card => {
        card.addEventListener('click', () => {
            playSoundEffect('pop');
            const targetScreen = card.getAttribute('data-target');
            showScreen(targetScreen);
        });
    });
}

function setupGlobalControls() {
    const btnHome = document.getElementById('btn-home');
    const btnLang = document.getElementById('btn-lang');
    const btnSound = document.getElementById('btn-sound');
    
    btnHome.addEventListener('click', () => {
        playSoundEffect('pop');
        showScreen('screen-dashboard');
    });
    
    btnLang.addEventListener('click', () => {
        playSoundEffect('pop');
        if (currentLang === 'hi') {
            currentLang = 'en';
            btnLang.querySelector('.icon').textContent = '🇬🇧';
            btnLang.querySelector('#lang-text').textContent = 'English';
            speak("English mode active!", "English mode active!");
        } else {
            currentLang = 'hi';
            btnLang.querySelector('.icon').textContent = '🇮🇳';
            btnLang.querySelector('#lang-text').textContent = 'Hindi / हिंदी';
            speak("हिंदी मोड चालू है!", "Hindi mode active!");
        }
    });
    
    btnSound.addEventListener('click', () => {
        isMuted = !isMuted;
        const soundIcon = document.getElementById('sound-icon');
        const soundText = document.getElementById('sound-text');
        
        if (isMuted) {
            soundIcon.textContent = '🔇';
            soundText.textContent = 'Sound: Off';
            if ('speechSynthesis' in window) {
                window.speechSynthesis.cancel();
            }
        } else {
            soundIcon.textContent = '🔊';
            soundText.textContent = 'Sound: On';
            getAudioContext();
            playSoundEffect('pop');
        }
    });
}

// SVG Food inline definitions helper
const FOOD_SVGS = {
    banana: `<svg viewBox="0 0 100 100"><path d="M 15,30 Q 30,10 60,20 Q 90,30 85,55 Q 80,75 50,85 Q 20,95 22,65 Z" fill="#FFEB3B"/><path d="M 20,32 Q 32,15 58,23 Q 84,31 80,53 Q 76,70 50,78 Z" fill="#FFF59D"/><path d="M 15,30 Q 10,25 8,15 Q 12,12 18,20 Z" fill="#8D6E63"/></svg>`,
    milk: `<svg viewBox="0 0 100 100"><ellipse cx="50" cy="65" rx="35" ry="18" fill="#E0F7FA" stroke="#00ACC1" stroke-width="4"/><ellipse cx="50" cy="61" rx="31" ry="13" fill="#FFFFFF"/><line x1="42" y1="65" x2="58" y2="65" stroke="#00ACC1" stroke-width="3"/><line x1="46" y1="61" x2="46" y2="69" stroke="#00ACC1" stroke-width="2"/></svg>`,
    bone: `<svg viewBox="0 0 100 100"><g transform="rotate(45 50 50)"><rect x="25" y="44" width="50" height="12" rx="3" fill="#ECEFF1" stroke="#B0BEC5" stroke-width="3"/><circle cx="25" cy="40" r="10" fill="#ECEFF1"/><circle cx="25" cy="58" r="10" fill="#ECEFF1"/><circle cx="75" cy="40" r="10" fill="#ECEFF1"/><circle cx="75" cy="58" r="10" fill="#ECEFF1"/></g></svg>`,
    meat: `<svg viewBox="0 0 100 100"><path d="M 15,75 L 35,55 M 10,75 C 5,75 5,85 15,85 C 20,85 Z" fill="#ECEFF1" stroke="#B0BEC5" stroke-width="6"/><path d="M 32,58 C 25,40 40,20 60,18 C 80,16 90,35 85,55 C 80,75 50,80 32,58 Z" fill="#EF5350" stroke="#C62828" stroke-width="4"/><circle cx="62" cy="35" r="7" fill="#ECEFF1"/></svg>`,
    acorn: `<svg viewBox="0 0 100 100"><path d="M 30,45 C 30,70 50,88 50,88 C 50,88 70,70 70,45 Z" fill="#FFB74D" stroke="#EF6C00" stroke-width="4"/><path d="M 25,45 C 25,35 75,35 75,45 C 75,49 65,52 50,52 Z" fill="#8D6E63" stroke="#4E342E" stroke-width="4"/></svg>`,
    cheese: `<svg viewBox="0 0 100 100"><polygon points="15,75 85,75 75,25 15,75" fill="#FFD54F" stroke="#FFB300" stroke-width="4"/><circle cx="35" cy="60" r="6" fill="#FFB300" opacity="0.6"/><circle cx="55" cy="55" r="4" fill="#FFB300" opacity="0.6"/></svg>`,
    bug: `<svg viewBox="0 0 100 100"><ellipse cx="50" cy="50" rx="18" ry="24" fill="#8E24AA" stroke="#4A148C" stroke-width="3"/><circle cx="50" cy="24" r="10" fill="#4A148C"/><ellipse cx="38" cy="45" rx="10" ry="22" fill="#E0F7FA" opacity="0.7" stroke="#00ACC1" stroke-width="2" transform="rotate(-15 38 45)"/></svg>`,
    egg: `<svg viewBox="0 0 100 100"><path d="M 50,15 C 25,45 25,75 50,85 C 75,75 75,45 50,15 Z" fill="#FFF8E1" stroke="#D7CCC8" stroke-width="4"/><circle cx="45" cy="45" r="2.5" fill="#8D6E63" opacity="0.4"/></svg>`,
    chili: `<svg viewBox="0 0 100 100"><path d="M 50,25 Q 35,30 38,55 Q 42,82 55,78 Q 68,74 58,55 Q 48,35 50,25 Z" fill="#EF5350" stroke="#C62828" stroke-width="4"/><path d="M 50,25 Q 52,15 62,18" fill="none" stroke="#4CAF50" stroke-width="4.5" stroke-linecap="round"/></svg>`,
    leaf: `<svg viewBox="0 0 100 100"><path d="M 50,15 C 20,40 35,75 50,85 C 65,75 80,40 50,15 Z" fill="#4CAF50" stroke="#2E7D32" stroke-width="4"/><path d="M 50,15 L 50,85 M 50,35 Q 40,40 33,43 M 50,48 Q 40,55 35,59 M 50,60 Q 40,68 37,71 M 50,35 Q 60,40 67,43 M 50,48 Q 60,55 65,59 M 50,60 Q 60,68 63,71" stroke="#2E7D32" stroke-width="3" stroke-linecap="round"/></svg>`
};

const PLAYGROUND_ANIMAL_MAP = {
    lion: 'meat', elephant: 'leaf', cat: 'milk', dog: 'bone',
    snake: 'egg', lizard: 'bug', squirrel: 'acorn', rat: 'cheese', parrot: 'chili', monkey: 'banana'
};

// ============================================================
// JANVIKA STAR JAR & CONFETTI REWARD ENGINE
// ============================================================
let janvikaStars = parseInt(localStorage.getItem('janvika_stars') || '0');

function updateStarDisplay() {
    const starNumEl = document.getElementById('star-count-num');
    if (starNumEl) {
        starNumEl.textContent = janvikaStars;
    }
}

function addJanvikaStars(amount = 1) {
    janvikaStars += amount;
    localStorage.setItem('janvika_stars', janvikaStars);
    updateStarDisplay();
    playSoundEffect('victory');
    triggerConfetti();
}

// Lightweight Canvas Confetti Explosion
function triggerConfetti() {
    const canvas = document.createElement('canvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '999999';
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    const particles = [];
    const colors = ['#FF1744', '#FF9100', '#FFD600', '#00E676', '#00E5FF', '#AA00FF', '#E040FB'];

    for (let i = 0; i < 60; i++) {
        particles.push({
            x: window.innerWidth / 2,
            y: window.innerHeight / 2,
            vx: (Math.random() - 0.5) * 16,
            vy: (Math.random() - 0.7) * 16,
            size: Math.random() * 10 + 6,
            color: colors[Math.floor(Math.random() * colors.length)],
            rotation: Math.random() * 360,
            opacity: 1
        });
    }

    let frame = 0;
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        let active = false;

        particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.4; // gravity
            p.opacity -= 0.018;

            if (p.opacity > 0) {
                active = true;
                ctx.save();
                ctx.globalAlpha = p.opacity;
                ctx.fillStyle = p.color;
                ctx.translate(p.x, p.y);
                ctx.rotate(p.rotation * Math.PI / 180);
                ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
                ctx.restore();
            }
        });

        if (active && frame < 90) {
            frame++;
            requestAnimationFrame(animate);
        } else {
            canvas.remove();
        }
    }
    animate();
}

// ============================================================
// DORA-STYLE BOLO & KARO ADVENTURE QUEST ENGINE
// ============================================================
const DORA_QUEST_SCENARIOS = [
    {
        titleHi: "जादुई जंगल का सफर! 🦁🌳",
        titleEn: "Magical Jungle Safari! 🦁🌳",
        emoji: "🦁🌳",
        promptHi: "Janvika! Suno, Hum Jungle me hain! Aage ek Nadi hai. Bolo 'PANI' ya bolo 'JUMP'!",
        promptEn: "Janvika! Listen, We are in the jungle! Say 'PANI' or say 'JUMP'!",
        targetWord: "PANI",
        choices: [
            { word: "PANI", labelHi: "PANI (पानी)", labelEn: "PANI (Water)", emoji: "🌊", prompt: "Bolo - PANI!" },
            { word: "JUMP", labelHi: "JUMP (कूदना)", labelEn: "JUMP (Hop)", emoji: "🦘", prompt: "Bolo - JUMP!" },
            { word: "LION", labelHi: "LION (शेर)", labelEn: "LION (Sheru)", emoji: "🦁", prompt: "Bolo - LION!" }
        ]
    },
    {
        titleHi: "जादुई महल और खज़ाना! 🏰🔑",
        titleEn: "Magical Castle & Treasure! 🏰🔑",
        emoji: "🏰🔑",
        promptHi: "Janvika! Khazane ka darwaza kholne ke liye bolo 'OPEN' ya bolo 'PAPA'!",
        promptEn: "Janvika! To open the treasure door say 'OPEN' or say 'PAPA'!",
        targetWord: "PAPA",
        choices: [
            { word: "PAPA", labelHi: "PAPA (पापा)", labelEn: "PAPA (Daddy)", emoji: "👨‍👧", prompt: "Bolo - PAPA!" },
            { word: "OPEN", labelHi: "OPEN (खोलो)", labelEn: "OPEN (Door)", emoji: "🔑", prompt: "Bolo - OPEN!" },
            { word: "MUMMA", labelHi: "MUMMA (मम्मा)", labelEn: "MUMMA (Mommy)", emoji: "👩‍👧", prompt: "Bolo - MUMMA!" }
        ]
    },
    {
        titleHi: "फल और आइसक्रीम लैंड! 🍎🍦",
        titleEn: "Fruit & Ice Cream Land! 🍎🍦",
        emoji: "🍎🍦",
        promptHi: "Janvika! Yummy treats hain! Bolo 'APPLE' ya bolo 'MILK'!",
        promptEn: "Janvika! Yummy treats! Say 'APPLE' or say 'MILK'!",
        targetWord: "APPLE",
        choices: [
            { word: "APPLE", labelHi: "APPLE (सेब)", labelEn: "APPLE (Fruit)", emoji: "🍎", prompt: "Bolo - APPLE!" },
            { word: "MILK", labelHi: "MILK (दूध)", labelEn: "MILK (Drink)", emoji: "🥛", prompt: "Bolo - MILK!" },
            { word: "AAM", labelHi: "AAM (आम)", labelEn: "MANGO (Aam)", emoji: "🥭", prompt: "Bolo - AAM!" }
        ]
    },
    {
        titleHi: "तारे और स्पेस एडवेंचर! 🚀⭐",
        titleEn: "Star & Space Adventure! 🚀⭐",
        emoji: "🚀⭐",
        promptHi: "Janvika! Aasmaan me taare hain! Bolo 'STAR' ya bolo 'DOGGY'!",
        promptEn: "Janvika! Stars in the sky! Say 'STAR' or say 'DOGGY'!",
        targetWord: "STAR",
        choices: [
            { word: "STAR", labelHi: "STAR (तारा)", labelEn: "STAR (Sky)", emoji: "⭐", prompt: "Bolo - STAR!" },
            { word: "DOGGY", labelHi: "DOGGY (डौगी)", labelEn: "DOGGY (Pup)", emoji: "🐶", prompt: "Bolo - DOGGY!" },
            { word: "MOON", labelHi: "MOON (चांद)", labelEn: "MOON (Chanda)", emoji: "🌙", prompt: "Bolo - MOON!" }
        ]
    }
];

let doraCurrentStep = 0;
let speechRecognitionObj = null;
let doraSpeechTimer = null;

function initializeDoraQuest() {
    const repeatBtn = document.getElementById('btn-repeat-speech');
    const dismissBtn = document.getElementById('btn-touch-guard-dismiss');
    const movementDoneBtn = document.getElementById('btn-movement-done');

    // Tap Sheru Lion to listen to his voice again out loud!
    if (repeatBtn) {
        repeatBtn.addEventListener('click', () => {
            playSoundEffect('pop');
            const scenario = DORA_QUEST_SCENARIOS[doraCurrentStep];
            speak(scenario.promptHi, scenario.promptEn, 1.15, 0.85);
        });
    }

    if (dismissBtn) {
        dismissBtn.addEventListener('click', () => {
            playSoundEffect('pop');
            document.getElementById('touch-guard-modal').classList.add('hidden');
        });
    }

    if (movementDoneBtn) {
        movementDoneBtn.addEventListener('click', () => {
            addJanvikaStars(5);
            speak("Wah Janvika! Bohot badhiya! Tali bajayi!", "Great job Janvika!");
            document.getElementById('dora-movement-card').classList.add('hidden');
            nextDoraQuestStep();
        });
    }

    // Auto-start Web Speech Recognition (Microphone Listener)
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        try {
            const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
            speechRecognitionObj = new SpeechRec();
            speechRecognitionObj.continuous = true;
            speechRecognitionObj.interimResults = true;
            speechRecognitionObj.lang = 'hi-IN';

            speechRecognitionObj.onresult = (event) => {
                for (let i = event.resultIndex; i < event.results.length; ++i) {
                    // ANY sound or word detected from Janvika!
                    if (event.results[i][0].transcript.length > 0 || event.results[i].isFinal) {
                        const wordHeard = event.results[i][0].transcript;
                        console.log("Janvika spoke: ", wordHeard);
                        
                        addJanvikaStars(5);
                        speak("WAH JANVIKA! Tumne bol diya! Shabash!", "Great speaking Janvika!");
                        setTimeout(() => nextDoraQuestStep(), 1400);
                        break;
                    }
                }
            };

            speechRecognitionObj.onerror = (e) => {
                console.log("Speech Rec error/idle: ", e);
            };

            speechRecognitionObj.start();
        } catch(err) {
            console.log("Speech recognition auto-start notice: ", err);
        }
    }

    loadDoraQuestScenario(0);
}

function loadDoraQuestScenario(index) {
    doraCurrentStep = index % DORA_QUEST_SCENARIOS.length;
    const scenario = DORA_QUEST_SCENARIOS[doraCurrentStep];
    
    // Update DOM Visuals (Giant animated emojis, title, caption)
    const heroEl = document.getElementById('dora-hero-emoji');
    if (heroEl) heroEl.textContent = scenario.emoji;
    
    const titleEl = document.getElementById('dora-scene-title');
    if (titleEl) titleEl.textContent = currentLang === 'hi' ? scenario.titleHi : scenario.titleEn;

    const speechTextEl = document.getElementById('dora-speech-text');
    if (speechTextEl) speechTextEl.textContent = currentLang === 'hi' ? scenario.promptHi : scenario.promptEn;

    // SPEAK HOST VOICE OUT LOUD IMMEDIATELY!
    speak(scenario.promptHi, scenario.promptEn, 1.15, 0.85);

    // Auto-restart microphone listening for her voice
    if (speechRecognitionObj) {
        try { speechRecognitionObj.start(); } catch(e) {}
    }

    // Populate Giant Picture Cards (No reading needed for child!)
    const choicesContainer = document.getElementById('dora-choices');
    if (choicesContainer) {
        choicesContainer.innerHTML = '';

        scenario.choices.forEach(ch => {
            const card = document.createElement('div');
            card.className = 'dora-choice-card giant-toddler-card';
            card.innerHTML = `
                <div class="choice-emoji giant-emoji-pic">${ch.emoji}</div>
                <div class="choice-word-label giant-label-text">${ch.word}</div>
            `;

            card.addEventListener('click', () => handleDoraChoiceClick(ch));
            choicesContainer.appendChild(card);
        });
    }
}

function handleDoraChoiceClick(choice) {
    playSoundEffect('pop');
    
    // Speak out loud in friendly voice for toddler!
    const speakTextHi = `Janvika ne bola ${choice.word}! Shabash!`;
    const speakTextEn = `Janvika said ${choice.word}! Great!`;
    speak(speakTextHi, speakTextEn, 1.15, 0.85);

    addJanvikaStars(5);

    // 50% chance to show a physical exercise prompt (Clap / Jump / Hands Up)!
    if (Math.random() > 0.5) {
        showPhysicalExercisePrompt();
    } else {
        setTimeout(() => nextDoraQuestStep(), 1500);
    }
}

function showPhysicalExercisePrompt() {
    const card = document.getElementById('dora-movement-card');
    const iconEl = document.getElementById('movement-icon');
    const textEl = document.getElementById('movement-text');

    const exercises = [
        { icon: "👏", textHi: "Janvika, 3 baar Tali bajao! 👏", textEn: "Janvika, Clap 3 times! 👏" },
        { icon: "🦘", textHi: "Janvika, Chalo JUMP karo! 🦘", textEn: "Janvika, Jump up high! 🦘" },
        { icon: "🙌", textHi: "Janvika, Hands Up karo aur bolo 'HOORAY'! 🙌", textEn: "Janvika, Hands Up! 🙌" }
    ];

    const ex = exercises[Math.floor(Math.random() * exercises.length)];
    iconEl.textContent = ex.icon;
    textEl.textContent = currentLang === 'hi' ? ex.textHi : ex.textEn;

    card.classList.remove('hidden');
    speak(ex.textHi, ex.textEn, 1.1, 0.85);
}

function nextDoraQuestStep() {
    loadDoraQuestScenario(doraCurrentStep + 1);
}

// ============================================================
// FINGER TRACING WORLD ENGINE
// ============================================================
let tracingCanvas, tracingCtx;
let isDrawing = false;
let traceChars = ['A', 'B', 'C', 'D', '1', '2', '3', 'अ', 'आ', 'इ', 'क'];
let currentTraceIndex = 0;

function initializeTracingWorld() {
    tracingCanvas = document.getElementById('tracing-canvas');
    if (!tracingCanvas) return;
    tracingCtx = tracingCanvas.getContext('2d');

    const selectorBar = document.getElementById('tracing-selector');
    const clearBtn = document.getElementById('btn-clear-canvas');
    const nextBtn = document.getElementById('btn-next-trace');

    // Populate selector bar
    if (selectorBar) {
        selectorBar.innerHTML = '';
        traceChars.forEach((ch, idx) => {
            const btn = document.createElement('button');
            btn.className = `trace-select-btn ${idx === 0 ? 'active' : ''}`;
            btn.textContent = ch;
            btn.addEventListener('click', () => {
                playSoundEffect('pop');
                document.querySelectorAll('.trace-select-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                setTraceChar(idx);
            });
            selectorBar.appendChild(btn);
        });
    }

    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            playSoundEffect('pop');
            clearTracingCanvas();
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            addJanvikaStars(3);
            setTraceChar((currentTraceIndex + 1) % traceChars.length);
        });
    }

    // Pointer events for drawing
    tracingCanvas.addEventListener('pointerdown', startTracing);
    tracingCanvas.addEventListener('pointermove', drawTracing);
    tracingCanvas.addEventListener('pointerup', stopTracing);
    tracingCanvas.addEventListener('pointercancel', stopTracing);

    setTraceChar(0);
}

function setTraceChar(index) {
    currentTraceIndex = index;
    const char = traceChars[currentTraceIndex];
    document.getElementById('tracing-bg-char').textContent = char;
    clearTracingCanvas();
    speak(`Bolo - ${char}`, `Say - ${char}`);
}

function clearTracingCanvas() {
    if (tracingCtx) {
        tracingCtx.clearRect(0, 0, tracingCanvas.width, tracingCanvas.height);
    }
}

function startTracing(e) {
    isDrawing = true;
    tracingCtx.beginPath();
    const rect = tracingCanvas.getBoundingClientRect();
    tracingCtx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
}

function drawTracing(e) {
    if (!isDrawing) return;
    const rect = tracingCanvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    tracingCtx.lineWidth = 18;
    tracingCtx.lineCap = 'round';
    tracingCtx.lineJoin = 'round';
    tracingCtx.strokeStyle = '#FF1744';
    tracingCtx.shadowBlur = 10;
    tracingCtx.shadowColor = '#FF9100';

    tracingCtx.lineTo(x, y);
    tracingCtx.stroke();

    playSoundEffect('pop');
}

function stopTracing() {
    if (isDrawing) {
        isDrawing = false;
        tracingCtx.closePath();
    }
}

// ============================================================
// BALLOON POP SPEECH GAME ENGINE
// ============================================================
let balloonPopCount = 0;
let balloonInterval = null;

function initializeBalloonPopWorld() {
    const playground = document.getElementById('balloon-playground');
    if (!playground) return;

    // Clear previous balloons
    playground.innerHTML = '';
    balloonPopCount = 0;
    document.getElementById('balloon-pop-count').textContent = '0';

    speak("Balloons phodo aur bolo!", "Pop the balloons and speak!");

    // Spawn 4 initial balloons
    for (let i = 0; i < 4; i++) {
        spawnBalloon();
    }

    if (balloonInterval) clearInterval(balloonInterval);
    balloonInterval = setInterval(() => {
        if (document.querySelectorAll('.floating-balloon').length < 6) {
            spawnBalloon();
        }
    }, 2500);
}

function spawnBalloon() {
    const playground = document.getElementById('balloon-playground');
    if (!playground) return;

    const balloon = document.createElement('div');
    balloon.className = 'floating-balloon';

    const colors = ['#FF1744', '#E91E63', '#9C27B0', '#2196F3', '#00BCD4', '#4CAF50', '#FFEB3B', '#FF9800'];
    const items = ['A', 'B', 'C', '1', '2', '3', '🍎', '🐱', '🐶', '🦁', '⭐', '🎈'];
    const item = items[Math.floor(Math.random() * items.length)];

    balloon.style.background = colors[Math.floor(Math.random() * colors.length)];
    balloon.style.left = Math.random() * 75 + '%';
    balloon.style.animationDuration = (Math.random() * 3 + 4) + 's';
    balloon.textContent = item;

    balloon.addEventListener('click', () => {
        playSoundEffect('pop');
        speak(`Bolo - ${item}`, `Pop - ${item}`);
        addJanvikaStars(1);
        
        balloonPopCount++;
        document.getElementById('balloon-pop-count').textContent = balloonPopCount;

        balloon.remove();
        spawnBalloon();
    });

    playground.appendChild(balloon);
}

// ============================================================
// DRAG & MATCH GAME ENGINE
// ============================================================
const MATCH_PAIRS = [
    { left: "🍎 Apple", right: "A", word: "A for Apple" },
    { left: "🐘 Elephant", right: "E", word: "E for Elephant" },
    { left: "🐱 Cat", right: "C", word: "C for Cat" },
    { left: "🐶 Dog", right: "D", word: "D for Dog" }
];

let selectedLeftCard = null;

function initializeMatchWorld() {
    const leftCol = document.getElementById('match-col-left');
    const rightCol = document.getElementById('match-col-right');

    if (!leftCol || !rightCol) return;
    leftCol.innerHTML = '';
    rightCol.innerHTML = '';
    selectedLeftCard = null;

    speak("Sahi jodi milaao!", "Match the pairs!");

    // Shuffle pairs
    const shuffledPairs = [...MATCH_PAIRS].sort(() => Math.random() - 0.5);
    const shuffledRights = [...MATCH_PAIRS].sort(() => Math.random() - 0.5);

    shuffledPairs.forEach(p => {
        const card = document.createElement('div');
        card.className = 'match-card';
        card.textContent = p.left;
        card.dataset.match = p.right;

        card.addEventListener('click', () => {
            playSoundEffect('pop');
            document.querySelectorAll('#match-col-left .match-card').forEach(c => c.style.borderColor = '#CE93D8');
            card.style.borderColor = '#FF9800';
            selectedLeftCard = p;
        });

        leftCol.appendChild(card);
    });

    shuffledRights.forEach(p => {
        const card = document.createElement('div');
        card.className = 'match-card';
        card.textContent = p.right;

        card.addEventListener('click', () => {
            playSoundEffect('pop');
            if (selectedLeftCard && selectedLeftCard.right === p.right) {
                // Match success!
                addJanvikaStars(5);
                speak(`Wah! ${selectedLeftCard.word}!`, `Great! ${selectedLeftCard.word}!`);

                document.querySelectorAll('#match-col-left .match-card').forEach(lc => {
                    if (lc.dataset.match === p.right) {
                        lc.classList.add('matched');
                    }
                });
                card.classList.add('matched');
                selectedLeftCard = null;
            } else {
                playSoundEffect('boing');
                speak("Try again!", "Phir se koshish karo!");
            }
        });

        rightCol.appendChild(card);
    });
}

// ============================================================
// WINDOW LOAD INITIALIZATION EXTENSION
// ============================================================
window.addEventListener('load', () => {
    setupGlobalControls();
    setupDashboard();
    
    initializeAbcWorld();
    initializeHindiWorld();
    initializeNumbersWorld();
    initializeInstrumentsWorld();

    // New 10/10 Toddler Features Init
    updateStarDisplay();
    initializeDoraQuest();
    initializeTracingWorld();
    initializeBalloonPopWorld();
    initializeMatchWorld();
    
    showScreen('screen-dashboard');
});

