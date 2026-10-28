import Image from 'next/image'
import { trackAttrs } from '@/components/analytics/track-attrs'
import { Breadcrumbs } from '@/components/breadcrumbs/breadcrumbs'
import {
  consulting,
  consultingCover,
  offerPath,
  type ConsultingOffer,
} from '../../content'
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

        <div className={styles.hero}>
          <header className={styles.header}>
            <h1 className={styles.title}>{consulting.title}</h1>
            <p className={styles.subtitle}>{consulting.subtitle}</p>
            <p className={styles.lead}>{consulting.intro}</p>
          </header>
          <figure className={styles.cover}>
            <Image
              src={consultingCover.src}
              alt={consultingCover.alt}
              width={consultingCover.width}
              height={consultingCover.height}
              priority
              sizes="(min-width: 900px) 640px, 100vw"
              className={styles.coverImage}
            />
          </figure>
        </div>

        <section className={styles.section} aria-labelledby="experiencia">
          <h2 id="experiencia" className={styles.sectionTitle}>
            {consulting.experience.heading}
          </h2>
          <p className={styles.statement}>{consulting.experience.statement}</p>
          <p className={styles.statementNote}>{consulting.experience.note}</p>
          <div className={styles.cases}>
            {consulting.experience.cases.map((item) => (
              <article key={item.company} className={styles.case}>
                <h3 className={styles.caseName}>{item.company}</h3>
                <p className={styles.caseText}>{item.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.section} aria-labelledby="entrega">
          <h2 id="entrega" className={styles.sectionTitle}>
            {consulting.deliveryHeading}
          </h2>
          <p className={styles.statementNote}>{consulting.deliveryLead}</p>
          <div className={styles.cards}>
            {consulting.offers.map((offer) => (
              <OfferCard key={offer.id} offer={offer} />
            ))}
          </div>
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
