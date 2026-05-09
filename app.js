'use strict';

// ═══════════════════════════════════════
//  CONFIG
// ═══════════════════════════════════════
const AUDIO_PATH = 'assets/audio/';
const ALL_NOTES  = ['a1','a2','b1','b2','c1','c2','c3','d1','d2','d3','e1','e2','e3','f1','f2','g1','g2'];

const DRUM_AUDIO_PATH = 'assets/drum/';
const DRUM_NOTES = ['a3','bb3','c3','c4','d3','d4','e3','e4','f3','f4','g3'];

const LAYOUTS = {
  9:  ['c2','a1','f1','d1','c1','e1','g1','b1','d2'],
  13: ['g2','e2','c2','a1','f1','d1','c1','e1','g1','b1','d2','f2','a2'],
  17: ['d3','b2','g2','e2','c2','a1','f1','d1','c1','e1','g1','b1','d2','f2','a2','c3','e3']
};

const NOTE_LABEL = { c:'C', d:'D', e:'E', f:'F', g:'G', a:'A', b:'B' };
const NOTE_NUM      = { c:'1', d:'2', e:'3', f:'4', g:'5', a:'6', b:'7' };
const DRUM_NOTE_NUM = { f:'1', g:'2', a:'3', b:'4', c:'5', d:'6', e:'7' };

const TINE_WIDTHS = { 9:'52px', 13:'36px', 17:'26px' };

// Steel Tongue Drum — 10 tongues around oval + 1 center oval (SVG layout)
// angle: math convention 0=right 90=screen-top; top tongues >0, bottom <0
const DRUM_TONGUES = [
  { key:'d4',  num:'6', dot:'',   angle: 150 },
  { key:'f4',  num:'1', dot:'up', angle: 120 },
  { key:'d3',  num:'6', dot:'dn', angle:  90 },
  { key:'e4',  num:'7', dot:'',   angle:  60 },
  { key:'c4',  num:'5', dot:'',   angle:  30 },
  { key:'bb3', num:'4', dot:'',   angle:-150 },
  { key:'g3',  num:'2', dot:'',   angle:-120 },
  { key:'e3',  num:'7', dot:'dn', angle: -90 },
  { key:'f3',  num:'1', dot:'',   angle: -60 },
  { key:'a3',  num:'3', dot:'',   angle: -30 },
];

const INSTRUMENTS = [
  { id:'KALIMBA', en:'Kalimba',           th:'คาลิมบา',     notes:['C','D','E','F','G','A','B'] },
  { id:'DRUM',    en:'Steel Tongue Drum', th:'สตีลทังดรัม', notes:['F','G','A','B♭','C','D','E'] },
];

const THEMES = [
  { id:'TOY',     icon:'🧱', en:'Toy',     th:'ของเล่น' },
  { id:'BLUE',    icon:'💧', en:'Blue',    th:'น้ำ'     },
  { id:'GREEN',   icon:'🍃', en:'Green',   th:'ป่า'     },
  { id:'BRICK',   icon:'🏚️', en:'Brick',   th:'อิฐ'     },
  { id:'GLOW',    icon:'✨', en:'Glow',    th:'เรือง'   },
  { id:'LAVA',    icon:'🔥', en:'Lava',    th:'ลาวา'    },
  { id:'NEON',    icon:'⚡', en:'Neon',    th:'นีออน'   },
  { id:'RAINBOW', icon:'🌈', en:'Rainbow', th:'รุ้ง'    },
  { id:'SAKURA',  icon:'🌸', en:'Sakura',  th:'ซากุระ'  },
  { id:'PRISM',   icon:'🎨', en:'Prism',   th:'ปริซึม'  },
];

const EQ_PRESETS = [
  { id:'DRY',    en:'Dry',    th:'ธรรมดา' },
  { id:'WARM',   en:'Warm',   th:'นุ่ม'   },
  { id:'BRIGHT', en:'Bright', th:'ใส'     },
  { id:'DEEP',   en:'Deep',   th:'ลึก'    },
  { id:'PRESENCE', en:'Presence', th:'โดดเด่น' },
];

const STRINGS = {
  th: {
    settings:'ตั้งค่า', volume:'ระดับเสียง', eq:'เอฟเฟคเสียง',
    mode:'โหมดลิ้น', tines:'ลิ้น', theme:'ธีม', instrument:'เครื่องดนตรี',
    recordings:'การบันทึก', language:'ภาษา', reset:'รีเซตทั้งหมด',
    resetTitle:'รีเซตทั้งหมด?',
    resetMsg:'การบันทึกและการตั้งค่าทั้งหมดจะหาย ยกเว้นแพ็กเกจที่ซื้อแล้ว',
    cancel:'ยกเลิก', confirmReset:'รีเซต',
    playback:'เล่นย้อนหลัง', save:'💾 บันทึกเสียง',
    orient17:'🔄 โหมด 17 ลิ้น ใช้แนวนอนเท่านั้น',
    noRec:'ยังไม่มีการบันทึก',
    recStart:'⏺ เริ่มบันทึกแล้ว',
    recStop:'บันทึกเสร็จแล้ว',
    recFull:'คลิปเต็มแล้ว คลิปเก่าสุดถูกลบ',
    clip:'คลิป', exporting:'กำลังสร้างไฟล์...',
    quickTheme:'🎨 ธีม',
  },
  en: {
    settings:'Settings', volume:'Volume', eq:'Sound Effect',
    mode:'Tine Mode', tines:'Tines', theme:'Theme', instrument:'Instrument',
    recordings:'Recordings', language:'Language', reset:'Reset All',
    resetTitle:'Reset Everything?',
    resetMsg:'All recordings and settings will be lost. Purchased packages are kept.',
    cancel:'Cancel', confirmReset:'Reset',
    playback:'Playback', save:'💾 Save Audio',
    orient17:'🔄 17-Tine mode: landscape only',
    noRec:'No recordings yet',
    recStart:'⏺ Recording started',
    recStop:'Recording saved',
    recFull:'Clips full – oldest removed',
    clip:'Clip', exporting:'Creating file...',
    quickTheme:'🎨 Theme',
  }
};

// ═══════════════════════════════════════
//  STATE
// ═══════════════════════════════════════
const DEFAULT_STATE = {
  lang:'en', theme:'TOY', instrument:'KALIMBA', mode:13, volume:80,
  eqKalimba:'DRY', eqDrum:'DRY', recordings:[]
};
let state = { ...DEFAULT_STATE };

// ═══════════════════════════════════════
//  AUDIO
// ═══════════════════════════════════════
let audioCtx, drumGain, kalimbaGain, drumLimiter, kalimbaLimiter, audioBuffers = {};
let _drumEQNodes = [], _kalimbaEQNodes = [];
const activeDrumSrc = {};
const drumVoiceQueue = [];
const MAX_DRUM_VOICES = 2;
const activeKalimbaSrc = {};
let currentReplaySources = [];

function trimSilence(buffer, maxSec = 1.5) {
  const newLen = Math.min(buffer.length, Math.floor(buffer.sampleRate * maxSec));
  if (newLen >= buffer.length) return buffer;

  const out = audioCtx.createBuffer(buffer.numberOfChannels, newLen, buffer.sampleRate);
  for (let ch = 0; ch < buffer.numberOfChannels; ch++) {
    const dst = out.getChannelData(ch);
    dst.set(buffer.getChannelData(ch).subarray(0, newLen));
    // fade out ท้าย 512 samples กันกระตุก
    const fade = Math.min(512, newLen);
    for (let i = 0; i < fade; i++) dst[newLen - fade + i] *= (fade - i) / fade;
  }
  return out;
}


function normalizeBuffer(buffer, target = 0.85) {
  let peak = 0;
  for (let ch = 0; ch < buffer.numberOfChannels; ch++) {
    const data = buffer.getChannelData(ch);
    for (let i = 0; i < data.length; i++) {
      const abs = Math.abs(data[i]);
      if (abs > peak) peak = abs;
    }
  }
  if (peak === 0) return buffer;
  if (Math.abs(peak - target) < 0.02) return buffer;
  const scale = target / peak;
  for (let ch = 0; ch < buffer.numberOfChannels; ch++) {
    const data = buffer.getChannelData(ch);
    for (let i = 0; i < data.length; i++) data[i] *= scale;
  }
  return buffer;
}


async function preloadAudio(onProgress) {
  audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  const mkChain = (attack = 0.001, ratio = 20, knee = 1, threshold = 0) => {
    const gain = audioCtx.createGain();
    gain.gain.value = state.volume / 100;
    const lim = audioCtx.createDynamicsCompressor();
    lim.threshold.value = threshold; lim.knee.value = knee; lim.ratio.value = ratio;
    lim.attack.value = attack; lim.release.value = 0.1;
    lim.connect(audioCtx.destination);
    return { gain, lim };
  };
  ({ gain: kalimbaGain, lim: kalimbaLimiter } = mkChain());
  ({ gain: drumGain,    lim: drumLimiter    } = mkChain(0.0001, 20, 0, -3));

  const allToLoad = [
    ...ALL_NOTES.map(n => ({ key: n, path: `${AUDIO_PATH}${n}.wav` })),
    ...DRUM_NOTES.map(n => ({ key: `drum_${n}`, path: `${DRUM_AUDIO_PATH}${n}.wav` })),
  ];
  let done = 0;
  await Promise.all(allToLoad.map(async ({ key, path }) => {
    try {
      const res = await fetch(path);
      const buf = await res.arrayBuffer();
      const isDrumKey = key.startsWith('drum_');
      const decoded = await audioCtx.decodeAudioData(buf);
      normalizeBuffer(decoded, isDrumKey ? 0.45 : 1.0);
      audioBuffers[key] = trimSilence(decoded, isDrumKey ? 1.2 : 1.5);
    } catch(e) { /* skip failed */ }
    done++;
    onProgress(Math.round(done / allToLoad.length * 100));
  }));
}

function resumeCtx() {
  if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume();
}

function currentEQ() {
  return state.instrument === 'DRUM' ? state.eqDrum : state.eqKalimba;
}

function buildSharedEQ() {
  if (!audioCtx || !kalimbaGain || !drumGain) return;

  const mkf = (type, freq, Q, gain) => {
    const f = audioCtx.createBiquadFilter();
    f.type = type; f.frequency.value = freq;
    if (Q    !== undefined) f.Q.value    = Q;
    if (gain !== undefined) f.gain.value = gain;
    return f;
  };

  const buildChain = (srcGain, eqNodes, eq, isD, limiter) => {
    srcGain.disconnect();
    eqNodes.forEach(n => { try { n.disconnect(); } catch(_) {} });
    eqNodes.length = 0;
    let prev = srcGain;
    const chain = (nodes) => nodes.forEach(n => { prev.connect(n); eqNodes.push(n); prev = n; });
    if      (eq === 'WARM')     chain([mkf('lowpass',  isD?1200:1000, 0.6),     mkf('lowshelf',  isD?200:480,   undefined, 3)]);
    else if (eq === 'BRIGHT')   chain([mkf('highpass', isD?200:120,   0.5),     mkf('highshelf', isD?1400:2400, undefined, 6)]);
    else if (eq === 'DEEP')     chain([mkf('lowshelf', isD?220:500,   undefined, 5), mkf('highshelf', isD?900:2800, undefined, -5)]);
    else if (eq === 'PRESENCE') chain([mkf('peaking',  isD?450:1000,  1.0, 5),  mkf('peaking',   isD?1800:4500, 2.0, 4)]);
    if (!isD || eq !== 'DRY') {
      const ceil = mkf('lowpass', isD ? 8000 : 6000, isD ? 0.1 : 0.7);
      prev.connect(ceil); eqNodes.push(ceil); prev = ceil;
    }
    prev.connect(limiter);
  };

  buildChain(kalimbaGain, _kalimbaEQNodes, state.eqKalimba, false, kalimbaLimiter);
  buildChain(drumGain,    _drumEQNodes,    state.eqDrum,    true,  drumLimiter);
}

function playNote(noteFile, scheduleAt = 0) {
  if (!audioBuffers[noteFile] || !audioCtx) return null;
  resumeCtx();

  const src = audioCtx.createBufferSource();
  src.buffer = audioBuffers[noteFile];

  const isDrum = noteFile.startsWith('drum_');

  const env = audioCtx.createGain();
  src.connect(env);
  env.connect(isDrum ? drumGain : kalimbaGain);
  const t = scheduleAt > 0 ? scheduleAt : audioCtx.currentTime;
  const hold = isDrum ? 0.9 : 1.0;
  const fade = isDrum ? 1.15 : 1.5;
  const attack = isDrum ? 0.0005 : 0.01;
  env.gain.setValueAtTime(0, t);
  env.gain.linearRampToValueAtTime(1, t + attack);
  env.gain.setValueAtTime(1, t + hold);
  env.gain.linearRampToValueAtTime(0, t + fade);

  src.addEventListener('ended', () => { env.disconnect(); });

  if (state.isRecording && scheduleAt === 0) {
    state.recordedNotes.push({ file: noteFile, time: audioCtx.currentTime - state.recordStart });
  }

  src.start(t);
  return { src, env };
}

function fadeStop(srcObj, fadeTime = 0.01) {
  if (!srcObj) return;
  const { src, env } = srcObj;
  try {
    const t = audioCtx ? audioCtx.currentTime : 0;
    if (env && audioCtx) {
      const g = env.gain.value;
      env.gain.cancelScheduledValues(t);
      env.gain.setValueAtTime(g, t);
      env.gain.linearRampToValueAtTime(0, t + fadeTime);
    }
    try { src.stop(t + fadeTime + 0.001); } catch(_) {}
  } catch(_) { try { src.stop(); } catch(__) {} }
}

function killDrumVoice(srcObj) {
  if (!srcObj) return;
  const { src, env } = srcObj;
  try { if (env) env.gain.value = 0; } catch(_) {}
  try { if (src) src.stop(); } catch(_) {}
}

// ═══════════════════════════════════════
//  RECORDING
// ═══════════════════════════════════════
let recTimerInterval = null;

function startRecording() {
  resumeCtx();
  state.isRecording       = true;
  state.recordStart       = audioCtx.currentTime;
  state.recordedNotes     = [];
  state.recordInstrument  = state.instrument;

  const isDrum = state.instrument === 'DRUM';
  const btn     = document.getElementById(isDrum ? 'btn-record-drum' : 'btn-record');
  const timerEl = isDrum ? btn.querySelector('.rec-timer') : document.getElementById('rec-timer');
  btn.classList.add('recording');
  timerEl.classList.remove('hidden');

  let elapsed = 0;
  recTimerInterval = setInterval(() => {
    elapsed++;
    const m = Math.floor(elapsed / 60);
    const s = elapsed % 60;
    timerEl.textContent = `${m}:${s.toString().padStart(2,'0')}`;
    if (elapsed >= 300) stopRecording();  // 5 min limit
  }, 1000);

  showToast(t('recStart'));
}

