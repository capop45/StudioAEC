import { ptBR } from '@clerk/localizations';

/** Aparência alinhada ao design Estúdio AEC — sem logo/branding do provedor de auth. */
export const clerkAppearance = {
  variables: {
    colorPrimary: 'var(--oxide-600)',
    colorPrimaryForeground: 'var(--paper-50)',
    colorBackground: 'var(--paper-50)',
    colorInputBackground: '#ffffff',
    colorInputText: 'var(--ink-900)',
    colorText: 'var(--ink-900)',
    colorTextSecondary: 'var(--ink-600)',
    colorDanger: 'var(--oxide-600)',
    borderRadius: '0',
    fontFamily: 'var(--font-sans)',
    fontFamilyButtons: 'var(--font-sans)',
  },
  layout: {
    logoPlacement: 'none' as const,
    socialButtonsVariant: 'blockButton' as const,
    shimmer: false,
  },
  elements: {
    rootBox: 'clerk-auth-root',
    card: 'clerk-auth-card',
    headerTitle: 'clerk-auth-title',
    headerSubtitle: 'clerk-auth-subtitle',
    formButtonPrimary: 'btn btn-primary',
    formFieldInput: 'field__control',
    footer: 'clerk-auth-footer-hidden',
    footerPages: 'clerk-auth-footer-hidden',
    badge: 'clerk-auth-footer-hidden',
    devBar: 'clerk-auth-footer-hidden',
  },
};

/** pt-BR oficial + textos da marca Estúdio AEC (sem menção a terceiros). */
export const clerkLocalization = {
  ...ptBR,
  signIn: {
    ...ptBR.signIn,
    start: {
      ...ptBR.signIn?.start,
      title: 'Entrar na área do aluno',
      subtitle: 'Acesse trilhas, templates e bibliotecas Revit do Estúdio AEC.',
    },
    emailCode: {
      ...ptBR.signIn?.emailCode,
      title: 'Verifique seu e-mail',
      subtitle: 'Informe o código enviado para {{emailAddress}}',
    },
    emailLink: {
      ...ptBR.signIn?.emailLink,
      title: 'Verifique seu e-mail',
      subtitle: 'Use o link enviado para {{emailAddress}}',
    },
    phoneCode: {
      ...ptBR.signIn?.phoneCode,
      title: 'Verifique seu telefone',
    },
    alternativeMethods: {
      ...ptBR.signIn?.alternativeMethods,
      title: 'Outra forma de entrar',
    },
  },
  signUp: {
    ...ptBR.signUp,
    start: {
      ...ptBR.signUp?.start,
      title: 'Criar sua conta',
      subtitle: 'Cadastre-se para acessar a biblioteca completa do Estúdio AEC.',
    },
    emailCode: {
      ...ptBR.signUp?.emailCode,
      title: 'Confirme seu e-mail',
    },
    phoneCode: {
      ...ptBR.signUp?.phoneCode,
      title: 'Confirme seu telefone',
    },
    continue: {
      ...ptBR.signUp?.continue,
      title: 'Complete seu cadastro',
    },
  },
  userButton: {
    ...ptBR.userButton,
    action__manageAccount: 'Minha conta',
    action__signOut: 'Sair',
  },
  userProfile: {
    ...ptBR.userProfile,
    navbar: {
      ...ptBR.userProfile?.navbar,
      account: 'Perfil',
      title: 'Minha conta',
      description: 'Dados da sua conta no Estúdio AEC.',
    },
  },
};

export const authPaths = {
  signIn: '/sign-in',
  signUp: '/sign-up',
  afterAuth: '/dashboard',
} as const;
