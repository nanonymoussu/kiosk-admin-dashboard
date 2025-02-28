'use client'

import { IBM_Plex_Sans_Thai } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/providers'
import { OrderHistoryProvider } from '@/contexts/OrderHistoryContext'
import { MQTTProvider } from '@/contexts/MQTTContext'

const ibmPlexSansThai = IBM_Plex_Sans_Thai({
  subsets: ['thai', 'latin'],
  weight: ['300', '400', '700'],
  variable: '--font-ibm-plex-thai',
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang='th' className={ibmPlexSansThai.variable}>
      <body suppressHydrationWarning>
        <MQTTProvider>
          <OrderHistoryProvider>
            <Providers>{children}</Providers>
          </OrderHistoryProvider>
        </MQTTProvider>
      </body>
    </html>
  )
}
