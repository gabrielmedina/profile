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
          <div className={styles.reason}>
            <p className={styles.reasonSubtitle}>
              {consulting.experience.subtitle}
            </p>
            <h2 id="experiencia" className={styles.reasonTitle}>
              {consulting.experience.title}
            </h2>
            <div className={styles.reasonText}>
              {consulting.experience.paragraphs.map((paragraph) => (
                <p key={paragraph[0].text}>
                  {paragraph.map((part) =>
                    part.emphasis ? (
                      <strong key={part.text}>{part.text}</strong>
                    ) : (
                      part.text
                    ),
                  )}
                </p>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.section} aria-labelledby="entrega">
          <h2 id="entrega" className={styles.sectionTitle}>
            {consulting.deliveryHeading}
          </h2>
          <p className={styles.lead}>{consulting.deliveryLead}</p>
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
