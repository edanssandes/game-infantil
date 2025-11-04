// =================== Ciências - Grupo 6: Comparações e transformações ===================
import { pick, shuffle } from '../utils.js';

const DATA_CIENCAS_GRUPO6 = [
  {
    question: 'As garrafas eram de...',
    options: [
      { val: 'a', label: 'Vidro' },
      { val: 'b', label: 'Madeira' },
      { val: 'c', label: 'Tecido' }
    ],
    answer: 'a'
  },
  {
    question: 'Hoje as garrafas são de...',
    options: [
      { val: 'a', label: 'Plástico' },
      { val: 'b', label: 'Alumínio' },
      { val: 'c', label: 'Papel' }
    ],
    answer: 'a'
  },
  {
    question: 'Os brinquedos eram de...',
    options: [
      { val: 'a', label: 'Madeira' },
      { val: 'b', label: 'Plástico' },
      { val: 'c', label: 'Ferro' }
    ],
    answer: 'a'
  },
  {
    question: 'As janelas antigas eram de...',
    options: [
      { val: 'a', label: 'Madeira' },
      { val: 'b', label: 'Alumínio' },
      { val: 'c', label: 'Cimento' }
    ],
    answer: 'a'
  },
  {
    question: 'As janelas atuais são de...',
    options: [
      { val: 'a', label: 'Alumínio' },
      { val: 'b', label: 'Plástico' },
      { val: 'c', label: 'Tecido' }
    ],
    answer: 'a'
  },
  {
    question: 'Os sacos antigos eram de...',
    options: [
      { val: 'a', label: 'Papel' },
      { val: 'b', label: 'Plástico' },
      { val: 'c', label: 'Vidro' }
    ],
    answer: 'a'
  },
  {
    question: 'Os sacos atuais são de...',
    options: [
      { val: 'a', label: 'Plástico' },
      { val: 'b', label: 'Pedra' },
      { val: 'c', label: 'Madeira' }
    ],
    answer: 'a'
  },
  {
    question: 'O aquário é feito de...',
    options: [
      { val: 'a', label: 'Vidro' },
      { val: 'b', label: 'Metal' },
      { val: 'c', label: 'Papel' }
    ],
    answer: 'a'
  }
];

function genGrupo6() {
  const item = pick(DATA_CIENCAS_GRUPO6);
  const correctOption = item.options.find(opt => opt.val === item.answer);
  return {
    cat: 'Ciências — Comparações e transformações',
    key: `CIEN_G6:${item.question}`,
    answer: correctOption.label,
    display: `${item.question} <span class="blank"></span>`,
    options: shuffle(item.options.map(opt => ({ val: opt.label, label: opt.label }))),
    hint: 'Escolha a opção correta.'
  };
}

export const items = [
  { id: 'cien_g6', label: 'Comparações e transformações', fn: genGrupo6 }
];

export { genGrupo6 };