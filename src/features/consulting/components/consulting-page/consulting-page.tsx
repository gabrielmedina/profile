import { Breadcrumbs } from '@/components/breadcrumbs/breadcrumbs'
import { consulting } from '../../content'
import styles from './consulting.module.scss'
import { WhatsAppCta } from './whatsapp-cta'

export function ConsultingPage() {
  return (
    <div className={styles.wrapper}>
      <div className={`${styles.container} ${styles.landing}`}>
        <Breadcrumbs
          items={[
            { name: 'Início', href: '/' },
            { name: consulting.title, href: consulting.path },
          ]}
        />

        <header className={styles.pitch}>
          <h1 className={styles.title}>{consulting.promise}</h1>
          <p className={styles.subtitle}>{consulting.audience}</p>
          <p className={styles.lead}>{consulting.mechanism}</p>
          <p className={styles.proof}>{consulting.proof}</p>
        </header>

        <section className={styles.section} aria-labelledby="trabalho">
          <h2 id="trabalho" className={styles.sectionTitle}>
            {consulting.workHeading}
          </h2>
          <div className={styles.work}>
            {consulting.work.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </section>

        <section className={styles.section} aria-labelledby="convite">
          <h2 id="convite" className={styles.ask}>
            {consulting.ask}
          </h2>
          <WhatsAppCta />
        </section>
      </div>
    </div>
  )
}