function stopRecording() {
  if (!state.isRecording) return;
  state.isRecording = false;
  clearInterval(recTimerInterval);

  const isDrum  = state.recordInstrument === 'DRUM';
  const btn     = document.getElementById(isDrum ? 'btn-record-drum' : 'btn-record');
  const timerEl = isDrum ? btn.querySelector('.rec-timer') : document.getElementById('rec-timer');
  btn.classList.remove('recording');
  timerEl.classList.add('hidden');

  if (state.recordedNotes.length === 0) return;

  const duration = audioCtx.currentTime - state.recordStart;
  const rec = {
    id: Date.now(),
    instrument: state.recordInstrument,
    mode: state.mode,
    notes: [...state.recordedNotes],
    duration,
    date: new Date().toLocaleDateString(state.lang === 'th' ? 'th-TH' : 'en-US')
  };

  let msg = t('recStop');
  if (state.recordings.length >= 5) {
    state.recordings.pop();
    msg = t('recFull');
  }
  state.recordings.unshift(rec);

  saveState();
  renderRecordings();
  showToast(msg);
}

// ── Export to WAV ──
let currentExportRec = null;

async function exportAudio() {
  if (!currentExportRec) return;
  const rec = currentExportRec;
  showToast(t('exporting'));

  try {
    const duration = rec.duration + 3;
    const sr = audioCtx ? audioCtx.sampleRate : 44100;
    const offCtx = new OfflineAudioContext(2, Math.ceil(sr * duration), sr);

    rec.notes.forEach(n => {
      if (!audioBuffers[n.file]) return;
      const src = offCtx.createBufferSource();
      src.buffer = audioBuffers[n.file];
      const g = offCtx.createGain();
      g.gain.value = state.volume / 100;
      src.connect(g); g.connect(offCtx.destination);
      src.start(Math.min(n.time, duration - 0.1));
    });

    const rendered = await offCtx.startRendering();

    // Interleave stereo
    const L = rendered.getChannelData(0);
    const R = rendered.numberOfChannels > 1 ? rendered.getChannelData(1) : L;
    const interleaved = new Float32Array(L.length * 2);
    for (let i = 0; i < L.length; i++) {
      interleaved[i*2]   = L[i];
      interleaved[i*2+1] = R[i];
    }

    const wavBuf = encodeWAV(interleaved, sr, 2);
    const blob = new Blob([wavBuf], { type: 'audio/wav' });
    const filename = `kalimba_${rec.id}.wav`;
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    if (isIOS && navigator.canShare && navigator.canShare({ files: [new File([blob], filename, { type: 'audio/wav' })] })) {
      await navigator.share({ files: [new File([blob], filename, { type: 'audio/wav' })], title: filename });
    } else {
      const url = URL.createObjectURL(blob);
      const a   = document.createElement('a');
      a.href = url; a.download = filename;
      document.body.appendChild(a); a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  } catch(e) {
    console.error(e);
  }
}

function encodeWAV(samples, sr, ch) {
  const dataLen = samples.length * 2;
  const buf = new ArrayBuffer(44 + dataLen);
  const v = new DataView(buf);
  const ws = (o, s) => { for(let i=0;i<s.length;i++) v.setUint8(o+i, s.charCodeAt(i)); };
  ws(0,'RIFF'); v.setUint32(4, 36+dataLen, true); ws(8,'WAVE');
  ws(12,'fmt '); v.setUint32(16,16,true); v.setUint16(20,1,true);
  v.setUint16(22,ch,true); v.setUint32(24,sr,true);
  v.setUint32(28,sr*ch*2,true); v.setUint16(32,ch*2,true); v.setUint16(34,16,true);
  ws(36,'data'); v.setUint32(40,dataLen,true);
  let off = 44;
  for(let i=0;i<samples.length;i++) {
    const s = Math.max(-1,Math.min(1,samples[i]));
    v.setInt16(off, s<0 ? s*32768 : s*32767, true); off+=2;
  }
  return buf;
}

// ═══════════════════════════════════════
//  TINE RENDERING
// ═══════════════════════════════════════
function adjustTineHeights() {
  // Canvas ตายตัว 820×420 — ใช้ CSS calc(var(--hr) * 310px) แทนแล้ว
}

function renderTines(containerId = 'tines-container', interactive = true) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = '';

  const layout = LAYOUTS[state.mode];
  const center = Math.floor(layout.length / 2);
  const maxDist = center;

  const BOARD_W = 820;
  const n = layout.length;
  const EXTRA_PAD = n === 9 ? 60 : 0; // เพิ่มขอบซ้ายขวาสำหรับ 9-ลิ้น
  const SIDE_PAD = (8 + 4) * 2 + EXTRA_PAD * 2;
  const MAX_TINE_W = 68;
  const TARGET_GAP = n === 9 ? 8 : 4;
  let tineW = Math.floor((BOARD_W - SIDE_PAD - TARGET_GAP * (n - 1)) / n);
  tineW = Math.min(tineW, MAX_TINE_W);
  const gap = Math.max(TARGET_GAP, Math.floor((BOARD_W - SIDE_PAD - tineW * n) / (n - 1)));
  container.style.paddingLeft  = (4 + EXTRA_PAD) + 'px';
  container.style.paddingRight = (4 + EXTRA_PAD) + 'px';
  document.documentElement.style.setProperty('--tine-width', tineW + 'px');
  document.documentElement.style.setProperty('--tine-gap', gap + 'px');

  const lastSlideNote = new Map();

  layout.forEach((noteFile, i) => {
    const dist = Math.abs(i - center);
    const hr = 1 - (dist / maxDist) * 0.30;

    const tine = document.createElement('div');
    tine.className = 'tine' + (i === center ? ' center-tine' : '');
    tine.dataset.note = noteFile;
    tine.style.setProperty('--hr', hr.toFixed(3));

    // Body ห้อยลง — label อยู่บนตัวลิ้นเลย
    const body = document.createElement('div');
    body.className = 'tine-body note-' + noteFile[0].toUpperCase();
    body.dataset.hr = hr.toFixed(3);

    const label = document.createElement('div');
    label.className = 'tine-label';

    const letterEl = document.createElement('span');
    letterEl.className = 'tine-letter';
    letterEl.textContent = NOTE_LABEL[noteFile[0]];

    const numWrap = document.createElement('div');
    numWrap.className = 'tine-num-wrap';

    const suffix = parseInt(noteFile[1]);
    const dotEl = document.createElement('span');
    if (suffix >= 2) {
      dotEl.className = 'tine-dots';
      dotEl.textContent = suffix === 2 ? '•' : '••';
    } else {
      dotEl.className = 'tine-dots tine-dots-spacer';
      dotEl.textContent = '\u00A0';
    }
    numWrap.appendChild(dotEl);
    const numEl = document.createElement('span');
    numEl.className = 'tine-num';
    numEl.textContent = NOTE_NUM[noteFile[0]];
    numWrap.appendChild(numEl);

    label.appendChild(letterEl);
    label.appendChild(numWrap);
    body.appendChild(label);   // label อยู่ในลิ้น

    tine.appendChild(body);
    container.appendChild(tine);

    if (interactive) {
      tine.dataset.note = noteFile;
      tine.addEventListener('pointerdown', e => {
        e.preventDefault();
        lastSlideNote.set(e.pointerId, noteFile);
        activateTine(tine, noteFile, e.clientX, e.clientY);
      });
      tine.addEventListener('pointerenter', e => {
        if (e.buttons > 0) activateTine(tine, noteFile, e.clientX, e.clientY);
      });
    }
  });

  if (interactive) {
    container.addEventListener('pointermove', e => {
      if (e.pointerType === 'mouse' && e.buttons === 0) return;
      e.preventDefault();
      const el = document.elementFromPoint(e.clientX, e.clientY);
      const tineEl = el?.closest?.('.tine[data-note]');
      if (!tineEl) return;
      const note = tineEl.dataset.note;
      if (note === lastSlideNote.get(e.pointerId)) return;
      lastSlideNote.set(e.pointerId, note);
      activateTine(tineEl, note, e.clientX, e.clientY);
    }, { passive: false });
    container.addEventListener('pointerup',     e => { lastSlideNote.delete(e.pointerId); });
    container.addEventListener('pointercancel', e => { lastSlideNote.delete(e.pointerId); });
  }

  // คำนวณความสูงลิ้นจาก container จริง
  adjustTineHeights(container);
}


function activateTine(tine, note, px, py) {
  if (activeKalimbaSrc[note]) fadeStop(activeKalimbaSrc[note]);
  const kObj = playNote(note);
  activeKalimbaSrc[note] = kObj;
  if (kObj) kObj.src.addEventListener('ended', () => { delete activeKalimbaSrc[note]; });
  tine.classList.add('pressed');
  setTimeout(() => tine.classList.remove('pressed'), 280);

  if (state.theme === 'BLUE') {
    const rect = tine.getBoundingClientRect();
    const cx = (px !== undefined) ? px : rect.left + rect.width / 2;
    const cy = (py !== undefined) ? py : rect.top + rect.height / 2;
    const size = Math.max(rect.width, 40);
    ['' , 'r2'].forEach(cls => {
      const r = document.createElement('div');
      r.className = 'tine-ripple' + (cls ? ' ' + cls : '');
      r.style.cssText = `width:${size}px;height:${size}px;left:${cx - size/2}px;top:${cy - size/2}px;`;
      document.body.appendChild(r);
      setTimeout(() => r.remove(), 950);
    });
  }

  if (state.theme === 'PRISM') {
    const rect = tine.getBoundingClientRect();
    const cx = (px !== undefined) ? px : rect.left + rect.width/2;
    const cy = (py !== undefined) ? py : rect.top  + rect.height/2;
    spawnPrismBurst(cx, cy);
  }

  if (state.theme === 'SAKURA') {
    const rect = tine.getBoundingClientRect();
    const cx = (px !== undefined) ? px : rect.left + rect.width / 2;
    const cy = (py !== undefined) ? py : rect.bottom - 8;
    spawnSakuraBurst(cx, cy);
  }
}

function spawnPrismBurst(cx, cy) {
  if(document.querySelectorAll('.pburst').length > 20) return;
  for(let i=0;i<5;i++){
    const p=document.createElement('div'); p.className='pburst';
    const sz=4+Math.random()*10;
    const hue=((i/10)*360+Math.random()*30)|0;
    const angle=(i/10)*Math.PI*2+Math.random()*0.6;
    const dist=28+Math.random()*55;
    const pbx=(Math.cos(angle)*dist).toFixed(0)+'px';
    const pby=(Math.sin(angle)*dist).toFixed(0)+'px';
    const dur=(0.45+Math.random()*0.45).toFixed(2)+'s';
    p.style.cssText=`width:${sz}px;height:${sz}px;`+
      `background:hsl(${hue},100%,68%);`+
      `box-shadow:0 0 ${sz}px hsl(${hue},100%,65%),0 0 ${sz*2.5}px hsl(${hue},100%,50%);`+
      `left:${cx-sz/2}px;top:${cy-sz/2}px;`+
      `--pb-x:${pbx};--pb-y:${pby};--pb-dur:${dur};`;
    document.body.appendChild(p);
    setTimeout(()=>p.remove(),600);
  }
}

function spawnSakuraBurst(cx, cy) {
  for(let i = 0; i < 7; i++){
    const p = document.createElement('div');
    p.className = 'spburst';
    const w = 5 + Math.random() * 9;
    const h = w * (0.5 + Math.random() * 0.55);
    const [c1,c2] = PETAL_COLORS[Math.floor(Math.random()*PETAL_COLORS.length)];
    const shape = PETAL_SHAPES[Math.floor(Math.random()*PETAL_SHAPES.length)];
    const angle = Math.random() * Math.PI * 2;
    const dist = 25 + Math.random() * 45;
    const pbx = (Math.cos(angle) * dist).toFixed(0) + 'px';
    const pby = (Math.sin(angle) * dist + 18).toFixed(0) + 'px';
    const pbr = (Math.random() * 400 - 200).toFixed(0) + 'deg';
    const dur = (0.55 + Math.random() * 0.5).toFixed(2) + 's';
    p.style.cssText = `width:${w}px;height:${h}px;`+
      `background:linear-gradient(135deg,${c1},${c2});border-radius:${shape};`+
      `left:${cx - w/2}px;top:${cy - h/2}px;`+
      `--pb-x:${pbx};--pb-y:${pby};--pb-r:${pbr};--pb-dur:${dur};`;
    document.body.appendChild(p);
    setTimeout(() => p.remove(), 1100);
  }
}

// ═══════════════════════════════════════
//  PLAYBACK (REPLAY)
// ═══════════════════════════════════════
let replayTimeouts = [];

function renderMiniTines(rec) {
  const container = document.getElementById('pb-tines');
  if (!container) return;
  container.innerHTML = '';

  const layout  = LAYOUTS[rec.mode];
  const center  = Math.floor(layout.length / 2);
  const tineW   = { 9: 24, 13: 16, 17: 11 }[rec.mode] || 14;

  layout.forEach((noteFile, i) => {
    const hr = 1 - (Math.abs(i - center) / center) * 0.30;

    const tine = document.createElement('div');
    tine.className = 'tine' + (i === center ? ' center-tine' : '');
    tine.dataset.note = noteFile;

    const body = document.createElement('div');
    body.className = 'tine-body note-' + noteFile[0].toUpperCase();
    body.style.setProperty('--hr', hr.toFixed(3));
    body.style.setProperty('--tine-width', tineW + 'px');  // scoped ใน element นี้เท่านั้น font/width จะ scale ตาม

    const label = document.createElement('div');
    label.className = 'tine-label';

    const letterEl = document.createElement('span');
    letterEl.className = 'tine-letter';
    letterEl.textContent = NOTE_LABEL[noteFile[0]];

    const numWrap = document.createElement('div');
    numWrap.className = 'tine-num-wrap';

    const suffix = parseInt(noteFile[1]);
    const dotEl  = document.createElement('span');
    if (suffix >= 2) {
      dotEl.className   = 'tine-dots';
      dotEl.textContent = suffix === 2 ? '•' : '••';
    } else {
      dotEl.className   = 'tine-dots tine-dots-spacer';
      dotEl.textContent = '\u00A0';
    }
    numWrap.appendChild(dotEl);
    const numEl = document.createElement('span');
    numEl.className   = 'tine-num';
    numEl.textContent = NOTE_NUM[noteFile[0]];
    numWrap.appendChild(numEl);

    label.appendChild(letterEl);
    label.appendChild(numWrap);
    body.appendChild(label);
    tine.appendChild(body);
    container.appendChild(tine);
  });
}

