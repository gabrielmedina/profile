const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const
const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
] as const

// Calendar math, not `Date`, so prerender stays deterministic under Cache Components.
export function rfc822Date(isoDate: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(isoDate)

  if (!match) return isoDate

  const year = Number(match[1])
  const month = Number(match[2])
  const day = Number(match[3])
  const monthName = MONTHS[month - 1]

  if (!monthName || day < 1 || day > 31) return isoDate

  const weekday = DAYS[dayOfWeek(year, month, day)]
  const paddedDay = String(day).padStart(2, '0')

  return `${weekday}, ${paddedDay} ${monthName} ${year} 00:00:00 GMT`
}

function dayOfWeek(year: number, month: number, day: number) {
  const offsets = [0, 3, 2, 5, 0, 3, 5, 1, 4, 6, 2, 4]
  const adjustedYear = month < 3 ? year - 1 : year

  return (
    (adjustedYear +
      Math.floor(adjustedYear / 4) -
      Math.floor(adjustedYear / 100) +
      Math.floor(adjustedYear / 400) +
      (offsets[month - 1] ?? 0) +
      day) %
    7
  )
}
