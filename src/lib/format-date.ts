const MONTHS = [
  'janeiro',
  'fevereiro',
  'março',
  'abril',
  'maio',
  'junho',
  'julho',
  'agosto',
  'setembro',
  'outubro',
  'novembro',
  'dezembro',
] as const

export function formatDate(isoDate: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(isoDate)

  if (!match) return isoDate

  const [, year, month, day] = match
  const monthName = MONTHS[Number(month) - 1]

  if (!monthName) return isoDate

  return `${day} ${monthName} ${year}`
}
