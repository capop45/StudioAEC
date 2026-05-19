export interface Testimonial {
  id: string;
  quote: string;
  name: string;
  role: string;
  initials: string;
}

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 't1',
    quote:
      'Saí de planilhas e CAD soltos para um fluxo BIM federado em três meses. Os templates são o que mais economiza tempo no dia a dia.',
    name: 'Camila Reis',
    role: 'Arquiteta · Escritório Reis+Souza',
    initials: 'CR'
  },
  {
    id: 't2',
    quote:
      'O nível de detalhe das famílias e a forma como o curso estrutura as disciplinas mudou o nosso padrão de entrega.',
    name: 'André Vilela',
    role: 'Coordenador BIM · Construtora Vilas',
    initials: 'AV'
  },
  {
    id: 't3',
    quote:
      'Compatibilização hidráulica + estrutural deixou de ser sofrimento. Recomendo para qualquer escritório que está migrando para BIM.',
    name: 'Patrícia Lima',
    role: 'Engenheira civil · ProjetaPL',
    initials: 'PL'
  }
];
