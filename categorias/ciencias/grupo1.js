// =================== Ciências - Grupo 1: Materiais naturais ===================
import { pick, shuffle } from '../utils.js';

const DATA_CIENCAS_GRUPO1 = [
  {
    question: 'A madeira vem de qual origem?',
    options: [
      { val: 'a', label: 'Planta' },
      { val: 'b', label: 'Fábrica' },
      { val: 'c', label: 'Pedreira' }
    ],
    answer: 'a'
  },
  {
    question: 'O algodão é um material...',
    options: [
      { val: 'a', label: 'Artificial' },
      { val: 'b', label: 'Natural' },
      { val: 'c', label: 'Metálico' }
    ],
    answer: 'b'
  },
  {
    question: 'O bambu é um material...',
    options: [
      { val: 'a', label: 'Natural' },
      { val: 'b', label: 'Sintético' },
      { val: 'c', label: 'Plástico' }
    ],
    answer: 'a'
  },
  {
    question: 'A lã vem de qual ser vivo?',
    options: [
      { val: 'a', label: 'Ovelha' },
      { val: 'b', label: 'Galinha' },
      { val: 'c', label: 'Peixe' }
    ],
    answer: 'a'
  },
  {
    question: 'O linho é usado para...',
    options: [
      { val: 'a', label: 'Fazer roupas' },
      { val: 'b', label: 'Fazer brinquedos' },
      { val: 'c', label: 'Fazer cabos elétricos' }
    ],
    answer: 'a'
  },
  {
    question: 'A areia é usada para...',
    options: [
      { val: 'a', label: 'Construir' },
      { val: 'b', label: 'Comer' },
      { val: 'c', label: 'Escrever' }
    ],
    answer: 'a'
  },
  {
    question: 'O cobre é um material...',
    options: [
      { val: 'a', label: 'Metálico natural' },
      { val: 'b', label: 'Plástico sintético' },
      { val: 'c', label: 'Artificial leve' }
    ],
    answer: 'a'
  },
  {
    question: 'O capim-dourado é um material...',
    options: [
      { val: 'a', label: 'Artificial' },
      { val: 'b', label: 'Natural' },
      { val: 'c', label: 'Metálico' }
    ],
    answer: 'b'
  }
];

function genGrupo1() {
  const item = pick(DATA_CIENCAS_GRUPO1);
  const correctOption = item.options.find(opt => opt.val === item.answer);
  return {
    cat: 'Ciências — Materiais naturais',
    key: `CIEN_G1:${item.question}`,
    answer: correctOption.label,
    display: `${item.question} <span class="blank"></span>`,
    options: shuffle(item.options.map(opt => ({ val: opt.label, label: opt.label }))),
    hint: 'Escolha a opção correta.'
  };
}

export const items = [
  { id: 'cien_g1', label: 'Materiais naturais', fn: genGrupo1 }
];

export { genGrupo1 };