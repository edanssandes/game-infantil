// =================== Geografia - Grupo 4: Meios de comunicação ===================
import { pick, shuffle } from '../utils.js';

const DATA_GEOGRAFIA_GRUPO4 = [
  {
    question: 'Qual meio de comunicação permite transmissão instantânea?',
    options: [
      { val: 'a', label: 'Celular' },
      { val: 'b', label: 'Livro' },
      { val: 'c', label: 'Carta' }
    ],
    answer: 'a'
  },
  {
    question: 'Qual meio de comunicação é mais lento?',
    options: [
      { val: 'a', label: 'Celular' },
      { val: 'b', label: 'Livro' },
      { val: 'c', label: 'Rádio' }
    ],
    answer: 'b'
  },
  {
    question: 'Qual meio de comunicação é bom para ensinar?',
    options: [
      { val: 'a', label: 'Celular' },
      { val: 'b', label: 'Livro' },
      { val: 'c', label: 'Carta' }
    ],
    answer: 'b'
  },
  {
    question: 'Qual meio de comunicação não é bom para informação rápida?',
    options: [
      { val: 'a', label: 'Celular' },
      { val: 'b', label: 'Livro' },
      { val: 'c', label: 'Rádio' }
    ],
    answer: 'b'
  },
  {
    question: 'Qual é um meio de comunicação escrito antigo?',
    options: [
      { val: 'a', label: 'Celular' },
      { val: 'b', label: 'Rádio' },
      { val: 'c', label: 'Carta' }
    ],
    answer: 'c'
  },
  {
    question: 'O rádio permite transmissão rápida?',
    options: [
      { val: 'a', label: 'Sim' },
      { val: 'b', label: 'Não' },
      { val: 'c', label: 'Apenas texto' }
    ],
    answer: 'a'
  },
  {
    question: 'Qual meio usa ondas para transmitir?',
    options: [
      { val: 'a', label: 'Livro' },
      { val: 'b', label: 'Rádio' },
      { val: 'c', label: 'Carta' }
    ],
    answer: 'b'
  },
  {
    question: 'O celular conecta pessoas instantaneamente?',
    options: [
      { val: 'a', label: 'Sim' },
      { val: 'b', label: 'Não' },
      { val: 'c', label: 'Apenas local' }
    ],
    answer: 'a'
  }
];

function genGrupo4() {
  const item = pick(DATA_GEOGRAFIA_GRUPO4);
  const correctOption = item.options.find(opt => opt.val === item.answer);
  return {
    cat: 'Geografia — Meios de comunicação',
    key: `GEO_G4:${item.question}`,
    answer: correctOption.label,
    display: `${item.question} <span class="blank"></span>`,
    options: shuffle(item.options.map(opt => ({ val: opt.label, label: opt.label }))),
    hint: 'Escolha a opção correta.'
  };
}

export const items = [
  { id: 'geo_g4', label: 'Meios de comunicação', fn: genGrupo4 }
];

export { genGrupo4 };