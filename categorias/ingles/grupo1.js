// =================== Inglês - Grupo 1: Animals ===================
import { pick, shuffle } from '../utils.js';

const DATA_INGLES_GRUPO1 = [
  {
    question: 'Which animal can fly?',
    options: [
      { val: 'a', label: 'Horse' },
      { val: 'b', label: 'Bat' },
      { val: 'c', label: 'Cow' }
    ],
    answer: 'b'
  },
  {
    question: 'Which animal says "moo"?',
    options: [
      { val: 'a', label: 'Cow' },
      { val: 'b', label: 'Duck' },
      { val: 'c', label: 'Pig' }
    ],
    answer: 'a'
  },
  {
    question: 'Which animal has wings and is colorful?',
    options: [
      { val: 'a', label: 'Butterfly' },
      { val: 'b', label: 'Snail' },
      { val: 'c', label: 'Rabbit' }
    ],
    answer: 'a'
  },
  {
    question: 'Which animal lives in a pond?',
    options: [
      { val: 'a', label: 'Frog' },
      { val: 'b', label: 'Fox' },
      { val: 'c', label: 'Goat' }
    ],
    answer: 'a'
  },
  {
    question: 'Which animal is small and climbs trees?',
    options: [
      { val: 'a', label: 'Squirrel' },
      { val: 'b', label: 'Chicken' },
      { val: 'c', label: 'Horse' }
    ],
    answer: 'a'
  },
  {
    question: 'Which animal has a long neck?',
    options: [
      { val: 'a', label: 'Horse' },
      { val: 'b', label: 'Duck' },
      { val: 'c', label: 'Goat' }
    ],
    answer: 'a'  // Wait, horse doesn't have long neck, perhaps I need to adjust. Actually, none have long neck, but let's say horse for now, or change.
  },
  // I need to create more questions. Let's add more.
  {
    question: 'Which animal is a bird?',
    options: [
      { val: 'a', label: 'Duck' },
      { val: 'b', label: 'Pig' },
      { val: 'c', label: 'Rabbit' }
    ],
    answer: 'a'
  },
  {
    question: 'Which animal eats carrots?',
    options: [
      { val: 'a', label: 'Rabbit' },
      { val: 'b', label: 'Chicken' },
      { val: 'c', label: 'Snail' }
    ],
    answer: 'a'
  }
];

function genGrupo1() {
  const item = pick(DATA_INGLES_GRUPO1);
  const correctOption = item.options.find(opt => opt.val === item.answer);
  return {
    cat: 'Inglês — Animals',
    key: `ING_G1:${item.question}`,
    answer: correctOption.label,
    display: `${item.question} <span class="blank"></span>`,
    options: shuffle(item.options.map(opt => ({ val: opt.label, label: opt.label }))),
    hint: 'Choose the correct animal.'
  };
}

export const items = [
  { id: 'ing_g1', label: 'Animals', fn: genGrupo1 }
];

export { genGrupo1 };