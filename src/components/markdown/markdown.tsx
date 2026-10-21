import ReactMarkdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'

type MarkdownProps = {
  source: string
}

export function Markdown({ source }: MarkdownProps) {
  return <ReactMarkdown rehypePlugins={[rehypeRaw]}>{source}</ReactMarkdown>
}
