export function todayInBrasilia() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Sao_Paulo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}
export function sessionInstant(date, time) {
  return new Date(date + "T" + time + ":00-03:00").getTime();
}