function renderMiniDrum(container) {
  container.innerHTML = '';
  const W=660, H=330, OX=330, OY=165, RX=322, RY=158;
  const ns = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(ns, 'svg');
  svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
  svg.setAttribute('width', '220'); svg.setAttribute('height', '110');
  svg.style.cssText = 'display:block;margin:auto;';

  const mk = (tag, attrs) => {
    const el = document.createElementNS(ns, tag);
    for (const [k,v] of Object.entries(attrs)) el.setAttribute(k,v);
    return el;
  };
  const P = (deg, s=1) => {
    const r = deg*Math.PI/180;
    return [OX + RX*s*Math.cos(r), OY - RY*s*Math.sin(r)];
  };
  const Pe = (deg, rxi, ryi) => {
    const r = deg*Math.PI/180;
    return [OX + rxi*Math.cos(r), OY - ryi*Math.sin(r)];
  };

  const pal = getDrumPalette();
  svg.appendChild(mk('ellipse', { cx:OX, cy:OY, rx:RX, ry:RY, fill:pal.bodyFill||'#1a1a2e', stroke:pal.metalGrad?pal.metalGrad[1]:(pal.bodyStroke||'#888'), 'stroke-width': pal.borderW||2.5 }));

  const OUTER=0.97, DHO=8, DHI=6, RXI=210, RYI=60, RXC=175, RYC=40;
  const normDH = (refSin, refR, rxi, ryi, angle) => {
    const r=angle*Math.PI/180, s=Math.sin(r), c=Math.cos(r);
    return Math.asin(Math.min(refSin*refR/Math.sqrt(rxi*rxi*s*s+ryi*ryi*c*c),1))*180/Math.PI;
  };
  const sinDHO=Math.sin(DHO*Math.PI/180), sinDHI=Math.sin(DHI*Math.PI/180);
  const RXeff=RX*OUTER, RYeff=RY*OUTER;

  const lc = pal.label || '#fff';
  DRUM_TONGUES.forEach(({ key, num, dot, angle }) => {
    const isMid = angle===90||angle===-90;
    const _sinDHO=isMid?Math.sin(10*Math.PI/180):sinDHO;
    const _sinDHI=isMid?Math.sin(8*Math.PI/180):sinDHI;
    const _RYI=isMid?70:RYI, _RYC=isMid?55:RYC;
    const dho=normDH(_sinDHO,RXeff,RXeff,RYeff,angle);
    const dhi=normDH(_sinDHI,RXI,RXI,_RYI,angle);
    const [ax,ay]=P(angle+dho,OUTER), [bx,by]=P(angle-dho,OUTER);
    const [cx2,cy2]=Pe(angle-dhi,RXI,_RYI), [qx,qy]=Pe(angle,RXC,_RYC), [dx,dy]=Pe(angle+dhi,RXI,_RYI);
    const d=`M${ax.toFixed(1)} ${ay.toFixed(1)} A${RX} ${RY} 0 0 1 ${bx.toFixed(1)} ${by.toFixed(1)} L${cx2.toFixed(1)} ${cy2.toFixed(1)} Q${qx.toFixed(1)} ${qy.toFixed(1)} ${dx.toFixed(1)} ${dy.toFixed(1)} Z`;
    svg.appendChild(mk('path', { d, fill:pal.idle, stroke:pal.tongStroke||'#444', 'stroke-width':1.5, 'data-key':key, 'data-note':'drum_'+key, 'data-idle':pal.idle, 'data-press':pal.press, class:'dtongue-path' }));
    const [oxL,oyL]=P(angle,OUTER), [ixL,iyL]=Pe(angle,RXI,RYI);
    const lx=(oxL+ixL)/2, ly=(oyL+iyL)/2;
    if (dot==='up') { const t=mk('text',{x:lx.toFixed(1),y:(ly-16).toFixed(1),'text-anchor':'middle','dominant-baseline':'middle',fill:lc,'pointer-events':'none','font-size':18,'font-weight':900}); t.textContent='•'; svg.appendChild(t); }
    const nt=mk('text',{x:lx.toFixed(1),y:ly.toFixed(1),'text-anchor':'middle','dominant-baseline':'middle',fill:lc,'pointer-events':'none','font-size':24,'font-weight':700}); nt.textContent=num; svg.appendChild(nt);
    if (dot==='dn') { const t=mk('text',{x:lx.toFixed(1),y:(ly+16).toFixed(1),'text-anchor':'middle','dominant-baseline':'middle',fill:lc,'pointer-events':'none','font-size':18,'font-weight':900}); t.textContent='•'; svg.appendChild(t); }
  });
  // center tongue — c3 (5 + dot below)
  svg.appendChild(mk('ellipse', { cx:OX, cy:OY, rx:72, ry:52, fill:pal.idle, stroke:pal.tongStroke||'#444', 'stroke-width':1.5, 'data-key':'c3', 'data-note':'drum_c3', 'data-idle':pal.idle, 'data-press':pal.press, class:'dtongue-path' }));
  const cn=mk('text',{x:OX,y:OY-3,'text-anchor':'middle','dominant-baseline':'middle',fill:lc,'pointer-events':'none','font-size':24,'font-weight':700}); cn.textContent='5'; svg.appendChild(cn);
  const cd=mk('text',{x:OX,y:OY+14,'text-anchor':'middle','dominant-baseline':'middle',fill:lc,'pointer-events':'none','font-size':18,'font-weight':900}); cd.textContent='•'; svg.appendChild(cd);

  container.appendChild(svg);
}

function openPlayback(rec) {
  currentExportRec = rec;

  const pbTines = document.getElementById('pb-tines');
  if (rec.instrument === 'DRUM') {
    renderMiniDrum(pbTines);
  } else {
    renderMiniTines(rec);
  }

  document.getElementById('pb-play').disabled = false;
  document.getElementById('pb-stop').disabled = true;

  showPanel('play-panel', 'play-overlay');
}

function startReplay() {
  if (!currentExportRec) return;
  resumeCtx();

  const now = audioCtx.currentTime;
  const rec = currentExportRec;

  document.getElementById('pb-play').disabled = true;
  document.getElementById('pb-stop').disabled = false;

  replayTimeouts = [];

  rec.notes.forEach(n => {
    // Audio
    const srcObj = playNote(n.file, now + n.time);
    if (srcObj) currentReplaySources.push(srcObj);

    // Visual
    const tid = setTimeout(() => {
      const tine = document.querySelector(`#pb-tines [data-note="${n.file}"]`);
      if (tine) {
        if (tine.hasAttribute('data-press')) {
          tine.setAttribute('fill', tine.dataset.press);
          setTimeout(() => tine.setAttribute('fill', tine.dataset.idle), 280);
        } else {
          tine.classList.add('pressed');
          setTimeout(() => tine.classList.remove('pressed'), 280);
        }
      }
    }, n.time * 1000);
    replayTimeouts.push(tid);
  });

  // Auto-reset buttons when done
  const endTid = setTimeout(() => {
    document.getElementById('pb-play').disabled = false;
    document.getElementById('pb-stop').disabled = true;
  }, (rec.duration + 0.5) * 1000);
  replayTimeouts.push(endTid);
}

function stopReplay() {
  replayTimeouts.forEach(clearTimeout);
  replayTimeouts = [];
  currentReplaySources.forEach(obj => fadeStop(obj));
  currentReplaySources = [];

  document.getElementById('pb-play').disabled = false;
  document.getElementById('pb-stop').disabled = true;
}

function closePlayback() {
  stopReplay();
  hidePanel('play-panel', 'play-overlay');
}

// ═══════════════════════════════════════
//  UI HELPERS
// ═══════════════════════════════════════
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  const el = document.getElementById(id);
  if (el) { el.style.display = ''; requestAnimationFrame(() => el.classList.add('active')); }
}

function showPanel(panelId, overlayId) {
  const panel = document.getElementById(panelId);
  const overlay = document.getElementById(overlayId);
  if (!panel || !overlay) return;
  panel.classList.remove('hidden');
  overlay.classList.remove('hidden');
  requestAnimationFrame(() => panel.classList.add('visible'));
}

function hidePanel(panelId, overlayId) {
  const panel = document.getElementById(panelId);
  const overlay = document.getElementById(overlayId);
  if (!panel || !overlay) return;
  panel.classList.remove('visible');
  overlay.classList.add('hidden');
  setTimeout(() => panel.classList.add('hidden'), 350);
}

let toastTimer = null;
function showToast(msg) {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.classList.remove('hidden');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.add('hidden'), 2500);
}

function t(key) {
  return (STRINGS[state.lang] || STRINGS.th)[key] || key;
}

// ═══════════════════════════════════════
//  SETTINGS RENDERS
// ═══════════════════════════════════════
function renderEQ() {
  const row = document.getElementById('eqRow');
  if (!row) return;
  row.innerHTML = '';
  EQ_PRESETS.forEach(p => {
    const btn = document.createElement('button');
    btn.className = 'preset-btn' + (currentEQ() === p.id ? ' active' : '');
    btn.textContent = state.lang === 'th' ? p.th : p.en;
    btn.onclick = () => App.setEQ(p.id);
    row.appendChild(btn);
  });
}

function renderThemes() {
  const list = document.getElementById('themeList');
  if (!list) return;
  list.innerHTML = '';
  THEMES.forEach(th => {
    const item = document.createElement('div');
    item.className = 'theme-item' + (state.theme === th.id ? ' active' : '');
    const sub = state.lang === 'th' ? `<div class="theme-name-sub">${th.th}</div>` : '';
    item.innerHTML = `
      <span class="theme-icon">${th.icon}</span>
      <div class="theme-info">
        <div class="theme-name">${th.en}</div>
        ${sub}
      </div>
      ${state.theme === th.id ? '<span class="theme-check">✓</span>' : ''}
    `;
    item.onclick = () => App.setTheme(th.id);
    list.appendChild(item);
  });
}

function renderInstruments() {
  const list = document.getElementById('instrumentList');
  if (!list) return;
  list.innerHTML = '';
  INSTRUMENTS.forEach(inst => {
    const item = document.createElement('div');
    item.className = 'inst-item' + (state.instrument === inst.id ? ' active' : '');
    const name = state.lang === 'th' ? inst.th : inst.en;

    let svgHtml;
    if (inst.id === 'KALIMBA') {
      svgHtml = `<svg width="54" height="34" viewBox="0 0 54 34" fill="currentColor">
        <rect x="0" y="4" width="53" height="3" rx="1.5" opacity="0.45"/>
        <rect x="1"  y="8" width="4" height="18" rx="2" opacity="0.75"/>
        <rect x="7"  y="8" width="4" height="21" rx="2" opacity="0.8"/>
        <rect x="13" y="8" width="4" height="24" rx="2" opacity="0.85"/>
        <rect x="19" y="8" width="4" height="27" rx="2" opacity="0.9"/>
        <rect x="25" y="4" width="4" height="30" rx="2"/>
        <rect x="31" y="8" width="4" height="27" rx="2" opacity="0.9"/>
        <rect x="37" y="8" width="4" height="24" rx="2" opacity="0.85"/>
        <rect x="43" y="8" width="4" height="21" rx="2" opacity="0.8"/>
        <rect x="49" y="8" width="4" height="18" rx="2" opacity="0.75"/>
      </svg>`;
    } else {
      const tongues = [150, 90, 30, -30, -90, -150].map(a => {
        const r = a * Math.PI / 180;
        const ox = (30 + 28 * 0.93 * Math.cos(r)).toFixed(1);
        const oy = (17 - 15 * 0.93 * Math.sin(r)).toFixed(1);
        const ix = (30 + 28 * 0.42 * Math.cos(r)).toFixed(1);
        const iy = (17 - 15 * 0.42 * Math.sin(r)).toFixed(1);
        return `<line x1="${ox}" y1="${oy}" x2="${ix}" y2="${iy}" stroke="currentColor" stroke-width="4.5" stroke-linecap="round" opacity="0.75"/>`;
      }).join('');
      svgHtml = `<svg width="60" height="34" viewBox="0 0 60 34" fill="none">
        <ellipse cx="30" cy="17" rx="28" ry="15" stroke="currentColor" stroke-width="1.5" opacity="0.5"/>
        ${tongues}
        <ellipse cx="30" cy="17" rx="6" ry="4" fill="currentColor" opacity="0.5"/>
      </svg>`;
    }

    item.innerHTML = `<div class="inst-name">${name}</div>${svgHtml}`;
    item.onclick = () => App.setInstrument(inst.id);
    list.appendChild(item);
  });
}

