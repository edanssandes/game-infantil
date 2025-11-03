// =================== Ciências - Grupo 4: Uso e propriedades ===================
import { pick, shuffle } from '../utils.js';

const DATA_CIENCAS_GRUPO4 = [
  {
    question: 'O vidro é usado porque é...',
    options: [
      { val: 'a', label: 'Transparente' },
      { val: 'b', label: 'Flexível' },
      { val: 'c', label: 'Macio' }
    ],
    answer: 'a'
  },
  {
    question: 'O plástico é...',
    options: [
      { val: 'a', label: 'Leve' },
      { val: 'b', label: 'Cortante' },
      { val: 'c', label: 'Pesado' }
    ],
    answer: 'a'
  },
  {
    question: 'O metal é usado em panelas porque...',
    options: [
      { val: 'a', label: 'Conduz calor' },
      { val: 'b', label: 'É transparente' },
      { val: 'c', label: 'É leve demais' }
    ],
    answer: 'a'
  },
  {
    question: 'O cabo da panela é de plástico para...',
    options: [
      { val: 'a', label: 'Evitar queimaduras' },
      { val: 'b', label: 'Ficar bonito' },
      { val: 'c', label: 'Esfriar a comida' }
    ],
    answer: 'a'
  },
  {
    question: 'O aço é...',
    options: [
      { val: 'a', label: 'Duro e resistente' },
      { val: 'b', label: 'Leve e macio' },
      { val: 'c', label: 'Transparente' }
    ],
    answer: 'a'
  },
  {
    question: 'O vidro conserva os alimentos porque...',
    options: [
      { val: 'a', label: 'Não reage com eles' },
      { val: 'b', label: 'É poroso' },
      { val: 'c', label: 'É leve demais' }
    ],
    answer: 'a'
  },
  {
    question: 'O plástico é bom porque...',
    options: [
      { val: 'a', label: 'Não conduz calor' },
      { val: 'b', label: 'Conduz eletricidade' },
      { val: 'c', label: 'É pesado' }
    ],
    answer: 'a'
  },
  {
    question: 'O papelão é bom para...',
    options: [
      { val: 'a', label: 'Embalar alimentos' },
      { val: 'b', label: 'Aquecer líquidos' },
      { val: 'c', label: 'Cortar tecidos' }
    ],
    answer: 'a'
  }
];

function genGrupo4() {
  const item = pick(DATA_CIENCAS_GRUPO4);
  const correctOption = item.options.find(opt => opt.val === item.answer);
  return {
    cat: 'Ciências — Uso e propriedades',
    key: `CIEN_G4:${item.question}`,
    answer: correctOption.label,
    display: `${item.question} <span class="blank"></span>`,
    options: shuffle(item.options.map(opt => ({ val: opt.label, label: opt.label }))),
    hint: 'Escolha a opção correta.'
  };
}

export const items = [
  { id: 'cien_g4', label: 'Uso e propriedades', fn: genGrupo4 }
];

export { genGrupo4 };