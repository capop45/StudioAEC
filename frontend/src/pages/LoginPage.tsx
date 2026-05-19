import { FormEvent, useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Icon } from '../components/Icon';

export function LoginPage() {
  const { login, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string })?.from ?? '/';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (isAuthenticated) {
    return <Navigate to={isAdmin && from.startsWith('/admin') ? from : '/'} replace />;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Informe um e-mail válido.');
      return;
    }
    setError(null);
    setSubmitting(true);
    try {
      await login(email, password);
      const dest = email.toLowerCase().includes('admin') ? '/admin/planejamento' : from;
      navigate(dest, { replace: true });
    } catch {
      setError('E-mail ou senha inválidos.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="auth-page">
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
        <div className="auth-page__cartouche">
          <div>
            <strong>R.LG</strong>
            Plate code
          </div>
          <div>
            <strong>2026</strong>
            Edição
          </div>
        </div>
      </aside>

      <section className="auth-page__form-pane">
        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <span className="auth-form__plate">AEC.LG · R.01</span>
          <h1>Entrar.</h1>
          <p>Acesse sua biblioteca de cursos e materiais Revit.</p>

          <div className="field">
            <label className="field__label" htmlFor="email">E-mail</label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              className="field__control"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="field">
            <label className="field__label" htmlFor="password">Senha</label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              className="field__control"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && (
            <p className="form-error" role="alert">
              {error}
            </p>
          )}

          <button type="submit" className="btn btn-primary btn-lg" disabled={submitting}>
            {submitting ? (
              'Entrando…'
            ) : (
              <>
                Entrar <Icon name="arrow-right" size={14} />
              </>
            )}
          </button>

          <div className="auth-hint">
            <strong>Demonstração</strong>
            Aluno: <code>aluno@estudioaec.com</code> / <code>aluno123</code>
            <br />
            Admin: <code>admin@estudioaec.com</code> / <code>admin123</code>
          </div>
        </form>
      </section>
    </div>
  );
}
