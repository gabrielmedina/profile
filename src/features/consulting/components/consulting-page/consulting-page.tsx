import { trackAttrs } from '@/components/analytics/track-attrs'
import { Breadcrumbs } from '@/components/breadcrumbs/breadcrumbs'
import { consulting, offerPath, type ConsultingOffer } from '../../content'
import styles from './consulting.module.scss'
import { OfferIcon } from './offer-icon'

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
        </header>

        <section className={styles.proof} aria-label="De onde sai o critério">
          <ul className={styles.proofList}>
            {consulting.proof.map((item) => (
              <li key={item.value}>
                <p className={styles.proofValue}>{item.value}</p>
                <p className={styles.proofCaption}>{item.caption}</p>
              </li>
            ))}
          </ul>
          <p className={styles.proofNote}>{consulting.proofNote}</p>
        </section>

        <section className={styles.choice} aria-labelledby="formato">
          <h2 id="formato" className={styles.sectionTitle}>
            {consulting.choiceHeading}
          </h2>
          <div className={styles.cards}>
            {consulting.offers.map((offer) => (
              <OfferCard key={offer.id} offer={offer} />
            ))}
          </div>
          <p className={styles.fit}>{consulting.fit}</p>
        </section>
      </div>
    </div>
  )
}

function OfferCard({ offer }: { offer: ConsultingOffer }) {
  const tone =
    offer.id === 'individual' ? styles.cardIndividual : styles.cardCompany

  return (
    <a
      className={`${styles.card} ${tone}`}
      href={offerPath(offer.slug)}
      {...trackAttrs('clicked-consulting-offer', { offer: offer.id })}
    >
      <span className={styles.icon} aria-hidden="true">
        <OfferIcon id={offer.id} />
      </span>
      <div className={styles.cardCopy}>
        <p className={styles.cardKicker}>{offer.kicker}</p>
        <h3 className={styles.cardTitle}>{offer.title}</h3>
        <p className={styles.cardSummary}>{offer.summary}</p>
      </div>
      <span className={styles.more}>Quero saber mais</span>
    </a>
  )
}
