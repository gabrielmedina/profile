import { Breadcrumbs } from '@/components/breadcrumbs/breadcrumbs'
import { consulting, offerPath, type ConsultingOffer } from '../../content'
import styles from './consulting.module.scss'
import { WhatsAppCta } from './whatsapp-cta'

type ConsultingOfferPageProps = {
  offer: ConsultingOffer
}

export function ConsultingOfferPage({ offer }: ConsultingOfferPageProps) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <Breadcrumbs
          items={[
            { name: 'Início', href: '/' },
            { name: consulting.title, href: consulting.path },
            { name: offer.title, href: offerPath(offer.slug) },
          ]}
        />

        <header className={styles.header}>
          <h1 className={styles.title}>{offer.title}</h1>
          <p className={styles.lead}>{offer.summary}</p>
          <WhatsAppCta offer={offer} />
        </header>

        <section className={styles.section} aria-labelledby="como">
          <h2 id="como" className={styles.sectionTitle}>
            Como funciona
          </h2>
          <ol className={styles.steps}>
            {offer.steps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
          <p className={styles.boundary}>{offer.boundary}</p>
        </section>

        <section className={styles.section} aria-labelledby="valores">
          <h2 id="valores" className={styles.sectionTitle}>
            Valores
          </h2>
          {offer.groups.map((group) => (
            <div key={group.intro ?? group.prices[0].label}>
              {group.intro ? (
                <p className={styles.groupIntro}>{group.intro}</p>
              ) : null}
              <dl className={styles.prices}>
                {group.prices.map((price) => (
                  <div key={price.label} className={styles.price}>
                    <dt>{price.label}</dt>
                    <dd>{price.display}</dd>
                  </div>
                ))}
              </dl>
            </div>
          ))}
          <p className={styles.note}>{offer.note}</p>
          <WhatsAppCta offer={offer} />
        </section>
      </div>
    </div>
  )
}
