import { absoluteUrl } from '@/config/absolute-url'
import { site } from '@/config/site'

export const personId = `${site.url}/#person`
export const websiteId = `${site.url}/#website`

type Crumb = {
  name: string
  path: string
}

type PostListItem = {
  title: string
  slug: string
}

type ArticleTag = {
  name: string
  slug: string
}

type ArticleData = {
  title: string
  description: string
  slug: string
  date: string
  updated?: string
  lang: string
  tags: ArticleTag[]
  wordCount: number
  image?: string
  imageWidth?: number
  imageHeight?: number
}

type SubjectData = {
  name: string
  slug: string
  description: string
}

export function websiteGraph() {
  return {
    '@context': 'https://schema.org',
    '@graph': [websiteNode(), personNode()],
  }
}

export function profilePageGraph() {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    '@id': `${site.url}/#profile`,
    url: site.url,
    name: site.title,
    description: site.description,
    inLanguage: site.language,
    isPartOf: { '@id': websiteId },
    about: { '@id': personId },
    mainEntity: { '@id': personId },
  }
}

export function postsPageGraph(posts: PostListItem[]) {
  const url = absoluteUrl('/posts')

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': `${url}#page`,
        url,
        name: `${site.posts.title} - ${site.name}`,
        description: site.posts.description,
        inLanguage: site.language,
        isPartOf: { '@id': websiteId },
        mainEntity: {
          '@type': 'ItemList',
          numberOfItems: posts.length,
          itemListElement: posts.map((post, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: post.title,
            url: absoluteUrl(`/posts/${post.slug}`),
          })),
        },
      },
      breadcrumbList([
        { name: 'Início', path: '/' },
        { name: 'Posts', path: '/posts' },
      ]),
    ],
  }
}

type ConsultingOfferData = {
  name: string
  description: string
  prices: { name: string; price: number }[]
}

export function consultingPageGraph(offers: ConsultingOfferData[]) {
  const url = absoluteUrl(site.consulting.path)

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `${url}#page`,
        url,
        name: `${site.consulting.title} - ${site.name}`,
        description: site.consulting.description,
        inLanguage: site.language,
        isPartOf: { '@id': websiteId },
        about: { '@id': personId },
        mainEntity: {
          '@type': 'ItemList',
          numberOfItems: offers.length,
          itemListElement: offers.map((offer, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            item: {
              '@type': 'Service',
              name: offer.name,
              description: offer.description,
              provider: { '@id': personId },
              areaServed: 'BR',
              offers: offer.prices.map((price) => ({
                '@type': 'Offer',
                name: price.name,
                price: price.price,
                priceCurrency: 'BRL',
                availability: 'https://schema.org/InStock',
                url,
              })),
            },
          })),
        },
      },
      breadcrumbList([
        { name: 'Início', path: '/' },
        { name: site.consulting.title, path: site.consulting.path },
      ]),
    ],
  }
}

export function subjectPageGraph(tag: SubjectData, posts: PostListItem[]) {
  const url = absoluteUrl(subjectPath(tag.slug))

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': `${url}#page`,
        url,
        name: `${tag.name} - ${site.name}`,
        description: tag.description,
        inLanguage: site.language,
        isPartOf: { '@id': websiteId },
        about: definedTerm(tag),
        mainEntity: {
          '@type': 'ItemList',
          numberOfItems: posts.length,
          itemListElement: posts.map((post, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: post.title,
            url: absoluteUrl(`/posts/${post.slug}`),
          })),
        },
      },
      breadcrumbList([
        { name: 'Início', path: '/' },
        { name: 'Posts', path: '/posts' },
        { name: tag.name, path: subjectPath(tag.slug) },
      ]),
    ],
  }
}

export function postPageGraph(post: ArticleData) {
  const url = absoluteUrl(`/posts/${post.slug}`)
  const image = absoluteUrl(post.image ?? site.image.url)

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BlogPosting',
        '@id': `${url}#article`,
        url,
        mainEntityOfPage: { '@type': 'WebPage', '@id': url },
        headline: post.title,
        description: post.description,
        image: {
          '@type': 'ImageObject',
          url: image,
          ...(post.imageWidth ? { width: post.imageWidth } : {}),
          ...(post.imageHeight ? { height: post.imageHeight } : {}),
        },
        datePublished: `${post.date}T00:00:00.000Z`,
        dateModified: `${post.updated ?? post.date}T00:00:00.000Z`,
        inLanguage: post.lang,
        author: authorNode(),
        publisher: authorNode(),
        keywords: post.tags.map((tag) => tag.name).join(', '),
        articleSection: post.tags[0]?.name,
        about: post.tags.map((tag) => definedTerm(tag)),
        wordCount: post.wordCount,
        isAccessibleForFree: true,
      },
      breadcrumbList([
        { name: 'Início', path: '/' },
        { name: 'Posts', path: '/posts' },
        { name: post.title, path: `/posts/${post.slug}` },
      ]),
    ],
  }
}

function websiteNode() {
  return {
    '@type': 'WebSite',
    '@id': websiteId,
    url: site.url,
    name: site.name,
    description: site.description,
    inLanguage: site.language,
    publisher: { '@id': personId },
  }
}

function personNode() {
  return {
    '@type': 'Person',
    '@id': personId,
    name: site.name,
    url: site.url,
    image: site.avatarUrl,
    jobTitle: site.jobTitle,
    description: site.description,
    sameAs: [...site.sameAs],
    knowsAbout: [...site.knowsAbout],
    knowsLanguage: site.language,
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'BR',
    },
  }
}

function subjectPath(slug: string) {
  return `${site.subjects.path}/${slug}`
}

function definedTerm(tag: ArticleTag) {
  return {
    '@type': 'DefinedTerm',
    name: tag.name,
    url: absoluteUrl(subjectPath(tag.slug)),
    inDefinedTermSet: absoluteUrl('/posts'),
  }
}

function authorNode() {
  return {
    '@type': 'Person',
    '@id': personId,
    name: site.name,
    url: site.url,
  }
}

function breadcrumbList(items: Crumb[]) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  }
}
