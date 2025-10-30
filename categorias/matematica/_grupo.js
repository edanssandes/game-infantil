// =================== Grupo Matemática ===================
import { items as somaItems } from './soma.js';
import { items as subtracaoItems } from './subtracao.js';
import { items as multiplicacaoItems } from './multiplicacao.js';

export const items = [
  ...somaItems,
  ...subtracaoItems,
  ...multiplicacaoItems
];