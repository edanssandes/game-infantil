// =================== Agregador Geral de Categorias ===================
import { items as matematicaItems } from './matematica/_grupo.js';
import { items as financasItems } from './financas/_grupo.js';
import { items as portuguesItems } from './portugues/_grupo.js';
import { items as tempoItems } from './tempo/_grupo.js';
import { items as cienciasItems } from './ciencias/_grupo.js';
import { items as inglesItems } from './ingles/_grupo.js';
import { items as geografiaItems } from './geografia/_grupo.js';

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
  },
  {
    id: 'grp_cien',
    label: 'Ciências',
    subgroups: [
      { id: 'sub_cien_g1', label: 'Materiais naturais', items: cienciasItems.slice(0, 1) },
      { id: 'sub_cien_g2', label: 'Materiais artificiais', items: cienciasItems.slice(1, 2) },
      { id: 'sub_cien_g3', label: 'Correspondência material/objeto', items: cienciasItems.slice(2, 3) },
      { id: 'sub_cien_g4', label: 'Uso e propriedades', items: cienciasItems.slice(3, 4) },
      { id: 'sub_cien_g5', label: 'Segurança e prevenção', items: cienciasItems.slice(4, 5) },
      { id: 'sub_cien_g6', label: 'Comparações e transformações', items: cienciasItems.slice(5) }
    ]
  },
  {
    id: 'grp_ing',
    label: 'Inglês',
    subgroups: [
      { id: 'sub_ing_animals', label: 'Animals', items: inglesItems.slice(0, 1) },
      { id: 'sub_ing_can', label: 'yes, it can/No it can\'t', items: inglesItems.slice(1, 2) },
      { id: 'sub_ing_picnic', label: 'Picnick time', items: inglesItems.slice(2, 3) },
      { id: 'sub_ing_verbs', label: 'Verbos', items: inglesItems.slice(3) }
    ]
  },
  {
    id: 'grp_geo',
    label: 'Geografia',
    subgroups: [
      { id: 'sub_geo_g1', label: 'Meios de transporte', items: geografiaItems.slice(0, 1) },
      { id: 'sub_geo_g2', label: 'Vias de circulação', items: geografiaItems.slice(1, 2) },
      { id: 'sub_geo_g3', label: 'Regras e sinalização', items: geografiaItems.slice(2, 3) },
      { id: 'sub_geo_g4', label: 'Meios de comunicação', items: geografiaItems.slice(3, 4) },
      { id: 'sub_geo_g5', label: 'Conectando pessoas e lugares', items: geografiaItems.slice(4, 5) },
      { id: 'sub_geo_g6', label: 'Comunicação vs. Transporte', items: geografiaItems.slice(5) }
    ]
  }
];