interface FormateDatetimeOptions {
  dateStyle?: 'full' | 'long' | 'medium' | 'short';
  timeStyle?: 'full' | 'long' | 'medium' | 'short';
}

export const formateDatetime = (timestamp: number, options?: FormateDatetimeOptions) =>
  new Intl.DateTimeFormat('en-GB', {
    dateStyle: 'medium',
    timeStyle: 'short',
    ...options,
  }).format(new Date(timestamp));
