import {FC} from 'react'
import {PostItem} from '../Item/PostItem'
import {TPost} from '../Post.types'
import styles from './PostList.module.scss'

type TPostListProps = {
  posts: TPost[]
}

export const PostList: FC<TPostListProps> = ({posts}) => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <h1 className={styles.title}>Posts</h1>

        <ol className={styles.list}>
          {posts.map((post) => (
            <li key={post.data.slug} className={styles.listItem}>
              <PostItem data={post.data} />
            </li>
          ))}
        </ol>
      </div>
    </div>
  )
}
