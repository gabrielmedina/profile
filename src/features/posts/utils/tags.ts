import { site } from '@/config/site'
import type { PostSummary, PostTag } from '../types'

export type TagSummary = PostTag & {
  description: string
  count: number
  latest: string
}

type CatalogTag = PostTag & {
  description: string
  aliases: readonly string[]
}

// Published name is `name`. Aliases collapse spelling and the same concept.
// A key outside the catalog still becomes its own tag.
const catalog: readonly CatalogTag[] = [
  {
    slug: 'front-end',
    name: 'Front-end',
    description:
      'Interface, arquitetura de UI e as decisões de implementação que aparecem no navegador.',
    aliases: ['front-end', 'frontend', 'front end'],
  },
  {
    slug: 'software-engineering',
    name: 'Software Engineering',
    description:
      'Como o software é desenhado e entregue: trade-offs, previsibilidade e a qualidade da decisão.',
    aliases: ['software engineering', 'engenharia de software'],
  },
  {
    slug: 'ia',
    name: 'IA',
    description:
      'Como a inteligência artificial entra no desenvolvimento e muda o que o time escreve e decide.',
    aliases: ['ia', 'ai', 'inteligencia artificial'],
  },
  {
    slug: 'spec-driven-development',
    name: 'Spec-driven Development',
    description:
      'Especificar o comportamento antes de gerar código, para a IA e o time seguirem o mesmo contrato.',
    aliases: ['spec-driven development', 'spec driven development', 'sdd'],
  },
  {
    slug: 'design-system',
    name: 'Design System',
    description:
      'Sistemas de componentes e como evoluir a interface sem perder consistência nem o contrato com quem consome.',
    aliases: ['design system', 'design systems', 'componentes', 'componente'],
  },
  {
    slug: 'ux',
    name: 'UX',
    description:
      'A experiência de quem usa o produto e como ela aparece nas decisões de interface.',
    aliases: ['ux', 'experiencia do usuario'],
  },
  {
    slug: 'react',
    name: 'React',
    description:
      'React na interface: composição, estado, dados de servidor e as escolhas que seguram uma tela grande.',
    aliases: [
      'react',
      'estado',
      'gerenciamento de estado',
      'state management',
      'tanstack query',
      'react query',
    ],
  },
  {
    slug: 'monorepos',
    name: 'Monorepos',
    description:
      'Monorepos, pacotes isolados e a organização do código entre projetos.',
    aliases: ['monorepos', 'monorepo', 'nx'],
  },
  {
    slug: 'context-api',
    name: 'Context API',
    description:
      'Quando a Context API do React serve o fluxo e quando outro modelo de estado cabe melhor.',
    aliases: ['context api', 'contextapi', 'react context'],
  },
  {
    slug: 'lideranca-tecnica',
    name: 'Liderança Técnica',
    description:
      'O papel de quem referencia o time: critério, mentoria e decisão técnica entre squads.',
    aliases: [
      'lideranca tecnica',
      'technical leadership',
      'mentoria',
      'mentorship',
    ],
  },
  {
    slug: 'cultura-de-engenharia',
    name: 'Cultura de Engenharia',
    description:
      'Hábitos, colaboração e o ambiente em que o time escreve e evolui o software.',
    aliases: ['cultura de engenharia', 'engineering culture'],
  },
]

const byAlias = new Map<string, CatalogTag>()
const bySlug = new Map<string, CatalogTag>()

for (const tag of catalog) {
  bySlug.set(tag.slug, tag)
  byAlias.set(lookupKey(tag.name), tag)

  for (const alias of tag.aliases) {
    byAlias.set(lookupKey(alias), tag)
  }
}

export function tagPath(slug: string) {
  return `${site.subjects.path}/${slug}`
}

export function tagDescription(slug: string, name: string) {
  return bySlug.get(slug)?.description ?? `Posts sobre ${name}.`
}

export function canonicalizeTags(keys: readonly string[]): PostTag[] {
  const seen = new Set<string>()
  const tags: PostTag[] = []

  for (const key of keys) {
    const trimmed = key.trim()
    if (!trimmed) continue

    const known = byAlias.get(lookupKey(trimmed))
    const slug = known?.slug || tagSlug(trimmed)
    if (!slug || seen.has(slug)) continue

    const resolved = known ?? bySlug.get(slug)
    seen.add(slug)
    tags.push(
      resolved
        ? { slug: resolved.slug, name: resolved.name }
        : { slug, name: trimmed },
    )
  }

  return tags
}

export function tagsFromPosts(posts: readonly PostSummary[]): TagSummary[] {
  const tags = new Map<string, TagSummary>()

  for (const post of posts) {
    const touched = lastTouched(post)

    for (const tag of post.tags) {
      const current = tags.get(tag.slug)

      if (!current) {
        tags.set(tag.slug, {
          slug: tag.slug,
          name: tag.name,
          description: tagDescription(tag.slug, tag.name),
          count: 1,
          latest: touched,
        })
        continue
      }

      current.count += 1
      if (touched > current.latest) current.latest = touched
    }
  }

  return [...tags.values()].sort((left, right) => {
    if (right.count !== left.count) return right.count - left.count

    return left.name.localeCompare(right.name, 'pt-BR')
  })
}

export function postsWithTag(posts: readonly PostSummary[], slug: string) {
  return posts.filter((post) => post.tags.some((tag) => tag.slug === slug))
}

export function postCountLabel(count: number) {
  return count === 1 ? '1 post' : `${count} posts`
}

function tagSlug(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function lookupKey(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .replace(/\s+/g, ' ')
}

function lastTouched(post: PostSummary) {
  return post.updated && post.updated > post.date ? post.updated : post.date
}
