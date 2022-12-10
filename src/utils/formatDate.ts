export function formatDate(date: string): string {
  const dateInstance = new Date(date);

  const dateFormated = new Intl.DateTimeFormat("pt-BR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(dateInstance);

  const hour = new Intl.DateTimeFormat("pt-BR", {
    hour: "numeric",
    dayPeriod: "long",
  }).format(dateInstance);

  return `${hour}h - ${dateFormated}`;
}
