// =================== Imports das Categorias ===================
import { randi, randf, pick } from './categorias/utils.js';
import { GROUPS } from './categorias/_grupo.js';

// =================== Elementos e Estado ===================
const wordEl     = document.getElementById('word');
const scoreEl    = document.getElementById('score');
const hintEl     = document.getElementById('hint');
const catEl      = document.getElementById('category');
const nextEl     = document.getElementById('nextInfo');
const subscoreEl = document.getElementById('subscore');
const statsBtn   = document.getElementById('statsBtn');
const statsModal = document.getElementById('statsModal');
const statsBody  = document.getElementById('statsBody');
const optionsEl  = document.getElementById('options');
const startOverlay = document.getElementById('startOverlay');
const catGroupsEl  = document.getElementById('catGroups');
const startBtn     = document.getElementById('startBtn');
const selectAllBtn = document.getElementById('selectAllBtn');
const clearAllBtn  = document.getElementById('clearAllBtn');
const resetOnStart = document.getElementById('resetOnStart');
const backBtn      = document.getElementById('backBtn');

let hits = 0, misses = 0, streak = 0; // placares
let current = null; // { cat,key,answer,display,options[],hint }
let lock = false; let timeoutId = null; let timeoutId2 = null; let lastKey = '';
const STATS = {}; // key -> {correct, wrong, cat, label}

// =================== 2 Robôs no canvas ===================
const arenaEl = document.getElementById('arena');
const canvas = document.getElementById('botCanvas');
const ctx = canvas.getContext('2d');

const clamp10 = n => Math.max(0, Math.min(20, n));
const scaleFromStreak = s => 1 + 0.14 * clamp10(s);
const smileFromStreak = s => 0.5 + 0.5 * (clamp10(s) / 20);
const SPEED_CYCLE = [30, 20, 10, 8, 5, 45, 3, 2];

function speedBoostFromPhase(phase){
  // Fase é um índice inteiro que caminha ciclicamente, independente do streak
  return 1 + 0.04 * SPEED_CYCLE[phase % SPEED_CYCLE.length];
}

function makeBot(init){
  return {
    x: init.x, y: init.y,
    vx: init.vx, vy: init.vy,
    baseR: init.baseR,
    color: init.color,
    mood: 'neutral', moodUntil: 0,
    phase: randi(0, SPEED_CYCLE.length-1), // fase de velocidade própria
    lastBeepTs: 0,
    isDragging: false, // novo: indica se o robô está sendo arrastado
    dragOffsetX: 0, dragOffsetY: 0 // novo: offset do mouse em relação ao centro do robô
  };
}

const bots = [];
let numRobots = 1; // Número atual de robôs ativos

// ====== Áudio (beep) ======
let audioCtx = null;
function ensureAudio(){
  try{
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    if (audioCtx.state === 'suspended') audioCtx.resume();
  }catch(e){}
}
function beep(){
  ensureAudio(); if (!audioCtx) return;
  const o = audioCtx.createOscillator();
  const g = audioCtx.createGain();
  o.type = 'sine';
  o.frequency.setValueAtTime(880, audioCtx.currentTime);
  g.gain.setValueAtTime(0.001, audioCtx.currentTime);
  g.gain.exponentialRampToValueAtTime(0.15, audioCtx.currentTime + 0.01);
  g.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.12);
  o.connect(g).connect(audioCtx.destination);
  o.start(); o.stop(audioCtx.currentTime + 0.14);
}
function beepWithCooldown(bot, minMs=150){ const now = performance.now(); if (now-bot.lastBeepTs>=minMs){ bot.lastBeepTs=now; beep(); } }

function resizeCanvas(){
  const dpr = window.devicePixelRatio||1; const r = arenaEl.getBoundingClientRect();
  canvas.width=Math.max(1,Math.floor(r.width*dpr)); canvas.height=Math.max(1,Math.floor(r.height*dpr));
  canvas.style.width=r.width+'px'; canvas.style.height=r.height+'px';
  ctx.setTransform(dpr,0,0,dpr,0,0);
  // garantir que ambos os robôs fiquem dentro
  bots.forEach(b=>{
    const rb = b.baseR*scaleFromStreak(streak);
    b.x=Math.min(Math.max(rb,b.x), r.width-rb);
    b.y=Math.min(Math.max(rb,b.y), r.height-rb);
  });
}

