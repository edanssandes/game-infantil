// =================== Educação Financeira ===================
import { randi, pick, shuffle, makeNumericOptions } from '../utils.js';

const ITEMS = ['bola','caderno','lápis','borracha','livro','carrinho','boneca','pião','figurinhas','massinha','cola','estojo'];

function genPricesNoCarry(count){
  while(true){
    const tens=[], hund=[]; let sumT=0, sumH=0; const out=[];
    for(let i=0;i<count;i++){
      const t = randi(1, Math.max(1, 9 - sumT - (count-1-i)));
      tens.push(t); sumT += t;
    }
    for(let i=0;i<count;i++){
      const h = randi(0, Math.max(0, 9 - sumH - (count-1-i)));
      hund.push(h); sumH += h;
    }
    for(let i=0;i<count;i++){
      const price = hund[i]*100 + tens[i]*10;
      if (price < 10 || price > 990) { out.length=0; break; }
      out.push(price);
    }
    if (out.length===count) return out;
  }
}

function fmtBRL(n){ return `R$\u00A0${n}`; }

function genShoppingTotal(){
  let n, prices, names, total; let tries=0;
  while(true){
    n = randi(2,3);
    prices = genPricesNoCarry(n);
    total = prices.reduce((s,x)=>s+x,0);
    if (total <= 200) break;
    if (++tries>100){ prices = [10,20]; n=2; total=30; break; }
  }
  names = shuffle([...ITEMS]).slice(0,n);
  const lista = names.map((nm,i)=>`${nm} ${fmtBRL(prices[i])}`).join(', ');
  return { cat: 'Educação Financeira — total', key: `FIN_TOTAL:${prices.join('+')}`, answer: total,
    display: `Compras: ${lista}.\nQuanto é o total? <span class="blank"></span>`,
    options: makeNumericOptions(total).map(v=>({val:v,label:fmtBRL(v)})), hint: 'Some os preços (sem vai‑um). Resultado ≤ 200.' };
}

function genPaymentChange(){
  let price, pay, change; let tries=0;
  while(true){
    price = genPricesNoCarry(1)[0];
    const ph = Math.floor(price/100), pt = Math.floor((price%100)/10);
    let payH = randi(ph, 9);
    let payT = randi(pt + (payH===ph?1:0), 9);
    if (payT>9){ payT=pt; if (payH<9) payH++; }
    pay = payH*100 + payT*10; change = pay - price;
    if (change > 0 && change <= 200) break;
    if (++tries>200){ pay = price + 10; change = 10; break; }
  }
  return { cat: 'Educação Financeira — troco', key: `FIN_TROCO:${pay}-${price}`, answer: change,
    display: `Você paga ${fmtBRL(pay)} por um item que custa ${fmtBRL(price)}.\nQual é o troco? <span class="blank"></span>`,
    options: makeNumericOptions(change).map(v=>({val:v,label:fmtBRL(v)})), hint: 'Subtraia sem emprestar. Troco ≤ 200.' };
}

export const items = [
  { id:'fin_total', label:'Total da compra (sem vai‑um)', fn: genShoppingTotal },
  { id:'fin_troco', label:'Troco (sem empréstimo)', fn: genPaymentChange }
];

export { genShoppingTotal, genPaymentChange };