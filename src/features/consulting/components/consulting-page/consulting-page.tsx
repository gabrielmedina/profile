import { Breadcrumbs } from '@/components/breadcrumbs/breadcrumbs'
import article from '@/features/posts/components/post-article/post-article.module.scss'
import { consulting } from '../../content'
import styles from './consulting.module.scss'
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
            <p>{consulting.mechanism}</p>
            <p>{consulting.proof}</p>
            <h2 id="trabalho">{consulting.workHeading}</h2>
            {consulting.work.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            <h2 id="convite">{consulting.ask}</h2>
            <WhatsAppCta />
          </div>
        </div>
      </div>
    </div>
  )
}
