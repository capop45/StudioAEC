import { SignIn } from '@clerk/nextjs';
import { AuthShell } from '@/components/auth/AuthShell';
import { authPaths, clerkAppearance } from '@/lib/clerk-config';

export const metadata = {
  title: 'Entrar',
  description: 'Acesse sua conta no Estúdio AEC — trilhas, templates e bibliotecas Revit.',
};

export default function SignInPage() {
  return (
    <AuthShell mode="sign-in">
      <SignIn
        path={authPaths.signIn}
        routing="path"
        signUpUrl={authPaths.signUp}
        fallbackRedirectUrl={authPaths.afterAuth}
        forceRedirectUrl={authPaths.afterAuth}
        appearance={clerkAppearance}
      />
    </AuthShell>
  );
}
