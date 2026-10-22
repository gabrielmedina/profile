export type ImageSize = {
  width: number
  height: number
}

export type PostFrontmatter = {
  title: string
  description: string
  keys: string
  image?: string
  slug: string
  lang: string
  date: string
}

export type Post = PostFrontmatter & {
  readingTime: string
  wordCount: number
  content: string
  images: Record<string, ImageSize>
  contentImages: string[]
}

export type PostSummary = Omit<Post, 'content' | 'wordCount' | 'images'>
