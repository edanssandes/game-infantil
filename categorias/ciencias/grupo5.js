// =================== Ciências - Grupo 5: Segurança e prevenção ===================
import { pick, shuffle } from '../utils.js';

const DATA_CIENCAS_GRUPO5 = [
  {
    question: 'A faca deve ser usada...',
    options: [
      { val: 'a', label: 'Com um adulto' },
      { val: 'b', label: 'Sozinho' }
    ],
    answer: 'a'
  },
  {
    question: 'As panelas quentes devem ser manuseadas com...',
    options: [
      { val: 'a', label: 'Luvas térmicas' },
      { val: 'b', label: 'Sem proteção' }
    ],
    answer: 'a'
  },
  {
    question: 'Os produtos de limpeza devem ficar...',
    options: [
      { val: 'a', label: 'Fora do alcance' },
      { val: 'b', label: 'No chão' }
    ],
    answer: 'a'
  },
  {
    question: 'Medicamentos devem ser...',
    options: [
      { val: 'a', label: 'Guardados com cuidado' },
      { val: 'b', label: 'Brincadeira de criança' }
    ],
    answer: 'a'
  },
  {
    question: 'Aparelhos elétricos exigem...',
    options: [
      { val: 'a', label: 'Cuidado' },
      { val: 'b', label: 'Brincadeira' }
    ],
    answer: 'a'
  },
  {
    question: 'Na dúvida sobre segurança, pergunte a...',
    options: [
      { val: 'a', label: 'Um adulto' },
      { val: 'b', label: 'Um amigo de 4 anos' }
    ],
    answer: 'a'
  },
  {
    question: 'Evite choque usando...',
    options: [
      { val: 'a', label: 'Protetores de tomada' },
      { val: 'b', label: 'Tesoura de metal' }
    ],
    answer: 'a'
  },
  {
    question: 'Objetos cortantes são...',
    options: [
      { val: 'a', label: 'Perigosos' },
      { val: 'b', label: 'Inofensivos' }
    ],
    answer: 'a'
  }
];

function genGrupo5() {
  const item = pick(DATA_CIENCAS_GRUPO5);
  const correctOption = item.options.find(opt => opt.val === item.answer);
  return {
    cat: 'Ciências — Segurança e prevenção',
    key: `CIEN_G5:${item.question}`,
    answer: correctOption.label,
    display: `${item.question} <span class="blank"></span>`,
    options: shuffle(item.options.map(opt => ({ val: opt.label, label: opt.label }))),
    hint: 'Escolha a opção correta.'
  };
}

export const items = [
  { id: 'cien_g5', label: 'Segurança e prevenção', fn: genGrupo5 }
];

export { genGrupo5 };