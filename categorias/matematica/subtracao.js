// =================== Matemática - Subtração ===================
import { randi, genNoBorrowSubPair, makeNumericOptions, pick } from '../utils.js';

function genNumberLineSub(){ const [A,B]=genNoBorrowSubPair(); return { cat:'Reta numérica — subtração', key:`SUB:${A}-${B}`, answer:A-B,
  display:`${A} - ${B} = <span class=\"blank\"></span>`, options: makeNumericOptions(A-B).map(v=>({val:v,label:String(v)})), hint:'Imagine pulos para a esquerda.' }; }

function genSubtractUnits(){
  const tens = randi(1,99); const u = randi(1,9);
  const A = tens*10 + u; const B = u; const ans = tens*10;
  return { cat:'Subtração das unidades', key:`SUBU:${A}-${B}`, answer:ans,
    display:`${A} - ${B} = <span class=\"blank\"></span>`, options: makeNumericOptions(ans).map(v=>({val:v,label:String(v)})), hint:'Retire apenas as unidades.' };
}

export const items = [
  { id:'sub', label:'Reta numérica — subtração', fn: genNumberLineSub },
  { id:'subu', label:'Subtração das unidades', fn: genSubtractUnits }
];

export { genNumberLineSub, genSubtractUnits };