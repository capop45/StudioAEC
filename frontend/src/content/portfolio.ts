export interface PortfolioProject {
  id: string;
  title: string;
  category: 'Edifício' | 'Residencial' | 'Comercial' | 'Industrial' | 'Institucional' | 'Infraestrutura';
  image: string;
  year?: number;
}

export const PORTFOLIO_CATEGORIES = [
  'Todos',
  'Edifício',
  'Residencial',
  'Comercial',
  'Industrial',
  'Institucional',
  'Infraestrutura'
] as const;

export const PORTFOLIO: PortfolioProject[] = [
  { id: 'p1', title: 'Edifício JR', category: 'Edifício', image: '/images/portfolio/Edificio-JR.png', year: 2024 },
  { id: 'p2', title: 'Edifício Andares Médios', category: 'Edifício', image: '/images/portfolio/Edificio-AN.png', year: 2024 },
  { id: 'p3', title: 'Edifício CV Comercial', category: 'Edifício', image: '/images/portfolio/Edificio-CV.png', year: 2023 },
  { id: 'p4', title: 'Edifício DL Misto', category: 'Edifício', image: '/images/portfolio/Edificio-DL.png', year: 2023 },
  { id: 'p5', title: 'Edifício FM', category: 'Edifício', image: '/images/portfolio/Edificio-FM.png', year: 2023 },
  { id: 'p6', title: 'Edifício MO', category: 'Edifício', image: '/images/portfolio/Edificio-MO.png', year: 2023 },
  { id: 'p7', title: 'Edifício SU Habitacional', category: 'Edifício', image: '/images/portfolio/Edificio-SU.png', year: 2022 },
  { id: 'p8', title: 'Edifício TM', category: 'Edifício', image: '/images/portfolio/Edificio-TM.png', year: 2022 },
  { id: 'p9', title: 'Edifício VT Litorâneo', category: 'Edifício', image: '/images/portfolio/Edificio-VT.png', year: 2022 },
  { id: 'p10', title: 'Edifício NW', category: 'Edifício', image: '/images/portfolio/Edificio-NW.png', year: 2024 },
  { id: 'p11', title: 'Edifício RC Multifamiliar', category: 'Edifício', image: '/images/portfolio/Edificio-RC.png', year: 2024 },
  { id: 'p12', title: 'Edifício MAR', category: 'Edifício', image: '/images/portfolio/Edificio-MAR.png', year: 2021 },
  { id: 'p13', title: 'Edifício STA', category: 'Edifício', image: '/images/portfolio/Edificio-STA.png', year: 2024 },
  { id: 'p14', title: 'Edifício SS', category: 'Edifício', image: '/images/portfolio/Edificio-SS.png', year: 2023 },
  { id: 'p15', title: 'Edifício NP', category: 'Edifício', image: '/images/portfolio/Edificio-NP.png', year: 2024 },
  { id: 'p16', title: 'Edifício ITJ', category: 'Edifício', image: '/images/portfolio/Edificio-ITJ.png', year: 2023 },
  { id: 'p17', title: 'Edifício BL', category: 'Edifício', image: '/images/portfolio/Edificio-BL.png', year: 2023 },
  { id: 'p18', title: 'Edifício IN', category: 'Edifício', image: '/images/portfolio/Edificio-IN.png', year: 2022 },
  { id: 'p19', title: 'Edifício ICA', category: 'Edifício', image: '/images/portfolio/Edificio-ICA.png', year: 2022 },
  { id: 'p20', title: 'Edifício SJ', category: 'Edifício', image: '/images/portfolio/Edificio-SJ.png', year: 2024 },
  { id: 'r1', title: 'Residência AG', category: 'Residencial', image: '/images/portfolio/Residencia-AG.png', year: 2024 },
  { id: 'r2', title: 'Residência BX', category: 'Residencial', image: '/images/portfolio/Residencia-BX.png', year: 2024 },
  { id: 'r3', title: 'Residência CC', category: 'Residencial', image: '/images/portfolio/Residencia-CC.png', year: 2023 },
  { id: 'r4', title: 'Residência ED', category: 'Residencial', image: '/images/portfolio/Residencia-ED.png', year: 2023 },
  { id: 'r5', title: 'Residência FI', category: 'Residencial', image: '/images/portfolio/Residencia-FI.png', year: 2023 },
  { id: 'r6', title: 'Residência HS', category: 'Residencial', image: '/images/portfolio/Residencia-HS.png', year: 2022 },
  { id: 'r7', title: 'Residência JJ', category: 'Residencial', image: '/images/portfolio/Residencia-JJ.png', year: 2022 },
  { id: 'r8', title: 'Residência JR', category: 'Residencial', image: '/images/portfolio/Residencia-JR.png', year: 2024 },
  { id: 'r9', title: 'Residência PQ', category: 'Residencial', image: '/images/portfolio/Residencia-PQ.png', year: 2024 },
  { id: 'r10', title: 'Residência RS', category: 'Residencial', image: '/images/portfolio/Residencia-RS.png', year: 2023 },
  { id: 'r11', title: 'Residencial AB', category: 'Residencial', image: '/images/portfolio/Residencial-AB.png', year: 2024 },
  { id: 'r12', title: 'Residencial DF', category: 'Residencial', image: '/images/portfolio/Residencial-DF.png', year: 2024 },
  { id: 'r13', title: 'Residencial HH', category: 'Residencial', image: '/images/portfolio/Residencial-HH.png', year: 2023 },
  { id: 'r14', title: 'Residencial PR', category: 'Residencial', image: '/images/portfolio/Residencial-PR.png', year: 2023 },
  { id: 'r15', title: 'Geminadas CR', category: 'Residencial', image: '/images/portfolio/Geminadas-CR.png', year: 2022 },
  { id: 'c1', title: 'Comercial EH', category: 'Comercial', image: '/images/portfolio/Comercial-EH.png', year: 2024 },
  { id: 'c2', title: 'Shopping RR', category: 'Comercial', image: '/images/portfolio/Shopping-RR.png', year: 2023 },
  { id: 'c3', title: 'Supermercado IS', category: 'Comercial', image: '/images/portfolio/Supermercado-IS.png', year: 2023 },
  { id: 'c4', title: 'Supermercado PS', category: 'Comercial', image: '/images/portfolio/Supermercado-PS.png', year: 2022 },
  { id: 'c5', title: 'Hotel PS', category: 'Comercial', image: '/images/portfolio/Hotel-PS.png', year: 2022 },
  { id: 'c6', title: 'Cinema BH', category: 'Comercial', image: '/images/portfolio/Cinema-BH.png', year: 2024 },
  { id: 'c7', title: 'Cinema RS', category: 'Comercial', image: '/images/portfolio/Cinema-RS.png', year: 2024 },
  { id: 'c8', title: 'Motel MT', category: 'Comercial', image: '/images/portfolio/Motel-MT.png', year: 2023 },
  { id: 'i1', title: 'Centro Cultural', category: 'Institucional', image: '/images/portfolio/Centro-Cultural.png', year: 2024 },
  { id: 'i2', title: 'Salão de Festas BM', category: 'Institucional', image: '/images/portfolio/A.-Festas-BM.png', year: 2024 },
  { id: 'i3', title: 'Espaço de Eventos CC', category: 'Institucional', image: '/images/portfolio/Eventos-CC.png', year: 2023 },
  { id: 'i4', title: 'Hospital BT', category: 'Institucional', image: '/images/portfolio/Hospi-BT.png', year: 2023 },
  { id: 'i5', title: 'Hospital SJ', category: 'Institucional', image: '/images/portfolio/Hospital-SJ.png', year: 2024 },
  { id: 'i6', title: 'Biblioteca AN', category: 'Institucional', image: '/images/portfolio/Biblioteca-AN.png', year: 2022 },
  { id: 'ind1', title: 'Indústria AB', category: 'Industrial', image: '/images/portfolio/Industria-AB.png', year: 2024 },
  { id: 'ind2', title: 'Indústria AN', category: 'Industrial', image: '/images/portfolio/Industria-AN.png', year: 2023 },
  { id: 'ind3', title: 'Indústria BP', category: 'Industrial', image: '/images/portfolio/Industria-BP.png', year: 2022 },
  { id: 'ind4', title: 'Indústria CI', category: 'Industrial', image: '/images/portfolio/Industria-CI.png', year: 2024 },
  { id: 'ind5', title: 'Galpão Logístico', category: 'Industrial', image: '/images/portfolio/Galpao.png', year: 2023 },
  { id: 'inf1', title: 'Rebaixo de Lençol — Armazém de Grãos', category: 'Infraestrutura', image: '/images/portfolio/Rebaixo-de-Lencol-de-Armazem-de-Graos.png', year: 2023 },
  { id: 'inf2', title: 'Repartições de Carroceria de Caminhão', category: 'Infraestrutura', image: '/images/portfolio/Reparticoes-de-carroceria-de-Caminhao.png', year: 2022 },
  { id: 'inf3', title: 'Sistema de Captação Municipal', category: 'Infraestrutura', image: '/images/portfolio/Sistema-de-Captacao-Municipal.png', year: 2024 },
  { id: 'inf4', title: 'Tabuleiro de Ponte', category: 'Infraestrutura', image: '/images/portfolio/Tabuleiro-de-Ponte.png', year: 2024 }
];