function getDrumPalette() {
  const palettes = {
    TOY: {
      boardBg:    'linear-gradient(180deg, #ffee88 0%, #ffe044 100%)',
      bodyFill:   'rgba(255,215,30,0.08)',
      metalGrad:  ['#c09050', '#0044A0', '#3a2508'],
      borderW:    8,
      idle:       'rgba(255,51,51,0.88)',
      press:      'rgba(255,180,180,0.96)',
      tongStroke: 'rgba(0,85,191,0.30)',
      label:      'rgba(255,255,255,0.92)',
    },
    BLUE: {
      boardBg:    'linear-gradient(180deg, #0a1835 0%, #0c2255 100%)',
      bodyFill:   '#0b1d45',
      metalGrad:  ['#4ab0ff', '#0a2a6e', '#1a6abf'],
      borderW:    6,
      idle:       'rgba(50,140,255,0.82)',
      press:      'rgba(180,225,255,0.96)',
      tongStroke: 'rgba(120,200,255,0.30)',
      label:      'rgba(255,255,255,0.95)',
    },
    GREEN: {
      boardBg:    'linear-gradient(180deg, #030f03 0%, #061a06 100%)',
      bodyFill:   '#051205',
      metalGrad:  ['#8B6E0A', '#4B3608', '#7A5C0A'],
      borderW:    6,
      idle:       'rgba(35,155,55,0.87)',
      press:      'rgba(160,255,160,0.96)',
      tongStroke: 'rgba(80,200,80,0.28)',
      label:      'rgba(255,255,255,0.95)',
    },
    BRICK: {
      boardBg:    `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='40'%3E%3Crect width='80' height='40' fill='%23703018'/%3E%3Crect x='2' y='2' width='36' height='16' rx='1' fill='%23e07850'/%3E%3Crect x='42' y='2' width='36' height='16' rx='1' fill='%23cc6038'/%3E%3Crect x='0' y='22' width='18' height='16' fill='%23d86840'/%3E%3Crect x='22' y='22' width='36' height='16' rx='1' fill='%23e07850'/%3E%3Crect x='62' y='22' width='18' height='16' fill='%23cc6038'/%3E%3C/svg%3E") 0 0 / 80px 40px repeat #8c3518`,
      bodyFill:   '#7a3018',
      metalGrad:  ['#a06030', '#5c2e10', '#8a4820'],
      borderW:    7,
      idle:       'rgba(210,110,45,0.88)',
      press:      'rgba(255,185,90,0.96)',
      tongStroke: 'rgba(255,150,60,0.25)',
      label:      'rgba(255,220,160,0.95)',
    },
    NEON: {
      boardBg:    '#000000',
      bodyFill:   '#000008',
      metalGrad:  ['#00ffff', '#001828', '#ff00ff'],
      borderW:    5,
      idle:       'rgba(0,200,255,0.85)',
      press:      'rgba(255,0,255,0.96)',
      tongStroke: 'rgba(0,255,255,0.35)',
      label:      'rgba(0,230,255,0.95)',
    },
    LAVA: {
      boardBg:    'linear-gradient(180deg, #0a0000 0%, #1a0400 100%)',
      bodyFill:   '#150300',
      metalGrad:  ['#ff6000', '#2a0800', '#cc2200'],
      borderW:    6,
      idle:       'rgba(220,80,20,0.88)',
      press:      'rgba(255,220,60,0.96)',
      tongStroke: 'rgba(255,100,0,0.30)',
      label:      'rgba(255,220,120,0.95)',
    },
    RAINBOW: {
      boardBg:    'linear-gradient(180deg, #f0eefa 0%, #faf8ff 100%)',
      bodyFill:   '#f2eef8',
      metalGrad:  ['#c8a8e8', '#a080c0', '#d0b0f0'],
      borderW:    5,
      idle:       'rgba(160,120,220,0.82)',
      press:      'rgba(220,180,255,0.97)',
      tongStroke: 'rgba(120,80,180,0.25)',
      label:      'rgba(40,20,60,0.88)',
    },
    GLOW: {
      boardBg:    'linear-gradient(180deg, #101840 0%, #0a0a28 60%, #05050f 100%)',
      bodyFill:   '#0b1228',
      metalGrad:  ['#80ffcc', '#0a1a20', '#00c890'],
      borderW:    5,
      idle:       'rgba(80,220,170,0.85)',
      press:      'rgba(200,255,240,0.96)',
      tongStroke: 'rgba(80,255,180,0.30)',
      label:      'rgba(160,255,220,0.95)',
    },
    PRISM: {
      boardBg:    'radial-gradient(ellipse at 20% 30%, #12063a 0%, #08041c 45%, #050214 100%)',
      bodyFill:   '#08041c',
      metalGrad:  ['#ff60ff', '#2a0060', '#00ffcc'],
      borderW:    5,
      idle:       'rgba(180,100,255,0.85)',
      press:      'rgba(255,200,255,0.97)',
      tongStroke: 'rgba(200,100,255,0.30)',
      label:      'rgba(240,200,255,0.95)',
    },
    SAKURA: {
      boardBg:    'linear-gradient(160deg, #fff0f5 0%, #fde8f0 50%, #fdf0f8 100%)',
      bodyFill:   '#fce8f0',
      metalGrad:  ['#ffb8d4', '#e890b0', '#ffd0e8'],
      borderW:    5,
      idle:       'rgba(220,100,140,0.82)',
      press:      'rgba(255,200,220,0.97)',
      tongStroke: 'rgba(255,140,180,0.28)',
      label:      'rgba(100,20,50,0.90)',
    },
  };
  return palettes[state.theme] || {
    bodyFill:   'rgba(18,22,45,0.82)',
    bodyStroke: 'rgba(160,160,180,0.40)',
    borderW:    2.5,
    idle:       'rgba(190,195,210,0.60)',
    press:      'rgba(230,235,255,0.92)',
    tongStroke: 'rgba(255,255,255,0.18)',
    label:      'rgba(15,15,25,0.85)',
  };
}

function spawnDrumRipple(cx, cy) {
  [false, true].forEach(isR2 => {
    const r = document.createElement('div');
    r.className = 'tine-ripple' + (isR2 ? ' r2' : '');
    r.style.cssText = `width:48px;height:48px;left:${cx - 24}px;top:${cy - 24}px;`;
    document.body.appendChild(r);
    setTimeout(() => r.remove(), 950);
  });
}

function renderDrum() {
  const body = document.getElementById('drum-body');
  if (!body) return;
  body.innerHTML = '';

  const drumEl = document.getElementById('drum-board');

  const W = 660, H = 330, OX = 330, OY = 165, RX = 322, RY = 158;
  const ns = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(ns, 'svg');
  svg.setAttribute('width', W); svg.setAttribute('height', H);
  svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
  svg.style.cssText = 'display:block;touch-action:none;user-select:none;';

  const mk = (tag, attrs) => {
    const el = document.createElementNS(ns, tag);
    for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
    return el;
  };
  // angle: math convention (0=right, 90=screen-top); returns [x,y]
  const P = (deg, s = 1) => {
    const r = deg * Math.PI / 180;
    return [OX + RX * s * Math.cos(r), OY - RY * s * Math.sin(r)];
  };

  const pal = getDrumPalette();
  if (drumEl) drumEl.style.background = pal.boardBg || '#1a1a2e';
  const { bodyFill, idle: IDLE, press: PRESS, tongStroke, label: LABEL } = pal;
  const borderW = pal.borderW || 2.5;
  const isRainbow = state.theme === 'RAINBOW';
  const DRC = {
    c3:{i:'rgba(208,120,120,0.9)',p:'rgba(255,200,200,0.97)'},
    c4:{i:'rgba(208,120,120,0.9)',p:'rgba(255,200,200,0.97)'},
    d3:{i:'rgba(210,148,80,0.9)', p:'rgba(255,210,155,0.97)'},
    d4:{i:'rgba(210,148,80,0.9)', p:'rgba(255,210,155,0.97)'},
    e3:{i:'rgba(196,176,48,0.9)', p:'rgba(255,245,140,0.97)'},
    e4:{i:'rgba(196,176,48,0.9)', p:'rgba(255,245,140,0.97)'},
    f3:{i:'rgba(88,164,108,0.9)', p:'rgba(180,240,200,0.97)'},
    f4:{i:'rgba(88,164,108,0.9)', p:'rgba(180,240,200,0.97)'},
    g3:{i:'rgba(80,128,196,0.9)', p:'rgba(180,215,255,0.97)'},
    a3:{i:'rgba(136,92,196,0.9)', p:'rgba(215,175,255,0.97)'},
    bb3:{i:'rgba(196,88,158,0.9)',p:'rgba(255,175,220,0.97)'},
  };
  const RL = 'rgba(40,20,60,0.88)';

  let bodyStroke = pal.bodyStroke || 'rgba(160,160,180,0.40)';
  if (pal.metalGrad) {
    const gradId = 'drumMetalGrad';
    const defs = mk('defs', {});
    const grad = mk('linearGradient', { id: gradId, x1:'0', y1:'0', x2:'0', y2:'1' });
    ['0%','55%','100%'].forEach((offset, i) => {
      grad.appendChild(mk('stop', { offset, 'stop-color': pal.metalGrad[i] }));
    });
    defs.appendChild(grad);
    svg.appendChild(defs);
    bodyStroke = `url(#${gradId})`;
  }

  // Drum body
  svg.appendChild(mk('ellipse', {
    cx: OX, cy: OY, rx: RX, ry: RY,
    fill: bodyFill,
    stroke: bodyStroke, 'stroke-width': borderW
  }));

  const OUTER = 0.97, DHO = 8, DHI = 6;
  // inner tip oval — wider x than y so side tongues don't lean too far toward center
  const RXI = 210, RYI = 60;
  const RXC = 175, RYC = 40;
  // point on a custom ellipse (not necessarily the outer oval)
  const Pe = (deg, rxi, ryi) => {
    const r = deg * Math.PI / 180;
    return [OX + rxi * Math.cos(r), OY - ryi * Math.sin(r)];
  };

  // chord-width normalizer: compute angular half-width so every tongue has same pixel chord
  const RXeff = RX * OUTER, RYeff = RY * OUTER;
  const normDH = (refSin, refR, rxi, ryi, angle) => {
    const r = angle * Math.PI / 180, s = Math.sin(r), c = Math.cos(r);
    const f = Math.sqrt(rxi*rxi*s*s + ryi*ryi*c*c);
    return Math.asin(Math.min(refSin * refR / f, 1)) * 180 / Math.PI;
  };
  const sinDHO = Math.sin(DHO * Math.PI / 180); // reference at 90°: factor = RXeff
  const sinDHI = Math.sin(DHI * Math.PI / 180); // reference at 90°: factor = RXI

  DRUM_TONGUES.forEach(({ key, num, dot, angle }) => {
    const isMid = angle === 90 || angle === -90;
    const _sinDHO = isMid ? Math.sin(10 * Math.PI / 180) : sinDHO;
    const _sinDHI = isMid ? Math.sin(8  * Math.PI / 180) : sinDHI;
    const _RYI    = isMid ? 70 : RYI;
    const _RYC    = isMid ? 55 : RYC;
    const dho = normDH(_sinDHO, RXeff, RXeff, RYeff, angle);
    const dhi = normDH(_sinDHI, RXI,  RXI,  _RYI,  angle);
    const [ax, ay] = P(angle + dho, OUTER);
    const [bx, by] = P(angle - dho, OUTER);
    const [cx, cy] = Pe(angle - dhi, RXI, _RYI);
    const [qx, qy] = Pe(angle, RXC, _RYC);
    const [dx, dy] = Pe(angle + dhi, RXI, _RYI);
    // outer arc always CW (sweep=1) = decreasing angle = bows away from center
    const d = `M${ax.toFixed(1)} ${ay.toFixed(1)} A${RX} ${RY} 0 0 1 ${bx.toFixed(1)} ${by.toFixed(1)} L${cx.toFixed(1)} ${cy.toFixed(1)} Q${qx.toFixed(1)} ${qy.toFixed(1)} ${dx.toFixed(1)} ${dy.toFixed(1)} Z`;

    const tI = isRainbow ? (DRC[key]?.i || IDLE) : IDLE;
    const tP = isRainbow ? (DRC[key]?.p || PRESS) : PRESS;
    const tL = isRainbow ? RL : LABEL;
    const path = mk('path', { d, fill: tI, stroke: tongStroke, 'stroke-width': 1.5, 'data-key': key, class: 'dtongue-path' });
    path.style.cursor = 'pointer';
    path.addEventListener('pointerdown', e => {
      e.preventDefault(); path.setAttribute('fill', tP);
      resumeCtx();
      drumVoiceQueue.forEach(v => killDrumVoice(v));
      drumVoiceQueue.length = 0;
      Object.keys(activeDrumSrc).forEach(k => delete activeDrumSrc[k]);
      const dObj = playNote('drum_' + key, 0);
      activeDrumSrc[key] = dObj;
      if (dObj) {
        drumVoiceQueue.push(dObj);
        dObj.src.addEventListener('ended', () => {
          const i = drumVoiceQueue.indexOf(dObj); if (i >= 0) drumVoiceQueue.splice(i, 1);
          if (activeDrumSrc[key] === dObj) delete activeDrumSrc[key];
        });
      }
      if (state.theme === 'BLUE') spawnDrumRipple(e.clientX, e.clientY);
      if (state.theme === 'SAKURA') spawnSakuraBurst(e.clientX, e.clientY);
      if (state.theme === 'PRISM') spawnPrismBurst(e.clientX, e.clientY);
    });
    const rel = () => path.setAttribute('fill', tI);
    path.addEventListener('pointerup', rel);
    path.addEventListener('pointerleave', rel);
    svg.appendChild(path);

    const [oxL, oyL] = P(angle, OUTER);
    const [ixL, iyL] = Pe(angle, RXI, RYI);
    const [lx, ly] = [(oxL + ixL) / 2, (oyL + iyL) / 2];
    if (dot === 'up') {
      const t = mk('text', { x: lx.toFixed(1), y: (ly-16).toFixed(1), 'text-anchor':'middle', 'dominant-baseline':'middle', fill:tL, 'pointer-events':'none', 'font-size':18, 'font-weight':900 });
      t.textContent = '•'; svg.appendChild(t);
    }
    const nt = mk('text', { x: lx.toFixed(1), y: ly.toFixed(1), 'text-anchor':'middle', 'dominant-baseline':'middle', fill:tL, 'pointer-events':'none', 'font-size':24, 'font-weight':700 });
    nt.textContent = num; svg.appendChild(nt);
    if (dot === 'dn') {
      const t = mk('text', { x: lx.toFixed(1), y: (ly+16).toFixed(1), 'text-anchor':'middle', 'dominant-baseline':'middle', fill:tL, 'pointer-events':'none', 'font-size':18, 'font-weight':900 });
      t.textContent = '•'; svg.appendChild(t);
    }
  });

  // Center oval — C3 (5̣)
  const ceI = isRainbow ? DRC.c3.i : IDLE;
  const ceP = isRainbow ? DRC.c3.p : PRESS;
  const ceL = isRainbow ? RL : LABEL;
  const ce = mk('ellipse', { cx: OX, cy: OY, rx: 72, ry: 52, fill: ceI, stroke: tongStroke, 'stroke-width': 1.5, 'data-key': 'c3', class: 'dtongue-path' });
  ce.style.cursor = 'pointer';
  ce.addEventListener('pointerdown', e => {
    e.preventDefault(); ce.setAttribute('fill', ceP);
    resumeCtx();
    drumVoiceQueue.forEach(v => killDrumVoice(v));
    drumVoiceQueue.length = 0;
    Object.keys(activeDrumSrc).forEach(k => delete activeDrumSrc[k]);
    const c3Obj = playNote('drum_c3', 0);
    activeDrumSrc['c3'] = c3Obj;
    if (c3Obj) {
      drumVoiceQueue.push(c3Obj);
      c3Obj.src.addEventListener('ended', () => {
        const i = drumVoiceQueue.indexOf(c3Obj); if (i >= 0) drumVoiceQueue.splice(i, 1);
        if (activeDrumSrc['c3'] === c3Obj) delete activeDrumSrc['c3'];
      });
    }
    if (state.theme === 'BLUE') spawnDrumRipple(e.clientX, e.clientY);
    if (state.theme === 'SAKURA') spawnSakuraBurst(e.clientX, e.clientY);
    if (state.theme === 'PRISM') spawnPrismBurst(e.clientX, e.clientY);
  });
  const relC = () => ce.setAttribute('fill', ceI);
  ce.addEventListener('pointerup', relC); ce.addEventListener('pointerleave', relC);
  svg.appendChild(ce);
  const cn = mk('text', { x: OX, y: OY-3, 'text-anchor':'middle', 'dominant-baseline':'middle', fill:ceL, 'pointer-events':'none', 'font-size':26, 'font-weight':700 });
  cn.textContent = '5'; svg.appendChild(cn);
  const cd = mk('text', { x: OX, y: OY+16, 'text-anchor':'middle', 'dominant-baseline':'middle', fill:ceL, 'pointer-events':'none', 'font-size':18, 'font-weight':900 });
  cd.textContent = '•'; svg.appendChild(cd);

  body.appendChild(svg);
}
function renderRecordings() {
  const list = document.getElementById('recordingsList');
  if (!list) return;
  if (state.recordings.length === 0) {
    list.innerHTML = `<div class="rec-empty">${t('noRec')}</div>`;
    return;
  }
  list.innerHTML = '';
  state.recordings.forEach((rec, i) => {
    const m = Math.floor(rec.duration / 60);
    const s = Math.floor(rec.duration % 60);
    const durStr = `${m}:${s.toString().padStart(2,'0')}`;

    const item = document.createElement('div');
    item.className = 'rec-item';
    item.innerHTML = `
      <div class="rec-info">
        <div class="rec-title">${rec.instrument === 'DRUM' ? '🥁' : '🎵'} ${t('clip')} ${i + 1}${rec.instrument !== 'DRUM' ? ' · ' + rec.mode + ' ' + t('tines') : ''}</div>
        <div class="rec-meta">${durStr} · ${rec.date}</div>
      </div>
      <div class="rec-btns">
        <button class="rec-action" title="Play">▶</button>
        <button class="rec-action" title="Save">💾</button>
        <button class="rec-action del" title="Delete">🗑</button>
      </div>
    `;
    const btns = item.querySelectorAll('.rec-action');
    btns[0].onclick = () => { App.closeSettings(); openPlayback(rec); };
    btns[1].onclick = () => { currentExportRec = rec; exportAudio(); };
    btns[2].onclick = () => {
      state.recordings.splice(i, 1);
      saveState(); renderRecordings();
    };
    list.appendChild(item);
  });
}

