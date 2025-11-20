// =================== Geografia - Grupo 1: Meios de transporte ===================
import { pick, shuffle } from '../utils.js';

const DATA_GEOGRAFIA_GRUPO1 = [
  {
    question: 'Qual meio de transporte é melhor paravoar para países bem longes?',
    options: [
      { val: 'a', label: 'Avião' },
      { val: 'b', label: 'Bicicleta' },
      { val: 'c', label: 'Ônibus' }
    ],
    answer: 'a'
  },
  {
    question: 'Qual meio de transporte é usado para pessoas pelo bairro em curtas distâncias?',
    options: [
      { val: 'a', label: 'Avião' },
      { val: 'b', label: 'Bicicleta' },
      { val: 'c', label: 'Navio' }
    ],
    answer: 'b'
  },
  {
    question: 'Qual meio de transporte leva muitas pessoas?',
    options: [
      { val: 'a', label: 'Carro' },
      { val: 'b', label: 'Ônibus' },
      { val: 'c', label: 'Moto' }
    ],
    answer: 'b'
  },
  {
    question: 'Qual meio de transporte só circula por trilhos?',
    options: [
      { val: 'a', label: 'Carro' },
      { val: 'b', label: 'Trem' },
      { val: 'c', label: 'Navio' }
    ],
    answer: 'b'
  },
  {
    question: 'Qual é mais rápido: avião ou navio?',
    options: [
      { val: 'a', label: 'Avião' },
      { val: 'b', label: 'Navio' },
      { val: 'c', label: 'Igual' }
    ],
    answer: 'a'
  },
  {
    question: 'Qual meio de transporte voa e pode ser um helicóptero?',
    options: [
      { val: 'a', label: 'Carro' },
      { val: 'b', label: 'Helicóptero' },
      { val: 'c', label: 'Barco' }
    ],
    answer: 'b'
  },
  {
    question: 'Qual meio de transporte usa balão?',
    options: [
      { val: 'a', label: 'Aéreo' },
      { val: 'b', label: 'Terrestre' },
      { val: 'c', label: 'Aquático' }
    ],
    answer: 'a'
  },
  {
    question: 'Qual meio de transporte é um barco pequeno?',
    options: [
      { val: 'a', label: 'Navio' },
      { val: 'b', label: 'Bote' },
      { val: 'c', label: 'Avião' }
    ],
    answer: 'b'
  }
];

function genGrupo1() {
  const item = pick(DATA_GEOGRAFIA_GRUPO1);
  const correctOption = item.options.find(opt => opt.val === item.answer);
  return {
    cat: 'Geografia — Meios de transporte',
    key: `GEO_G1:${item.question}`,
    answer: correctOption.label,
    display: `${item.question} <span class="blank"></span>`,
    options: shuffle(item.options.map(opt => ({ val: opt.label, label: opt.label }))),
    hint: 'Escolha a opção correta.'
  };
}

export const items = [
  { id: 'geo_g1', label: 'Meios de transporte', fn: genGrupo1 }
];

export { genGrupo1 };