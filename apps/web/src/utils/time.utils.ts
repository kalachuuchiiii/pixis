// utils/time.ts  (or wherever you keep helpers)

const rtf = new Intl.RelativeTimeFormat('en', {
  numeric: 'auto',     // "yesterday" instead of "1 day ago"
  style: 'narrow',     // makes it shorter: "1h ago" instead of "1 hour ago"
});

export function timeAgo(isoString: string): string {
  const date = new Date(isoString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);


  if (diffInSeconds < 0) {
    return rtf.format(Math.abs(diffInSeconds), 'second'); // or handle differently
  }

  const intervals = [
    { label: 'year', seconds: 31536000 },
    { label: 'month', seconds: 2592000 },
    { label: 'week', seconds: 604800 },
    { label: 'day', seconds: 86400 },
    { label: 'hour', seconds: 3600 },
    { label: 'minute', seconds: 60 },
    { label: 'second', seconds: 1 },
  ] as const;

  for (const interval of intervals) {
    const count = Math.floor(diffInSeconds / interval.seconds);
    if (count >= 1) {
      return rtf.format(-count, interval.label); // negative = past
    }
  }

  return 'just now';
}