export type PostFrontmatter = {
  title: string
  description: string
  keys: string
  image?: string
  imageAlt?: string
  slug: string
  lang: string
  date: string
}

export type Post = PostFrontmatter & {
  readingTime: string
  content: string
}

export type PostSummary = Omit<Post, 'content'>
