export interface TimelineEntry {
  year: string;
  title: string;
  description: string;
}

export const ABOUT_TIMELINE: TimelineEntry[] = [
  {
    year: '2010',
    title: 'Primeiros projetos em BIM',
    description: 'Início da migração de CAD 2D para Revit em projetos residenciais de pequeno porte.'
  },
  {
    year: '2014',
    title: 'Estruturação do escritório',
    description: 'Atuação completa em edifícios verticalizados com modelagem multidisciplinar federada.'
  },
  {
    year: '2018',
    title: 'Treinamentos corporativos',
    description: 'Capacitação de equipes de escritórios e construtoras na metodologia BIM aplicada à obra.'
  },
  {
    year: '2021',
    title: 'Plataforma online',
    description: 'Lançamento do hub digital com trilhas estruturadas, bibliotecas e templates revisados continuamente.'
  },
  {
    year: '2026',
    title: 'BIM 4D, 5D e além',
    description: 'Integração de cronograma, custos e operação em projetos de infraestrutura e edificações complexas.'
  }
];

export const ABOUT_VALUES = [
  {
    title: 'Engenharia aplicada',
    description:
      'Toda metodologia é validada em projetos reais entregues. Não ensinamos teoria desconectada da obra.'
  },
  {
    title: 'Padrão de escritório',
    description:
      'Templates e bibliotecas estruturados como em um escritório profissional — não amontoados soltos de famílias.'
  },
  {
    title: 'Atualização contínua',
    description:
      'Conteúdo revisado a cada versão nova do Revit e a cada nova diretriz normativa relevante.'
  }
];
