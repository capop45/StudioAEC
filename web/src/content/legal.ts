import { BRAND } from '@/content/site';

/** Última revisão exibida nas páginas legais (ISO). */
export const LEGAL_LAST_UPDATED = '2026-05-22';

export const LEGAL_CONTACT_EMAIL = BRAND.email;

export interface LegalSubsection {
  title: string;
  paragraphs?: string[];
  bullets?: string[];
}

export interface LegalSection {
  id: string;
  code: string;
  title: string;
  paragraphs?: string[];
  bullets?: string[];
  subsections?: LegalSubsection[];
}

export interface LegalDocument {
  slug: 'privacidade' | 'termos';
  plateCode: string;
  title: string;
  lead: string;
  intro: string[];
  sections: LegalSection[];
}

export const PRIVACY_POLICY: LegalDocument = {
  slug: 'privacidade',
  plateCode: 'AEC.PP01',
  title: 'Política de privacidade',
  lead:
    'Como o Estúdio AEC trata dados pessoais na plataforma de treinamentos, catálogo e área do aluno — em conformidade com a Lei nº 13.709/2018 (LGPD).',
  intro: [
    `Esta Política de Privacidade descreve as práticas de ${BRAND.name} («Estúdio AEC», «nós») no site e na plataforma digital acessíveis pelos domínios operados pelo estúdio (coletivamente, o «Serviço»).`,
    'Ao utilizar o Serviço — inclusive como visitante, aluno, comprador ou administrador — você declara ter lido este documento. O tratamento de dados pessoais observa a LGPD, regulamentações da Autoridade Nacional de Proteção de Dados (ANPD) e, quando aplicável, normas internacionais de proteção de dados para usuários fora do Brasil.',
    `Última atualização: ${formatLegalDate(LEGAL_LAST_UPDATED)}.`,
  ],
  sections: [
    {
      id: 'controlador',
      code: '§ PP01',
      title: '1. Controlador e encarregado',
      paragraphs: [
        `Controlador: ${BRAND.name}, com atuação em ${BRAND.location}.`,
        `Canal de privacidade e exercício de direitos: ${LEGAL_CONTACT_EMAIL}.`,
        'Encarregado pelo tratamento de dados pessoais (DPO): o mesmo canal acima, até designação formal em registro interno. Responderemos solicitações em prazo razoável, conforme a LGPD.',
      ],
    },
    {
      id: 'escopo',
      code: '§ PP02',
      title: '2. Escopo e definições',
      paragraphs: [
        'Esta política aplica-se ao tratamento realizado por meio do Serviço: páginas institucionais, catálogo público, autenticação, área do aluno, checkout de cursos, downloads de bibliotecas, tutor de inteligência artificial (IA), formulários e APIs associadas.',
        '«Dado pessoal» é informação relacionada a pessoa natural identificada ou identificável. «Tratamento» inclui coleta, uso, armazenamento, compartilhamento e eliminação. «Titular» é você, usuário ou visitante.',
      ],
      bullets: [
        'Não se aplica a sites de terceiros acessados por links (redes sociais, Stripe Checkout, etc.), regidos pelas políticas próprias desses provedores.',
        'Serviços legados fora do domínio principal (`frontend/` Vite, APIs .NET antigas) não devem ser utilizados para novos cadastros; quando ainda acessíveis, possuem políticas próprias.',
      ],
    },
    {
      id: 'dados',
      code: '§ PP03',
      title: '3. Dados que podemos tratar',
      subsections: [
        {
          title: '3.1 Visitantes e navegação',
          bullets: [
            'Endereço IP, data e hora de acesso, páginas visitadas, identificadores técnicos de sessão e cookies estritamente necessários (ver seção 5).',
            'Preferências inferidas pelo uso do site (ex.: páginas de treinamento visualizadas), quando registradas em logs de servidor.',
          ],
        },
        {
          title: '3.2 Conta e autenticação (Clerk)',
          bullets: [
            'Nome, e-mail, identificador de usuário, foto de perfil (se fornecida), metadados de função (ex.: administrador), histórico de sessão e credenciais gerenciadas pelo provedor de autenticação.',
          ],
        },
        {
          title: '3.3 Aluno e matrícula',
          bullets: [
            'Matrículas em cursos e trilhas, progresso de aulas, certificados emitidos, interações com conteúdo restrito a matriculados.',
          ],
        },
        {
          title: '3.4 Compras (Stripe)',
          bullets: [
            'Identificação do pedido, curso adquirido, status de pagamento, identificadores de cliente e transação na Stripe (não armazenamos número completo de cartão — o pagamento ocorre na página segura da Stripe).',
          ],
        },
        {
          title: '3.5 Formulário de contato',
          bullets: [
            'Nome, e-mail, empresa (opcional), assunto e mensagem enviados voluntariamente.',
          ],
        },
        {
          title: '3.6 Tutor IA (RAG)',
          bullets: [
            'Perguntas enviadas ao tutor, respostas geradas, curso vinculado, registros de recuperação de conteúdo (logs técnicos de RAG) e embeddings derivados de materiais didáticos — para prestação do serviço educacional contratado.',
          ],
        },
        {
          title: '3.7 Administradores',
          bullets: [
            'Dados de planejamento interno, tarefas e relatórios acessíveis apenas a perfis autorizados.',
          ],
        },
      ],
    },
    {
      id: 'finalidades',
      code: '§ PP04',
      title: '4. Finalidades e bases legais (LGPD)',
      bullets: [
        'Prestação do Serviço, cadastro, login e área do aluno — execução de contrato ou procedimentos preliminares (art. 7º, V).',
        'Processamento de pagamentos e emissão de comprovantes — execução de contrato e obrigação legal/fiscal quando aplicável (art. 7º, V e II).',
        'Suporte, resposta a contato e comunicações operacionais — execução de contrato ou legítimo interesse (art. 7º, V ou IX), com opt-out quando for marketing.',
        'Segurança, prevenção a fraudes e integridade da plataforma — legítimo interesse (art. 7º, IX) ou obrigação legal.',
        'Melhoria do tutor IA e materiais didáticos (logs agregados ou pseudonimizados quando possível) — legítimo interesse ou execução de contrato, sem venda de dados a terceiros para publicidade.',
        'Cumprimento de obrigações legais, regulatórias ou ordens de autoridade — obrigação legal (art. 7º, II).',
        'Marketing direto, newsletters ou pesquisas — consentimento (art. 7º, I), quando implementados; hoje o Serviço não utiliza cookies de publicidade comportamental.',
      ],
    },
    {
      id: 'cookies',
      code: '§ PP05',
      title: '5. Cookies e tecnologias similares',
      paragraphs: [
        'Cookies são pequenos arquivos armazenados no seu navegador. Utilizamos cookies e armazenamento local apenas na medida necessária para o funcionamento do Serviço. Não empregamos, no código atual da plataforma, ferramentas de analytics de terceiros (ex.: Google Analytics, Meta Pixel) nem cookies de remarketing.',
        'O aviso discreto exibido no site registra apenas que você tomou ciência desta política quanto a cookies essenciais; essa preferência é guardada localmente no seu dispositivo (`localStorage`), sem identificação cruzada para marketing.',
      ],
      subsections: [
        {
          title: '5.1 Cookies estritamente necessários',
          bullets: [
            'Autenticação e sessão (Clerk): manter login seguro, detectar sessão ativa e proteger rotas restritas (`/dashboard`, `/admin`, APIs autenticadas).',
            'Segurança e balanceamento: cookies técnicos do provedor de hospedagem (ex.: Vercel), quando aplicáveis à entrega do site.',
            'Preferência de ciência do aviso de cookies: armazenamento local `aec_legal_notice_v1`.',
          ],
        },
        {
          title: '5.2 O que não utilizamos hoje',
          bullets: [
            'Cookies de publicidade, perfilamento entre sites ou medição de audiência de terceiros.',
            'Embeds de vídeo ou mapas que disparem rastreadores antes do seu consentimento — links para redes sociais abrem em domínio externo.',
          ],
        },
        {
          title: '5.3 Como gerenciar',
          bullets: [
            'Você pode bloquear ou apagar cookies nas configurações do navegador; parte do Serviço (login, compra, área do aluno) pode deixar de funcionar.',
            'Para sessão Clerk, utilize «Sair» na conta ou as ferramentas do navegador para limpar dados do site.',
            'Se no futuro adicionarmos cookies não essenciais, solicitaremos consentimento prévio conforme a legislação aplicável e atualizaremos esta seção.',
          ],
        },
      ],
    },
    {
      id: 'compartilhamento',
      code: '§ PP06',
      title: '6. Operadores e compartilhamento',
      paragraphs: [
        'Compartilhamos dados apenas com operadores que nos auxiliam a operar o Serviço, sob contratos ou termos que exigem proteção adequada, ou quando exigido por lei.',
      ],
      bullets: [
        'Clerk, Inc. — autenticação e gestão de identidade (EUA).',
        'Stripe, Inc. — processamento de pagamentos (EUA / Irlanda conforme configuração da conta).',
        'Provedor de hospedagem e banco de dados (ex.: Vercel, Neon ou PostgreSQL equivalente) — infraestrutura e armazenamento transacional.',
        'Amazon Web Services (S3) — armazenamento de arquivos (bibliotecas, materiais), com URLs pré-assinadas de acesso restrito.',
        'OpenAI ou provedor de embeddings configurado — processamento de perguntas do tutor IA e geração de vetores, quando a funcionalidade está ativa.',
        'Autoridades públicas — mediante ordem legal válida.',
        'Não vendemos dados pessoais. Não compartilhamos listas de alunos com terceiros para publicidade.',
      ],
    },
    {
      id: 'transferencia',
      code: '§ PP07',
      title: '7. Transferência internacional',
      paragraphs: [
        'Alguns operadores processam dados fora do Brasil (notadamente EUA). Nesses casos, adotamos salvaguardas previstas na LGPD, como cláusulas contratuais padrão, políticas de privacidade dos fornecedores reconhecidos globalmente ou consentimento específico quando exigido.',
        'Ao utilizar o Serviço a partir de outros países, você reconhece que o tratamento pode ocorrer no Brasil e em jurisdições dos operadores listados na seção 6.',
      ],
    },
    {
      id: 'retencao',
      code: '§ PP08',
      title: '8. Prazo de conservação',
      bullets: [
        'Dados de conta: enquanto a conta estiver ativa e, após encerramento, pelo prazo necessário para obrigações legais, defesa de direitos ou resolução de disputas (em geral até 5 anos, salvo prazo maior exigido por lei).',
        'Registros de pagamento e fiscais: conforme legislação tributária e comercial aplicável.',
        'Logs de servidor e segurança: período técnico limitado (ex.: 90 a 365 dias), salvo incidente de segurança.',
        'Conversas com o tutor IA: pelo tempo necessário à melhoria do serviço educacional e suporte, com possibilidade de anonimização após o término da relação contratual.',
        'Formulário de contato: até conclusão do atendimento e arquivamento operacional razoável.',
      ],
    },
    {
      id: 'seguranca',
      code: '§ PP09',
      title: '9. Segurança da informação',
      paragraphs: [
        'Adotamos medidas técnicas e organizacionais proporcionais ao risco: HTTPS, controle de acesso por autenticação, segregação de rotas administrativas, URLs de download temporárias, validação de entrada em APIs e princípio de menor privilégio em produção.',
        'Nenhum sistema é absolutamente seguro. Em caso de incidente relevante que afete seus dados, comunicaremos você e a ANPD conforme a LGPD.',
      ],
    },
    {
      id: 'direitos',
      code: '§ PP10',
      title: '10. Seus direitos (titular LGPD)',
      paragraphs: [
        `Você pode solicitar, via ${LEGAL_CONTACT_EMAIL}, com identificação razoável:`,
      ],
      bullets: [
        'Confirmação da existência de tratamento e acesso aos dados.',
        'Correção de dados incompletos, inexatos ou desatualizados.',
        'Anonimização, bloqueio ou eliminação de dados desnecessários ou excessivos.',
        'Portabilidade, quando aplicável e regulamentado.',
        'Eliminação dos dados tratados com consentimento, observadas bases legais de retenção.',
        'Informação sobre compartilhamentos e sobre a possibilidade de não consentir.',
        'Revogação do consentimento, quando essa for a base do tratamento.',
        'Oposição a tratamento em hipóteses legais e revisão de decisões automatizadas, quando couber.',
        'Também pode apresentar reclamação à ANPD (www.gov.br/anpd). Buscaremos resolver previamente de boa-fé.',
      ],
    },
    {
      id: 'criancas',
      code: '§ PP11',
      title: '11. Crianças e adolescentes',
      paragraphs: [
        'O Serviço destina-se a profissionais e empresas do setor AEC. Não coletamos intencionalmente dados de menores de 18 anos sem consentimento parental específico. Se tomarmos conhecimento de coleta indevida, eliminaremos os dados com diligência razoável.',
      ],
    },
    {
      id: 'ia',
      code: '§ PP12',
      title: '12. Inteligência artificial e decisões automatizadas',
      paragraphs: [
        'O tutor IA responde com base em materiais do curso matriculado (RAG). As respostas são assistivas, não substituem julgamento técnico profissional nem constituem consultoria regulada de engenharia/arquitetura.',
        'Não utilizamos seus dados para treinar modelos públicos de terceiros além do necessário à chamada de API configurada; consulte a política do provedor de IA em vigor.',
        'Você pode solicitar esclarecimento sobre critérios gerais de funcionamento do tutor; decisões com efeito legal significativo exclusivamente automatizado não são aplicadas neste Serviço.',
      ],
    },
    {
      id: 'links',
      code: '§ PP13',
      title: '13. Links externos',
      paragraphs: [
        'Links para Instagram, YouTube, LinkedIn e outros sites abrem fora do Serviço. Recomendamos ler as políticas de privacidade desses destinos.',
      ],
    },
    {
      id: 'alteracoes',
      code: '§ PP14',
      title: '14. Alterações desta política',
      paragraphs: [
        'Podemos atualizar este documento para refletir mudanças legais ou funcionais. A data no topo indica a versão vigente. Alterações relevantes serão destacadas no site ou por e-mail aos usuários cadastrados, quando apropriado.',
      ],
    },
    {
      id: 'contato',
      code: '§ PP15',
      title: '15. Contato',
      paragraphs: [
        `Dúvidas sobre privacidade: ${LEGAL_CONTACT_EMAIL}.`,
        `Endereço de referência comercial: ${BRAND.location}.`,
        'Documento correlato: Termos de Uso em /termos.',
      ],
    },
  ],
};

