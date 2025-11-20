// =================== Geografia - Grupo 6: Comunicação vs. Transporte ===================
import { pick, shuffle } from '../utils.js';

const DATA_GEOGRAFIA_GRUPO6 = [
  {
    question: 'O balão é um meio de...',
    options: [
      { val: 'a', label: 'Transporte' },
      { val: 'b', label: 'Comunicação' },
      { val: 'c', label: 'Ambos' }
    ],
    answer: 'a'
  },
  {
    question: 'O patinete é um meio de...',
    options: [
      { val: 'a', label: 'Transporte' },
      { val: 'b', label: 'Comunicação' },
      { val: 'c', label: 'Ambos' }
    ],
    answer: 'a'
  },
  {
    question: 'O livro é um meio de...',
    options: [
      { val: 'a', label: 'Transporte' },
      { val: 'b', label: 'Comunicação' },
      { val: 'c', label: 'Ambos' }
    ],
    answer: 'b'
  },
  {
    question: 'O rádio é um meio de...',
    options: [
      { val: 'a', label: 'Transporte' },
      { val: 'b', label: 'Comunicação' },
      { val: 'c', label: 'Ambos' }
    ],
    answer: 'b'
  },
  {
    question: 'O carro é um meio de...',
    options: [
      { val: 'a', label: 'Transporte' },
      { val: 'b', label: 'Comunicação' },
      { val: 'c', label: 'Ambos' }
    ],
    answer: 'a'
  },
  {
    question: 'O telefone é um meio de...',
    options: [
      { val: 'a', label: 'Transporte' },
      { val: 'b', label: 'Comunicação' },
      { val: 'c', label: 'Ambos' }
    ],
    answer: 'b'
  },
  {
    question: 'O barco é um meio de...',
    options: [
      { val: 'a', label: 'Transporte' },
      { val: 'b', label: 'Comunicação' },
      { val: 'c', label: 'Ambos' }
    ],
    answer: 'a'
  },
  {
    question: 'A carta é um meio de...',
    options: [
      { val: 'a', label: 'Transporte' },
      { val: 'b', label: 'Comunicação' },
      { val: 'c', label: 'Ambos' }
    ],
    answer: 'b'
  }
];

function genGrupo6() {
  const item = pick(DATA_GEOGRAFIA_GRUPO6);
  const correctOption = item.options.find(opt => opt.val === item.answer);
  return {
    cat: 'Geografia — Comunicação vs. Transporte',
    key: `GEO_G6:${item.question}`,
    answer: correctOption.label,
    display: `${item.question} <span class="blank"></span>`,
    options: shuffle(item.options.map(opt => ({ val: opt.label, label: opt.label }))),
    hint: 'Escolha a opção correta.'
  };
}

export const items = [
  { id: 'geo_g6', label: 'Comunicação vs. Transporte', fn: genGrupo6 }
];

export { genGrupo6 };