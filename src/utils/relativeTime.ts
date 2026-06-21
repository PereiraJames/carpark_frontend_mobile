/** Coarse, human-friendly "time ago" label: ~1 second ago, ~10 seconds ago, ~30 seconds ago, 1 min ago, ... */
export function formatRelativeTime(date: Date, now: Date = new Date()): string {
  const diffSec = Math.max(0, Math.round((now.getTime() - date.getTime()) / 1000));

  if (diffSec < 5) return '~1 second ago';
  if (diffSec < 20) return '~10 seconds ago';
  if (diffSec < 45) return '~30 seconds ago';
  if (diffSec < 90) return '1 min ago';

  const diffMin = Math.round(diffSec / 60);
  if (diffMin < 60) return `${diffMin} min ago`;

  const diffHour = Math.round(diffMin / 60);
  return `${diffHour} hour${diffHour === 1 ? '' : 's'} ago`;
}
