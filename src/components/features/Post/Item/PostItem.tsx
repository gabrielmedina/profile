import {FC} from 'react'
import ReactMarkdown from 'react-markdown'
import {formatDate} from 'src/libs'
import {TPost} from '../Post.types'

type TPostItemProps = {
  post: TPost
}

export const PostItem: FC<TPostItemProps> = ({post}) => {
  return (
    <article className="post">
      <div className="post__wrapper">
        <header className="post__header">
          <h2 className="post__title">{post.data.title}</h2>
          <p className="post__description">{post.data.description}</p>
          <time dateTime={post.data.date} className="post__date">
            {formatDate(post.data.date)}
          </time>
        </header>

        <ReactMarkdown className="post__content">{post.content}</ReactMarkdown>

        <footer className="post__footer">
          <p className="post__footer-copy">Just keep going, Gabriel Medina.</p>
          <p className="post__footer-keywords">Keywords: {post.data.keys}.</p>
        </footer>
      </div>
    </article>
  )
}
