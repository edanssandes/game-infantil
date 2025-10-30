// =================== Agregador Geral de Categorias ===================
import { items as matematicaItems } from './matematica/_grupo.js';
import { items as financasItems } from './financas/_grupo.js';
import { items as portuguesItems } from './portugues/_grupo.js';
import { items as tempoItems } from './tempo/_grupo.js';

export const GROUPS = [
  {
    id: 'grp_mat',
    label: 'Matemática',
    subgroups: [
      { id: 'sub_mat_soma', label: 'Soma', items: matematicaItems.slice(0, 8) }, // primeiros 8 items são de soma
      { id: 'sub_mat_sub', label: 'Subtração', items: matematicaItems.slice(8, 10) }, // próximos 2
      { id: 'sub_mat_mult', label: 'Multiplicação', items: matematicaItems.slice(10) } // resto
    ]
  },
  {
    id: 'grp_fin',
    label: 'Educação Financeira',
    subgroups: [
      { id: 'sub_fin_all', label: 'Exercícios', items: financasItems }
    ]
  },
  {
    id: 'grp_pt',
    label: 'Português',
    subgroups: [
      { id: 'sub_pt_ort', label: 'Ortografia', items: portuguesItems.slice(0, 2) },
      { id: 'sub_pt_cat', label: 'Categorias', items: portuguesItems.slice(2) }
    ]
  },
  {
    id: 'grp_tempo',
    label: 'Tempo',
    subgroups: [
      { id: 'sub_tempo_all', label: 'Exercícios', items: tempoItems }
    ]
  }
];