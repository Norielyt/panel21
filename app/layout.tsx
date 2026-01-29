import type { Metadata } from 'next'
import './globals.css'

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'https://panel21-bice.vercel.app')
// Imagen para vista previa (está en public/og-default.png). Para otra URL: NEXT_PUBLIC_OG_IMAGE en Vercel.
const defaultOgImage = process.env.NEXT_PUBLIC_OG_IMAGE || '/og-default.png'

export const metadata: Metadata = {
  title: 'Video Player',
  description: 'Reproductor de videos',
  metadataBase: new URL(siteUrl),
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    url: siteUrl,
    siteName: 'Video Player',
    title: 'Video Player',
    description: 'Reproductor de videos',
    images: [
      {
        url: defaultOgImage,
        width: 1200,
        height: 630,
        alt: 'Video Player',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Video Player',
    description: 'Reproductor de videos',
    images: [defaultOgImage],
  },
  other: {
    'fb:app_id': '1731936674147975',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <head>
        {/* Meta obligatorio para Facebook Debugger */}
        <meta property="fb:app_id" content="1731936674147975" />
      </head>
      <body className="font-sans antialiased">{children}</body>
    </html>
  )
}
