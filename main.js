// =================== Imports das Categorias ===================
import { randi, randf, pick } from './categorias/utils.js';
import { GROUPS } from './categorias/_grupo.js';
import { SpriteManager } from './sprites/manager.js';
import { createRobots } from './sprites/robot.js';
import { createDucklings } from './sprites/duckling.js';

/*
  === EXEMPLO DE EXTENSIBILIDADE ===
  
  Para adicionar um novo tipo de sprite (ex: sapo), você precisaria apenas:
  
  1. Criar sprites/frog.js:
     - export class Frog extends Sprite { ... }
     - export function createRandomFrog(x, y, bounds) { ... }
  
  2. Importar no main.js:
     - import { createRandomFrog } from './sprites/frog.js';
  
  3. Adicionar no HTML:
     - <input type="radio" name="spriteType" value="frogs" id="spriteFrogs">
     - <span>🐸 Sapos</span>
  
  4. Atualizar as funções de suporte:
     - getSpriteTypeName(): case 'frogs': return 'Sapo';
     - getSpriteTypePlural(): case 'frogs': return 'Sapos';  
     - getSpriteEmoji(): case 'frogs': return '🐸';
     - createSprites(): case 'frogs': createFrogs(bounds); break;
  
  5. Criar função createFrogs():
     - function createFrogs(bounds, count = 5) { ... }
  
  E pronto! O sistema é completamente modular e extensível!
*/

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

// =================== Sistema de Sprites ===================
const arenaEl = document.getElementById('arena');
const canvas = document.getElementById('botCanvas');

// Utility functions para compatibilidade
const clamp10 = n => Math.max(0, Math.min(20, n));
const scaleFromStreak = s => 1 + 0.14 * clamp10(s);

// Gerenciador de sprites
let spriteManager = null;
let numRobots = 1; // Número atual de sprites ativos
let currentSpriteType = 'duckling'; // Tipo atual de sprite

// ====== Sistema de Áudio Global ======
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

// Torna o áudio disponível globalmente para os sprites
window.gameAudio = { beep };

// Funções simplificadas que delegam para o SpriteManager
function resizeCanvas(){
  if (spriteManager) {
    spriteManager.resize();
  }
}

function drawScene(){
  if (spriteManager) {
    spriteManager.draw();
  }
}

function tick(ts){
  if (spriteManager) {
    spriteManager.update(ts);
    spriteManager.draw();
  }
  requestAnimationFrame(tick);
}

function updateScoreUI(){
  scoreEl.textContent = `Pontos: ${hits}`;
  subscoreEl.textContent = `Acertos: ${hits}\nErros: ${misses}`;
}

function updateRobotCount(){
  // Calcula o número de sprites baseado no streak (a cada 10 acertos consecutivos)
  const newNumRobots = Math.min(5, Math.max(1, Math.floor(streak / 10) + 1));

  if(newNumRobots !== numRobots){
    const oldNumRobots = numRobots;
    numRobots = newNumRobots;

    // Atualiza o sprite manager
    if (spriteManager) {
      spriteManager.setActiveCount(numRobots);
      spriteManager.setGlobalScale(scaleFromStreak(streak));
    }

    // Atualiza o título baseado no tipo de sprite
    const title = document.querySelector('title');
    const spriteTypeName = getSpriteTypeName();

    if(numRobots === 1){
      title.textContent = `Jogo — Matemática, Educação Financeira, Português & Tempo (1 ${spriteTypeName})`;
    } else {
      const plural = getSpriteTypePlural();
      title.textContent = `Jogo — Matemática, Educação Financeira, Português & Tempo (${numRobots} ${plural})`;
    }

    // Se aumentou o número de sprites, mostra mensagem de parabéns
    if(newNumRobots > oldNumRobots && newNumRobots > 1){
      const nextInfo = document.getElementById('nextInfo');
      const spriteEmoji = getSpriteEmoji();
      nextInfo.textContent = `🎉 Parabéns! ${newNumRobots}º ${spriteTypeName.toLowerCase()} desbloqueado com ${streak} acertos em sequência! ${spriteEmoji}`;
      setTimeout(() => {
        if(nextInfo.textContent.includes('desbloqueado')) nextInfo.textContent = '';
      }, 4000);
    }
  }
}

