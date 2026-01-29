import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Video Player',
  description: 'Reproductor de videos',
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
