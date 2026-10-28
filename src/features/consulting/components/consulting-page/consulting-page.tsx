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
          <h1 className={styles.promise}>{consulting.promise}</h1>
          <p className={styles.audience}>{consulting.audience}</p>
          <p className={styles.mechanism}>{consulting.mechanism}</p>
          <p className={styles.proof}>{consulting.proof}</p>
        </header>

        <section className={styles.section} aria-labelledby="trabalho">
          <h2 id="trabalho" className={styles.sectionTitle}>
            {consulting.workHeading}
          </h2>
          <ol className={styles.work}>
            {consulting.work.map((item) => (
              <li key={item.title}>
                <h3 className={styles.workTitle}>{item.title}</h3>
                <p className={styles.workText}>{item.text}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className={styles.section} aria-labelledby="comeco">
          <h2 id="comeco" className={styles.sectionTitle}>
            {consulting.startHeading}
          </h2>
          <p className={styles.mechanism}>{consulting.start}</p>
          <WhatsAppCta />
        </section>
      </div>
    </div>
  )
}
