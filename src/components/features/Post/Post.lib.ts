import fs from 'fs'
import { join } from 'path'
import matter from 'gray-matter'

const postsDirectory = join(process.cwd(), 'posts')

export const getPostSlugs = () => {
  return fs.readdirSync(postsDirectory)
}

export const getPostBySlug = (slug: string) => {
  const realSlug = slug.replace(/\.md$/, '')
  const fullPath = join(postsDirectory, `${realSlug}.md`)
  const fileContents = fs.readFileSync(fullPath, 'utf8')
  const { data, content } = matter(fileContents)

  data.timeToRead = getTimeToReadPost(content)
  
  return {
    data,
    content
  }
}

export const getAllPosts = () => {
  const slugs = getPostSlugs()

  const posts = slugs
    .map(slug => getPostBySlug(slug))
    .sort((post1, post2) => (post1.data.date > post2.data.date ? -1 : 1))

  return posts
}

export const getTimeToReadPost = (content: string) => {
  const wordsPerMinute = 200
  
  let wordsQuantity = content.split(' ').length

  if (wordsQuantity > 0) {
    const value = Math.ceil(wordsQuantity / wordsPerMinute)
    
    return `~${value} min de leitura`
  }

  return '~1 min de leitura'
}