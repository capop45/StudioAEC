const ICONS: Record<string, string> = {
  buildings: '🏛',
  drop: '💧',
  lightning: '⚡',
  shield: '🛡',
  wind: '🌬',
  columns: '🏗'
};

export function TrackIcon({ name }: { name: string }) {
  return <span aria-hidden="true">{ICONS[name] ?? '📘'}</span>;
}
