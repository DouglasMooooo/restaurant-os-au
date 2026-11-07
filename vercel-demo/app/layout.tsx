import type { Metadata } from 'next';
import './globals.css';
import './qr.css';

export const metadata: Metadata = {
  title: 'RestaurantOS — 餐饮运营演示',
  description: '中英双语餐饮运营与扫码点单互动演示。',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="zh-CN"><body>{children}</body></html>;
}
