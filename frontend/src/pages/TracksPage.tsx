import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiGet } from '../api/client';
import { TrackIcon } from '../components/TrackIcon';
import type { CourseTrack } from '../types';
import '../styles/home.css';

export function TracksPage() {
  const [tracks, setTracks] = useState<CourseTrack[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiGet<CourseTrack[]>('/api/tracks')
      .then(setTracks)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="page-loading container">Carregando trilhas…</p>;

  return (
    <div className="container" style={{ padding: '2rem 0 3rem' }}>
      <h1 className="section-title">Todas as trilhas</h1>
      <p className="section-sub">
        Escolha sua área de especialização. Cada trilha agrupa cursos, templates e bibliotecas relacionados.
      </p>
      <div className="tracks-grid">
        {tracks.map((track) => (
          <Link key={track.id} to={`/trilhas/${track.slug}`} className="card track-card">
            <div
              className="track-card__icon"
              style={{ background: `${track.color}22`, color: track.color }}
            >
              <TrackIcon name={track.icon} />
            </div>
            <h3>{track.title}</h3>
            <p>{track.description}</p>
            <div className="track-card__meta">
              <span>{track.courseCount} cursos</span>
              <span>{track.totalHours}h</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
