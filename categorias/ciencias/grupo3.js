// =================== Ciências - Grupo 3: Correspondência material/objeto ===================
import { pick, shuffle } from '../utils.js';

const DATA_CIENCAS_GRUPO3 = [
  {
    question: 'A colher é de...',
    options: [
      { val: 'a', label: 'Plástico' },
      { val: 'b', label: 'Tecido' }
    ],
    answer: 'a'
  },
  {
    question: 'O lápis é de...',
    options: [
      { val: 'a', label: 'Madeira' },
      { val: 'b', label: 'Metal' }
    ],
    answer: 'a'
  },
  {
    question: 'O caderno é de...',
    options: [
      { val: 'a', label: 'Papel' },
      { val: 'b', label: 'Vidro' }
    ],
    answer: 'a'
  },
  {
    question: 'A régua é de...',
    options: [
      { val: 'a', label: 'Plástico' },
      { val: 'b', label: 'Tecido' }
    ],
    answer: 'a'
  },
  {
    question: 'O clipe é de...',
    options: [
      { val: 'a', label: 'Metal' },
      { val: 'b', label: 'Borracha' }
    ],
    answer: 'a'
  },
  {
    question: 'O grampeador é de...',
    options: [
      { val: 'a', label: 'Metal' },
      { val: 'b', label: 'Tecido' }
    ],
    answer: 'a'
  },
  {
    question: 'A mochila é de...',
    options: [
      { val: 'a', label: 'Tecido' },
      { val: 'b', label: 'Vidro' }
    ],
    answer: 'a'
  },
  {
    question: 'A canetinha é de...',
    options: [
      { val: 'a', label: 'Plástico' },
      { val: 'b', label: 'Areia' }
    ],
    answer: 'a'
  }
];

function genGrupo3() {
  const item = pick(DATA_CIENCAS_GRUPO3);
  const correctOption = item.options.find(opt => opt.val === item.answer);
  return {
    cat: 'Ciências — Correspondência material/objeto',
    key: `CIEN_G3:${item.question}`,
    answer: correctOption.label,
    display: `${item.question} <span class="blank"></span>`,
    options: shuffle(item.options.map(opt => ({ val: opt.label, label: opt.label }))),
    hint: 'Escolha a opção correta.'
  };
}

export const items = [
  { id: 'cien_g3', label: 'Correspondência material/objeto', fn: genGrupo3 }
];

export { genGrupo3 };