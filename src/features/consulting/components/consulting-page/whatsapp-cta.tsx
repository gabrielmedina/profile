import { trackAttrs } from '@/components/analytics/track-attrs'
import { consulting } from '../../content'
import styles from './consulting.module.scss'
import { whatsappHref } from './whatsapp'

export function WhatsAppCta() {
  const { whatsapp } = consulting

  return (
    <a
      className={styles.cta}
      href={whatsappHref(whatsapp.e164, whatsapp.message)}
      {...trackAttrs('clicked-consulting-whatsapp')}
    >
      {whatsapp.label}
    </a>
  )
}