function applyLangText() {
  const ids = [
    'txt-settings','txt-volume','txt-eq','txt-mode','txt-theme','txt-instrument',
    'txt-recordings','txt-language',
    'txt-reset','txt-resetTitle','txt-resetMsg','txt-cancel','txt-confirmReset',
    'txt-playback','txt-save','txt-orient17'
  ];
  const keys = [
    'settings','volume','eq','mode','theme','instrument',
    'recordings','language',
    'reset','resetTitle','resetMsg','cancel','confirmReset',
    'playback','save','orient17'
  ];
  ids.forEach((id, i) => {
    const el = document.getElementById(id);
    if (el) el.textContent = t(keys[i]);
  });
  updateQuickThemeBtn();

  // tines label on mode buttons
  document.querySelectorAll('.mode-sub').forEach(el => { el.textContent = t('tines'); });
  document.querySelectorAll('.mode-btn').forEach(btn => {
    btn.classList.toggle('active', Number(btn.dataset.mode) === state.mode);
  });

  // lang mini buttons
  document.querySelectorAll('.lang-mini').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === state.lang);
  });

  renderInstruments();
}

// ═══════════════════════════════════════
//  ANIMATED THEME ENGINES
// ═══════════════════════════════════════

// ── BLUE: Water Drops ──
function getDC(){return state.instrument==='DRUM'?document.getElementById('drop-canvas'):document.getElementById('drop-canvas-klmb');}
const WD = { MIN_R:8, MAX_R:68, SPLIT_R:62, SPEED:0.6, MIN_SPD:0.2, COUNT:14 };
let wDrops = [], wRAF = null;
function getWaterBounds(){return{x0:0,y0:0,x1:820,y1:420};}
function wMake(x,y,r){const a=Math.random()*Math.PI*2,spd=(Math.random()*.7+.5)*WD.SPEED;const el=document.createElement('div');el.className='wdrop';getDC().appendChild(el);return{x,y,r,vx:Math.cos(a)*spd,vy:Math.sin(a)*spd,el,alive:true,sc:0,cd:0};}
function wRender(d){const s=d.r*2;d.el.style.cssText=`left:${d.x-d.r}px;top:${d.y-d.r}px;width:${s}px;height:${s}px;opacity:${(0.22+Math.min(d.r/WD.MAX_R,1)*.55).toFixed(2)};`;}
function wMerge(a,b){const nr=Math.min(Math.sqrt(a.r*a.r+b.r*b.r),WD.MAX_R);const tm=a.r*a.r+b.r*b.r;const nx=(a.x*a.r*a.r+b.x*b.r*b.r)/tm,ny=(a.y*a.r*a.r+b.y*b.r*b.r)/tm;const big=a.r>=b.r?a:b;a.alive=false;b.alive=false;a.el.classList.add('wsplit');b.el.classList.add('wsplit');setTimeout(()=>{a.el.remove();b.el.remove();},260);const nd=wMake(nx,ny,nr);nd.vx=big.vx*.88;nd.vy=big.vy*.88;if(nd.r>=WD.SPLIT_R)nd.sc=160+(Math.random()*100|0);nd.el.classList.add('mpop');setTimeout(()=>nd.el.classList.remove('mpop'),450);wDrops.push(nd);}
function wSplit(d){d.alive=false;d.el.classList.add('wsplit');setTimeout(()=>d.el.remove(),260);const nr=d.r/Math.SQRT2,perp=Math.atan2(d.vy,d.vx)+Math.PI/2;const spd=Math.sqrt(d.vx*d.vx+d.vy*d.vy)*1.1;const b=getWaterBounds();for(let i=0;i<2;i++){const s=i?-1:1,ox=Math.cos(perp)*d.r*.6*s,oy=Math.sin(perp)*d.r*.6*s;const nd=wMake(Math.max(b.x0+nr,Math.min(b.x1-nr,d.x+ox)),Math.max(b.y0+nr,Math.min(b.y1-nr,d.y+oy)),Math.max(WD.MIN_R,nr));nd.vx=Math.cos(perp)*spd*s;nd.vy=Math.sin(perp)*spd*s;wDrops.push(nd);}}
function wTick(){const b=getWaterBounds();const x0=b.x0,y0=b.y0,x1=b.x1,y1=b.y1;wDrops.forEach(d=>{if(!d.alive)return;d.x+=d.vx;d.y+=d.vy;if(d.x-d.r<x0){d.x=x0+d.r;d.vx=Math.abs(d.vx);}if(d.x+d.r>x1){d.x=x1-d.r;d.vx=-Math.abs(d.vx);}if(d.y-d.r<y0){d.y=y0+d.r;d.vy=Math.abs(d.vy);}if(d.y+d.r>y1){d.y=y1-d.r;d.vy=-Math.abs(d.vy);}if(d.cd>0)d.cd--;if(d.sc>0){d.sc--;if(d.sc===0){wSplit(d);return;}}wRender(d);});wDrops=wDrops.filter(d=>d.alive);while(wDrops.length<10){const r=Math.random()*22+WD.MIN_R;wDrops.push(wMake(x0+r+Math.random()*(x1-x0-r*2),y0+r+Math.random()*(y1-y0-r*2),r));}const alive=wDrops.filter(d=>d.alive);for(let i=0;i<alive.length;i++)for(let j=i+1;j<alive.length;j++){const a=alive[i],bj=alive[j];if(!a.alive||!bj.alive||a.cd>0||bj.cd>0)continue;const dx=bj.x-a.x,dy=bj.y-a.y,dist=Math.sqrt(dx*dx+dy*dy);if(dist<a.r+bj.r-3)wMerge(a,bj);}wRAF=requestAnimationFrame(wTick);}
function startWaterDrops(){if(wRAF)return;getDC().innerHTML='';wDrops=[];const b=getWaterBounds();const bW=b.x1-b.x0,bH=b.y1-b.y0;for(let i=0;i<WD.COUNT;i++){const r=Math.random()*28+WD.MIN_R;wDrops.push(wMake(b.x0+r+Math.random()*(bW-r*2),b.y0+r+Math.random()*(bH-r*2),r));}wTick();}
function stopWaterDrops(){if(wRAF){cancelAnimationFrame(wRAF);wRAF=null;}getDC().innerHTML='';wDrops=[];}

// ── GREEN: Leaves + Fireflies ──
const GC = document.getElementById('green-canvas');
const LEAF_COLORS=[['#166534','#15803d'],['#16a34a','#4ade80'],['#4ade80','#86efac'],['#365314','#4d7c0f'],['#a3e635','#84cc16'],['#052e16','#166534']];
let gFlyRAF=null,gFlies=[],gBeams=[],gBeamTimer=null;

function makeBeam(){
  const el=document.createElement('div');
  el.className='sunbeam';
  const w=(50+Math.random()*130).toFixed(0);
  const x=(Math.random()*110-5).toFixed(1);
  const dur=(12+Math.random()*12).toFixed(1);
  const delay=(-Math.random()*18).toFixed(1);
  const op=(0.05+Math.random()*0.08).toFixed(3);
  el.style.cssText=`left:${x}%;width:${w}px;--sb-dur:${dur}s;--sb-delay:${delay}s;--sb-op:${op};`;
  GC.appendChild(el);
  return el;
}

function repositionBeams(){
  gBeams.forEach(b=>{
    if(Math.random()<0.5){
      b.style.left=(Math.random()*110-5).toFixed(1)+'%';
      b.style.width=(50+Math.random()*130).toFixed(0)+'px';
      b.style.setProperty('--sb-op',(0.05+Math.random()*0.08).toFixed(3));
    }
  });
}

function startGreenFx(){
  GC.innerHTML='';gFlies=[];gBeams=[];
  // ใบไม้
  for(let i=0;i<22;i++){const el=document.createElement('div');el.className='gleaf';const w=8+Math.random()*18;const h=w*(1.4+Math.random()*0.6);const[c1,c2]=LEAF_COLORS[Math.floor(Math.random()*LEAF_COLORS.length)];const dur=(7+Math.random()*10).toFixed(1)+'s';const del=(-Math.random()*14).toFixed(1)+'s';const sx=(Math.random()*80-40).toFixed(0)+'px';const ex=(Math.random()*120-60).toFixed(0)+'px';const r1=(Math.random()*200-100).toFixed(0)+'deg';const r2=(Math.random()*360-180).toFixed(0)+'deg';el.style.cssText=`left:${Math.random()*105-3}%;width:${w}px;height:${h}px;background:linear-gradient(135deg,${c1},${c2});--dur:${dur};--delay:${del};--sx:${sx};--ex:${ex};--r1:${r1};--r2:${r2};opacity:0;`;GC.appendChild(el);}
  // หิ่งห้อย
  for(let i=0;i<10;i++){const el=document.createElement('div');el.className='gfly';const sz=4+Math.random()*5;el.style.cssText=`width:${sz}px;height:${sz}px;left:${Math.random()*95}%;top:${Math.random()*90}%;--pd:${(1.5+Math.random()*2.5).toFixed(1)}s;--pdelay:-${(Math.random()*3).toFixed(1)}s;`;GC.appendChild(el);gFlies.push({el,x:parseFloat(el.style.left),y:parseFloat(el.style.top),vx:(Math.random()-.5)*.12,vy:(Math.random()-.5)*.12});}
  // แสงแดด
  for(let i=0;i<7;i++) gBeams.push(makeBeam());
  gBeamTimer=setInterval(repositionBeams, 9000);
  if(!gFlyRAF)gFlyLoop();
}
function gFlyLoop(){gFlies.forEach(f=>{f.x+=f.vx;f.y+=f.vy;f.vx+=(Math.random()-.5)*.02;f.vy+=(Math.random()-.5)*.02;f.vx=Math.max(-0.25,Math.min(0.25,f.vx));f.vy=Math.max(-0.25,Math.min(0.25,f.vy));if(f.x<0)f.x=100;if(f.x>100)f.x=0;if(f.y<0)f.y=100;if(f.y>100)f.y=0;f.el.style.left=f.x+'%';f.el.style.top=f.y+'%';});gFlyRAF=requestAnimationFrame(gFlyLoop);}
function stopGreenFx(){if(gFlyRAF){cancelAnimationFrame(gFlyRAF);gFlyRAF=null;}if(gBeamTimer){clearInterval(gBeamTimer);gBeamTimer=null;}GC.innerHTML='';gFlies=[];gBeams=[];}

// ── GREEN DRUM: Leaves + Fireflies + Sunbeams (scoped inside drum-board) ──
let dgFlyRAF=null,dgFlies=[],dgBeams=[],dgBeamTimer=null;
function makeDrumBeam(){
  const dc=getDC();
  const el=document.createElement('div');el.className='sunbeam';
  const w=(40+Math.random()*100).toFixed(0);
  const x=(Math.random()*110-5).toFixed(1);
  const dur=(10+Math.random()*10).toFixed(1);
  const delay=(-Math.random()*16).toFixed(1);
  const op=(0.06+Math.random()*0.09).toFixed(3);
  el.style.cssText=`left:${x}%;width:${w}px;--sb-dur:${dur}s;--sb-delay:${delay}s;--sb-op:${op};`;
  dc.appendChild(el);return el;
}
function repositionDrumBeams(){
  dgBeams.forEach(b=>{if(Math.random()<0.5){b.style.left=(Math.random()*110-5).toFixed(1)+'%';b.style.width=(40+Math.random()*100).toFixed(0)+'px';b.style.setProperty('--sb-op',(0.06+Math.random()*0.09).toFixed(3));}});
}
function startDrumGreenFx(){
  const dc=getDC();dc.innerHTML='';dgFlies=[];dgBeams=[];
  for(let i=0;i<14;i++){const el=document.createElement('div');el.className='gleaf';const w=6+Math.random()*14;const h=w*(1.4+Math.random()*0.6);const[c1,c2]=LEAF_COLORS[Math.floor(Math.random()*LEAF_COLORS.length)];const dur=(7+Math.random()*10).toFixed(1)+'s';const del=(-Math.random()*12).toFixed(1)+'s';const sx=(Math.random()*60-30).toFixed(0)+'px';const ex=(Math.random()*80-40).toFixed(0)+'px';const r1=(Math.random()*200-100).toFixed(0)+'deg';const r2=(Math.random()*360-180).toFixed(0)+'deg';el.style.cssText=`left:${Math.random()*100}%;width:${w}px;height:${h}px;background:linear-gradient(135deg,${c1},${c2});--dur:${dur};--delay:${del};--sx:${sx};--ex:${ex};--r1:${r1};--r2:${r2};opacity:0;`;dc.appendChild(el);}
  for(let i=0;i<8;i++){const el=document.createElement('div');el.className='gfly';const sz=3+Math.random()*4;const lx=Math.random()*90;const ly=Math.random()*85;el.style.cssText=`width:${sz}px;height:${sz}px;left:${lx}%;top:${ly}%;--pd:${(1.5+Math.random()*2.5).toFixed(1)}s;--pdelay:-${(Math.random()*3).toFixed(1)}s;`;dc.appendChild(el);dgFlies.push({el,x:lx,y:ly,vx:(Math.random()-.5)*.12,vy:(Math.random()-.5)*.12});}
  for(let i=0;i<5;i++)dgBeams.push(makeDrumBeam());
  dgBeamTimer=setInterval(repositionDrumBeams,9000);
  if(!dgFlyRAF)dgFlyLoop2();
}
function dgFlyLoop2(){dgFlies.forEach(f=>{f.x+=f.vx;f.y+=f.vy;f.vx+=(Math.random()-.5)*.02;f.vy+=(Math.random()-.5)*.02;f.vx=Math.max(-0.25,Math.min(0.25,f.vx));f.vy=Math.max(-0.25,Math.min(0.25,f.vy));if(f.x<0)f.x=100;if(f.x>100)f.x=0;if(f.y<0)f.y=100;if(f.y>100)f.y=0;f.el.style.left=f.x+'%';f.el.style.top=f.y+'%';});dgFlyRAF=requestAnimationFrame(dgFlyLoop2);}
function stopDrumGreenFx(){if(dgFlyRAF){cancelAnimationFrame(dgFlyRAF);dgFlyRAF=null;}if(dgBeamTimer){clearInterval(dgBeamTimer);dgBeamTimer=null;}const dc=document.getElementById('drop-canvas');if(dc)dc.innerHTML='';dgFlies=[];dgBeams=[];}

