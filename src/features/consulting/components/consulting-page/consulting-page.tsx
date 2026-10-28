import Image from 'next/image'
import { Breadcrumbs } from '@/components/breadcrumbs/breadcrumbs'
import article from '@/features/posts/components/post-article/post-article.module.scss'
import { consulting } from '../../content'
import styles from './consulting.module.scss'
import { Emphasis } from './emphasis'
import { WhatsAppCta } from './whatsapp-cta'

function StepText({ text }: { text: string }) {
  const breakAt = text.indexOf('. ')

  if (breakAt === -1) return text

  return (
    <p>
      <span className={styles.stepLead}>{text.slice(0, breakAt + 1)}</span>{' '}
      {text.slice(breakAt + 2)}
    </p>
  )
}

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
            <h2 id="como-funciona">{consulting.howHeading}</h2>
            <ol className={styles.steps}>
              {consulting.steps.map((step) => (
                <li key={step}>
                  <StepText text={step} />
                </li>
              ))}
            </ol>
            <WhatsAppCta />
          </div>
        </div>
      </div>
    </div>
  )
}
