// =================== Tempo ===================
import { randi, pick, shuffle, makeNumericOptions } from '../utils.js';

const PERIODOS = [
  { q: "Quantas horas tem um dia?", a: 24 },
  { q: "Quantos dias tem uma semana?", a: 7 },
  { q: "Quantos dias tem no ano?", a: 365 },
  { q: "Quantos minutos tem em uma hora?", a: 60 },
  { q: "Quantos segundos tem em um minuto?", a: 60 },
  { q: "Quantos meses no ano?", a: 12 },
  { q: "Quantas estações no ano?", a: 4 }
];

const MESES = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

const TURNOS = [
  { time: "6h00", turno: "manhã" },
  { time: "9h00", turno: "manhã" },
  { time: "12h00", turno: "meio-dia" },
  { time: "15h00", turno: "tarde" },
  { time: "17h00", turno: "tarde" },
  { time: "20h00", turno: "noite" },
  { time: "22h00", turno: "noite" },
  { time: "2h00", turno: "madrugada" },
  { time: "4h00", turno: "madrugada" }
];

function genPeriodos(){
  const item = pick(PERIODOS);
  return { cat: 'Tempo — Períodos', key: `TEMPO_PER:${item.q}`, answer: item.a,
    display: `${item.q} <span class="blank"></span>`,
    options: makeNumericOptions(item.a).map(v=>({val:v,label:String(v)})), hint: 'Pense nos períodos de tempo.' };
}

function genMeses(){
  const type = randi(1,3);
  let q, a;
  if(type === 1){
    const pos = pick(["primeiro", "segundo", "último"]);
    if(pos === "primeiro") a = MESES[0];
    else if(pos === "segundo") a = MESES[1];
    else a = MESES[11];
    q = `Qual é o ${pos} mês do ano?`;
  } else if(type === 2){
    const idx = randi(0,10);
    const mes = MESES[idx];
    a = MESES[idx+1];
    q = `Qual mês vem depois de ${mes}?`;
  } else {
    const idx = randi(1,11);
    const mes = MESES[idx];
    a = MESES[idx-1];
    q = `Qual mês vem antes de ${mes}?`;
  }
  const wrongs = shuffle(MESES.filter(m=>m!==a)).slice(0,2);
  return { cat: 'Tempo — Meses', key: `TEMPO_MES:${q}`, answer: a,
    display: `${q} <span class="blank"></span>`,
    options: shuffle([a, ...wrongs]).map(v=>({val:v,label:v})), hint: 'Lembre-se da ordem dos meses.' };
}

function genTurno(){
  const item = pick(TURNOS);
  const allTurnos = ["manhã", "tarde", "noite", "madrugada", "meio-dia"];
  const wrongs = shuffle(allTurnos.filter(t=>t!==item.turno)).slice(0,2);
  return { cat: 'Tempo — Turno', key: `TEMPO_TURNO:${item.time}`, answer: item.turno,
    display: `${item.time} é <span class="blank"></span>`,
    options: shuffle([item.turno, ...wrongs]).map(v=>({val:v,label:v})), hint: 'Considere o horário do dia.' };
}

function genDiferencaTempo(){
  const startHour = randi(8,16);
  const diff = pick([1,2]);
  const endHour = startHour + diff;
  const q = `A aula começou às ${startHour}h00 e terminou às ${endHour}h00. Qual foi a duração?`;
  return { cat: 'Tempo — Diferença', key: `TEMPO_DIFF:${startHour}-${endHour}`, answer: diff,
    display: `${q} <span class="blank"></span> horas`,
    options: makeNumericOptions(diff).map(v=>({val:v,label:String(v)})), hint: 'Subtraia as horas.' };
}

export const items = [
  { id:'tempo_per', label:'Períodos (horas, dias, etc.)', fn: genPeriodos },
  { id:'tempo_mes', label:'Meses (ordem, sequência)', fn: genMeses },
  { id:'tempo_turno', label:'Turno do dia (manhã, tarde, etc.)', fn: genTurno },
  { id:'tempo_diff', label:'Diferença de tempo (1 ou 2 horas)', fn: genDiferencaTempo }
];

export { genPeriodos, genMeses, genTurno, genDiferencaTempo };