import type { Metadata } from 'next'
import './globals.css'
import { ToastProvider } from '@/components/common/toast'
import QueryProvider from './query-provider'

export const metadata: Metadata = {
  title: {
    template: '%s | 종로타워',
    default: '종로타워 리테일',
  },
  description: '종로타워 쇼핑몰 층별 매장 안내, 플로어맵, 오시는길, 주차 정보를 확인하세요.',
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    siteName: '종로타워 리테일',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <head>
        <link rel="preconnect" href="https://cdn.jsdelivr.net" />
        <link
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
          rel="stylesheet"
        />
      </head>
      <body className="font-pretendard antialiased bg-white text-gray-900">
        <QueryProvider>
          <ToastProvider>{children}</ToastProvider>
        </QueryProvider>
      </body>
    </html>
  )
}
