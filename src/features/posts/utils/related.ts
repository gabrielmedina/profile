import type { PostSummary } from '../types'

export function relatedPosts(
  current: PostSummary,
  posts: PostSummary[],
  limit = 2,
) {
  const currentTags = new Set(current.tags.map((tag) => tag.slug))

  return posts
    .filter((post) => post.slug !== current.slug)
    .map((post) => ({
      post,
      score: post.tags.filter((tag) => currentTags.has(tag.slug)).length,
    }))
    .sort((left, right) => {
      if (right.score !== left.score) return right.score - left.score
      if (left.post.date === right.post.date) return 0

      return left.post.date < right.post.date ? 1 : -1
    })
    .slice(0, limit)
    .map((entry) => entry.post)
}
