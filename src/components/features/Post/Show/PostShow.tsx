import {FC} from 'react'
import ReactMarkdown from 'react-markdown'
import {formatDate} from 'src/libs'
import {TPost} from '../Post.types'
import styles from './PostShow.module.scss'

type TPostShowProps = {
  post: TPost
}

export const PostShow: FC<TPostShowProps> = ({post}) => {
  return (
    <article className={styles.wrapper}>
      <div className={styles.container}>
        <header className={styles.header}>
          <h2 className={styles.title}>{post.data.title}</h2>
          <p className={styles.description}>{post.data.description}</p>
          <time dateTime={post.data.date} className={styles.date}>
            {formatDate(post.data.date)}
          </time>
        </header>

        <ReactMarkdown className={styles.content}>{post.content}</ReactMarkdown>

        <footer className={styles.footer}>
          <p className={styles.copy}>Just keep going, Gabriel Medina.</p>
          <p className={styles.keywords}>Keywords: {post.data.keys}.</p>
        </footer>
      </div>
    </article>
  )
}
