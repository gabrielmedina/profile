import { FC } from 'react'
import Link from 'next/link'
import { TPost } from '../Post.types'
import styles from './PostItem.module.scss'

type TPostItemProps = Pick<TPost, 'data'>

export const PostItem: FC<TPostItemProps> = ({ data }) => {
  return (
    <Link href={`/posts/${data.slug}`}>
      <a className={styles.link}>
        <h2 className={styles.title}>{data.title}</h2>
        <p className={styles.description}>{data.description}</p>
      </a>
    </Link>
  )
}
