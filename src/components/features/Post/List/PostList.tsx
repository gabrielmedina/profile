import Link from 'next/link'
import {FC} from 'react'
import {TPost} from '../Post.types'

type TPostListProps = {
  posts: TPost[]
}

export const PostList: FC<TPostListProps> = ({posts}) => {
  return (
    <div className="posts">
      <div className="posts__wrapper">
        <h1 className="posts__title">Posts</h1>

        <ol className="posts__list">
          {posts.map((post) => (
            <li key={post.data.slug} className="posts__list-item">
              <Link href={`/posts/${post.data.slug}`}>
                <a className="posts__list-link">
                  <h2 className="posts__list-title">{post.data.title}</h2>
                  <p className="posts__list-description">
                    {post.data.description}
                  </p>
                </a>
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </div>
  )
}
