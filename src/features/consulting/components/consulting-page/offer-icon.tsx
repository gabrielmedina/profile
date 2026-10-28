import type { ConsultingOffer } from '../../content'

type OfferIconProps = {
  id: ConsultingOffer['id']
}

export function OfferIcon({ id }: OfferIconProps) {
  return id === 'individual' ? <Person /> : <People />
}

function Person() {
  return (
    <svg viewBox="0 0 64 64" width="64" height="64" fill="none">
      <circle cx="32" cy="18" r="8" stroke="currentColor" strokeWidth="2" />
      <path
        d="M14 50c2.2-10 8.2-15 18-15s15.8 5 18 15"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  )
}

function People() {
  return (
    <svg viewBox="0 0 88 64" width="88" height="64" fill="none">
      <circle cx="22" cy="22" r="6" stroke="currentColor" strokeWidth="2" />
      <path
        d="M10 48c1.6-7 6-11 12-11s10.4 4 12 11"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="66" cy="22" r="6" stroke="currentColor" strokeWidth="2" />
      <path
        d="M54 48c1.6-7 6-11 12-11s10.4 4 12 11"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="44" cy="16" r="8" stroke="currentColor" strokeWidth="2" />
      <path
        d="M26 52c2.2-11 8-16 18-16s15.8 5 18 16"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  )
}
