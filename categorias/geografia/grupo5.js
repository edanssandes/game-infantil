// =================== Geografia - Grupo 5: Conectando pessoas e lugares ===================
import { pick, shuffle } from '../utils.js';

const DATA_GEOGRAFIA_GRUPO5 = [
  {
    question: 'O celular conecta pessoas em lugares distantes?',
    options: [
      { val: 'a', label: 'Sim' },
      { val: 'b', label: 'Não' },
      { val: 'c', label: 'Apenas locais' }
    ],
    answer: 'a'
  },
  {
    question: 'Por que não podemos usar celular por muito tempo?',
    options: [
      { val: 'a', label: 'Dá choque' },
      { val: 'b', label: 'Pode fazer mal à saúde' },
      { val: 'c', label: 'Não conecta' }
    ],
    answer: 'b'
  },
  {
    question: 'O rádio conecta pessoas em tempo real?',
    options: [
      { val: 'a', label: 'Sim' },
      { val: 'b', label: 'Não' },
      { val: 'c', label: 'Apenas texto' }
    ],
    answer: 'a'
  },
  {
    question: 'Livros conectam pessoas através de quê?',
    options: [
      { val: 'a', label: 'Conhecimento' },
      { val: 'b', label: 'Velocidade' },
      { val: 'c', label: 'Som' }
    ],
    answer: 'a'
  },
  {
    question: 'Cartas conectam pessoas lentamente?',
    options: [
      { val: 'a', label: 'Sim' },
      { val: 'b', label: 'Não' },
      { val: 'c', label: 'Instantâneo' }
    ],
    answer: 'a'
  },
  {
    question: 'Qual meio conecta lugares sem movimento físico?',
    options: [
      { val: 'a', label: 'Carro' },
      { val: 'b', label: 'Celular' },
      { val: 'c', label: 'Navio' }
    ],
    answer: 'b'
  },
  {
    question: 'Comunicação instantânea conecta pessoas rapidamente?',
    options: [
      { val: 'a', label: 'Sim' },
      { val: 'b', label: 'Não' },
      { val: 'c', label: 'Apenas locais' }
    ],
    answer: 'a'
  },
  {
    question: 'Usar celular demais pode ser prejudicial?',
    options: [
      { val: 'a', label: 'Sim' },
      { val: 'b', label: 'Não' },
      { val: 'c', label: 'Sempre bom' }
    ],
    answer: 'a'
  }
];

function genGrupo5() {
  const item = pick(DATA_GEOGRAFIA_GRUPO5);
  const correctOption = item.options.find(opt => opt.val === item.answer);
  return {
    cat: 'Geografia — Conectando pessoas e lugares',
    key: `GEO_G5:${item.question}`,
    answer: correctOption.label,
    display: `${item.question} <span class="blank"></span>`,
    options: shuffle(item.options.map(opt => ({ val: opt.label, label: opt.label }))),
    hint: 'Escolha a opção correta.'
  };
}

export const items = [
  { id: 'geo_g5', label: 'Conectando pessoas e lugares', fn: genGrupo5 }
];

export { genGrupo5 };