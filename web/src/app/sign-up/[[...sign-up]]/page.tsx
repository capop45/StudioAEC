import { SignUp } from '@clerk/nextjs';
import { AuthShell } from '@/components/auth/AuthShell';
import { authPaths, clerkAppearance } from '@/lib/clerk-config';

export const metadata = {
  title: 'Criar conta',
  description: 'Cadastre-se no Estúdio AEC e acesse trilhas BIM, templates e bibliotecas Revit.',
};

export default function SignUpPage() {
  return (
    <AuthShell mode="sign-up">
      <SignUp
        path={authPaths.signUp}
        routing="path"
        signInUrl={authPaths.signIn}
        fallbackRedirectUrl={authPaths.afterAuth}
        forceRedirectUrl={authPaths.afterAuth}
        appearance={clerkAppearance}
      />
    </AuthShell>
  );
}
