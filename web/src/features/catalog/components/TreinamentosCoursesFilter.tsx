'use client';

import { useMemo, useState } from 'react';
import { Icon } from '@/components/Icon';
import type { CourseDto, CourseTrackDto } from '@/features/catalog/types';

interface TreinamentosCoursesFilterProps {
  tracks: CourseTrackDto[];
  courses: CourseDto[];
}

export function TreinamentosCoursesFilter({ tracks, courses }: TreinamentosCoursesFilterProps) {
  const [filter, setFilter] = useState<string>('all');

  const visibleCourses = useMemo(
    () => (filter === 'all' ? courses : courses.filter((c) => c.trackId === filter)),
    [filter, courses],
  );

  return (
    <>
      <div className="filters-bar" role="tablist" aria-label="Filtrar por trilha">
        <button
          type="button"
          role="tab"
          aria-pressed={filter === 'all'}
          onClick={() => setFilter('all')}
        >
          Todos
        </button>
        {tracks.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-pressed={filter === t.id}
            onClick={() => setFilter(t.id)}
          >
            {t.title}
          </button>
        ))}
      </div>

      <div className="courses-grid">
        {visibleCourses.map((course, idx) => (
          <article key={course.id} className="course-card">
            <div className="course-card__media">
              <img src={course.thumbnail} alt="" loading="lazy" />
              <span className="badge badge--brand course-card__plate">
                C.{String(idx + 1).padStart(3, '0')}
              </span>
            </div>
            <div className="course-card__body">
              <span className="badge">{course.level}</span>
              <h3>{course.title}</h3>
              <p className="course-card__summary">{course.summary}</p>
              <div className="course-card__meta">
                <span>
                  <Icon name="clock" size={13} /> {course.durationHours}h
                </span>
                <span>
                  <Icon name="star" size={13} /> {course.rating.toFixed(1)}
                </span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
