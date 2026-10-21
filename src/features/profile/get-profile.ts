import 'server-only'

import { cacheLife } from 'next/cache'
import { z } from 'zod'
import type { ProfileContent } from './types'

const githubUserSchema = z.object({
  avatar_url: z.url(),
  name: z.string().nullable(),
  bio: z.string().nullable(),
})

const githubUserUrl = 'https://api.github.com/users/gabrielmedina'
const readmeUrl =
  'https://raw.githubusercontent.com/gabrielmedina/gabrielmedina/main/README.md'

async function readText(url: string, label: string) {
  const response = await fetch(url, {
    headers: {
      Accept: 'application/vnd.github+json',
      'User-Agent': 'gabrielmedina-profile',
    },
  })

  if (!response.ok) {
    throw new Error(`${label} failed with status ${response.status}`)
  }

  return response.text()
}

export async function getProfile(): Promise<ProfileContent> {
  'use cache'
  cacheLife('weeks')

  const [userPayload, content] = await Promise.all([
    readText(githubUserUrl, 'GitHub profile'),
    readText(readmeUrl, 'GitHub README'),
  ])

  const user = githubUserSchema.parse(JSON.parse(userPayload))

  return {
    user: {
      avatarUrl: user.avatar_url,
      name: user.name ?? 'Gabriel Medina',
      bio: user.bio ?? '',
    },
    content,
  }
}
