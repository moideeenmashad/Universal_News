declare module 'date-fns' {
  export function format(date: Date | number, formatStr: string): string;
  export function formatDistanceToNow(
    date: Date | number,
    options?: { addSuffix?: boolean }
  ): string;
  export function isValid(date: any): date is Date;
  export function formatRelativeTime(
    date: Date | number,
    baseDate?: Date | number,
    options?: { addSuffix?: boolean }
  ): string;
}

