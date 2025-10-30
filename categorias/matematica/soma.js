// =================== Matemática - Soma ===================
import { randi, genNoCarryAddPair, makeNumericOptions, makeTensOptions, pick } from '../utils.js';

function genNumberLineAdd(){ const [A,B]=genNoCarryAddPair(); return { cat:'Reta numérica — adição', key:`ADD:${A}+${B}`, answer:A+B,
  display:`${A} + ${B} = <span class=\"blank\"></span>`, options: makeNumericOptions(A+B).map(v=>({val:v,label:String(v)})), hint:'Imagine pulos para a direita.' }; }

function genAddMultipleOf10(){
  const tens = 10 * randi(1,9);
  const other = randi(1, 999 - tens);
  const order = Math.random()<0.5;
  const A = order ? other : tens;
  const B = order ? tens : other;
  const sum = A + B;
  return { cat:'Soma com múltiplo de 10', key:`ADD10:${A}+${B}`, answer:sum,
    display:`${A} + ${B} = <span class=\"blank\"></span>`, options: makeNumericOptions(sum).map(v=>({val:v,label:String(v)})), hint:'Use os "dezenas" para somar rapidamente.' };
}

function genAddFive(){
  const side = Math.random()<0.5 ? 'left':'right';
  let other = 5 * randi(1, 199);
  if (other>994) other=995;
  const A = side==='left' ? 5 : other;
  const B = side==='left' ? other : 5;
  const ans = A+B;
  return { cat:'Soma de 5', key:`ADD5:${A}+${B}`, answer:ans,
    display:`${A} + ${B} = <span class=\"blank\"></span>`, options: makeNumericOptions(ans).map(v=>({val:v,label:String(v)})), hint:'Adicione 5 ao outro número.' };
}

function genSumEquals10(){
  const a = randi(1,9); const b = 10 - a; const order=Math.random()<0.5;
  const A = order? a:b, B = order? b:a; const ans = 10;
  return { cat:'Soma igual a 10', key:`SUM10:${A}+${B}`, answer:ans,
    display:`${A} + ${B} = <span class=\"blank\"></span>`, options: makeNumericOptions(ans).map(v=>({val:v,label:String(v)})), hint:'Complete para 10.' };
}

function genSumEquals20(){
  const a = randi(1,19); const b = 20 - a; const order=Math.random()<0.5;
  const A = order? a:b, B = order? b:a; const ans = 20;
  return { cat:'Soma igual a 20', key:`SUM20:${A}+${B}`, answer:ans,
    display:`${A} + ${B} = <span class=\"blank\"></span>`, options: makeNumericOptions(ans).map(v=>({val:v,label:String(v)})), hint:'Complete para 20.' };
}

function genApprox10FixedSmall(maxTen, smallSet){
  while(true){
    const Mten = randi(1, maxTen);
    const total = 10 * Mten;
    const small = pick(smallSet);
    if (total <= small) continue;
    const big = total - small;
    const orderLeft = Math.random() < 0.5;
    const A = orderLeft ? small : big;
    const B = orderLeft ? big   : small;
    return {
      cat: (maxTen<=9 ? 'Aproximação com 10 — Nível 1' : (smallSet.some(v=>v>=11) ? 'Aproximação com 10 — Nível 3' : 'Aproximação com 10 — Nível 2')),
      key: `APP10_${maxTen}:${A}+${B}`,
      answer: total,
      display: `${A} + ${B} = <span class=\"blank\"></span>`,
      options: makeTensOptions(total, 10*maxTen).map(v=>({val:v,label:String(v)})),
      hint: 'Complete para o próximo múltiplo de 10 (uma parcela é fixa).'
    };
  }
}

function genApprox10L1(){ return genApprox10FixedSmall(9,  [1,2,8,9]); }
function genApprox10L2(){ return genApprox10FixedSmall(19, [1,2,8,9]); }
function genApprox10L3(){ return genApprox10FixedSmall(19, [1,2,8,9,11,12,18,19]); }

export const items = [
  { id:'add', label:'Reta numérica — adição', fn: genNumberLineAdd },
  { id:'add10', label:'Soma com múltiplo de 10', fn: genAddMultipleOf10 },
  { id:'add5', label:'Soma de 5', fn: genAddFive },
  { id:'sum10', label:'Soma igual a 10', fn: genSumEquals10 },
  { id:'sum20', label:'Soma igual a 20', fn: genSumEquals20 },
  { id:'approx10_l1', label:'Aproximação com 10 — Nível 1 (parcela = 1, 2, 8 ou 9)', fn: genApprox10L1 },
  { id:'approx10_l2', label:'Aproximação com 10 — Nível 2 (parcela = 1, 2, 8 ou 9)', fn: genApprox10L2 },
  { id:'approx10_l3', label:'Aproximação com 10 — Nível 3 (parcela = 1, 2, 8, 9, 11, 12, 18 ou 19)', fn: genApprox10L3 }
];

export { genNumberLineAdd, genAddMultipleOf10, genAddFive, genSumEquals10, genSumEquals20, genApprox10L1, genApprox10L2, genApprox10L3 };