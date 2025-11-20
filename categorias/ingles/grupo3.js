// =================== Inglês - Grupo 3: Picnick time ===================
import { pick, shuffle } from '../utils.js';

const DATA_INGLES_GRUPO3 = [
  {
    question: 'Which is a drink?',
    options: [
      { val: 'a', label: 'Milk' },
      { val: 'b', label: 'Chicken' },
      { val: 'c', label: 'Rice' }
    ],
    answer: 'a'
  },
  {
    question: 'Which is meat?',
    options: [
      { val: 'a', label: 'Chicken' },
      { val: 'b', label: 'Salad' },
      { val: 'c', label: 'Pasta' }
    ],
    answer: 'a'
  },
  {
    question: 'Which is a vegetable dish?',
    options: [
      { val: 'a', label: 'Salad' },
      { val: 'b', label: 'Cheese' },
      { val: 'c', label: 'Ice cream' }
    ],
    answer: 'a'
  },
  {
    question: 'Which is sweet?',
    options: [
      { val: 'a', label: 'Candy' },
      { val: 'b', label: 'Rice' },
      { val: 'c', label: 'Water' }
    ],
    answer: 'a'
  },
  {
    question: 'Which is dairy?',
    options: [
      { val: 'a', label: 'Cheese' },
      { val: 'b', label: 'Fries' },
      { val: 'c', label: 'Pasta' }
    ],
    answer: 'a'
  },
  {
    question: 'Which is frozen?',
    options: [
      { val: 'a', label: 'Ice cream' },
      { val: 'b', label: 'Milk' },
      { val: 'c', label: 'Chicken' }
    ],
    answer: 'a'
  },
  {
    question: 'Which is fried?',
    options: [
      { val: 'a', label: 'Fries' },
      { val: 'b', label: 'Rice' },
      { val: 'c', label: 'Water' }
    ],
    answer: 'a'
  },
  {
    question: 'Which is a grain?',
    options: [
      { val: 'a', label: 'Rice' },
      { val: 'b', label: 'Candy' },
      { val: 'c', label: 'Cheese' }
    ],
    answer: 'a'
  }
];

function genGrupo3() {
  const item = pick(DATA_INGLES_GRUPO3);
  const correctOption = item.options.find(opt => opt.val === item.answer);
  return {
    cat: 'Inglês — Picnick time',
    key: `ING_G3:${item.question}`,
    answer: correctOption.label,
    display: `${item.question} <span class="blank"></span>`,
    options: shuffle(item.options.map(opt => ({ val: opt.label, label: opt.label }))),
    hint: 'Choose the correct food.'
  };
}

export const items = [
  { id: 'ing_g3', label: 'Picnick time', fn: genGrupo3 }
];

export { genGrupo3 };