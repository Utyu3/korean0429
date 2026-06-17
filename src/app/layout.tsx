import type { Metadata, Viewport } from 'next';
import './globals.css';
import Navigation from '@/components/Navigation';

export const metadata: Metadata = {
  title: 'ダイエットトラッカー',
  description: '毎食のカロリーと栄養素を記録して健康管理',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body className="bg-gray-50 min-h-screen">
        <div className="max-w-md mx-auto relative min-h-screen">
          <main className="pb-20">{children}</main>
          <Navigation />
        </div>
      </body>
    </html>
  );
}
