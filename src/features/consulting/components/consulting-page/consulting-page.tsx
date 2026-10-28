import Image from 'next/image'
import { Breadcrumbs } from '@/components/breadcrumbs/breadcrumbs'
import {
  consulting,
  consultingCover,
  offerPath,
  type ConsultingOffer,
} from '../../content'
import styles from './consulting.module.scss'

export function ConsultingPage() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
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
              sizes="(min-width: 768px) 480px, 100vw"
              className={styles.coverImage}
            />
          </figure>
        </div>

        <section className={styles.section} aria-labelledby="experiencia">
          <h2 id="experiencia" className={styles.sectionTitle}>
            {consulting.experience.heading}
          </h2>
          <p className={styles.body}>{consulting.experience.body}</p>
          <ul className={styles.experience}>
            {consulting.experience.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section className={styles.section} aria-labelledby="entrega">
          <h2 id="entrega" className={styles.sectionTitle}>
            {consulting.deliveryHeading}
          </h2>
          <div className={styles.cards}>
            {consulting.offers.map((offer) => (
              <OfferCard key={offer.id} offer={offer} />
            ))}
          </div>
        </section>

        <section className={styles.section} aria-labelledby="tamanho">
          <h2 id="tamanho" className={styles.sectionTitle}>
            {consulting.scope.heading}
          </h2>
          <ul className={styles.scope}>
            {consulting.scope.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  )
}

function OfferCard({ offer }: { offer: ConsultingOffer }) {
  const from = offer.groups[0]?.prices[0]

  return (
    <a className={styles.card} href={offerPath(offer.slug)}>
      <p className={styles.eyebrow}>{offer.eyebrow}</p>
      <h3 className={styles.cardTitle}>{offer.title}</h3>
      <p className={styles.cardSummary}>{offer.summary}</p>
      {from ? (
        <p className={styles.cardFrom}>A partir de {from.display}</p>
      ) : null}
      <p className={styles.cardAction}>Ver o formato</p>
    </a>
  )
}
