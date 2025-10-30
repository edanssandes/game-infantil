// =================== Matemática - Multiplicação ===================
import { randi, makeNumericOptions, pick } from '../utils.js';

function genTabuada2a5(){ const a=randi(2,5), b=randi(1,10), ans=a*b; return { cat:'Tabuada 2–5', key:`TAB:${a}x${b}`, answer:ans,
  display:`${a} × ${b} = <span class=\"blank\"></span>`, options: makeNumericOptions(ans).map(v=>({val:v,label:String(v)})), hint:'Soma repetida.' }; }

export const items = [
  { id:'tab', label:'Tabuada 2–5', fn: genTabuada2a5 }
];

export { genTabuada2a5 };