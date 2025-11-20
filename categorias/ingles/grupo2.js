// =================== Inglês - Grupo 2: yes, it can/No it can't ===================
import { pick, shuffle } from '../utils.js';

const DATA_INGLES_GRUPO2 = [
  {
    question: 'Can a fish fly?',
    options: [
      { val: 'a', label: 'Yes, it can' },
      { val: 'b', label: 'No, it can\'t' },
      { val: 'c', label: 'Maybe' }
    ],
    answer: 'b'
  },
  {
    question: 'Can a frog sing?',
    options: [
      { val: 'a', label: 'Yes, it can' },
      { val: 'b', label: 'No, it can\'t' },
      { val: 'c', label: 'Maybe' }
    ],
    answer: 'b'
  },
  {
    question: 'Can a squirrel climb?',
    options: [
      { val: 'a', label: 'Yes, it can' },
      { val: 'b', label: 'No, it can\'t' },
      { val: 'c', label: 'Maybe' }
    ],
    answer: 'a'
  },
  {
    question: 'Can a chicken dance?',
    options: [
      { val: 'a', label: 'Yes, it can' },
      { val: 'b', label: 'No, it can\'t' },
      { val: 'c', label: 'Maybe' }
    ],
    answer: 'b'
  },
  {
    question: 'Can a fish swim?',
    options: [
      { val: 'a', label: 'Yes, it can' },
      { val: 'b', label: 'No, it can\'t' },
      { val: 'c', label: 'Maybe' }
    ],
    answer: 'a'
  },
  {
    question: 'Can a bat fly?',
    options: [
      { val: 'a', label: 'Yes, it can' },
      { val: 'b', label: 'No, it can\'t' },
      { val: 'c', label: 'Maybe' }
    ],
    answer: 'a'
  },
  {
    question: 'Can a horse run?',
    options: [
      { val: 'a', label: 'Yes, it can' },
      { val: 'b', label: 'No, it can\'t' },
      { val: 'c', label: 'Maybe' }
    ],
    answer: 'a'
  },
  {
    question: 'Can a snail jump?',
    options: [
      { val: 'a', label: 'Yes, it can' },
      { val: 'b', label: 'No, it can\'t' },
      { val: 'c', label: 'Maybe' }
    ],
    answer: 'b'
  }
];

function genGrupo2() {
  const item = pick(DATA_INGLES_GRUPO2);
  const correctOption = item.options.find(opt => opt.val === item.answer);
  return {
    cat: 'Inglês — yes, it can/No it can\'t',
    key: `ING_G2:${item.question}`,
    answer: correctOption.label,
    display: `${item.question} <span class="blank"></span>`,
    options: shuffle(item.options.map(opt => ({ val: opt.label, label: opt.label }))),
    hint: 'Choose yes or no.'
  };
}

export const items = [
  { id: 'ing_g2', label: 'yes, it can/No it can\'t', fn: genGrupo2 }
];

export { genGrupo2 };