export const TERMS_OF_USE: LegalDocument = {
  slug: 'termos',
  plateCode: 'AEC.TU01',
  title: 'Termos de uso',
  lead:
    'Condições gerais para navegação, cadastro, compra de treinamentos e uso da plataforma Estúdio AEC.',
  intro: [
    `Estes Termos de Uso («Termos») regem o acesso e a utilização do Serviço digital operado por ${BRAND.name} («Estúdio AEC», «nós»).`,
    'Ao acessar o site, criar conta, adquirir cursos ou utilizar recursos como bibliotecas, tutor IA e área administrativa, você («Usuário», «você») concorda com estes Termos e com a Política de Privacidade em /privacidade. Se não concordar, não utilize o Serviço.',
    `Última atualização: ${formatLegalDate(LEGAL_LAST_UPDATED)}.`,
  ],
  sections: [
    {
      id: 'aceitacao',
      code: '§ TU01',
      title: '1. Aceitação e elegibilidade',
      paragraphs: [
        'Você declara ter capacidade civil plena ou autorização de representante legal. O Serviço é voltado a profissionais e organizações do setor de Arquitetura, Engenharia e Construção (AEC).',
        'Pessoa jurídica deve ser representada por quem possui poderes para vincular a organização.',
      ],
    },
    {
      id: 'servico',
      code: '§ TU02',
      title: '2. Objeto do Serviço',
      bullets: [
        'Divulgação institucional, catálogo de treinamentos, templates, bibliotecas e orientações técnicas.',
        'Cadastro de usuários, área do aluno, acompanhamento de progresso e certificados quando disponíveis.',
        'Compra de cursos digitais via checkout seguro (Stripe).',
        'Downloads de arquivos mediante regras de matrícula ou liberação publicada.',
        'Tutor de IA auxiliar baseado em conteúdo do curso matriculado (RAG).',
        'Ferramentas internas de planejamento para administradores autorizados.',
      ],
      paragraphs: [
        'O Estúdio AEC pode alterar funcionalidades, conteúdos e rotas, preservando direitos já adquiridos em relação a compras confirmadas.',
      ],
    },
    {
      id: 'conta',
      code: '§ TU03',
      title: '3. Cadastro, conta e segurança',
      bullets: [
        'Informações cadastrais devem ser verdadeiras e atualizadas.',
        'Credenciais são pessoais e intransferíveis; você é responsável por atividades na sua conta.',
        'Notifique-nos imediatamente em caso de uso não autorizado via ' + LEGAL_CONTACT_EMAIL + '.',
        'Podemos suspender ou encerrar contas em caso de violação destes Termos, fraude ou exigência legal.',
      ],
    },
    {
      id: 'propriedade',
      code: '§ TU04',
      title: '4. Propriedade intelectual',
      paragraphs: [
        'Todo o conteúdo do Serviço — textos, vídeos, modelos Revit, famílias, scripts, marcas, layout e código — é protegido por direitos autorais e legislação aplicável, pertencente ao Estúdio AEC ou licenciadores.',
      ],
      bullets: [
        'É concedida licença limitada, não exclusiva e intransferível para uso pessoal ou interno na sua organização, conforme o produto adquirido ou matrícula.',
        'É vedada revenda, redistribuição pública, engenharia reversa comercial, remoção de marcas d’água ou compartilhamento de credenciais para burlar controle de acesso.',
        'Marcas «Estúdio AEC», logotipos e identidade visual não podem ser usados sem autorização prévia por escrito.',
      ],
    },
    {
      id: 'compras',
      code: '§ TU05',
      title: '5. Compras, preços e pagamento',
      bullets: [
        'Preços exibidos no catálogo podem ser alterados; o valor aplicável é o confirmado no checkout no momento da compra.',
        'Pagamentos processados pela Stripe; ao prosseguir, você também aceita os termos da Stripe na transação.',
        'A confirmação de pagamento e liberação de matrícula dependem do retorno bem-sucedido dos sistemas de pagamento e webhook.',
        'Impostos, notas fiscais e obrigações tributárias seguem a legislação brasileira e política comercial informada no ato da compra.',
      ],
      paragraphs: [
        'Políticas de reembolso, cancelamento e arrependimento (CDC, art. 49, quando aplicável a contratações à distância) serão comunicadas na página do produto ou por e-mail de confirmação. Na ausência de política específica, entre em contato em até 7 dias corridos após a compra para análise de pedido de desistência em produtos digitais ainda não consumidos de forma substancial.',
      ],
    },
    {
      id: 'matricula',
      code: '§ TU06',
      title: '6. Matrículas e acesso aos cursos',
      bullets: [
        'O acesso é pessoal, salvo licença corporativa expressamente contratada.',
        'Prazos de disponibilidade do curso, atualizações e requisitos técnicos (software, hardware) são informados na descrição do treinamento.',
        'Podemos remover ou arquivar cursos obsoletos, oferecendo substituto razoável ou acesso equivalente quando aplicável.',
      ],
    },
    {
      id: 'tutor',
      code: '§ TU07',
      title: '7. Tutor de inteligência artificial',
      paragraphs: [
        'O tutor IA fornece orientações automatizadas com base em materiais indexados do curso. Respostas podem conter imprecisões; você deve validar informações críticas com documentação oficial, normas técnicas e profissionais habilitados.',
        'É proibido enviar dados confidenciais de terceiros, segredos industriais sem autorização ou conteúdo ilícito através do tutor.',
      ],
    },
    {
      id: 'downloads',
      code: '§ TU08',
      title: '8. Downloads e bibliotecas',
      bullets: [
        'Arquivos disponibilizados por link pré-assinado são temporários e vinculados à sua matrícula ou regra de liberação.',
        'O uso dos arquivos limita-se ao escopo da licença do produto; modelos e famílias não transferem direito sobre software Autodesk ou de terceiros.',
      ],
    },
    {
      id: 'conduta',
      code: '§ TU09',
      title: '9. Conduta do usuário',
      paragraphs: ['Você concorda em não:'],
      bullets: [
        'Violar leis brasileiras ou internacionais aplicáveis.',
        'Acessar áreas restritas sem autorização, realizar scraping abusivo ou sobrecarregar a infraestrutura.',
        'Inserir malware, realizar engenharia reversa maliciosa ou interferir no Serviço.',
        'Utilizar o Serviço para spam, assédio ou discriminação.',
        'Compartilhar conteúdo pago em repositórios públicos ou grupos abertos sem permissão.',
      ],
    },
    {
      id: 'disponibilidade',
      code: '§ TU10',
      title: '10. Disponibilidade e alterações',
      paragraphs: [
        'O Serviço é fornecido «como disponível». Esforços razoáveis de continuidade não garantem ausência total de interrupções, manutenções ou falhas de terceiros (Clerk, Stripe, hospedagem, IA).',
        'Podemos modificar estes Termos; a data de vigência será atualizada. O uso continuado após publicação de alterações relevantes constitui aceitação, salvo direito de encerrar a conta nos casos previstos em lei.',
      ],
    },
    {
      id: 'responsabilidade',
      code: '§ TU11',
      title: '11. Limitação de responsabilidade',
      paragraphs: [
        'Na extensão permitida pela lei brasileira, o Estúdio AEC não responde por lucros cessantes, danos indiretos ou decisões profissionais tomadas com base exclusiva no tutor IA ou em materiais didáticos.',
        'A responsabilidade total por danos diretos comprovados relacionados a um pedido específico limita-se, quando aplicável, ao valor efetivamente pago pelo Usuário na transação que originou a reclamação, salvo dolo ou culpa grave.',
        'Nada nestes Termos limita direitos irrenunciáveis do consumidor previstos no Código de Defesa do Consumidor.',
      ],
    },
    {
      id: 'rescisao',
      code: '§ TU12',
      title: '12. Rescisão',
      bullets: [
        'Você pode encerrar a conta a qualquer momento, sujeito a obrigações pendentes e retenção legal de dados.',
        'Podemos encerrar ou suspender o acesso por violação destes Termos, inadimplência ou descontinuação do Serviço, com aviso quando razoável.',
      ],
    },
    {
      id: 'lei',
      code: '§ TU13',
      title: '13. Lei aplicável e foro',
      paragraphs: [
        'Estes Termos são regidos pelas leis da República Federativa do Brasil.',
        'Fica eleito o foro da comarca de São Paulo/SP, com renúncia a qualquer outro, salvo competência absoluta do foro do domicílio do consumidor nos termos do CDC.',
      ],
    },
    {
      id: 'disposicoes',
      code: '§ TU14',
      title: '14. Disposições gerais',
      bullets: [
        'A invalidade de uma cláusula não afeta as demais.',
        'A tolerância quanto a descumprimento não implica renúncia de direito.',
        'Estes Termos constituem o acordo integral sobre o uso do Serviço, salvo contrato corporativo específico assinado entre as partes.',
      ],
    },
    {
      id: 'contato-termos',
      code: '§ TU15',
      title: '15. Contato',
      paragraphs: [
        `Dúvidas sobre estes Termos: ${LEGAL_CONTACT_EMAIL}.`,
        'Política de Privacidade: /privacidade.',
      ],
    },
  ],
};

function formatLegalDate(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number);
  const months = [
    'janeiro',
    'fevereiro',
    'março',
    'abril',
    'maio',
    'junho',
    'julho',
    'agosto',
    'setembro',
    'outubro',
    'novembro',
    'dezembro',
  ];
  return `${d} de ${months[m - 1]} de ${y}`;
}

export const COOKIE_NOTICE_STORAGE_KEY = 'aec_legal_notice_v1';

export const COOKIE_NOTICE_TEXT =
  'Cookies essenciais de sessão (login). Sem rastreamento de publicidade.';
