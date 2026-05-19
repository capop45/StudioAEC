import { FormEvent, useState } from 'react';
import { Icon } from '../components/Icon';
import { BRAND } from '../content/site';

interface ContactState {
  name: string;
  email: string;
  company: string;
  topic: string;
  message: string;
}

const INITIAL: ContactState = {
  name: '',
  email: '',
  company: '',
  topic: 'Treinamentos',
  message: ''
};

function validate(state: ContactState): string | null {
  if (state.name.trim().length < 2) return 'Informe seu nome completo.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(state.email)) return 'Informe um e-mail válido.';
  if (state.message.trim().length < 10) {
    return 'Descreva sua necessidade com pelo menos 10 caracteres.';
  }
  return null;
}

export function ContatoPage() {
  const [state, setState] = useState<ContactState>(INITIAL);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  function update<K extends keyof ContactState>(key: K, value: ContactState[K]) {
    setState((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const v = validate(state);
    if (v) {
      setError(v);
      return;
    }
    setError(null);
    setSent(true);
    setState(INITIAL);
  }

  return (
    <>
      <header className="page-header">
        <div className="page-header__grid" aria-hidden="true" />
        <div className="page-header__hatch" aria-hidden="true" />
        <div className="container">
          <div className="page-header__bar">
            <span>
              <strong>AEC.CT01</strong> · Contato
            </span>
            <span>R.CT · Atendimento técnico</span>
          </div>
          <span className="eyebrow eyebrow--on-dark">
            <span className="eyebrow__line" />
            <span className="eyebrow__code">§ CT01</span> · Atendimento
          </span>
          <h1 className="page-header__title">
            Vamos planejar a transição BIM da sua <em>equipe</em>.
          </h1>
          <p className="page-header__lead">
            Atendemos profissionais autônomos, escritórios e construtoras. Envie sua necessidade —
            em até 24 horas úteis um especialista retorna.
          </p>
        </div>
      </header>

      <section className="section">
        <div className="container">
          <div className="contact-grid">
            <div>
              <div className="section-head" style={{ marginBlockEnd: 'var(--space-6)' }}>
                <div className="section-head__copy">
                  <span className="eyebrow">
                    <span className="eyebrow__line" />
                    <span className="eyebrow__code">§ CT02</span> · Canais
                  </span>
                  <h2 className="section-title" style={{ fontSize: 'var(--fs-800)' }}>
                    Meios de contato.
                  </h2>
                </div>
              </div>

              <div className="contact-info">
                <div className="contact-info__row">
                  <span className="contact-info__row__icon">
                    <Icon name="mail" />
                  </span>
                  <div>
                    <strong>E-mail</strong>
                    <span>
                      <a className="link-underline" href={`mailto:${BRAND.email}`}>
                        {BRAND.email}
                      </a>
                    </span>
                  </div>
                </div>
                <div className="contact-info__row">
                  <span className="contact-info__row__icon">
                    <Icon name="phone" />
                  </span>
                  <div>
                    <strong>WhatsApp</strong>
                    <span>{BRAND.phone}</span>
                  </div>
                </div>
                <div className="contact-info__row">
                  <span className="contact-info__row__icon">
                    <Icon name="pin" />
                  </span>
                  <div>
                    <strong>Localização</strong>
                    <span>{BRAND.location}</span>
                  </div>
                </div>
                <div className="contact-info__row">
                  <span className="contact-info__row__icon">
                    <Icon name="clock" />
                  </span>
                  <div>
                    <strong>Atendimento</strong>
                    <span>Seg–sex · 9h às 18h (BRT)</span>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div className="section-head" style={{ marginBlockEnd: 'var(--space-6)' }}>
                <div className="section-head__copy">
                  <span className="eyebrow">
                    <span className="eyebrow__line" />
                    <span className="eyebrow__code">§ CT03</span> · Briefing
                  </span>
                  <h2 className="section-title" style={{ fontSize: 'var(--fs-800)' }}>
                    Envie sua necessidade.
                  </h2>
                </div>
              </div>

              <form className="contact-form" onSubmit={handleSubmit} noValidate>
                <div className="contact-form__row">
                  <div className="field">
                    <label className="field__label" htmlFor="ct-name">Nome</label>
                    <input
                      id="ct-name"
                      className="field__control"
                      autoComplete="name"
                      required
                      value={state.name}
                      onChange={(e) => update('name', e.target.value)}
                    />
                  </div>
                  <div className="field">
                    <label className="field__label" htmlFor="ct-email">E-mail</label>
                    <input
                      id="ct-email"
                      type="email"
                      className="field__control"
                      autoComplete="email"
                      required
                      value={state.email}
                      onChange={(e) => update('email', e.target.value)}
                    />
                  </div>
                </div>
                <div className="contact-form__row">
                  <div className="field">
                    <label className="field__label" htmlFor="ct-company">Empresa</label>
                    <input
                      id="ct-company"
                      className="field__control"
                      autoComplete="organization"
                      value={state.company}
                      onChange={(e) => update('company', e.target.value)}
                    />
                  </div>
                  <div className="field">
                    <label className="field__label" htmlFor="ct-topic">Assunto</label>
                    <select
                      id="ct-topic"
                      className="field__control"
                      value={state.topic}
                      onChange={(e) => update('topic', e.target.value)}
                    >
                      <option>Treinamentos</option>
                      <option>Templates</option>
                      <option>Bibliotecas customizadas</option>
                      <option>Consultoria BIM</option>
                      <option>Outro</option>
                    </select>
                  </div>
                </div>
                <div className="field">
                  <label className="field__label" htmlFor="ct-message">Mensagem</label>
                  <textarea
                    id="ct-message"
                    className="field__control"
                    required
                    value={state.message}
                    onChange={(e) => update('message', e.target.value)}
                    placeholder="Conte um pouco sobre o cenário atual da sua equipe e o que pretende alcançar com BIM."
                  />
                </div>

                {error && (
                  <p className="form-error" role="alert">
                    {error}
                  </p>
                )}
                {sent && (
                  <p className="form-success" role="status">
                    Mensagem registrada · retornaremos em até 24h úteis.
                  </p>
                )}

                <button type="submit" className="btn btn-primary btn-lg">
                  Enviar mensagem <Icon name="arrow-right" size={14} />
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
