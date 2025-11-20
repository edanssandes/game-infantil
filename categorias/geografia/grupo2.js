// =================== Geografia - Grupo 2: Vias de circulação ===================
import { pick, shuffle } from '../utils.js';

const DATA_GEOGRAFIA_GRUPO2 = [
  {
    question: 'De que os carros dependem para circular?',
    options: [
      { val: 'a', label: 'Ruas' },
      { val: 'b', label: 'Trilhos' },
      { val: 'c', label: 'Rotas aquáticas' }
    ],
    answer: 'a'
  },
  {
    question: 'De que o trem depende para circular?',
    options: [
      { val: 'a', label: 'Ruas' },
      { val: 'b', label: 'Trilhos' },
      { val: 'c', label: 'Rotas aéreas' }
    ],
    answer: 'b'
  },
  {
    question: 'De que os navios precisam?',
    options: [
      { val: 'a', label: 'Trilhos' },
      { val: 'b', label: 'Rotas' },
      { val: 'c', label: 'Ruas' }
    ],
    answer: 'b'
  },
  {
    question: 'De que os aviões precisam?',
    options: [
      { val: 'a', label: 'Trilhos' },
      { val: 'b', label: 'Rotas' },
      { val: 'c', label: 'Ruas' }
    ],
    answer: 'b'
  },
  {
    question: 'O que permite que meios de transporte terrestres cruzem rios?',
    options: [
      { val: 'a', label: 'Túnel' },
      { val: 'b', label: 'Ponte' },
      { val: 'c', label: 'Rota' }
    ],
    answer: 'b'
  },
  {
    question: 'Pontes permitem cruzar lagos e até o mar?',
    options: [
      { val: 'a', label: 'Sim' },
      { val: 'b', label: 'Não' },
      { val: 'c', label: 'Apenas rios' }
    ],
    answer: 'a'
  },
  {
    question: 'Qual via é usada por carros?',
    options: [
      { val: 'a', label: 'Trilho' },
      { val: 'b', label: 'Rua' },
      { val: 'c', label: 'Rota marítima' }
    ],
    answer: 'b'
  },
  {
    question: 'Qual via é usada por aviões?',
    options: [
      { val: 'a', label: 'Rua' },
      { val: 'b', label: 'Trilho' },
      { val: 'c', label: 'Rota aérea' }
    ],
    answer: 'c'
  }
];

function genGrupo2() {
  const item = pick(DATA_GEOGRAFIA_GRUPO2);
  const correctOption = item.options.find(opt => opt.val === item.answer);
  return {
    cat: 'Geografia — Vias de circulação',
    key: `GEO_G2:${item.question}`,
    answer: correctOption.label,
    display: `${item.question} <span class="blank"></span>`,
    options: shuffle(item.options.map(opt => ({ val: opt.label, label: opt.label }))),
    hint: 'Escolha a opção correta.'
  };
}

export const items = [
  { id: 'geo_g2', label: 'Vias de circulação', fn: genGrupo2 }
];

export { genGrupo2 };