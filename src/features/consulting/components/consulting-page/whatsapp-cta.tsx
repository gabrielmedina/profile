import { trackAttrs } from '@/components/analytics/track-attrs'
import { consulting, type ConsultingOffer } from '../../content'
import styles from './consulting.module.scss'
import { whatsappHref } from './whatsapp'

type WhatsAppCtaProps = {
  offer: ConsultingOffer
}

export function WhatsAppCta({ offer }: WhatsAppCtaProps) {
  return (
    <a
      className={styles.cta}
      href={whatsappHref(consulting.whatsapp.e164, offer.whatsappMessage)}
      rel="noopener noreferrer"
      target="_blank"
      {...trackAttrs('clicked-consulting-whatsapp', { offer: offer.id })}
    >
      <span>{offer.whatsappLabel}</span>
      <span className={styles.ctaPhone}>{consulting.whatsapp.display}</span>
    </a>
  )
}
