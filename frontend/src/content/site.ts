export interface NavItem {
  label: string;
  href: string;
}

export const BRAND = {
  name: 'ESTÚDIO AEC',
  tagline: 'BIM · Revit · AEC',
  description:
    'Treinamentos, templates e bibliotecas Revit construídos por engenheiros e arquitetos atuantes em obra. Metodologia BIM aplicada do projeto à execução.',
  email: 'contato@estudioaec.com',
  phone: '+55 (11) 90000-0000',
  location: 'São Paulo · SP — atuação nacional',
  socials: [
    { label: 'Instagram', href: 'https://instagram.com/estudio.aec', icon: 'instagram' },
    { label: 'YouTube', href: 'https://youtube.com/@estudioaec', icon: 'youtube' },
    { label: 'LinkedIn', href: 'https://linkedin.com/company/estudioaec', icon: 'linkedin' }
  ]
} as const;

export const PRIMARY_NAV: NavItem[] = [
  { label: 'Início', href: '/' },
  { label: 'Treinamentos', href: '/treinamentos' },
  { label: 'Templates', href: '/templates' },
  { label: 'Bibliotecas', href: '/bibliotecas' },
  { label: 'Orientações', href: '/orientacoes' },
  { label: 'Portfólio', href: '/portfolio' },
  { label: 'Quem somos', href: '/quem-somos' },
  { label: 'Contato', href: '/contato' }
];

export const FOOTER_COLUMNS: { title: string; items: NavItem[] }[] = [
  {
    title: 'Plataforma',
    items: [
      { label: 'Treinamentos', href: '/treinamentos' },
      { label: 'Templates Revit', href: '/templates' },
      { label: 'Bibliotecas BIM', href: '/bibliotecas' },
      { label: 'Orientações técnicas', href: '/orientacoes' }
    ]
  },
  {
    title: 'Studio',
    items: [
      { label: 'Quem somos', href: '/quem-somos' },
      { label: 'Portfólio', href: '/portfolio' },
      { label: 'Contato', href: '/contato' },
      { label: 'Área do aluno', href: '/login' }
    ]
  },
  {
    title: 'Suporte',
    items: [
      { label: 'Política de privacidade', href: '/privacidade' },
      { label: 'Termos de uso', href: '/termos' },
      { label: 'FAQ', href: '/orientacoes' }
    ]
  }
];