// ── BRICK ──
let brickDataUrl=null;
function generateBrickTile(){const BW=58,BH=22,MOR=5;const TW=(BW+MOR)*2;const TH=(BH+MOR)*2;const c=document.createElement('canvas');c.width=TW;c.height=TH;const ctx=c.getContext('2d');const SHADES=['#8B3A0F','#7A2D0A','#9C4010','#6B2408','#A04318','#853510','#8B3515'];const MORTAR='#B8977A';ctx.fillStyle=MORTAR;ctx.fillRect(0,0,TW,TH);function brick(x,y,w,h){if(w<=0)return;const shade=SHADES[Math.floor(Math.abs(x*3+y*7)%SHADES.length)];ctx.fillStyle=shade;ctx.fillRect(x,y,w,h);const grd=ctx.createLinearGradient(x,y,x,y+h);grd.addColorStop(0,'rgba(255,180,100,0.22)');grd.addColorStop(0.35,'rgba(255,150,80,0.06)');grd.addColorStop(1,'rgba(0,0,0,0.32)');ctx.fillStyle=grd;ctx.fillRect(x,y,w,h);ctx.fillStyle='rgba(255,200,120,0.12)';ctx.fillRect(x,y,2,h);ctx.fillStyle='rgba(0,0,0,0.2)';ctx.fillRect(x+w-2,y,2,h);}const half=Math.floor((BW+MOR)/2);brick(MOR/2,MOR/2,BW,BH);brick(BW+MOR*1.5,MOR/2,BW,BH);brick(MOR/2,BH+MOR*1.5,half-MOR,BH);brick(half+MOR/2,BH+MOR*1.5,BW,BH);brick(half+BW+MOR+MOR/2,BH+MOR*1.5,half-MOR,BH);return c.toDataURL();}
function applyBrickBg(){if(!brickDataUrl)brickDataUrl=generateBrickTile();document.body.style.backgroundImage=`url("${brickDataUrl}")`;document.body.style.backgroundRepeat='repeat';document.body.style.backgroundSize='auto';}
function removeBrickBg(){document.body.style.backgroundImage='';document.body.style.backgroundRepeat='';document.body.style.backgroundSize='';}

// ── NEON: Circuit ──
const NEON_CVS=document.getElementById('neon-canvas');
const NEON_CTX=NEON_CVS.getContext('2d');
let neonRAF=null;
const NEON_COLORS=['#00FFF0','#00FF41','#FF00FF','#FFD700','#FF6600','#0080FF','#FF0066','#AAFFFF'];
const GRID=38;
const DIRS=[{dx:1,dy:0},{dx:-1,dy:0},{dx:0,dy:1},{dx:0,dy:-1}];
function turnLeft(d){return{dx:d.dy,dy:-d.dx};}
function turnRight(d){return{dx:-d.dy,dy:d.dx};}
function newSignal(){const W=NEON_CVS.width,H=NEON_CVS.height;const cols=Math.floor(W/GRID),rows=Math.floor(H/GRID);const dir=DIRS[Math.floor(Math.random()*4)];return{x:Math.floor(Math.random()*cols)*GRID+GRID/2,y:Math.floor(Math.random()*rows)*GRID+GRID/2,dir,color:NEON_COLORS[Math.floor(Math.random()*NEON_COLORS.length)],trail:[],maxTrail:10+Math.floor(Math.random()*14),speed:8+Math.floor(Math.random()*6),frame:0,age:0,maxAge:50+Math.floor(Math.random()*80)};}
let nSignals=[];
function neonTick(){const W=NEON_CVS.width,H=NEON_CVS.height;NEON_CTX.fillStyle='rgba(0,0,0,0.18)';NEON_CTX.fillRect(0,0,W,H);NEON_CTX.fillStyle='rgba(0,255,65,0.07)';for(let x=GRID/2;x<W;x+=GRID)for(let y=GRID/2;y<H;y+=GRID){NEON_CTX.fillRect(x-1,y-1,2,2);}nSignals.forEach(s=>{s.frame++;if(s.frame>=s.speed){s.frame=0;s.age++;s.trail.push({x:s.x,y:s.y});if(s.trail.length>s.maxTrail)s.trail.shift();s.x+=s.dir.dx*GRID;s.y+=s.dir.dy*GRID;if(s.x<0||s.x>=W||s.y<0||s.y>=H||s.age>=s.maxAge){Object.assign(s,newSignal());return;}const r=Math.random();if(r<0.28)s.dir=turnLeft(s.dir);else if(r<0.56)s.dir=turnRight(s.dir);}if(s.trail.length<2)return;NEON_CTX.save();NEON_CTX.lineWidth=2;NEON_CTX.lineCap='square';for(let i=1;i<s.trail.length;i++){const alpha=i/s.trail.length;NEON_CTX.globalAlpha=alpha*0.9;NEON_CTX.shadowColor=s.color;NEON_CTX.shadowBlur=6+alpha*8;NEON_CTX.strokeStyle=s.color;NEON_CTX.beginPath();NEON_CTX.moveTo(s.trail[i-1].x,s.trail[i-1].y);NEON_CTX.lineTo(s.trail[i].x,s.trail[i].y);NEON_CTX.stroke();}NEON_CTX.globalAlpha=1;NEON_CTX.shadowBlur=20;NEON_CTX.shadowColor=s.color;NEON_CTX.fillStyle=s.color;NEON_CTX.fillRect(s.x-4,s.y-4,8,8);NEON_CTX.shadowBlur=30;NEON_CTX.fillStyle='#fff';NEON_CTX.fillRect(s.x-2,s.y-2,4,4);NEON_CTX.restore();});neonRAF=requestAnimationFrame(neonTick);}
function startNeon(){if(neonRAF)return;NEON_CVS.width=window.innerWidth;NEON_CVS.height=window.innerHeight;NEON_CTX.fillStyle='#000';NEON_CTX.fillRect(0,0,NEON_CVS.width,NEON_CVS.height);nSignals=Array.from({length:20},newSignal);neonTick();}
function stopNeon(){if(neonRAF){cancelAnimationFrame(neonRAF);neonRAF=null;}NEON_CTX.clearRect(0,0,NEON_CVS.width,NEON_CVS.height);}

// ── NEON DRUM: Circuit signals (scoped inside drum-board) ──
const DRUM_N_W=820,DRUM_N_H=420;
let drumNeonRAF=null,drumNeonCVS=null,drumNeonCTX=null,drumNSignals=[];
function newDrumSignal(){const cols=Math.floor(DRUM_N_W/GRID),rows=Math.floor(DRUM_N_H/GRID);const dir=DIRS[Math.floor(Math.random()*4)];return{x:Math.floor(Math.random()*cols)*GRID+GRID/2,y:Math.floor(Math.random()*rows)*GRID+GRID/2,dir,color:NEON_COLORS[Math.floor(Math.random()*NEON_COLORS.length)],trail:[],maxTrail:8+Math.floor(Math.random()*10),speed:6+Math.floor(Math.random()*5),frame:0,age:0,maxAge:40+Math.floor(Math.random()*60)};}
function drumNeonTick(){const ctx=drumNeonCTX;const W=DRUM_N_W,H=DRUM_N_H;ctx.fillStyle='rgba(0,0,0,0.18)';ctx.fillRect(0,0,W,H);ctx.fillStyle='rgba(0,255,65,0.07)';for(let x=GRID/2;x<W;x+=GRID)for(let y=GRID/2;y<H;y+=GRID)ctx.fillRect(x-1,y-1,2,2);drumNSignals.forEach(s=>{s.frame++;if(s.frame>=s.speed){s.frame=0;s.age++;s.trail.push({x:s.x,y:s.y});if(s.trail.length>s.maxTrail)s.trail.shift();s.x+=s.dir.dx*GRID;s.y+=s.dir.dy*GRID;if(s.x<0||s.x>=W||s.y<0||s.y>=H||s.age>=s.maxAge){Object.assign(s,newDrumSignal());return;}const r=Math.random();if(r<0.28)s.dir=turnLeft(s.dir);else if(r<0.56)s.dir=turnRight(s.dir);}if(s.trail.length<2)return;ctx.save();ctx.lineWidth=2;ctx.lineCap='square';for(let i=1;i<s.trail.length;i++){const alpha=i/s.trail.length;ctx.globalAlpha=alpha*0.9;ctx.shadowColor=s.color;ctx.shadowBlur=6+alpha*8;ctx.strokeStyle=s.color;ctx.beginPath();ctx.moveTo(s.trail[i-1].x,s.trail[i-1].y);ctx.lineTo(s.trail[i].x,s.trail[i].y);ctx.stroke();}ctx.globalAlpha=1;ctx.shadowBlur=20;ctx.shadowColor=s.color;ctx.fillStyle=s.color;ctx.fillRect(s.x-4,s.y-4,8,8);ctx.shadowBlur=30;ctx.fillStyle='#fff';ctx.fillRect(s.x-2,s.y-2,4,4);ctx.restore();});drumNeonRAF=requestAnimationFrame(drumNeonTick);}
function startDrumNeon(){if(drumNeonRAF)return;const dc=getDC();dc.innerHTML='';drumNeonCVS=document.createElement('canvas');drumNeonCVS.width=DRUM_N_W;drumNeonCVS.height=DRUM_N_H;drumNeonCVS.style.cssText='position:absolute;inset:0;width:100%;height:100%;';dc.appendChild(drumNeonCVS);drumNeonCTX=drumNeonCVS.getContext('2d');drumNeonCTX.fillStyle='#000';drumNeonCTX.fillRect(0,0,DRUM_N_W,DRUM_N_H);drumNSignals=Array.from({length:12},newDrumSignal);drumNeonTick();}
function stopDrumNeon(){if(drumNeonRAF){cancelAnimationFrame(drumNeonRAF);drumNeonRAF=null;}const dc=document.getElementById('drop-canvas');if(dc)dc.innerHTML='';drumNeonCVS=null;drumNeonCTX=null;drumNSignals=[];}

// ── LAVA: Blobs ──
const LAVA_CVS=document.getElementById('lava-canvas');
const LAVA_COLORS=[['#FF7A00','#CC2800'],['#FF4500','#AA1500'],['#FF8C00','#DD4400'],['#FF3D00','#BB1100'],['#FF6020','#CC3000'],['#FF9040','#EE5500']];
let lavaBlobs=[],lavaRAF=null;
function makeLavaBlob(){const W=window.innerWidth,H=window.innerHeight;const r=30+Math.random()*55;const[c1,c2]=LAVA_COLORS[Math.floor(Math.random()*LAVA_COLORS.length)];const el=document.createElement('div');el.className='lava-blob';const sz=r*2;el.style.cssText=`width:${sz}px;height:${sz}px;background:radial-gradient(circle at 38% 32%,${c1},${c2});`;LAVA_CVS.appendChild(el);const amp=H*(0.14+Math.random()*0.22);const cy=H*(0.4+Math.random()*0.28);return{el,r,x:r+Math.random()*(W-r*2),phase:Math.random()*Math.PI*2,phaseSpeed:0.003+Math.random()*0.005,amplitude:amp,centerY:cy,driftVx:(Math.random()-0.5)*0.28};}
function lavaLoop(){const W=window.innerWidth;lavaBlobs.forEach(b=>{b.phase+=b.phaseSpeed;b.x+=b.driftVx;if(b.x<b.r){b.x=b.r;b.driftVx=Math.abs(b.driftVx);}if(b.x>W-b.r){b.x=W-b.r;b.driftVx=-Math.abs(b.driftVx);}const y=b.centerY+Math.sin(b.phase)*b.amplitude;b.el.style.left=(b.x-b.r)+'px';b.el.style.top=(y-b.r)+'px';});lavaRAF=requestAnimationFrame(lavaLoop);}
function startLava(){if(lavaRAF)return;LAVA_CVS.innerHTML='';lavaBlobs=[];for(let i=0;i<14;i++)lavaBlobs.push(makeLavaBlob());lavaLoop();}
function stopLava(){if(lavaRAF){cancelAnimationFrame(lavaRAF);lavaRAF=null;}LAVA_CVS.innerHTML='';lavaBlobs=[];}

// ── LAVA DRUM: Blobs (scoped inside drum-board) ──
let drumLavaBlobs=[],drumLavaRAF=null;
function makeDrumLavaBlob(dc){const r=18+Math.random()*38;const[c1,c2]=LAVA_COLORS[Math.floor(Math.random()*LAVA_COLORS.length)];const el=document.createElement('div');el.className='lava-blob';const sz=r*2;el.style.cssText=`width:${sz}px;height:${sz}px;background:radial-gradient(circle at 38% 32%,${c1},${c2});`;dc.appendChild(el);const amp=420*(0.10+Math.random()*0.18);const cy=420*(0.35+Math.random()*0.30);return{el,r,x:r+Math.random()*(820-r*2),phase:Math.random()*Math.PI*2,phaseSpeed:0.003+Math.random()*0.005,amplitude:amp,centerY:cy,driftVx:(Math.random()-0.5)*0.25};}
function drumLavaLoop(){drumLavaBlobs.forEach(b=>{b.phase+=b.phaseSpeed;b.x+=b.driftVx;if(b.x<b.r){b.x=b.r;b.driftVx=Math.abs(b.driftVx);}if(b.x>820-b.r){b.x=820-b.r;b.driftVx=-Math.abs(b.driftVx);}const y=b.centerY+Math.sin(b.phase)*b.amplitude;b.el.style.left=(b.x-b.r)+'px';b.el.style.top=(y-b.r)+'px';});drumLavaRAF=requestAnimationFrame(drumLavaLoop);}
function startDrumLava(){if(drumLavaRAF)return;const dc=getDC();dc.innerHTML='';drumLavaBlobs=[];for(let i=0;i<18;i++)drumLavaBlobs.push(makeDrumLavaBlob(dc));drumLavaLoop();}
function stopDrumLava(){if(drumLavaRAF){cancelAnimationFrame(drumLavaRAF);drumLavaRAF=null;}const dc=document.getElementById('drop-canvas');if(dc)dc.innerHTML='';drumLavaBlobs=[];}

