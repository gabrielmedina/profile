import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { Raleway } from 'next/font/google'
import { TrackColorScheme } from '@/components/analytics/track-color-scheme'
import { Nav } from '@/components/nav/nav'
import { site } from '@/lib/site'
import { THEME_DARK, themeBootScript } from '@/lib/theme'
import '@/styles/styles.scss'

const raleway = Raleway({
  subsets: ['latin'],
  weight: ['500', '700'],
  display: 'swap',
  variable: '--font-raleway',
})

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: site.title,
    template: '%s - Gabriel Medina',
  },
  description: site.description,
  keywords: [...site.keywords],
  authors: [{ name: site.name, url: site.url }],
  icons: { icon: '/favicon.svg' },
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: site.url,
    siteName: site.name,
    title: site.title,
    description: site.description,
    images: [{ url: '/og.png', alt: site.title }],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${raleway.variable} ${THEME_DARK}`}
      suppressHydrationWarning
    >
      <body>
        <script dangerouslySetInnerHTML={{ __html: themeBootScript }} />
        <TrackColorScheme />
        <Nav />
        {children}
      </body>
    </html>
  )
}