function drawBot(b){
  const r=b.baseR*scaleFromStreak(streak);
  ctx.save(); ctx.translate(b.x,b.y);
  ctx.fillStyle=b.color;
  ctx.beginPath(); ctx.arc(0,0,r,0,Math.PI*2); ctx.fill();
  // rodas
  ctx.fillStyle='#1f2937'; ctx.beginPath(); ctx.arc(-r*0.5, r*0.9, r*0.18, 0, Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.arc(r*0.5, r*0.9, r*0.18, 0, Math.PI*2); ctx.fill();
  // olhos
  ctx.fillStyle='#0f172a'; const eyeY=-r*0.15;
  ctx.beginPath(); ctx.arc(-r*0.35, eyeY, r*0.10, 0, Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.arc(r*0.35, eyeY, r*0.10, 0, Math.PI*2); ctx.fill();
  // sorriso
  const smile=smileFromStreak(streak); let offset=0; let color='#0f172a';
  if (b.isDragging){
    // Boca circular para surpresa quando arrastando
    ctx.fillStyle='#0f172a';
    ctx.beginPath(); ctx.arc(0, r*0.28, r*0.15, 0, Math.PI*2); ctx.fill();
  } else {
    if (b.mood==='happy'){ offset=r*0.30*smile; color='#16a34a'; }
    else if (b.mood==='sad'){ offset=-r*0.22; color='#dc2626'; }
    ctx.strokeStyle=color; ctx.lineWidth=Math.max(2, r*0.08);
    ctx.beginPath(); ctx.moveTo(-r*0.48, r*0.28); ctx.quadraticCurveTo(0, r*0.28+offset, r*0.48, r*0.28); ctx.stroke();
  }
  // antena
  ctx.strokeStyle='#1e3a8a'; ctx.lineWidth=Math.max(2, r*0.08);
  ctx.beginPath(); ctx.moveTo(0,-r); ctx.lineTo(0,-r*1.4); ctx.stroke();
  ctx.fillStyle='#60a5fa'; ctx.beginPath(); ctx.arc(0,-r*1.55, r*0.12, 0, Math.PI*2); ctx.fill();
  ctx.restore();
}

function drawScene(){
  const w=canvas.clientWidth,h=canvas.clientHeight;
  ctx.clearRect(0,0,w,h);
  // Desenha apenas os robôs ativos baseado no número atual
  for(let i = 0; i < Math.min(numRobots, bots.length); i++){
    drawBot(bots[i]);
  }
}

function updateBot(b, dt, w, h){
  // Não mover se estiver sendo arrastado
  if (b.isDragging) return;

  // boost independente (cíclico com o tempo)
  if (!b.phaseTimer) b.phaseTimer=0;
  b.phaseTimer += dt;
  if (b.phaseTimer > 0.7){ b.phaseTimer = 0; b.phase = (b.phase+1) % SPEED_CYCLE.length; }
  const speedBoost = speedBoostFromPhase(b.phase);
  const r = b.baseR*scaleFromStreak(streak);
  b.x += b.vx*dt*speedBoost;
  b.y += b.vy*dt*speedBoost;

  let bounced=false;
  if (b.x<r){ b.x=r; b.vx*=-1; bounced=true; }
  if (b.x>w-r){ b.x=w-r; b.vx*=-1; bounced=true; }
  if (b.y<r){ b.y=r; b.vy*=-1; bounced=true; }
  if (b.y>h-r){ b.y=h-r; b.vy*=-1; bounced=true; }
  if (bounced) beepWithCooldown(b, 120);
  // jitter leve e clamp
  if (Math.random()<0.01){ b.vx += (Math.random()-0.5)*40; b.vy += (Math.random()-0.5)*40; }
  b.vx=Math.max(-140,Math.min(140,b.vx));
  b.vy=Math.max(-140,Math.min(140,b.vy));
  // humor expira
  if (b.mood!=='neutral' && performance.now()>b.moodUntil) b.mood='neutral';
}

let lastTs = 0;
function tick(ts){
  if(!lastTs) lastTs=ts; const dt=Math.min(0.05, (ts-lastTs)/1000); lastTs=ts;
  const w=canvas.clientWidth,h=canvas.clientHeight;
  // Atualiza apenas os robôs ativos
  for(let i = 0; i < Math.min(numRobots, bots.length); i++){
    updateBot(bots[i], dt, w, h);
  }
  drawScene();
  requestAnimationFrame(tick);
}

function updateScoreUI(){
  scoreEl.textContent = `Pontos: ${hits}`;
  subscoreEl.textContent = `Acertos: ${hits}\nErros: ${misses}`;
}

function updateRobotCount(){
  // Calcula o número de robôs baseado no streak (a cada 10 acertos consecutivos)
  const newNumRobots = Math.min(5, Math.max(1, Math.floor(streak / 10) + 1));

  if(newNumRobots !== numRobots){
    const oldNumRobots = numRobots;
    numRobots = newNumRobots;

    // Atualiza o título
    const title = document.querySelector('title');

    if(numRobots === 1){
      title.textContent = 'Jogo — Matemática, Educação Financeira, Português & Tempo (1 Robô)';
    } else {
      title.textContent = `Jogo — Matemática, Educação Financeira, Português & Tempo (${numRobots} Robôs)`;
    }

    // Se aumentou o número de robôs, mostra mensagem de parabéns
    if(newNumRobots > oldNumRobots && newNumRobots > 1){
      const nextInfo = document.getElementById('nextInfo');
      nextInfo.textContent = `🎉 Parabéns! ${newNumRobots}º robô desbloqueado com ${streak} acertos em sequência!`;
      setTimeout(() => {
        if(nextInfo.textContent.includes('robô desbloqueado')) nextInfo.textContent = '';
      }, 4000);
    }
  }
}

// ========= Catálogo (grupos) ========= (carregamento dinâmico a partir dos metadados dos arquivos)
// GROUPS importado de ./categorias/_grupo.js

let ACTIVE_GENERATORS = [];

// ======== Lógica de seleção/início (árvore com checkboxes) ======== (igual ao v1)
const catGroupsElRef = catGroupsEl; // só para clareza
function renderCategoryTree(){
  const frag = document.createDocumentFragment();
  GROUPS.forEach(group => {
    renderGroup(group, frag, 0);
  });
  catGroupsEl.innerHTML=''; catGroupsEl.appendChild(frag);
  catGroupsEl.addEventListener('change', (e)=>{ if (e.target && e.target.matches('input[type="checkbox"]')){ updateGroupStates(); updateStartEnabled(); }});
  updateGroupStates();
  updateStartEnabled();
}

function renderGroup(group, parentFrag, level = 0){
  const sec = document.createElement('section'); sec.className='group'; sec.dataset.groupId=group.id; sec.style.marginLeft = `${level * 20}px`;
  const header = document.createElement('div'); header.className='groupHeader';
  const title = document.createElement('div'); title.className='groupTitle';
  const parentCb = document.createElement('input'); parentCb.type='checkbox'; parentCb.id=`${group.id}_cb`;
  const lbl = document.createElement('label'); lbl.textContent=group.label; lbl.setAttribute('for', parentCb.id);
  const foldBtn = document.createElement('button'); foldBtn.className='foldBtn'; foldBtn.type='button'; foldBtn.textContent='▸';
  title.appendChild(parentCb); title.appendChild(lbl); header.appendChild(title); header.appendChild(foldBtn);
  const body = document.createElement('div'); body.className='groupBody'; body.style.display = 'none';

  if (group.subgroups) {
    group.subgroups.forEach(subgroup => {
      renderGroup(subgroup, body, level + 1);
    });
  } else if (group.items) {
    group.items.forEach(item => {
      const lab = document.createElement('label'); lab.className='catItem'; lab.htmlFor=`cat_${item.id}`;
      const cb = document.createElement('input'); cb.type='checkbox'; cb.id=`cat_${item.id}`; cb.dataset.id=item.id; cb.dataset.group=group.id;
      const span = document.createElement('span'); span.textContent=item.label;
      lab.appendChild(cb); lab.appendChild(span); body.appendChild(lab);
    });
  }

  sec.appendChild(header); sec.appendChild(body); parentFrag.appendChild(sec);

  foldBtn.addEventListener('click', ()=>{
    const isHidden = body.style.display==='none';
    body.style.display = isHidden ? 'block' : 'none';
    foldBtn.textContent = isHidden ? '▾' : '▸';
  });
  parentCb.addEventListener('change', ()=>{
    body.querySelectorAll('input[type="checkbox"]').forEach(ch=>{ ch.checked = parentCb.checked; });
    updateStartEnabled(); updateGroupStates();
  });
}

function updateGroupStates(){
  function updateGroupState(group) {
    const parent = document.getElementById(`${group.id}_cb`);
    if (!parent) return;
    
    const children = [];
    if (group.subgroups) {
      group.subgroups.forEach(sub => {
        updateGroupState(sub); // recursão
        const subCb = document.getElementById(`${sub.id}_cb`);
        if (subCb) children.push(subCb);
      });
    } else if (group.items) {
      group.items.forEach(item => {
        const cb = document.getElementById(`cat_${item.id}`);
        if (cb) children.push(cb);
      });
    }
    
    const checked = children.filter(c=>c.checked).length;
    parent.indeterminate = checked>0 && checked<children.length;
    parent.checked = checked===children.length && children.length>0;
  }
  
  GROUPS.forEach(updateGroupState);
}

function getSelectedCategoryIds(){
  const selected = [];
  function collectIds(group) {
    if (group.subgroups) {
      group.subgroups.forEach(collectIds);
    } else if (group.items) {
      group.items.forEach(item => {
        const cb = document.getElementById(`cat_${item.id}`);
        if (cb && cb.checked) selected.push(item.id);
      });
    }
  }
  GROUPS.forEach(collectIds);
  return selected;
}

function updateStartEnabled(){ startBtn.disabled = getSelectedCategoryIds().length===0; }

selectAllBtn.addEventListener('click', ()=>{
  function selectAll(group) {
    if (group.subgroups) {
      group.subgroups.forEach(selectAll);
    } else if (group.items) {
      group.items.forEach(item => {
        const cb = document.getElementById(`cat_${item.id}`);
        if (cb) cb.checked = true;
      });
    }
  }
  GROUPS.forEach(selectAll);
  updateGroupStates(); updateStartEnabled();
});
clearAllBtn.addEventListener('click', ()=>{
  function clearAll(group) {
    if (group.subgroups) {
      group.subgroups.forEach(clearAll);
    } else if (group.items) {
      group.items.forEach(item => {
        const cb = document.getElementById(`cat_${item.id}`);
        if (cb) cb.checked = false;
      });
    }
  }
  GROUPS.forEach(clearAll);
  updateGroupStates(); updateStartEnabled();
});

function startGame(){
  ensureAudio();
  const ids = getSelectedCategoryIds();
  const allItems = [];
  function collectAllItems(group) {
    if (group.subgroups) {
      group.subgroups.forEach(collectAllItems);
    } else if (group.items) {
      allItems.push(...group.items);
    }
  }
  GROUPS.forEach(collectAllItems);
  ACTIVE_GENERATORS = allItems.filter(c=>ids.includes(c.id)).map(c=>c.fn);
  if (ACTIVE_GENERATORS.length===0) return;
  if (resetOnStart.checked){
    hits=0; misses=0; streak=0;
    numRobots = 1; // Reset para 1 robô
    updateScoreUI();
    updateRobotCount(); // Atualiza o título
  }
  startOverlay.style.display='none'; backBtn.disabled = false; nextRound();
}
startBtn.addEventListener('click', startGame);

function goBackToSelection(){
  clearTimeout(timeoutId); clearTimeout(timeoutId2); timeoutId=null; timeoutId2=null; lock=false; current=null;
  wordEl.className='wordBox neutral'; wordEl.textContent='—';
  catEl.textContent='—'; hintEl.textContent='Escolha a opção correta';
  optionsEl.innerHTML=''; nextEl.textContent='';
  startOverlay.style.display='flex'; backBtn.disabled = true;
}
backBtn.addEventListener('click', goBackToSelection);

// =================== Ciclo de jogo ===================
function pickProblem(){
  if (!ACTIVE_GENERATORS.length){ goBackToSelection(); return null; }
  let obj; let tries=0; do { obj = pick(ACTIVE_GENERATORS)(); tries++; } while (obj && obj.key===lastKey && tries<20);
  lastKey = obj ? obj.key : '';
  if (obj && !STATS[obj.key]) STATS[obj.key] = { correct:0, wrong:0, cat: obj.cat, label: obj.display.replace(/<[^>]+>/g,' ') };
  return obj;
}
function renderOptions(opts){
  optionsEl.innerHTML = '';
  const palette = ['primary','secondary','tertiary'];
  opts.forEach((opt,i)=>{
    const btt = document.createElement('button');
    btt.className = 'btn ' + palette[i % palette.length];
    btt.textContent = String(opt.label);
    btt.type='button';
    btt.addEventListener('click', () => handleChoice(opt.val));
    optionsEl.appendChild(btt);
  });
}
function renderWord(stateClass='neutral', filled=null, opts={}){
  if (!current) return;
  let shown = current.display;
  if (filled!=null){
    const withWrap = `<span class="answerSlot"><span class="ansVal">${String(filled)}</span>${opts.showX?'\n          <span class="x">✗</span>':''}</span>`;
    shown = current.display.replace(/<span class="blank"[^>]*><\/span>/, withWrap);
  }
  wordEl.className = `wordBox ${stateClass}`; wordEl.innerHTML = shown;
  catEl.textContent = current.cat; nextEl.textContent = '';
}
function nextRound(){
  lock = false; clearTimeout(timeoutId); clearTimeout(timeoutId2); timeoutId=null; timeoutId2=null;
  current = pickProblem(); if (!current) return;
  renderOptions(current.options); renderWord('neutral', null);
  hintEl.textContent = current.hint || 'Escolha a resposta correta';
  nextEl.textContent = '';
}
function setMoodAll(mood, ms){
  // Define humor apenas para os robôs ativos
  for(let i = 0; i < Math.min(numRobots, bots.length); i++){
    bots[i].mood = mood;
    bots[i].moodUntil = performance.now() + ms;
  }
}
function handleChoice(val){
  if (lock) return; lock = true;
  [...optionsEl.querySelectorAll('button')].forEach(b => b.disabled = true);
  const isNumAnswer = typeof current.answer === 'number';
  const correct = isNumAnswer ? (Number(val) === current.answer) : (String(val).toUpperCase() === String(current.answer).toUpperCase());
  clearTimeout(timeoutId); clearTimeout(timeoutId2); timeoutId=null; timeoutId2=null;

  if (correct){
    hits += 1; streak += 1; STATS[current.key].correct += 1;
    updateScoreUI();
    updateRobotCount(); // Atualiza número de robôs após acerto
    renderWord('correct', isNumAnswer ? val : null, { showX:false }); hintEl.textContent = 'Muito bem! ✅';
    setMoodAll('happy', 1500);
    nextEl.textContent = 'Novo desafio em 2 segundos…';
    timeoutId = setTimeout(nextRound, 2000);
  } else {
    misses += 1; streak = 0; STATS[current.key].wrong += 1;
    updateScoreUI();
    updateRobotCount(); // Atualiza número de robôs após erro (streak zerado)
    renderWord('wrong', isNumAnswer ? val : null, { showX:true });
    const feedback = isNumAnswer ? `A resposta correta aparecerá a seguir.` : 'Leia com atenção.';
    hintEl.textContent = `Quase! ❌ ${feedback}`;
    setMoodAll('sad', 1200);
    nextEl.textContent = 'Mostrando a resposta correta em 2 segundos…';
    timeoutId = setTimeout(()=>{
      renderWord('correct', current.answer, { showX:false });
      hintEl.textContent = 'Resposta correta ✅';
      nextEl.textContent = 'Próximo desafio em 2 segundos…';
      timeoutId2 = setTimeout(nextRound, 2000);
    }, 2000);
  }
}
function buildStatsTable(){
  const entries = Object.entries(STATS).map(([key,s])=>{
    const attempts = s.correct + s.wrong; const acc = attempts>0 ? (s.correct/attempts) : -1;
    return { key, cat:s.cat, word:s.label, correct:s.correct, wrong:s.wrong, attempts, acc };
  }).sort((a,b)=>{ if (a.acc===b.acc) return b.attempts-a.attempts; if (a.acc<0) return 1; if(b.acc<0) return -1; return b.acc-a.acc; });
  statsBody.innerHTML = entries.map(e=>{ const pct = e.acc<0 ? '—' : Math.round(e.acc*100); return `<tr><td>${e.word}</td><td>${e.cat}</td><td>${e.correct}</td><td>${e.wrong}</td><td>${pct}%</td><td>${e.attempts}</td></tr>`; }).join('');
}
statsBtn.addEventListener('click', () => { buildStatsTable(); statsModal.showModal(); });
document.getElementById('closeStats').addEventListener('click', () => statsModal.close());

function initBots(){
  const w = (canvas.clientWidth||600), h = (canvas.clientHeight||350);
  const colors = ['#93c5fd', '#c4b5fd', '#86efac', '#fbbf24', '#f87171']; // azul, roxo, verde, amarelo, vermelho

  // Cria todos os 5 robôs de uma vez
  for(let i = 0; i < 5; i++){
    // Posiciona os robôs em diferentes áreas da tela
    const angle = (i / 5) * Math.PI * 2; // Distribui em círculo
    const centerX = w * 0.5;
    const centerY = h * 0.5;
    const radius = Math.min(w, h) * 0.25;

    bots.push(makeBot({
      x: centerX + Math.cos(angle) * radius + randf(-30,30),
      y: centerY + Math.sin(angle) * radius + randf(-20,20),
      vx: randf(70,120)*(Math.random()<0.5?-1:1),
      vy: randf(60,110)*(Math.random()<0.5?-1:1),
      baseR: randi(16, 32),
      color: colors[i]
    }));
  }
}

function initCanvas(){ resizeCanvas(); drawScene(); requestAnimationFrame(tick); }

function getMousePos(canvas, e) {
  const rect = canvas.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;
  return {
    x: (e.clientX - rect.left) * dpr,
    y: (e.clientY - rect.top) * dpr
  };
}

function getBotAtPosition(mouseX, mouseY) {
  // Verifica apenas robôs ativos
  for (let i = 0; i < Math.min(numRobots, bots.length); i++) {
    const bot = bots[i];
    const r = bot.baseR * scaleFromStreak(streak);
    const dx = mouseX - bot.x;
    const dy = mouseY - bot.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance <= r) {
      return bot;
    }
  }
  return null;
}

let draggedBot = null;
let isDragging = false;

function handleMouseDown(e) {
  const mousePos = getMousePos(canvas, e);
  draggedBot = getBotAtPosition(mousePos.x, mousePos.y);

  if (draggedBot) {
    isDragging = true;
    draggedBot.isDragging = true;
    draggedBot.dragOffsetX = mousePos.x - draggedBot.x;
    draggedBot.dragOffsetY = mousePos.y - draggedBot.y;

    // Impede comportamento padrão para evitar seleção de texto
    e.preventDefault();
  }
}

function handleMouseMove(e) {
  if (isDragging && draggedBot) {
    const mousePos = getMousePos(canvas, e);
    const w = canvas.clientWidth, h = canvas.clientHeight;
    const r = draggedBot.baseR * scaleFromStreak(streak);

    // Atualiza posição do robô, mantendo dentro dos limites
    draggedBot.x = Math.max(r, Math.min(w - r, mousePos.x - draggedBot.dragOffsetX));
    draggedBot.y = Math.max(r, Math.min(h - r, mousePos.y - draggedBot.dragOffsetY));

    e.preventDefault();
  }
}

function handleMouseUp(e) {
  if (isDragging && draggedBot) {
    draggedBot.isDragging = false;
    draggedBot = null;
    isDragging = false;
  }
}

// Adiciona event listeners para drag and drop
canvas.addEventListener('mousedown', handleMouseDown);
canvas.addEventListener('mousemove', handleMouseMove);
canvas.addEventListener('mouseup', handleMouseUp);
canvas.addEventListener('mouseleave', handleMouseUp); // Para quando o mouse sai do canvas

// Suporte para touch (mobile)
canvas.addEventListener('touchstart', (e) => {
  e.preventDefault();
  const touch = e.touches[0];
  const mouseEvent = { clientX: touch.clientX, clientY: touch.clientY };
  handleMouseDown(mouseEvent);
});

canvas.addEventListener('touchmove', (e) => {
  e.preventDefault();
  const touch = e.touches[0];
  const mouseEvent = { clientX: touch.clientX, clientY: touch.clientY };
  handleMouseMove(mouseEvent);
});

canvas.addEventListener('touchend', (e) => {
  e.preventDefault();
  handleMouseUp(e);
});

// Boot
renderCategoryTree();
updateScoreUI();
initBots();
initCanvas();
addEventListener('resize', resizeCanvas);
document.addEventListener('pointerdown', ensureAudio, { once:true });