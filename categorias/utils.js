// =================== Utilidades Compartilhadas ===================
const randi = (a,b)=>Math.floor(Math.random()*(b-a+1))+a; // [a,b]
const randf = (a,b)=>Math.random()*(b-a)+a;
const pick = arr => arr[Math.floor(Math.random()*arr.length)];
const shuffle = arr => { for(let i=arr.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [arr[i],arr[j]]=[arr[j],arr[i]] } return arr; };

// Funções auxiliares para matemática
function genNoCarryAddPair(){
  while(true){
    const len = randi(1,3);
    const aD = [0,0,0], bD=[0,0,0]; // [u,t,c]
    for(let i=0;i<len;i++){
      aD[i] = randi(0,9);
      bD[i] = randi(0,9-aD[i]); // garante a_i + b_i < 10
    }
    const A = aD[2]*100 + aD[1]*10 + aD[0];
    const B = bD[2]*100 + bD[1]*10 + bD[0];
    if (A>=1 && B>=1){ return [A,B]; }
  }
}

function genNoBorrowSubPair(){
  while(true){
    const len = randi(1,3);
    const aD=[0,0,0], bD=[0,0,0];
    for(let i=0;i<len;i++){
      aD[i] = randi(0,9);
      bD[i] = randi(0,aD[i]); // garante a_i >= b_i
    }
    let A = aD[2]*100 + aD[1]*10 + aD[0];
    let B = bD[2]*100 + bD[1]*10 + bD[0];
    if (A>=1 && B>=1 && A>=B){ return [A,B]; }
  }
}

function makeNumericOptions(correct){
  const opts = new Set([correct]);
  const delta = Math.max(1, Math.round(Math.max(5, correct*0.1)));
  opts.add(Math.max(0, correct + randi(1,delta)));
  opts.add(Math.max(0, correct - randi(1,delta)));
  while (opts.size<3){ opts.add(correct + randi(1,9)); }
  return shuffle(Array.from(opts)).slice(0,3);
}

function makeTensOptions(correct, maxVal){
  const set = new Set([correct]);
  const max = Math.max(10, maxVal || 190);
  while (set.size < 3){
    const d = 10 * randi(1, Math.floor(max/10));
    if (d !== correct) set.add(d);
  }
  return shuffle(Array.from(set)).slice(0,3);
}

export { randi, randf, pick, shuffle, genNoCarryAddPair, genNoBorrowSubPair, makeNumericOptions, makeTensOptions };