'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Icon } from '@/components/Icon';

interface LibraryDownloadButtonProps {
  assetId: string;
  isSignedIn: boolean;
}

export function LibraryDownloadButton({ assetId, isSignedIn }: LibraryDownloadButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isSignedIn) {
    return (
      <Link
        href={`/sign-in?redirect_url=${encodeURIComponent('/bibliotecas')}`}
        className="asset-card__action"
      >
        <Icon name="download" size={13} /> Entrar para baixar
      </Link>
    );
  }

  async function handleDownload() {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/library/${assetId}/download`);
      const data = (await response.json()) as { url?: string; error?: string; code?: string };

      if (!response.ok || !data.url) {
        if (data.code === 'FORBIDDEN') {
          setError('Matrícula ativa na trilha necessária.');
        } else if (data.code === 'S3_NOT_CONFIGURED') {
          setError('Downloads em breve (S3 não configurado).');
        } else {
          setError(data.error ?? 'Download indisponível.');
        }
        return;
      }

      window.location.href = data.url;
    } catch {
      setError('Erro ao gerar link de download.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <span className="asset-card__download-wrap">
      <button
        type="button"
        className="asset-card__action asset-card__action--btn"
        onClick={handleDownload}
        disabled={loading}
      >
        <Icon name="download" size={13} /> {loading ? 'Gerando…' : 'Baixar'}
      </button>
      {error && (
        <span className="asset-card__download-error" role="alert">
          {error}
        </span>
      )}
    </span>
  );
}
