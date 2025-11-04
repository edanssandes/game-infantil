// =================== Ciências - Grupo 2: Materiais artificiais ===================
import { pick, shuffle } from '../utils.js';

const DATA_CIENCAS_GRUPO2 = [
  {
    question: 'O plástico é um material...',
    options: [
      { val: 'a', label: 'Natural' },
      { val: 'b', label: 'Artificial' },
      { val: 'c', label: 'Vegetal' }
    ],
    answer: 'b'
  },
  {
    question: 'O silicone é usado em...',
    options: [
      { val: 'a', label: 'Copos e moldes' },
      { val: 'b', label: 'Tecidos e lã' },
      { val: 'c', label: 'Rochas e areia' }
    ],
    answer: 'a'
  },
  {
    question: 'O poliéster é encontrado em...',
    options: [
      { val: 'a', label: 'Tecidos' },
      { val: 'b', label: 'Vidros' },
      { val: 'c', label: 'Metais' }
    ],
    answer: 'a'
  },
  {
    question: 'O nailon é um tipo de...',
    options: [
      { val: 'a', label: 'Tecido sintético' },
      { val: 'b', label: 'Madeira leve' },
      { val: 'c', label: 'Fibra natural' }
    ],
    answer: 'a'
  },
  {
    question: 'O grafite do lápis é um...',
    options: [
      { val: 'a', label: 'Material sintético' },
      { val: 'b', label: 'Metal natural' },
      { val: 'c', label: 'Mineral precioso' }
    ],
    answer: 'a'
  },
  {
    question: 'O vidro é considerado...',
    options: [
      { val: 'a', label: 'Artificial' },
      { val: 'b', label: 'Natural' },
      { val: 'c', label: 'Animal' }
    ],
    answer: 'a'
  },
  {
    question: 'O aço é feito de...',
    options: [
      { val: 'a', label: 'Ferro' },
      { val: 'b', label: 'Areia' },
      { val: 'c', label: 'Madeira' }
    ],
    answer: 'a'
  },
  {
    question: 'O papel é feito da ...',
    options: [
      { val: 'a', label: 'Madeira' },
      { val: 'b', label: 'Plástico' },
      { val: 'c', label: 'Vidro' }
    ],
    answer: 'a'
  }
];

function genGrupo2() {
  const item = pick(DATA_CIENCAS_GRUPO2);
  const correctOption = item.options.find(opt => opt.val === item.answer);
  return {
    cat: 'Ciências — Materiais artificiais',
    key: `CIEN_G2:${item.question}`,
    answer: correctOption.label,
    display: `${item.question} <span class="blank"></span>`,
    options: shuffle(item.options.map(opt => ({ val: opt.label, label: opt.label }))),
    hint: 'Escolha a opção correta.'
  };
}

export const items = [
  { id: 'cien_g2', label: 'Materiais artificiais', fn: genGrupo2 }
];

export { genGrupo2 };