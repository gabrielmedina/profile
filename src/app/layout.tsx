import type { Metadata, Viewport } from 'next'
import type { ReactNode } from 'react'
import { Lexend } from 'next/font/google'
import { Footer } from '@/components/footer/footer'
import { Nav } from '@/components/nav/nav'
import { JsonLd } from '@/components/seo/json-ld'
import { SkipLink } from '@/components/skip-link/skip-link'
import { documentBootScript } from '@/components/theme/document-boot'
import { THEME_COLOR, THEME_DARK } from '@/components/theme/theme'
import { site } from '@/config/site'
import { websiteGraph } from '@/lib/seo/schema-graph'
import '@/styles/styles.scss'
import styles from './layout.module.scss'

const lexend = Lexend({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-lexend',
})

const analyticsKey =
  process.env.NODE_ENV === 'production'
    ? (process.env.NEXT_PUBLIC_AMPLITUDE_KEY ?? '')
    : ''

const speculationRules = JSON.stringify({
  prefetch: [
    {
      eagerness: 'moderate',
      where: {
        and: [
          { href_matches: '/*' },
          { not: { href_matches: '/feed.xml' } },
          { not: { href_matches: '/sitemap.xml' } },
          { not: { href_matches: '/robots.txt' } },
        ],
      },
    },
  ],
})

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  applicationName: site.name,
  title: {
    default: site.title,
    template: `%s - ${site.name}`,
  },
  description: site.description,
  keywords: [...site.keywords],
  authors: [{ name: site.name, url: site.url }],
  creator: site.name,
  publisher: site.name,
  category: 'technology',
  referrer: 'origin-when-cross-origin',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  icons: {
    icon: [{ url: '/favicon.svg', type: 'image/svg+xml' }],
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: THEME_COLOR[THEME_DARK],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode
}>) {
  return (
    <html
      lang={site.language}
      className={`${lexend.variable} ${THEME_DARK}`}
      suppressHydrationWarning
    >
      <body>
        <script
          dangerouslySetInnerHTML={{ __html: documentBootScript(analyticsKey) }}
        />
        <JsonLd data={websiteGraph()} />
        <SkipLink />
        <Nav />
        <main id="conteudo" tabIndex={-1} className={styles.main}>
          {children}
        </main>
        <Footer />
        <script src="/site.js" defer />
        <script
          type="speculationrules"
          dangerouslySetInnerHTML={{ __html: speculationRules }}
        />
      </body>
    </html>
  )
}