// ── GLOW: Stars ──
const STAR_CVS = document.getElementById('star-canvas');
let starCtx2d, stars = [], starRAF = null, sW = 0, sH = 0;

function makeStar() {
  return {
    x: Math.random()*sW, y: Math.random()*sH,
    r: Math.random()*2.5+0.8,
    points: Math.random()<0.5 ? 4 : 6,
    phase: Math.random()*Math.PI*2,
    speed: Math.random()*0.5+0.2,
    rot: Math.random()*Math.PI*2
  };
}
function drawSparkle(ctx, x, y, r, points, alpha) {
  const inner = r * 0.35;
  ctx.beginPath();
  for (let i = 0; i < points*2; i++) {
    const angle = (i * Math.PI / points);
    const rad = i % 2 === 0 ? r : inner;
    i === 0 ? ctx.moveTo(x + Math.cos(angle)*rad, y + Math.sin(angle)*rad)
            : ctx.lineTo(x + Math.cos(angle)*rad, y + Math.sin(angle)*rad);
  }
  ctx.closePath();
  ctx.fillStyle = `rgba(255,255,255,${alpha.toFixed(2)})`;
  ctx.fill();
}
function starTick() {
  starCtx2d.clearRect(0, 0, sW, sH);
  const now = Date.now() / 1000;
  stars.forEach(s => {
    const alpha = 0.15 + Math.abs(Math.sin(now * s.speed + s.phase)) * 0.85;
    starCtx2d.save();
    starCtx2d.translate(s.x, s.y);
    starCtx2d.rotate(s.rot);
    drawSparkle(starCtx2d, 0, 0, s.r, s.points, alpha);
    starCtx2d.restore();
  });
  starRAF = requestAnimationFrame(starTick);
}
function startStars() {
  if (starRAF) return;
  sW = STAR_CVS.width  = window.innerWidth;
  sH = STAR_CVS.height = window.innerHeight;
  starCtx2d = STAR_CVS.getContext('2d');
  stars = [];
  for (let i = 0; i < 90; i++) stars.push(makeStar());
  starTick();
}
function stopStars() {
  if (starRAF) { cancelAnimationFrame(starRAF); starRAF = null; }
  if (starCtx2d) starCtx2d.clearRect(0, 0, sW, sH);
  stars = [];
}

// ── GLOW DRUM: Aurora Stars (scoped inside drum-board) ──
const DS_W=820, DS_H=420;
let drumStarRAF=null,drumStarCVS=null,drumStarCTX=null,drumStars=[];
function makeDrumStar(){return{x:Math.random()*DS_W,y:Math.random()*DS_H,r:Math.random()*2.5+0.8,points:Math.random()<0.5?4:6,phase:Math.random()*Math.PI*2,speed:Math.random()*0.5+0.2,rot:Math.random()*Math.PI*2};}
function drumStarTick(){drumStarCTX.clearRect(0,0,DS_W,DS_H);const now=Date.now()/1000;drumStars.forEach(s=>{const alpha=0.15+Math.abs(Math.sin(now*s.speed+s.phase))*0.85;drumStarCTX.save();drumStarCTX.translate(s.x,s.y);drumStarCTX.rotate(s.rot);drawSparkle(drumStarCTX,0,0,s.r,s.points,alpha);drumStarCTX.restore();});drumStarRAF=requestAnimationFrame(drumStarTick);}
function startDrumGlow(){if(drumStarRAF)return;const dc=getDC();dc.innerHTML='';drumStarCVS=document.createElement('canvas');drumStarCVS.width=DS_W;drumStarCVS.height=DS_H;drumStarCVS.style.cssText='position:absolute;inset:0;width:100%;height:100%;';dc.appendChild(drumStarCVS);drumStarCTX=drumStarCVS.getContext('2d');drumStars=[];for(let i=0;i<80;i++)drumStars.push(makeDrumStar());drumStarTick();}
function stopDrumGlow(){if(drumStarRAF){cancelAnimationFrame(drumStarRAF);drumStarRAF=null;}const dc=document.getElementById('drop-canvas');if(dc)dc.innerHTML='';drumStarCVS=null;drumStarCTX=null;drumStars=[];}

// ── SAKURA: Petals + Bokeh + Wind Beams ──
const SAKURA_CVS = document.getElementById('sakura-canvas');
const PETAL_COLORS = [
  ['#ffd0e0','#ffb0cc'],['#ffe8f2','#ffc8de'],
  ['#ffffff','#ffd8ec'],['#ffb8d4','#ff90b8'],
  ['#fff8fc','#ffe4f2'],['#fce4ec','#f8bbd0'],
];
const PETAL_SHAPES = [
  '50% 0% 50% 100%','60% 0% 40% 100%',
  '70% 30% 70% 30%','50% 0% 80% 100% / 50% 0% 50% 100%',
];

function _spawnPetal(cvs,wMin,wMax,durMin,durMax){
  const el=document.createElement('div'); el.className='spetal';
  const w=wMin+Math.random()*(wMax-wMin);
  const h=w*(0.55+Math.random()*0.55);
  const[c1,c2]=PETAL_COLORS[Math.floor(Math.random()*PETAL_COLORS.length)];
  const shape=PETAL_SHAPES[Math.floor(Math.random()*PETAL_SHAPES.length)];
  const dur=(durMin+Math.random()*(durMax-durMin)).toFixed(1)+'s';
  const del=(-Math.random()*22).toFixed(1)+'s';
  const sx=(Math.random()*100-50).toFixed(0)+'px';
  const ex=(Math.random()*150-75).toFixed(0)+'px';
  const r0=(Math.random()*360).toFixed(0)+'deg';
  const r1=(parseFloat(r0)+Math.random()*160-80).toFixed(0)+'deg';
  const r2=(parseFloat(r0)+Math.random()*360-180).toFixed(0)+'deg';
  const op=(0.5+Math.random()*0.45).toFixed(2);
  el.style.cssText=`left:${Math.random()*108-4}%;width:${w}px;height:${h}px;`+
    `background:linear-gradient(135deg,${c1},${c2});border-radius:${shape};`+
    `--dur:${dur};--delay:${del};--sx:${sx};--ex:${ex};--r0:${r0};--r1:${r1};--r2:${r2};--op:${op};`;
  cvs.appendChild(el);
}

function startSakura(){
  if(SAKURA_CVS.children.length>0) return;
  // Layer 1: กลีบ 3 ขนาด
  for(let i=0;i<28;i++) _spawnPetal(SAKURA_CVS,4, 9, 5, 9);
  for(let i=0;i<16;i++) _spawnPetal(SAKURA_CVS,10,16, 9,14);
  for(let i=0;i< 8;i++) _spawnPetal(SAKURA_CVS,17,24,14,21);

  // Layer 2: Bokeh orbs (วงกลมเรืองแสง)
  const BC=['rgba(255,150,185,','rgba(255,200,220,','rgba(255,230,240,','rgba(240,120,170,'];
  for(let i=0;i<9;i++){
    const el=document.createElement('div'); el.className='sbokeh';
    const sz=18+Math.random()*50;
    const col=BC[Math.floor(Math.random()*BC.length)];
    const op=(0.12+Math.random()*0.18).toFixed(2);
    const blur=(10+Math.random()*14).toFixed(0)+'px';
    const dur=(7+Math.random()*10).toFixed(1)+'s';
    const del=(-Math.random()*12).toFixed(1)+'s';
    const dx1=(Math.random()*70-35).toFixed(0)+'px', dy1=(Math.random()*50-25).toFixed(0)+'px';
    const dx2=(Math.random()*90-45).toFixed(0)+'px', dy2=(Math.random()*60-30).toFixed(0)+'px';
    const dx3=(Math.random()*70-35).toFixed(0)+'px', dy3=(Math.random()*50-25).toFixed(0)+'px';
    el.style.cssText=`width:${sz}px;height:${sz}px;`+
      `background:radial-gradient(circle,${col}0.85),${col}0));`+
      `filter:blur(${blur});left:${8+Math.random()*84}%;top:${8+Math.random()*80}%;`+
      `--bop:${op};--bd:${dur};--bdelay:${del};`+
      `--dx1:${dx1};--dy1:${dy1};--dx2:${dx2};--dy2:${dy2};--dx3:${dx3};--dy3:${dy3};`;
    SAKURA_CVS.appendChild(el);
  }

  // Layer 3: Wind beams (แสงลม)
  for(let i=0;i<5;i++){
    const el=document.createElement('div'); el.className='sbeam';
    const w=(35+Math.random()*110).toFixed(0);
    const x=(Math.random()*110-5).toFixed(1);
    const dur=(10+Math.random()*12).toFixed(1);
    const delay=(-Math.random()*16).toFixed(1);
    const op=(0.04+Math.random()*0.07).toFixed(3);
    el.style.cssText=`left:${x}%;width:${w}px;--sd:${dur}s;--sdelay:${delay}s;--sop:${op};`;
    SAKURA_CVS.appendChild(el);
  }
}
function stopSakura(){ SAKURA_CVS.innerHTML=''; }

// ── SAKURA DRUM: กลีบซากุระ + Bokeh + ลมแสง (scoped inside drum-board) ──
function startDrumSakura(){
  const dc=getDC(); if(dc.children.length>0) return;
  for(let i=0;i<40;i++) _spawnPetal(dc,4, 9, 5, 9);
  for(let i=0;i<24;i++) _spawnPetal(dc,10,16, 9,14);
  for(let i=0;i<12;i++) _spawnPetal(dc,17,24,14,21);
  const BC=['rgba(255,150,185,','rgba(255,200,220,','rgba(255,230,240,','rgba(240,120,170,'];
  for(let i=0;i<9;i++){
    const el=document.createElement('div'); el.className='sbokeh';
    const sz=18+Math.random()*50;
    const col=BC[Math.floor(Math.random()*BC.length)];
    const op=(0.12+Math.random()*0.18).toFixed(2);
    const blur=(10+Math.random()*14).toFixed(0)+'px';
    const dur=(7+Math.random()*10).toFixed(1)+'s';
    const del=(-Math.random()*12).toFixed(1)+'s';
    const dx1=(Math.random()*70-35).toFixed(0)+'px', dy1=(Math.random()*50-25).toFixed(0)+'px';
    const dx2=(Math.random()*90-45).toFixed(0)+'px', dy2=(Math.random()*60-30).toFixed(0)+'px';
    const dx3=(Math.random()*70-35).toFixed(0)+'px', dy3=(Math.random()*50-25).toFixed(0)+'px';
    el.style.cssText=`width:${sz}px;height:${sz}px;`+
      `background:radial-gradient(circle,${col}0.85),${col}0));`+
      `filter:blur(${blur});left:${8+Math.random()*84}%;top:${8+Math.random()*80}%;`+
      `--bop:${op};--bd:${dur};--bdelay:${del};`+
      `--dx1:${dx1};--dy1:${dy1};--dx2:${dx2};--dy2:${dy2};--dx3:${dx3};--dy3:${dy3};`;
    dc.appendChild(el);
  }
  for(let i=0;i<5;i++){
    const el=document.createElement('div'); el.className='sbeam';
    const w=(35+Math.random()*110).toFixed(0);
    const x=(Math.random()*110-5).toFixed(1);
    const dur=(10+Math.random()*12).toFixed(1);
    const delay=(-Math.random()*16).toFixed(1);
    const op=(0.04+Math.random()*0.07).toFixed(3);
    el.style.cssText=`left:${x}%;width:${w}px;--sd:${dur}s;--sdelay:${delay}s;--sop:${op};`;
    dc.appendChild(el);
  }
}
function stopDrumSakura(){const dc=document.getElementById('drop-canvas');if(dc)dc.innerHTML='';}

// ── PRISM: Light Rays + Crystal Dust ──
const PRISM_CVS = document.getElementById('prism-canvas');

const RAY_COLORS = [
  'rgba(255,60,60,0.80)',   // red
  'rgba(255,150,0,0.75)',   // orange
  'rgba(245,235,0,0.72)',   // yellow
  'rgba(50,230,90,0.75)',   // green
  'rgba(0,220,255,0.80)',   // cyan
  'rgba(80,100,255,0.80)',  // blue
  'rgba(200,30,255,0.78)',  // violet
];
const RAY_DEFS = [
  {x:2,  w:55,  rd:'14s', rdelay:'0s',   rhue:'8s',  rhd:'0s'  },
  {x:16, w:88,  rd:'18s', rdelay:'-4s',  rhue:'11s', rhd:'-2s' },
  {x:30, w:68,  rd:'12s', rdelay:'-8s',  rhue:'14s', rhd:'-5s' },
  {x:45, w:100, rd:'20s', rdelay:'-2s',  rhue:'9s',  rhd:'-3s' },
  {x:58, w:62,  rd:'16s', rdelay:'-12s', rhue:'12s', rhd:'-7s' },
  {x:72, w:84,  rd:'13s', rdelay:'-6s',  rhue:'17s', rhd:'-1s' },
  {x:85, w:72,  rd:'17s', rdelay:'-10s', rhue:'10s', rhd:'-9s' },
];

