import { SignIn } from '@clerk/nextjs';

export default function SignInPage() {
  return (
    <div className="auth-page auth-page--clerk">
      <aside className="auth-page__pane" aria-hidden="true">
        <span className="eyebrow eyebrow--on-dark">
          <span className="eyebrow__line" />
          <span className="eyebrow__code">AEC.LG</span> · Área do aluno
        </span>
        <div>
          <h2>
            Biblioteca completa do <em>Estúdio AEC</em>.
          </h2>
          <p>
            Trilhas, templates, bibliotecas Revit e mentorias mensais ao vivo. Um único hub pensado
            para profissionais AEC.
          </p>
        </div>
      </aside>
      <section className="auth-page__form-pane">
        <SignIn />
      </section>
    </div>
  );
}
