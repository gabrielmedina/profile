import type { Metadata } from 'next'
import { absoluteUrl } from '@/config/absolute-url'
import { site } from '@/config/site'

type SocialImage = {
  url: string
  alt: string
  width?: number
  height?: number
}

type PageMetadataOptions = {
  title?: string
  description: string
  path: string
  keywords?: readonly string[]
  image?: SocialImage
  kind?: 'website' | 'profile' | 'article'
  publishedTime?: string
  modifiedTime?: string
  tags?: string[]
  section?: string
}

const defaultImage: SocialImage = {
  url: site.image.url,
  alt: site.image.alt,
  width: site.image.width,
  height: site.image.height,
}

export const noIndexRobots: Metadata['robots'] = {
  index: false,
  follow: true,
  googleBot: {
    index: false,
    follow: true,
    'max-image-preview': 'none',
    'max-snippet': -1,
    'max-video-preview': -1,
  },
}

export const feedAlternates: Metadata['alternates'] = {
  types: {
    'application/rss+xml': site.feedPath,
  },
}

export function pageMetadata({
  title,
  description,
  path,
  keywords,
  image = defaultImage,
  kind = 'website',
  publishedTime,
  modifiedTime,
  tags,
  section,
}: PageMetadataOptions): Metadata {
  const socialTitle = title ? `${title} - ${site.name}` : site.title
  const url = absoluteUrl(path)
  const socialImage = imageDescriptor(image)
  const shared = {
    title: socialTitle,
    description,
    url,
    siteName: site.name,
    locale: site.locale,
    images: [socialImage],
  }

  const openGraph: Metadata['openGraph'] =
    kind === 'article'
      ? {
          ...shared,
          type: 'article',
          publishedTime,
          modifiedTime: modifiedTime ?? publishedTime,
          authors: [site.url],
          tags,
          section,
        }
      : kind === 'profile'
        ? {
            ...shared,
            type: 'profile',
            firstName: 'Gabriel',
            lastName: 'Medina',
            username: 'gabrielmedina',
          }
        : {
            ...shared,
            type: 'website',
          }

  return {
    ...(title ? { title } : {}),
    description,
    ...(keywords ? { keywords: [...keywords] } : {}),
    alternates: {
      canonical: url,
      types: {
        'application/rss+xml': site.feedPath,
      },
    },
    openGraph,
    twitter: {
      card: 'summary_large_image',
      title: socialTitle,
      description,
      images: [{ url: socialImage.url, alt: socialImage.alt }],
    },
  }
}

function imageDescriptor(image: SocialImage) {
  const type = imageType(image.url)

  return {
    url: image.url,
    alt: image.alt,
    ...(image.width ? { width: image.width } : {}),
    ...(image.height ? { height: image.height } : {}),
    ...(type ? { type } : {}),
  }
}

function imageType(url: string) {
  const pathname = url.split('?')[0]?.toLowerCase() ?? ''

  if (pathname.endsWith('.png')) return 'image/png'
  if (pathname.endsWith('.jpg') || pathname.endsWith('.jpeg'))
    return 'image/jpeg'
  if (pathname.endsWith('.webp')) return 'image/webp'
  if (pathname.endsWith('.gif')) return 'image/gif'

  return undefined
}