function startPrism(){
  if(PRISM_CVS.children.length>0) return;

  // Light rays
  RAY_DEFS.forEach(({x,w,rd,rdelay,rhue,rhd},i)=>{
    const el=document.createElement('div'); el.className='pray';
    const c=RAY_COLORS[i];
    el.style.cssText=`left:${x}%;width:${w}px;`+
      `background:linear-gradient(180deg,transparent 0%,${c} 35%,${c} 65%,transparent 100%);`+
      `--rd:${rd};--rdelay:${rdelay};--rhue:${rhue};--rhd:${rhd};`;
    PRISM_CVS.appendChild(el);
  });

  // Crystal dust (38 particles)
  for(let i=0;i<38;i++){
    const el=document.createElement('div'); el.className='pdust';
    const sz=3+Math.random()*7;
    const hue=Math.floor(Math.random()*360);
    const op=(0.35+Math.random()*0.55).toFixed(2);
    const dur=(4+Math.random()*8).toFixed(1)+'s';
    const del=(-Math.random()*12).toFixed(1)+'s';
    const dh=(2.5+Math.random()*5.5).toFixed(1)+'s';
    const dhd=(-Math.random()*8).toFixed(1)+'s';
    const dx1=(Math.random()*70-35).toFixed(0)+'px', dy1=(Math.random()*70-35).toFixed(0)+'px';
    const dx2=(Math.random()*90-45).toFixed(0)+'px', dy2=(Math.random()*90-45).toFixed(0)+'px';
    el.style.cssText=`width:${sz}px;height:${sz}px;`+
      `background:hsl(${hue},100%,75%);`+
      `box-shadow:0 0 ${sz*2}px hsl(${hue},100%,65%),0 0 ${sz*4}px hsl(${hue},100%,50%);`+
      `left:${Math.random()*97}%;top:${Math.random()*97}%;`+
      `--dop:${op};--dd:${dur};--ddelay:${del};--dh:${dh};--dhd:${dhd};`+
      `--dx1:${dx1};--dy1:${dy1};--dx2:${dx2};--dy2:${dy2};`;
    PRISM_CVS.appendChild(el);
  }
}
function stopPrism(){ PRISM_CVS.innerHTML=''; }

// ── PRISM DRUM: Aurora wisps (scoped inside drum-board) ──
function startDrumPrismAurora(){
  const dc=getDC(); dc.innerHTML=''; dc.style.display='block';
  const AURORA_DEFS = [
    { y:  5, color:'rgba(0,255,200,',   op:0.40, dur:13, delay:  0, dy:-22 },
    { y: 20, color:'rgba(100,80,255,',  op:0.35, dur:17, delay: -5, dy: 24 },
    { y: 38, color:'rgba(0,200,255,',   op:0.38, dur:11, delay: -3, dy:-18 },
    { y: 55, color:'rgba(200,0,255,',   op:0.30, dur:15, delay: -8, dy: 20 },
    { y: 70, color:'rgba(0,255,140,',   op:0.36, dur:14, delay: -6, dy:-16 },
    { y: 85, color:'rgba(160,60,255,',  op:0.32, dur:12, delay:-10, dy: 14 },
  ];
  AURORA_DEFS.forEach(({y,color,op,dur,delay,dy})=>{
    const el=document.createElement('div'); el.className='aurora-wisp';
    el.style.cssText=`top:${y}%;`+
      `background:radial-gradient(ellipse at 50% 50%,${color}0.9),${color}0));`+
      `--aw-op:${op};--aw-dur:${dur}s;--aw-delay:${delay}s;--aw-dy:${dy}px;`;
    dc.appendChild(el);
  });
}
function stopDrumPrismAurora(){const dc=document.getElementById('drop-canvas');if(dc)dc.innerHTML='';}

// ── Stop all animations ──
function stopAllAnims(){
  stopWaterDrops();
  stopGreenFx();
  stopDrumGreenFx();
  stopDrumNeon();
  removeBrickBg();
  stopNeon();
  stopLava();
  stopDrumLava();
  stopStars();
  stopDrumGlow();
  stopSakura();
  stopDrumSakura();
  stopPrism();
  stopDrumPrismAurora();
  ['drop-canvas','drop-canvas-klmb','green-canvas','neon-canvas','lava-canvas','star-canvas','prism-canvas'].forEach(id=>{
    const el=document.getElementById(id);
    if(el) el.style.display='none';
  });
}

function updateQuickThemeBtn() {
  const cur = THEMES.find(th => th.id === state.theme);
  if (!cur) return;
  const label = `${cur.icon} ${t('theme')}`;
  const btn = document.getElementById('txt-quickTheme');
  if (btn) btn.textContent = label;
  const btnDrum = document.getElementById('txt-quickTheme-drum');
  if (btnDrum) btnDrum.textContent = label;
}

function applyInstrument() {
  const isDrum = state.instrument === 'DRUM';
  document.getElementById('kalimba-board').classList.toggle('hidden', isDrum);
  document.getElementById('drum-board').classList.toggle('hidden', !isDrum);
  const modeSection = document.getElementById('section-mode');
  if (modeSection) modeSection.style.display = isDrum ? 'none' : '';
  if (state.theme === 'BLUE') {
    stopWaterDrops();
    getDC().style.display = 'block';
    startWaterDrops();
  }
  if (state.theme === 'GREEN') {
    stopGreenFx();
    stopDrumGreenFx();
    if (state.instrument === 'DRUM') {
      getDC().style.display = 'block';
      startDrumGreenFx();
    } else {
      GC.style.display = 'block';
      startGreenFx();
    }
  }
  if (state.theme === 'NEON') {
    stopNeon();
    stopDrumNeon();
    if (state.instrument === 'DRUM') {
      getDC().style.display = 'block';
      startDrumNeon();
    } else {
      NEON_CVS.style.display = 'block';
      startNeon();
    }
  }
  if (state.theme === 'LAVA') {
    stopLava();
    stopDrumLava();
    if (state.instrument === 'DRUM') {
      getDC().style.display = 'block';
      startDrumLava();
    } else {
      LAVA_CVS.style.display = 'block';
      startLava();
    }
  }
  if (state.theme === 'SAKURA') {
    stopSakura();
    stopDrumSakura();
    if (state.instrument === 'DRUM') {
      getDC().style.display = 'block';
      startDrumSakura();
    } else {
      startSakura();
    }
  }
  if (state.theme === 'PRISM') {
    stopPrism();
    stopDrumPrismAurora();
    if (state.instrument === 'DRUM') {
      getDC().style.display='block';
      startDrumPrismAurora();
    } else {
      PRISM_CVS.style.display='block';
      startPrism();
    }
  }
  if (state.theme === 'RAINBOW') {
    renderDrum();
  }
  if (state.theme === 'GLOW') {
    stopStars();
    stopDrumGlow();
    if (state.instrument === 'DRUM') {
      getDC().style.display = 'block';
      startDrumGlow();
    } else {
      STAR_CVS.style.display = 'block';
      startStars();
    }
  }
}

function applyTheme() {
  stopAllAnims();
  document.body.className = `theme-${state.theme}`;
  updateQuickThemeBtn();
  switch(state.theme) {
    case 'BLUE':
      getDC().style.display='block';
      startWaterDrops();
      break;
    case 'GREEN':
      if (state.instrument === 'DRUM') {
        getDC().style.display='block';
        startDrumGreenFx();
      } else {
        GC.style.display='block';
        startGreenFx();
      }
      break;
    case 'BRICK':
      applyBrickBg();
      break;
    case 'NEON':
      if (state.instrument === 'DRUM') {
        getDC().style.display='block';
        startDrumNeon();
      } else {
        NEON_CVS.style.display='block';
        startNeon();
      }
      break;
    case 'LAVA':
      if (state.instrument === 'DRUM') {
        getDC().style.display='block';
        startDrumLava();
      } else {
        LAVA_CVS.style.display='block';
        startLava();
      }
      break;
    case 'RAINBOW':
      break;
    case 'GLOW':
      if (state.instrument === 'DRUM') {
        getDC().style.display='block';
        startDrumGlow();
      } else {
        STAR_CVS.style.display='block';
        startStars();
      }
      break;
    case 'SAKURA':
      if (state.instrument === 'DRUM') {
        getDC().style.display='block';
        startDrumSakura();
      } else {
        startSakura();
      }
      break;
    case 'PRISM':
      if (state.instrument === 'DRUM') {
        getDC().style.display='block';
        startDrumPrismAurora();
      } else {
        PRISM_CVS.style.display='block';
        startPrism();
      }
      break;
  }
  renderDrum();
}

// ═══════════════════════════════════════
//  PERSISTENCE
// ═══════════════════════════════════════
function saveState() {
  const toSave = {
    lang: state.lang, theme: state.theme, instrument: state.instrument,
    mode: state.mode, volume: state.volume,
    eqKalimba: state.eqKalimba, eqDrum: state.eqDrum, recordings: state.recordings
  };
  localStorage.setItem('kalimba_state', JSON.stringify(toSave));
}

const VALID_THEMES      = new Set(THEMES.map(t => t.id));
const VALID_INSTRUMENTS = new Set(INSTRUMENTS.map(i => i.id));
const VALID_EQ          = new Set(EQ_PRESETS.map(p => p.id));
function loadState() {
  try {
    const raw = localStorage.getItem('kalimba_state');
    if (raw) {
      const saved = JSON.parse(raw);
      // migrate save เก่าที่ยังใช้ eq field เดียว
      if (saved.eq && !saved.eqKalimba) { saved.eqKalimba = saved.eq; saved.eqDrum = saved.eq; }
      Object.assign(state, saved);
      if (!VALID_THEMES.has(state.theme))           state.theme      = 'TOY';
      if (!VALID_INSTRUMENTS.has(state.instrument)) state.instrument = 'KALIMBA';
      if (!VALID_EQ.has(state.eqKalimba))           state.eqKalimba  = 'DRY';
      if (!VALID_EQ.has(state.eqDrum))              state.eqDrum     = 'DRY';
    }
  } catch(e) {}
}

// ═══════════════════════════════════════
//  PUBLIC APP API
// ═══════════════════════════════════════
const App = {

  async init() {
    // ล็อกหน้าจอแนวนอน (ใช้ได้เฉพาะ PWA/fullscreen บางอุปกรณ์)
    if (screen.orientation && screen.orientation.lock) {
      screen.orientation.lock('landscape').catch(() => {});
    }

    // ปรับความสูงลิ้นเมื่อขนาดหน้าจอเปลี่ยน
    new ResizeObserver(() => {
      const c = document.getElementById('tines-container');
      if (c && c.children.length) adjustTineHeights(c);
    }).observe(document.getElementById('screen-main'));

    // Lock landscape on first touch (requires user gesture)
    document.addEventListener('touchstart', () => {
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen().catch(() => {});
      }
      if (screen.orientation && screen.orientation.lock) {
        screen.orientation.lock('landscape').catch(() => {});
      }
    }, { once: true });

    // Resume audio on first touch
    document.addEventListener('touchstart', resumeCtx);
    document.addEventListener('click', resumeCtx);
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') resumeCtx();
    });

    const fillEl = document.getElementById('splashFill');
    const splashStart = Date.now();

    // Start preload
    const loadPromise = preloadAudio(pct => {
      fillEl.style.width = pct + '%';
    });

    await Promise.all([
      loadPromise,
      new Promise(r => setTimeout(r, 4000))
    ]);

    const elapsed = Date.now() - splashStart;
    if (elapsed < 4000) await new Promise(r => setTimeout(r, 4000 - elapsed));

    loadState();
    buildSharedEQ();
    this._startMain();
  },

  selectLang(lang) {
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen().catch(() => {});
    }
    if (screen.orientation && screen.orientation.lock) {
      screen.orientation.lock('landscape').catch(() => {});
    }
    state.lang = lang;
    saveState();
    this._startMain();
  },

  _startMain() {
    applyTheme();
    applyInstrument();
    applyLangText();
    renderTines();
    renderEQ();
    renderThemes();
    renderInstruments();
    renderDrum();
    renderRecordings();
    document.getElementById('volSlider').value = state.volume;
    showScreen('screen-main');
  },

  setVolume(val) {
    state.volume = Number(val);
    if (kalimbaGain) kalimbaGain.gain.value = state.volume / 100;
    if (drumGain)    drumGain.gain.value    = state.volume / 100;
    saveState();
  },

  setEQ(id) {
    if (state.instrument === 'DRUM') state.eqDrum = id;
    else state.eqKalimba = id;
    saveState();
    renderEQ();
    buildSharedEQ();
  },

  setMode(n) {
    state.mode = n;
    renderTines();
    saveState();
    applyLangText();
  },

  setInstrument(id) {
    state.instrument = id;
    applyInstrument();
    buildSharedEQ();
    renderInstruments();
    saveState();
  },

  setTheme(id) {
    state.theme = id;
    applyTheme();
    renderThemes();
    saveState();
  },

  nextTheme() {
    const idx = THEMES.findIndex(t => t.id === state.theme);
    const next = THEMES[(idx + 1) % THEMES.length];
    state.theme = next.id;
    applyTheme();
    renderThemes();
    updateQuickThemeBtn();
    saveState();
  },

  setLang(lang) {
    state.lang = lang;
    applyLangText();
    renderEQ();
    renderThemes();
    renderRecordings();
    saveState();
  },

  toggleRecord() {
    if (!state.isRecording) startRecording();
    else stopRecording();
  },

  openSettings() {
    renderRecordings();
    showPanel('settings-panel', 'settings-overlay');
    const scroll = document.querySelector('#settings-panel .panel-scroll');
    if (scroll) scroll.scrollTop = 0;
  },

  closeSettings() {
    hidePanel('settings-panel', 'settings-overlay');
  },

  startReplay,
  stopReplay,
  closePlayback,
  exportAudio,

  comingSoon() {
    showToast(t('comingSoon'));
  },

  confirmReset() {
    document.getElementById('reset-overlay').classList.remove('hidden');
    document.getElementById('reset-dialog').classList.remove('hidden');
  },

  cancelReset() {
    document.getElementById('reset-overlay').classList.add('hidden');
    document.getElementById('reset-dialog').classList.add('hidden');
  },

  doReset() {
    localStorage.removeItem('kalimba_state');
    App.cancelReset();
    App.closeSettings();
    // Restart app
    state = { ...DEFAULT_STATE };
    Object.assign(state, { isRecording: false, recordedNotes: [] });
    applyTheme();   // stop animations + reset theme class
    scaleApp();
    this._startMain();
  }
};

// ═══════════════════════════════════════
//  SCALE APP TO FIT SCREEN
// ═══════════════════════════════════════
function scaleApp() {
  const W = 820, H = 420;
  const vw = window.visualViewport ? window.visualViewport.width  : window.innerWidth;
  const vh = window.visualViewport ? window.visualViewport.height : window.innerHeight;
  const scale = Math.min(vw / W, vh / H);
  window._kalimbaScale = scale;
  const t = `scale(${scale.toFixed(4)})`;
  const board = document.getElementById('kalimba-board');
  if (board) board.style.transform = t;
  const drum = document.getElementById('drum-board');
  if (drum) drum.style.transform = t;
  const lang = document.getElementById('lang-wrap');
  if (lang) lang.style.transform = t;
}
window.addEventListener('resize', scaleApp);
if (window.visualViewport) window.visualViewport.addEventListener('resize', scaleApp);

// ═══════════════════════════════════════
//  BOOT
// ═══════════════════════════════════════
window.addEventListener('DOMContentLoaded', () => { scaleApp(); App.init(); });
