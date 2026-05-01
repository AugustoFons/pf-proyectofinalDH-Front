export const MONTHS_ES = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

export const DAYS_ES = ["Lu", "Ma", "Mi", "Ju", "Vi", "Sa", "Do"];

export function parseDate(str: string | undefined | null): Date | null {
  if (!str) return null;
  const d = new Date(str + "T00:00:00");
  return isNaN(d.getTime()) ? null : d;
}

export function toDateStr(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function addMonths(year: number, month: number, delta: number) {
  const d = new Date(year, month + delta, 1);
  return { year: d.getFullYear(), month: d.getMonth() };
}

export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

export function getFirstDayOfMonth(year: number, month: number): number {
  // Basado en Lunes: 0=Lu … 6=Do
  const day = new Date(year, month, 1).getDay();
  return (day + 6) % 7;
}

export function generateCalendarCells(year: number, month: number): (Date | null)[] {
  const days = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  
  const cells: (Date | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: days }, (_, i) => new Date(year, month, i + 1)),
  ];
  
  while (cells.length % 7 !== 0) cells.push(null);
  
  return cells;
}
