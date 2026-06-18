import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { FirebaseClientProvider } from '@/firebase';

export const metadata: Metadata = {
  title: 'VideoMaster AI - Professional AI Video Studio',
  description: 'Create viral videos 10x faster with VideoMaster AI. Features include AI Script Writer, Thumbnail Designer, and Veo 2.0 Video Generation. Get 100 free credits today!',
  keywords: ['AI Video Editor', 'Video Generation', 'Thumbnail Maker', 'AI Scripts', 'YouTube Tools', 'TikTok Editor'],
  authors: [{ name: 'VideoMaster AI Team' }],
  openGraph: {
    title: 'VideoMaster AI - Professional AI Video Studio',
    description: 'The all-in-one AI video studio for modern creators.',
    url: 'https://videomaster-ai.web.app',
    siteName: 'VideoMaster AI',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'VideoMaster AI',
    description: 'Create viral videos with AI in seconds.',
  },
  robots: {
    index: true,
    follow: true,
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased bg-background text-foreground">
        <FirebaseClientProvider>
          {children}
          <Toaster />
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
