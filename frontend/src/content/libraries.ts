export interface LibraryAsset {
  id: string;
  title: string;
  category: string;
  description: string;
  image: string;
  itemCount: number;
}

export const LIBRARIES: LibraryAsset[] = [
  {
    id: 'lib-arq',
    title: 'Biblioteca Arquitetura',
    category: 'Arquitetura',
    description: 'Portas, janelas, cercas, divisórias e mobiliário com parâmetros de tipo prontos para documentar.',
    image: '/images/disciplines/casa-base.png',
    itemCount: 420
  },
  {
    id: 'lib-hid',
    title: 'Biblioteca Hidráulica',
    category: 'Hidráulica',
    description: 'Bombas, caixas, medidores e conexões. Famílias paramétricas com conexões nativas.',
    image: '/images/disciplines/hidraulica.png',
    itemCount: 180
  },
  {
    id: 'lib-ele',
    title: 'Biblioteca Elétrica',
    category: 'Elétrica',
    description: 'Conduletes, luminárias, tomadas e equipamentos com cargas associadas para circuitos automáticos.',
    image: '/images/disciplines/eletrica.png',
    itemCount: 220
  },
  {
    id: 'lib-pci',
    title: 'Biblioteca Preventivo',
    category: 'Preventivo',
    description: 'Hidrantes, extintores, sprinklers e placas de sinalização normatizados.',
    image: '/images/disciplines/preventivo.png',
    itemCount: 95
  },
  {
    id: 'lib-cli',
    title: 'Biblioteca Climatização',
    category: 'Climatização',
    description: 'Splits, dutos, difusores, condensadoras e terminais com conexões e dados técnicos.',
    image: '/images/disciplines/climatizacao.png',
    itemCount: 140
  },
  {
    id: 'lib-est',
    title: 'Biblioteca Estrutural',
    category: 'Estruturas',
    description: 'Pré-moldados, perfis metálicos, conectores e armaduras paramétricas.',
    image: '/images/disciplines/estruturas.png',
    itemCount: 160
  },
  {
    id: 'lib-fam',
    title: 'Famílias paramétricas',
    category: 'Geral',
    description: 'Componentes nativos otimizados para baixo peso e alta performance no modelo federado.',
    image: '/images/disciplines/familias.png',
    itemCount: 320
  },
  {
    id: 'lib-dyn',
    title: 'Scripts Dynamo',
    category: 'Automação',
    description: 'Automatizações comuns: renumeração, exportação de PDFs, padronização de vistas e tags.',
    image: '/images/disciplines/dynamo.png',
    itemCount: 45
  }
];
