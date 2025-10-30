// =================== Português - Ortografia ===================
import { pick } from '../utils.js';

const DATA_PT = {
  "ss/s": [
    "profe[ss]or", "cla[ss]e", "pa[ss]arinho", "pa[ss]eio", "pre[ss]a", "ma[ss]a",
    "[s]orriso", "[s]apato", "[s]onho", "en[s]inar", "[s]alada"
  ],
  "l/u": [
    "anima[l]", "ane[l]", "azu[l]", "bamb[u]", "carrete[l]", "cé[u]", "chapé[u]", "litora[l]",
    "minga[u]", "nata[l]", "pape[l]", "sa[l]", "vé[u]"
  ]
};

const fullFromRaw = (raw) => raw.replace(/\[([^\]]+)\]/g, '$1');

function genPT_sss(){
  const list = DATA_PT['ss/s']; const raw = pick(list); const answer = (raw.match(/\[([^\]]+)\]/)||[])[1]||'';
  const display = raw.replace(/\[([^\]]+)\]/, '<span class="blank"></span>');
  const options = ['SS','S'].map(x=>({val:x,label:x}));
  const shown = fullFromRaw(raw);
  return { cat:'Português — S/SS', key:`PT_SSS:${shown}`, answer:answer.toUpperCase(), display, options, hint:'Escolha S ou SS.' };
}

function genPT_lu(){
  const list = DATA_PT['l/u']; const raw = pick(list); const answer = (raw.match(/\[([^\]]+)\]/)||[])[1]||'';
  const display = raw.replace(/\[([^\]]+)\]/, '<span class="blank"></span>');
  const options = ['L','U'].map(x=>({val:x,label:x}));
  const shown = fullFromRaw(raw);
  return { cat:'Português — L/U', key:`PT_LU:${shown}`, answer:answer.toUpperCase(), display, options, hint:'Escolha L ou U.' };
}

export const items = [
  { id:'pt_sss', label:'S/SS (complete a palavra)', fn: genPT_sss },
  { id:'pt_lu', label:'L/U (complete a palavra)', fn: genPT_lu }
];

export { genPT_sss, genPT_lu };