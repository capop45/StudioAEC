export interface BimDimension {
  id: string;
  number: string;
  letter: string;
  title: string;
  description: string;
  image: string;
}

export const BIM_DIMENSIONS: BimDimension[] = [
  {
    id: '3d',
    number: '3',
    letter: 'D',
    title: 'Modelagem',
    description: 'Geometria, famílias e parâmetros que organizam o projeto em um modelo único e consultável.',
    image: '/images/dimensions/3d.png'
  },
  {
    id: '4d',
    number: '4',
    letter: 'D',
    title: 'Tempo',
    description: 'Cronograma integrado ao modelo — simule etapas construtivas e o sequenciamento da obra.',
    image: '/images/dimensions/4d.png'
  },
  {
    id: '5d',
    number: '5',
    letter: 'D',
    title: 'Custos',
    description: 'Quantitativos extraídos do modelo viram orçamento auditável e atualizado em tempo real.',
    image: '/images/dimensions/5d.png'
  },
  {
    id: '6d',
    number: '6',
    letter: 'D',
    title: 'Sustentabilidade',
    description: 'Análises de desempenho energético, conforto e seleção de materiais com baixo impacto.',
    image: '/images/dimensions/6d.png'
  },
  {
    id: '7d',
    number: '7',
    letter: 'D',
    title: 'Operação',
    description: 'O modelo "as-built" alimenta a manutenção predial e o ciclo de vida do empreendimento.',
    image: '/images/dimensions/7d.png'
  }
];
