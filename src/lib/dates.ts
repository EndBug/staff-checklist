export function startOfLocalDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function startOfLocalDayMs(date: Date): number {
  return startOfLocalDay(date).getTime();
}

export function endOfLocalDayExclusiveMs(date: Date): number {
  const end = startOfLocalDay(date);
  end.setDate(end.getDate() + 1);
  return end.getTime();
}

export function addLocalDays(date: Date, days: number): Date {
  const result = startOfLocalDay(date);
  result.setDate(result.getDate() + days);
  return result;
}

export function isSameLocalDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}
