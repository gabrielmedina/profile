import Image from 'next/image'
import { Breadcrumbs } from '@/components/breadcrumbs/breadcrumbs'
import article from '@/features/posts/components/post-article/post-article.module.scss'
import { consulting } from '../../content'
import styles from './consulting.module.scss'
import { Emphasis } from './emphasis'
import { WhatsAppCta } from './whatsapp-cta'

export function ConsultingPage() {
  return (
    <div className={article.wrapper}>
      <div className={article.container}>
        <div className={article.readingRange}>
          <Breadcrumbs
            items={[
              { name: 'Início', href: '/' },
              { name: consulting.title, href: consulting.path },
            ]}
          />

          <header className={article.header}>
            <h1 className={article.title}>{consulting.promise}</h1>
            <p className={article.description}>{consulting.audience}</p>
          </header>

          <div className={`${article.content} ${styles.body}`}>
            <Image
              src={consulting.cover.src}
              alt={consulting.cover.alt}
              width={consulting.cover.width}
              height={consulting.cover.height}
              priority
              sizes="(min-width: 1200px) 1200px, 100vw"
            />
            <p>
              <Emphasis text={consulting.mechanism} />
            </p>
            <p>
              <Emphasis text={consulting.proof} />
            </p>
            <h2 id="trabalho">{consulting.workHeading}</h2>
            {consulting.work.map((paragraph) => (
              <p key={paragraph}>
                <Emphasis text={paragraph} />
              </p>
            ))}
            <section className={styles.close} aria-labelledby="convite">
              <h2 id="convite">{consulting.ask}</h2>
              <WhatsAppCta />
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
