export interface GuidanceArticle {
  id: string;
  category: string;
  title: string;
  excerpt: string;
  readMinutes: number;
  image: string;
  date: string;
}

export const GUIDANCE_ARTICLES: GuidanceArticle[] = [
  {
    id: 'g1',
    category: 'Boas práticas',
    title: 'Como estruturar templates Revit que sobrevivem ao escritório real',
    excerpt: 'Padronização que não engessa o time: o equilíbrio entre rigidez do template e flexibilidade do projetista.',
    readMinutes: 8,
    image: '/images/disciplines/arquitetura.png',
    date: '2026-04-12'
  },
  {
    id: 'g2',
    category: 'BIM 4D',
    title: 'Sequenciamento construtivo no Revit + Navisworks',
    excerpt: 'Linkar tarefas do cronograma ao modelo evita "linhas no Project sem aderência à obra".',
    readMinutes: 12,
    image: '/images/dimensions/4d.png',
    date: '2026-03-28'
  },
  {
    id: 'g3',
    category: 'Famílias',
    title: 'O peso esquecido das famílias: por que seu modelo ficou lento',
    excerpt: 'Boas práticas para criar componentes leves sem perder a flexibilidade paramétrica.',
    readMinutes: 7,
    image: '/images/disciplines/familias.png',
    date: '2026-03-14'
  },
  {
    id: 'g4',
    category: 'Hidráulica',
    title: 'Sistemas de água quente: do dimensionamento ao isométrico automático',
    excerpt: 'Fluxo prático no Revit MEP para entregar isométricos cotados sem retrabalho.',
    readMinutes: 10,
    image: '/images/disciplines/hidraulica-iso.png',
    date: '2026-02-22'
  },
  {
    id: 'g5',
    category: 'Compatibilização',
    title: 'Detecção de interferências: além do clash de tubulação',
    excerpt: 'O que separar em "clash crítico", "interferência aceitável" e "ruído" na revisão BIM.',
    readMinutes: 9,
    image: '/images/disciplines/estruturas-iso.png',
    date: '2026-02-08'
  },
  {
    id: 'g6',
    category: 'Automação',
    title: 'Dynamo na rotina: 5 scripts que pagam o curso no primeiro mês',
    excerpt: 'Renumeração, exportação de PDFs e padronização — automações que viram tempo de projeto.',
    readMinutes: 6,
    image: '/images/disciplines/dynamo.png',
    date: '2026-01-30'
  }
];

export const FAQ_ITEMS = [
  {
    question: 'Os treinamentos funcionam para iniciantes em Revit?',
    answer:
      'Sim. Cada trilha começa com fundamentos próprios da disciplina e avança para fluxos avançados. Quem nunca abriu o Revit começa pela trilha de Arquitetura.'
  },
  {
    question: 'Recebo certificado ao final do curso?',
    answer:
      'Sim. Ao completar 100% dos módulos de uma trilha você recebe certificado em PDF com QR de validação e número único.'
  },
  {
    question: 'Os templates e bibliotecas servem para minha versão do Revit?',
    answer:
      'Distribuímos os arquivos a partir do Revit 2023. Versões mais antigas exigem conversão e podem perder famílias específicas — sinalizamos sempre no asset.'
  },
  {
    question: 'Posso usar os templates em projetos comerciais?',
    answer:
      'Sim. A licença permite uso ilimitado em projetos do seu escritório. Não é permitido revender ou redistribuir os arquivos originais.'
  },
  {
    question: 'Como tiro dúvidas durante os cursos?',
    answer:
      'Cada aula tem comentários moderados. Para questões mais profundas há mentorias mensais ao vivo abertas aos alunos.'
  }
];
