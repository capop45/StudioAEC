'use client';

import { useState } from 'react';
import type { EnrollmentSummaryDto } from '@/features/catalog/types';

interface CourseTutorPanelProps {
  enrollments: EnrollmentSummaryDto[];
}

export function CourseTutorPanel({ enrollments }: CourseTutorPanelProps) {
  const [courseId, setCourseId] = useState(enrollments[0]?.courseId ?? '');
  const [message, setMessage] = useState('');
  const [answer, setAnswer] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (enrollments.length === 0) {
    return null;
  }

  async function handleAsk(event: React.FormEvent) {
    event.preventDefault();
    if (!courseId || !message.trim()) {
      return;
    }

    setLoading(true);
    setError(null);
    setAnswer(null);

    try {
      const response = await fetch('/api/ai/tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseId, message: message.trim() }),
      });

      const data = (await response.json()) as { answer?: string; error?: string };

      if (!response.ok) {
        setError(data.error ?? 'Não foi possível consultar o tutor.');
        return;
      }

      setAnswer(data.answer ?? '');
      setMessage('');
    } catch {
      setError('Erro de rede ao consultar o tutor.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="dashboard__panel dashboard__tutor" aria-labelledby="dashboard-tutor">
      <div className="dashboard__panel-head">
        <h2 id="dashboard-tutor">Tutor IA (RAG)</h2>
        <span className="dashboard__count">Matrícula ativa obrigatória</span>
      </div>

      <form className="dashboard__tutor-form" onSubmit={handleAsk}>
        <label className="dashboard__tutor-field">
          <span>Curso</span>
          <select value={courseId} onChange={(e) => setCourseId(e.target.value)} required>
            {enrollments.map((e) => (
              <option key={e.id} value={e.courseId}>
                {e.courseTitle}
              </option>
            ))}
          </select>
        </label>

        <label className="dashboard__tutor-field">
          <span>Pergunta</span>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={3}
            placeholder="Ex.: Como configurar o template executivo no Revit?"
            required
          />
        </label>

        <button type="submit" className="btn btn-primary btn-sm" disabled={loading}>
          {loading ? 'Consultando…' : 'Perguntar ao tutor'}
        </button>
      </form>

      {error && (
        <p className="dashboard__tutor-error" role="alert">
          {error}
        </p>
      )}

      {answer && (
        <div className="dashboard__tutor-answer">
          <strong>Resposta</strong>
          <p>{answer}</p>
        </div>
      )}
    </section>
  );
}
