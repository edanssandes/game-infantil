// =================== Geografia - Grupo 3: Regras e sinalização ===================
import { pick, shuffle } from '../utils.js';

const DATA_GEOGRAFIA_GRUPO3 = [
  {
    question: 'O que significa a luz vermelha no semáforo?',
    options: [
      { val: 'a', label: 'Pare' },
      { val: 'b', label: 'Atenção' },
      { val: 'c', label: 'Siga' }
    ],
    answer: 'a'
  },
  {
    question: 'O que significa a luz amarela no semáforo?',
    options: [
      { val: 'a', label: 'Pare' },
      { val: 'b', label: 'Atenção' },
      { val: 'c', label: 'Siga' }
    ],
    answer: 'b'
  },
  {
    question: 'O que significa a luz verde no semáforo?',
    options: [
      { val: 'a', label: 'Pare' },
      { val: 'b', label: 'Atenção' },
      { val: 'c', label: 'Siga' }
    ],
    answer: 'c'
  },
  {
    question: 'O que é obrigatório usar no carro?',
    options: [
      { val: 'a', label: 'Chapéu' },
      { val: 'b', label: 'Cinto de segurança' },
      { val: 'c', label: 'Óculos' }
    ],
    answer: 'b'
  },
  {
    question: 'O que os ônibus precisam ter para deficientes?',
    options: [
      { val: 'a', label: 'Rampas de acesso' },
      { val: 'b', label: 'Asas' },
      { val: 'c', label: 'Portas grandes' }
    ],
    answer: 'a'
  },
  {
    question: 'O que o ciclista sempre precisa usar?',
    options: [
      { val: 'a', label: 'Capacete' },
      { val: 'b', label: 'Relógio' },
      { val: 'c', label: 'Fone de Ouvido' }
    ],
    answer: 'a'
  },
  {
    question: 'Onde o pedestre deve cruzar a rua?',
    options: [
      { val: 'a', label: 'No meio da rua' },
      { val: 'b', label: 'Na faixa de segurança' },
      { val: 'c', label: 'Em qualquer lugar' }
    ],
    answer: 'b'
  },
  {
    question: 'Pra que servem calçadas rebaixadas?',
    options: [
      { val: 'a', label: 'Para acessibilidade' },
      { val: 'b', label: 'Para carros' },
      { val: 'c', label: 'Para animais' }
    ],
    answer: 'a'
  }
];

function genGrupo3() {
  const item = pick(DATA_GEOGRAFIA_GRUPO3);
  const correctOption = item.options.find(opt => opt.val === item.answer);
  return {
    cat: 'Geografia — Regras e sinalização',
    key: `GEO_G3:${item.question}`,
    answer: correctOption.label,
    display: `${item.question} <span class="blank"></span>`,
    options: shuffle(item.options.map(opt => ({ val: opt.label, label: opt.label }))),
    hint: 'Escolha a opção correta.'
  };
}

export const items = [
  { id: 'geo_g3', label: 'Regras e sinalização', fn: genGrupo3 }
];

export { genGrupo3 };