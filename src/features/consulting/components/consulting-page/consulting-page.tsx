import { trackAttrs } from '@/components/analytics/track-attrs'
import { Breadcrumbs } from '@/components/breadcrumbs/breadcrumbs'
import { consulting, type ConsultingOffer } from '../../content'
import styles from './consulting-page.module.scss'
import { whatsappHref } from './whatsapp'

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
        <header className={styles.header}>
          <h1 className={styles.title}>{consulting.title}</h1>
          <p className={styles.subtitle}>{consulting.subtitle}</p>
          <p className={styles.lead}>{consulting.intro}</p>
        </header>

        <section className={styles.section} aria-labelledby="experiencia">
          <h2 id="experiencia" className={styles.sectionTitle}>
            {consulting.experience.heading}
          </h2>
          <p className={styles.body}>{consulting.experience.body}</p>
          <ul className={styles.items}>
            {consulting.experience.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section className={styles.section} aria-labelledby="entrega">
          <h2 id="entrega" className={styles.sectionTitle}>
            {consulting.deliveryHeading}
          </h2>
          <div className={styles.offers}>
            {consulting.offers.map((offer) => (
              <Offer key={offer.id} offer={offer} />
            ))}
          </div>
        </section>

        <section className={styles.section} aria-labelledby="tamanho">
          <h2 id="tamanho" className={styles.sectionTitle}>
            {consulting.scope.heading}
          </h2>
          <ul className={styles.items}>
            {consulting.scope.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  )
}

function Offer({ offer }: { offer: ConsultingOffer }) {
  const href = whatsappHref(consulting.whatsapp.e164, offer.whatsappMessage)

  return (
    <article className={styles.offer} aria-labelledby={offer.id}>
      <h3 id={offer.id} className={styles.offerTitle}>
        {offer.title}
      </h3>
      <p className={styles.body}>{offer.summary}</p>
      <ol className={styles.steps}>
        {offer.steps.map((step) => (
          <li key={step}>{step}</li>
        ))}
      </ol>
      {offer.groups.map((group) => (
        <div
          key={group.intro ?? group.prices[0].label}
          className={styles.group}
        >
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
      <p className={styles.contact}>
        <a
          className={styles.whatsapp}
          href={href}
          rel="noopener noreferrer"
          target="_blank"
          {...trackAttrs('clicked-consulting-whatsapp', { offer: offer.id })}
        >
          {offer.whatsappLabel}
        </a>
        <span className={styles.phone}>{consulting.whatsapp.display}</span>
      </p>
      <p className={styles.messageLabel}>
        A mensagem abre pronta, para você completar:
      </p>
      <blockquote className={styles.message}>
        {offer.whatsappMessage}
      </blockquote>
    </article>
  )
}