function getSpriteTypeName() {
  switch(currentSpriteType) {
    case 'robots': return 'Robô';
    case 'ducklings': return 'Pintinho';
    case 'mixed': return 'Sprite';
    default: return 'Sprite';
  }
}

function getSpriteTypePlural() {
  switch(currentSpriteType) {
    case 'robots': return 'Robôs';
    case 'ducklings': return 'Pintinhos';
    case 'mixed': return 'Sprites';
    default: return 'Sprites';
  }
}

function getSpriteEmoji() {
  switch(currentSpriteType) {
    case 'robots': return '🤖';
    case 'ducklings': return '🐥�';
    case 'mixed': return '🎪';
    default: return '🎮';
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
  
  // Verifica se o tipo de sprite mudou
  const spriteTypeElement = document.querySelector('input[name="spriteType"]:checked');
  const selectedSpriteType = spriteTypeElement ? spriteTypeElement.value : 'robots';
  const spriteTypeChanged = selectedSpriteType !== currentSpriteType;
  
  if (resetOnStart.checked || spriteTypeChanged){
    hits=0; misses=0; streak=0;
    numRobots = 1; // Reset para 1 sprite
    currentSpriteType = selectedSpriteType;
    
    // Recria o sistema de sprites se o tipo mudou
    if (spriteTypeChanged && spriteManager) {
      const bounds = {
        width: canvas.clientWidth || 600,
        height: canvas.clientHeight || 350
      };
      spriteManager.clearSprites();
      createSprites(bounds);
      spriteManager.setActiveCount(numRobots);
      spriteManager.setGlobalScale(scaleFromStreak(streak));
    }
    
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
  if (spriteManager) {
    spriteManager.setMoodAll(mood, ms);
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
    renderWord('correct', val, { showX:false }); hintEl.textContent = 'Muito bem! ✅';
    setMoodAll('happy', 1500);
    nextEl.textContent = 'Novo desafio em 2 segundos…';
    timeoutId = setTimeout(nextRound, 2000);
  } else {
    misses += 1; streak = 0; STATS[current.key].wrong += 1;
    updateScoreUI();
    updateRobotCount(); // Atualiza número de robôs após erro (streak zerado)
    renderWord('wrong', val, { showX:true });
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

function initSpriteSystem(){
  // Cria o gerenciador de sprites
  spriteManager = new SpriteManager(canvas);
  
  // Obtém o tipo de sprite selecionado
  const spriteTypeElement = document.querySelector('input[name="spriteType"]:checked');
  currentSpriteType = spriteTypeElement ? spriteTypeElement.value : 'robots';
  
  // Cria os sprites baseado na seleção
  const bounds = {
    width: canvas.clientWidth || 600,
    height: canvas.clientHeight || 350
  };
  
  createSprites(bounds);
  spriteManager.setActiveCount(numRobots);
  spriteManager.setGlobalScale(scaleFromStreak(streak));
}

function createSprites(bounds) {
  if (currentSpriteType === 'robots') {
    createRobots(spriteManager, 5, bounds);
  } else if (currentSpriteType === 'ducklings') {
    createDucklings(spriteManager, 5, bounds);
  } else if (currentSpriteType === 'mixed') {
    // Cria uma mistura de robôs e pintinhos
    createRobots(spriteManager, 3, bounds);
    createDucklings(spriteManager, 2, bounds);
  }
}



function initCanvas(){ 
  initSpriteSystem();
  resizeCanvas(); 
  drawScene(); 
  requestAnimationFrame(tick); 
}

// Boot
renderCategoryTree();
updateScoreUI();

// Garantir que um tipo de sprite esteja sempre selecionado
const spriteRadios = document.querySelectorAll('input[name="spriteType"]');
if (spriteRadios.length > 0 && !document.querySelector('input[name="spriteType"]:checked')) {
  spriteRadios[0].checked = true; // Seleciona o primeiro (robots)
}

initCanvas();
addEventListener('resize', resizeCanvas);
document.addEventListener('pointerdown', ensureAudio, { once:true });