import { useEffect, useState } from 'react';

import { formatRelativeTime } from '../utils/relativeTime';

/** Live "~N ago" label for `date`, ticking every second while mounted. */
export function useRelativeTime(date: Date | null): string | null {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    if (!date) return;
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, [date]);

  if (!date) return null;
  return formatRelativeTime(date, now);
}
