// =================== Inglês - Grupo 4: Verbos ===================
import { pick, shuffle } from '../utils.js';

const DATA_INGLES_GRUPO4 = [
  {
    question: 'What do you do in the kitchen?',
    options: [
      { val: 'a', label: 'Cook' },
      { val: 'b', label: 'Climb' },
      { val: 'c', label: 'Swim' }
    ],
    answer: 'a'
  },
  {
    question: 'What do you do on a tree?',
    options: [
      { val: 'a', label: 'Climb' },
      { val: 'b', label: 'Dance' },
      { val: 'c', label: 'Sing' }
    ],
    answer: 'a'
  },
  {
    question: 'What do you do at a party?',
    options: [
      { val: 'a', label: 'Dance' },
      { val: 'b', label: 'Catch' },
      { val: 'c', label: 'Dive' }
    ],
    answer: 'a'
  },
  {
    question: 'What do you do with a ball?',
    options: [
      { val: 'a', label: 'Catch' },
      { val: 'b', label: 'Cook' },
      { val: 'c', label: 'Fly' }
    ],
    answer: 'a'
  },
  {
    question: 'What do you do in water?',
    options: [
      { val: 'a', label: 'Swim' },
      { val: 'b', label: 'Climb' },
      { val: 'c', label: 'Dance' }
    ],
    answer: 'a'
  },
  {
    question: 'What do you do with your voice?',
    options: [
      { val: 'a', label: 'Sing' },
      { val: 'b', label: 'Dive' },
      { val: 'c', label: 'Catch' }
    ],
    answer: 'a'
  },
  {
    question: 'What do you do from a height?',
    options: [
      { val: 'a', label: 'Dive' },
      { val: 'b', label: 'Cook' },
      { val: 'c', label: 'Swim' }
    ],
    answer: 'a'
  },
  {
    question: 'What do birds do?',
    options: [
      { val: 'a', label: 'Fly' },
      { val: 'b', label: 'Sing' },
      { val: 'c', label: 'Climb' }
    ],
    answer: 'a'
  }
];

function genGrupo4() {
  const item = pick(DATA_INGLES_GRUPO4);
  const correctOption = item.options.find(opt => opt.val === item.answer);
  return {
    cat: 'Inglês — Verbos',
    key: `ING_G4:${item.question}`,
    answer: correctOption.label,
    display: `${item.question} <span class="blank"></span>`,
    options: shuffle(item.options.map(opt => ({ val: opt.label, label: opt.label }))),
    hint: 'Choose the correct verb.'
  };
}

export const items = [
  { id: 'ing_g4', label: 'Verbos', fn: genGrupo4 }
];

export { genGrupo4 };