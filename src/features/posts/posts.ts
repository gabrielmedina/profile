import 'server-only'

import fs from 'node:fs/promises'
import path from 'node:path'
import { cacheLife } from 'next/cache'
import matter from 'gray-matter'
import { z } from 'zod'
import type { Post, PostSummary } from './types'

const postsDirectory = path.join(process.cwd(), 'content', 'posts')
const WORDS_PER_MINUTE = 200

const postFrontmatterSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  keys: z.string().min(1),
  image: z.string().min(1),
  imageAlt: z.string().min(1).optional(),
  slug: z.string().regex(/^[a-z0-9-]+$/),
  lang: z.string().min(1),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
})

function readingTimeLabel(content: string) {
  const words = content.split(' ').length

  if (words <= 0) return '~1 min de leitura'

  return `~${Math.ceil(words / WORDS_PER_MINUTE)} min de leitura`
}

function isEnoent(error: unknown) {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    error.code === 'ENOENT'
  )
}

async function readPost(slug: string): Promise<Post | null> {
  if (!/^[a-z0-9-]+$/.test(slug)) return null

  let fileContents: string

  try {
    fileContents = await fs.readFile(
      path.join(postsDirectory, `${slug}.md`),
      'utf8',
    )
  } catch (error) {
    if (isEnoent(error)) return null
    throw error
  }

  const { data, content } = matter(fileContents)
  const parsed = postFrontmatterSchema.safeParse(data)

  if (!parsed.success) {
    const details = parsed.error.issues.map((issue) => issue.message).join(', ')
    throw new Error(`Invalid frontmatter in ${slug}.md: ${details}`)
  }

  if (parsed.data.slug !== slug) {
    throw new Error(
      `Frontmatter slug "${parsed.data.slug}" does not match ${slug}.md`,
    )
  }

  return {
    ...parsed.data,
    content,
    readingTime: readingTimeLabel(content),
  }
}

function toSummary(post: Post): PostSummary {
  return {
    title: post.title,
    description: post.description,
    keys: post.keys,
    image: post.image,
    slug: post.slug,
    lang: post.lang,
    date: post.date,
    readingTime: post.readingTime,
  }
}

export async function getPost(slug: string) {
  'use cache'
  cacheLife('max')

  return readPost(slug)
}

export async function getAllPosts() {
  'use cache'
  cacheLife('max')

  const entries = await fs.readdir(postsDirectory)
  const posts = await Promise.all(
    entries
      .filter((entry) => entry.endsWith('.md'))
      .map((entry) => readPost(entry.replace(/\.md$/, ''))),
  )

  return posts
    .filter((post): post is Post => post !== null)
    .map(toSummary)
    .sort((left, right) => (left.date < right.date ? 1 : -1))
}
