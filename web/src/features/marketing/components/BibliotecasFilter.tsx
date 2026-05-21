'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Icon } from '@/components/Icon';
import { LibraryDownloadButton } from '@/features/content/components/LibraryDownloadButton';
import { LIBRARIES } from '@/content/libraries';

interface BibliotecasFilterProps {
  isSignedIn: boolean;
}

export function BibliotecasFilter({ isSignedIn }: BibliotecasFilterProps) {
  const categories = useMemo(
    () => ['Todos', ...Array.from(new Set(LIBRARIES.map((l) => l.category)))],
    [],
  );
  const [filter, setFilter] = useState<string>('Todos');

  const visible = filter === 'Todos' ? LIBRARIES : LIBRARIES.filter((l) => l.category === filter);

  return (
    <>
      <header className="page-header">
        <div className="page-header__grid" aria-hidden="true" />
        <div className="page-header__hatch" aria-hidden="true" />
        <div className="container">
          <div className="page-header__bar">
            <span>
              <strong>AEC.BL01</strong> · Bibliotecas BIM
            </span>
            <span>R.BL · Famílias Revit + Dynamo</span>
          </div>
          <span className="eyebrow eyebrow--on-dark">
            <span className="eyebrow__line" />
            <span className="eyebrow__code">§ BL01</span> · Componentes paramétricos
          </span>
          <h1 className="page-header__title">
            Componentes Revit prontos para <em>produção</em>.
          </h1>
          <p className="page-header__lead">
            Famílias paramétricas, scripts Dynamo e bibliotecas multidisciplinares estruturadas para
            modelos leves e auditáveis — sem nested desnecessário.
          </p>
          <div className="page-header__cartouche">
            <div>
              <strong>{LIBRARIES.length}</strong>
              Bibliotecas
            </div>
            <div>
              <strong>{LIBRARIES.reduce((s, l) => s + l.itemCount, 0)}+</strong>
              Componentes
            </div>
            <div>
              <strong>Revit 2023+</strong>
              Compatibilidade
            </div>
          </div>
        </div>
      </header>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <div className="section-head__copy">
              <span className="eyebrow">
                <span className="eyebrow__line" />
                <span className="eyebrow__code">§ BL02</span> · Catálogo
              </span>
              <h2 className="section-title">Famílias por categoria.</h2>
            </div>
            <div className="section-head__aside">
              <span>R.BL02</span>
            </div>
          </div>

          <div className="filters-bar" role="tablist" aria-label="Filtrar bibliotecas">
            {categories.map((c) => (
              <button
                key={c}
                type="button"
                role="tab"
                aria-pressed={filter === c}
                onClick={() => setFilter(c)}
              >
                {c}
              </button>
            ))}
          </div>

          <div className="asset-grid">
            {visible.map((lib, idx) => (
              <article
                key={lib.id}
                className="asset-card"
                data-code={`BL.${String(idx + 1).padStart(2, '0')}`}
              >
                <div className="asset-card__media">
                  <img src={lib.image} alt={lib.title} loading="lazy" />
                </div>
                <div className="asset-card__body">
                  <span className="badge badge--amber">{lib.category}</span>
                  <h3>{lib.title}</h3>
                  <p>{lib.description}</p>
                  <div className="asset-card__footer">
                    <span>{lib.itemCount} componentes</span>
                    <LibraryDownloadButton assetId={lib.id} isSignedIn={isSignedIn} />
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--inverse">
        <div className="container">
          <div className="section-head">
            <div className="section-head__copy">
              <span className="eyebrow eyebrow--on-dark">
                <span className="eyebrow__line" />
                <span className="eyebrow__code">§ BL03</span> · Performance
              </span>
              <h2 className="section-title">Famílias enxutas. Modelo leve.</h2>
              <p className="section-lead">
                Todas as famílias seguem padrão de modelagem para reduzir peso, evitar nested
                desnecessário e manter performance em projetos federados de grande porte.
              </p>
            </div>
            <div className="section-head__aside">
              <span>R.BL03</span>
            </div>
          </div>

          <div className="tools-row" style={{ borderColor: 'var(--rule-inverse)' }}>
            <img src="/images/brand/revit-pro.png" alt="Autodesk Revit Professional" />
            <img src="/images/brand/aci-standard.png" alt="Autodesk Certified Instructor" />
            <img src="/images/brand/enscape.png" alt="Enscape" />
            <img src="/images/brand/prosheets.png" alt="ProSheets" />
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="cta-strip">
            <div>
              <span className="eyebrow eyebrow--on-dark">
                <span className="eyebrow__line" />
                <span className="eyebrow__code">§ BL04</span> · Custom
              </span>
              <h2>
                Bibliotecas para sua <em>linha de produtos</em>.
              </h2>
              <p>
                Atendemos fabricantes, escritórios e construtoras na criação de famílias Revit
                customizadas com parâmetros, materiais e renderização aderentes ao seu catálogo.
              </p>
            </div>
            <div className="cta-strip__actions">
              <Link href="/contato" className="btn btn-accent btn-lg">
                Solicitar bibliotecas <Icon name="arrow-right" size={14} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
