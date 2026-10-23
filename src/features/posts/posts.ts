import 'server-only'

import fs from 'node:fs/promises'
import path from 'node:path'
import { cacheLife } from 'next/cache'
import matter from 'gray-matter'
import { z } from 'zod'
import { readImageSize } from './image-size'
import type { ImageSize, Post, PostSummary } from './types'

const postsDirectory = path.join(process.cwd(), 'content', 'posts')
const WORDS_PER_MINUTE = 200

const postFrontmatterSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  keys: z.string().min(1),
  image: z.string().min(1).optional(),
  slug: z.string().regex(/^[a-z0-9-]+$/),
  lang: z.string().min(1),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
})

function readingTimeLabel(wordCount: number) {
  return `~${Math.ceil(wordCount / WORDS_PER_MINUTE)} min de leitura`
}

function countWords(content: string) {
  const plain = content
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/!\[[^\]]*]\([^)]*\)/g, ' ')
    .replace(/[#>*_[\]]/g, ' ')
  const words = plain.trim().split(/\s+/).filter(Boolean)

  return Math.max(words.length, 1)
}

function contentImagePaths(content: string) {
  return [
    ...new Set(
      [...content.matchAll(/!\[[^\]]*]\((\/[^)\s]+)\)/g)]
        .map((match) => match[1])
        .filter((src): src is string => Boolean(src)),
    ),
  ]
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

  const contentImages = contentImagePaths(content)
  const sources = [
    ...new Set([
      ...contentImages,
      ...(parsed.data.image ? [parsed.data.image] : []),
    ]),
  ]
  const measured = await Promise.all(
    sources.map(async (src) => [src, await readImageSize(src)] as const),
  )
  const images: Record<string, ImageSize> = {}

  for (const [src, size] of measured) {
    if (size) images[src] = size
  }

  const wordCount = countWords(content)

  return {
    ...parsed.data,
    content,
    readingTime: readingTimeLabel(wordCount),
    wordCount,
    images,
    contentImages,
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
    contentImages: post.contentImages,
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
