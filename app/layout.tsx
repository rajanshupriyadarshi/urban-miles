import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Urban Miles | Premium Cab Booking in Pune',
  description: 'Book premium cab rides in Pune and beyond. Airport transfers, outstation trips, local hourly cabs. Fixed fares, verified drivers, 24/7 support.',
  keywords: 'cab booking pune, airport cab pune, outstation cab, urban miles, premium cab service pune lohegaon',
  metadataBase: new URL('https://urbanmiles.in'),
  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
  },
  openGraph: {
    title: 'Urban Miles | Premium Cab Booking in Pune',
    description: 'Book premium cab rides in Pune. Fixed fares, verified drivers, 24/7 service.',
    type: 'website',
    locale: 'en_IN',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-slate-50 text-slate-900 antialiased" suppressHydrationWarning>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
