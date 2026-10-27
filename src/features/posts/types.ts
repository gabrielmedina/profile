export type ImageSize = {
  width: number
  height: number
}

export type PostTag = {
  slug: string
  name: string
}

export type PostFrontmatter = {
  title: string
  description: string
  keywords: string[]
  tags: PostTag[]
  image?: string
  slug: string
  lang: string
  date: string
  updated?: string
}

export type Post = PostFrontmatter & {
  readingTime: string
  wordCount: number
  content: string
  images: Record<string, ImageSize>
  contentImages: string[]
}

export type PostSummary = Omit<Post, 'content' | 'wordCount' | 'images'>
