// =================== Português - Categorias ===================
import { pick } from '../utils.js';

const DATA_PT_CATEGORIAS = {
  "tempo;lugar;ação": [
    "Primeiro:tempo", "Depois:tempo", "À tarde:tempo",
    "perto:lugar", "longe:lugar", "no caminho:lugar",
    "brincar:ação", "sapatear:ação", "dormir:ação"
  ]
};

const isMultiCat = (cat) => cat.includes(';');
function parseTagged(raw){
  const idx = raw.lastIndexOf(':');
  if (idx === -1) return { phrase: raw, label: '' };
  return { phrase: raw.slice(0, idx).trim(), label: raw.slice(idx+1).trim() };
}

const MULTI_LABELS = {};
for (const [cat, list] of Object.entries(DATA_PT_CATEGORIAS)){
  if (!isMultiCat(cat)) continue;
  const base = cat.split(';').map(s => s.trim());
  const extra = new Set(base);
  for (const item of list){ const { label } = parseTagged(item); if (label) extra.add(label); }
  MULTI_LABELS[cat] = Array.from(extra);
}

function genPT_labels(){
  const cat = 'tempo;lugar;ação';
  const list = DATA_PT_CATEGORIAS[cat]; const raw = pick(list); const { phrase, label } = parseTagged(raw);
  const baseLabels = MULTI_LABELS[cat] || ['tempo','lugar','ação'];
  const options = baseLabels.map(x=>({val:x,label:x}));
  return { cat:'Português — categorias (tempo/lugar/ação)', key:`PT_TAG:${phrase}`, answer:label, display: `${phrase} = <span class="blank"></span>`, options, hint:'Classifique a palavra.' };
}

export const items = [
  { id:'pt_labels', label:'Categorias: tempo / lugar / ação', fn: genPT_labels }
];

export { genPT_labels };