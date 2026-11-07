import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'RestaurantOS AU — Interactive Demo',
  description: 'Interactive front-end demonstration for a 30-table Sydney restaurant.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en-AU"><body>{children}</body></html>;
}
