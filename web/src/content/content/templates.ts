export interface TemplateAsset {
  id: string;
  title: string;
  discipline: string;
  description: string;
  image: string;
  format: string;
  highlight?: boolean;
}

export const TEMPLATES: TemplateAsset[] = [
  {
    id: 'tpl-arq',
    title: 'Template Arquitetura BIM',
    discipline: 'Arquitetura',
    description: 'Vistas configuradas, anotações padronizadas e materiais prontos para acelerar a documentação de projeto.',
    image: '/images/disciplines/arquitetura.png',
    format: '.rte · Revit 2023+',
    highlight: true
  },
  {
    id: 'tpl-hid',
    title: 'Template Hidráulico',
    discipline: 'Hidráulica',
    description: 'Sistemas de água fria, quente, esgoto e pluvial com legendas, conexões e isométricos automáticos.',
    image: '/images/disciplines/hidraulica-iso.png',
    format: '.rte · Revit 2023+'
  },
  {
    id: 'tpl-ele',
    title: 'Template Elétrico',
    discipline: 'Elétrica',
    description: 'Painéis, circuitos, memorial e quadros de carga prontos. Diagrama unifilar dinâmico.',
    image: '/images/disciplines/eletrica.png',
    format: '.rte · Revit 2023+'
  },
  {
    id: 'tpl-pci',
    title: 'Template Preventivo (PCI)',
    discipline: 'Preventivo',
    description: 'Sprinklers, hidrantes e sinalização conforme NBR. Inclui simbologia e quantitativos.',
    image: '/images/disciplines/preventivo-iso.png',
    format: '.rte · Revit 2023+'
  },
  {
    id: 'tpl-cli',
    title: 'Template Climatização',
    discipline: 'Climatização',
    description: 'HVAC com dutos, difusores, terminais e cargas térmicas estruturados em sistemas.',
    image: '/images/disciplines/climatizacao.png',
    format: '.rte · Revit 2023+'
  },
  {
    id: 'tpl-est',
    title: 'Template Estrutural',
    discipline: 'Estruturas',
    description: 'Concreto e aço com famílias paramétricas, planos de cortes e tabelas de armação.',
    image: '/images/disciplines/estruturas-iso.png',
    format: '.rte · Revit 2023+'
  }
];
